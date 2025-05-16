'use client';
import "./Styles/globals.css";
import Background from "./Components/background";
import { HeaderComponent } from "./Components/header";
import LoginComponent from "./Components/login";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (admin) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  }, []);
  
  return (
    <div className="relative w-screen overflow-x-hidden overflow-y-auto md:h-screen md:overflow-hidden">
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Background />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderComponent />
        <LoginComponent />
      </div>
    </div>
)}