'use client'
import Background from "@/app/Components/background";
import { HeaderComponent } from "@/app/Components/header";
import QRCodeComponent from "../Components/qrCode";
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
      <div className="relative w-screen overflow-x-hidden overflow-y-auto md:h-screen md:overflow-hidden">
        <div className="absolute top-0 left-0 w-screen h-screen">
          <Background />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <HeaderComponent />
          <QRCodeComponent />
        </div>
      </div>
  );
}