"use client";
/* eslint-disable */

import { addUser } from "@/redux/userSlice";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register","/info","/productlisiting","/avoidscam","/privacy","/legal"];

export default function VerifyUser() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  
  const path = usePathname();
  const router = useRouter();





  useEffect(() => {
    const verify = async () => {
      setIsLoading(true);
      axios.defaults.withCredentials = true;

      // CASE 1: USER ALREADY IN REDUX
      if (userData?.id) {
        // Logged-in users should not stay on public pages
        // if (PUBLIC_ROUTES.includes(path)) {
        //   router.push(
        //     userData.role === "admin"
        //       ? "/admin/dashboard"
        //       : "/user/dashboard"
        //   );
        //   setIsLoading(false);
        //   return;
        // }

        // Check unauthorized access
        // if (path.startsWith("/admin") && userData.role !== "admin") {
        //   toast.error("Unauthorized Access!");
        //   router.push("/user/dashboard");
        //   setIsLoading(false);
        //   return;
        // }

        // if (path.startsWith("/user") && userData.role !== "user") {
        //   toast.error("Unauthorized Access!");
        //   router.push("/admin/dashboard");
        //   setIsLoading(false);
        //   return;
        // }

        setIsLoading(false);
        return;
      }

      // CASE 2: USER NOT IN REDUX
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify`
        );

        if (res.data.success) {
          const data = res.data.data;

          dispatch(
            addUser({
              id: data.id,
              fullName: data.fullName,
              email: data.email,
              role: data.role,
              phone:data.phone,
              gender:data.gender,
              dob:data.dob,
            })
          );

         
          if (data.role === "admin") {
            if (!path.startsWith("/admin")) router.push("/admin/dashboard");
          } else if (data.role === "user") {
            if (!path.startsWith("/")) router.push("/");
          }

          return;
        }
      } catch (error) {
        // ❌ Not logged in → allow only public routes
        // if (!PUBLIC_ROUTES.includes(path)) {
        //   router.push("/auth/login");
        // }
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [path, userData, dispatch, router]);

  if (isLoading) return null;
  return null;
}
