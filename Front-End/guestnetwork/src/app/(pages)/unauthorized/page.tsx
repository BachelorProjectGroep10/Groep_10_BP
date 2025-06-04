'use client';
import { useRouter } from "next/navigation";
import Background from "../../Components/Utils/background";
import { HeaderComponent } from "../../Components/Utils/header";
import { useEffect, useState } from "react";
import OverviewComponent from "../../Components/Overview/Overview";
import NoAccess from "@/app/Components/Utils/noAccess";
import { LoginResponse } from "@/app/Types";
import AdminService from "@/app/Services/StaffService";

export default function Overview() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<LoginResponse | null>(null);

  const router = useRouter(); 

  const fetchUser = async () => {
    try {
      const response = await AdminService.verifyUserData();
      if (!response.ok) {
        setIsLoggedIn(false);
        return;
      }
      const data = await response.json();

      const user: LoginResponse = {
        username: data.username,
        email: data.email,
        role: data.role,
      };

      setLoggedInUser(user);
      setIsLoggedIn(true);
    }catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn]);

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
    </div>
  )
}