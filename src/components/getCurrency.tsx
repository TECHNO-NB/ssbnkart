"use client";

import { setCurrency } from "@/redux/currencySlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function CurrencyAutoRefresher() {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshRate = async () => {
      // 1. Safety Check: Ensure we are in browser
      if (typeof window === "undefined") return;

      // 2. Get the saved code from LocalStorage (We only use this to know WHICH currency to fetch)
      const savedString = localStorage.getItem("user_currency");
      if (!savedString) return;

      try {
        const savedData = JSON.parse(savedString);
        // Handle naming conventions (code vs currencyCode)
        const codeToFetch = savedData.currencyCode || savedData.code;

        if (!codeToFetch) return;

        // 3. Call API to get latest rate
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/currencies/get-rate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_currency: codeToFetch }),
          }
        );

        if (!res.ok) return;

        const response = await res.json();

        if (response.success && response.data) {
          console.log("++++++++++++++ Server Response:", response.data);

          // 4. DISPATCH TO REDUX
          // This updates the Redux state with the fresh data from the server
          dispatch(setCurrency(response.data));
        }
      } catch (error) {
        console.error("Silent rate refresh failed:", error);
      }
    };

    refreshRate();
  }, [dispatch]); // Add dispatch to dependency array

  // This component is invisible
  return null;
}
