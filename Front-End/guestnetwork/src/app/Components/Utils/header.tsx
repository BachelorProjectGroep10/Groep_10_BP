"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LuLogOut, LuMenu } from "react-icons/lu";
import { LanguageComponent } from "./Language";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import '../../i18n'; 
import AdminService from "@/app/Services/StaffService";
import { LoginResponse } from "@/app/Types";
import { set } from "date-fns";

export function HeaderComponent() {
    const [language, setLanguage] = useState("EN");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<String | null>(null);

    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await AdminService.getUserData();
                if (res.ok) {
                    const data = await res.json();
                    setIsLoggedIn(true);
                    setLoggedInUser(data.name);
                } else {
                    setIsLoggedIn(false);
                    setLoggedInUser(null);
                }
            } catch (err) {
                setIsLoggedIn(false);
                setLoggedInUser(null);
            }
        };

        checkLogin();
    }, [language]);

    const handleLogout = async () => {
        try {
            const response = await AdminService.logout();
            if (response.ok) {
                setIsLoggedIn(false);
                setLoggedInUser(null);
                setDropdownOpen(false);
            } else {
                console.error("Logout failed");
            }
            router.push('/'); // Redirect to the home page after logout
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <header className="w-full flex flex-col md:flex-row items-center justify-around pt-1 mt-6">
            <div className="relative w-[120px] h-[60px] ">
                <Link href="/dashboard" className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src={t('header.logo')}
                        alt="UCLL Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Only show if logged in */}
            {isLoggedIn && (
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="text-[#002757] hover:text-[#FA1651] text-2xl focus:outline-none"
                    >
                        <LuMenu />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute -left-24 mt-2 w-55 bg-gray-50 rounded shadow-md z-50">
                            <ul className="flex flex-col space-y-2 p-4">
                                <p className="font-semibold text-black">Hi, {loggedInUser}</p>
                                <li>
                                    <Link href="/dashboard" className="text-[#002757] hover:text-[#FA1651] font-medium">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/overview" className="text-[#002757] hover:text-[#FA1651] font-medium">
                                        {t("header.overview")}
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center text-[#002757] hover:text-[#FA1651] font-medium">
                                        <LuLogOut className="mr-2" />
                                        {t("header.logout")}
                                    </button>
                                </li>
                                <li>
                                    <div className="pt-2 border-t">
                                        <LanguageComponent language={language} setLanguage={setLanguage} />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
export default HeaderComponent;