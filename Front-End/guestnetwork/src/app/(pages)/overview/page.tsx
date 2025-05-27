'use client';
import { useRouter } from "next/navigation";
import Background from "../../Components/Utils/background";
import { HeaderComponent } from "../../Components/Utils/header";
import { useEffect, useState } from "react";
import OverviewComponent from "../../Components/Overview/Overview";
import NoAccess from "@/app/Components/Utils/noAccess";


export default function Overview() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (admin) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="relative w-full min-h-screen overflow-x-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 ">
          <Background />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="mb-2 flex items-center justify-center">
            <img
              src="/Images/Logo_UCLL_ROUND.png"
              alt="UCLL Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full"
            />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-8 border-4 border-[#9FDAF9] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-2xl font-semibold text-gray-700">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

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
        <OverviewComponent />
      </div>)}
    </div>
  )
}