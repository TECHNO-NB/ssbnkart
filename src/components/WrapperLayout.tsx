"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import VerifyUser from "./UserVerify";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";



export const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
  const path=usePathname()
  
  
  return (
    <div>
      <Provider store={store}>
        <VerifyUser />
      {!path.startsWith("/admin") && (<Navbar/>) }
        {children}
        {!path.startsWith("/admin") && <Footer/> }
        
      </Provider>
    </div>
  );
};
