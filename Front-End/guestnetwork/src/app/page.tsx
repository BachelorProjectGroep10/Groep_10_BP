'use client';

import "./Styles/globals.css";
import Background from "./Components/Utils/background";
import { HeaderComponent } from "./Components/Utils/header";
import LoginComponent from "./Components/login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import './i18n';
import AdminService from "./Services/StaffService";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await AdminService.verifyUserData(); // Make sure this hits /auth/me with credentials
        if (res.ok) {
          router.push('/dashboard');
        }
      } catch (err) {
        // Not logged in — stay on the page
        console.error("Not logged in or error fetching user data:", err);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="relative w-screen overflow-x-hidden overflow-y-auto md:h-screen md:overflow-hidden">
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Background />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderComponent />

        {/* Existing login component */}
        <LoginComponent />
      </div>
    </div>
  );
}
