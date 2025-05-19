'use client'
import Background from "@/app/Components/background";
import { HeaderComponent } from "@/app/Components/header";
import QRCodeComponent from "../../Components/qrCode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (!admin) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, []);
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 ">
        <Background />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderComponent />
        <QRCodeComponent />
      </div>
    </div>
  );
}