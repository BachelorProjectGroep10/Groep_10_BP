'use client';

import "./Styles/globals.css";
import Background from "./Components/Utils/background";
import { HeaderComponent } from "./Components/Utils/header";
import LoginComponent from "./Components/login";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import './i18n';
import AdminService from "./Services/StaffService";

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await AdminService.verifyUserData();
        if (res.ok) {
          router.push('/dashboard');
        } else {
          console.error("User not logged in or unauthorized");
          setCheckingAuth(false); 
        }
      } catch (err) {
        console.error("Not logged in or error fetching user data:", err);
        setCheckingAuth(false);
      }
    };

    checkLoginStatus();
  }, [router]);

  return (
    <div className="relative w-screen overflow-x-hidden overflow-y-auto md:h-screen md:overflow-hidden">
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Background />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {checkingAuth ? (
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
        ) : (
          <div className="relative z-10 flex flex-col min-h-screen">
            <HeaderComponent />
            <LoginComponent />
          </div>
        )}
      </div>
    </div>
  );
}
