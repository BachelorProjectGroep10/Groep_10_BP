'use client'
import Background from "@/app/Components/Utils/background";
import { HeaderComponent } from "@/app/Components/Utils/header";
import QRCodeComponent from "../../Components/dashboard/qrCode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NoAccess from "@/app/Components/Utils/noAccess";


export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (admin) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 ">
        <Background />
      </div>
      {!isLoggedIn && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <NoAccess />
        </div>
      )}
      {isLoggedIn && (<div className="relative z-10 flex flex-col min-h-screen">
        <HeaderComponent />
        <QRCodeComponent />
      </div>)}
    </div>
  );
}