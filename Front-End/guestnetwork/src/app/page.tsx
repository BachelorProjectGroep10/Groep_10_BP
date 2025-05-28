'use client';

import "./Styles/globals.css";
import Background from "./Components/Utils/background";
import { HeaderComponent } from "./Components/Utils/header";
import LoginComponent from "./Components/login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import './i18n';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("user"); 
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleMicrosoftLogin = () => {
    window.location.href = "http://localhost:3000/auth/login";
  };

  return (
    <div className="relative w-screen overflow-x-hidden overflow-y-auto md:h-screen md:overflow-hidden">
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Background />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderComponent />

        {/* Existing login component */}
        <LoginComponent />

        {/* Microsoft Login Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleMicrosoftLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
