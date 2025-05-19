'use client';
import { useRouter } from "next/navigation";
import Background from "../../Components/background";
import { HeaderComponent } from "../../Components/header";
import { useEffect } from "react";
import OverviewComponent from "../../Components/Overview";


export default function Overview() {
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
        <OverviewComponent />
      </div>
    </div>
  )
}