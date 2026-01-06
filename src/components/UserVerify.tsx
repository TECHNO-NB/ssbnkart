"use client";
/* eslint-disable */

import { addUser } from "@/redux/userSlice";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function VerifyUser() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      axios.defaults.withCredentials = true;

      // ✅ USER EXISTS IN REDUX
      if (userData?.id) {
        if (path.startsWith("/admin") && userData.role !== "ADMIN") {
          toast.error("Unauthorized Access!");
          router.replace("/");
        }
        setIsLoading(false);
        return;
      }

      // ❌ USER NOT IN REDUX → VERIFY FROM BACKEND
      try {
        axios.defaults.withCredentials=true
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
              phone: data.phone,
              gender: data.gender,
              dob: data.dob,
            })
          );

          if (path.startsWith("/admin") && data.role !== "ADMIN") {
            toast.error("Unauthorized Access!");
            router.replace("/");
          }

          setIsLoading(false);
          return;
        }
      } catch (error) {
        // 🚫 NOT LOGGED IN → BLOCK ADMIN
        if (path.startsWith("/admin")) {
          toast.error("Please login as admin");
          router.replace("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [path, userData?.id]);

  if (isLoading) return null;
  return null;
}
