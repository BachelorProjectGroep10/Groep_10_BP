"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LuLogOut, LuMenu } from "react-icons/lu";
import { LanguageComponent } from "./Language";
import { useRouter } from "next/navigation";

export function HeaderComponent() {
    const [language, setLanguage] = useState("EN");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isloggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();
    const logoSrc = language === "NL" ? "/Images/Logo_UCLL_NL.png" : "/Images/Logo_UCLL_EN.png";

    const handleLogout = () => {
        sessionStorage.removeItem("admin");
    }

    useEffect(() => {
        const admin = sessionStorage.getItem("admin");
        if (admin) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [language]);

    return (
        <header className="w-full flex flex-col md:flex-row items-center justify-around p-4">
            <div className="relative w-[120px] h-[60px] ">
                <Image
                    src={logoSrc}
                    alt="UCLL Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            {isloggedIn && (<div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="text-[#002757] hover:text-[#FA1651] text-2xl focus:outline-none"
                >
                    <LuMenu />
                </button>

                {dropdownOpen && (
                    <div className="absolute -left-24 mt-2 w-55 bg-gray-50 rounded shadow-md z-50">
                        <ul className="flex flex-col space-y-2 p-4">
                            <li>
                                <Link href="/dashboard" className="text-[#002757] hover:text-[#FA1651] font-medium">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/overview" className="text-[#002757] hover:text-[#FA1651] font-medium">
                                    Overview
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="flex items-center text-[#002757] hover:text-[#FA1651] font-medium" onClick={handleLogout}>
                                    <LuLogOut className="mr-2" />
                                    Logout
                                </Link>
                            </li>
                            <li>
                                <div className="pt-2 border-t">
                                    <LanguageComponent language={language} setLanguage={setLanguage} />
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
            </div>)}
        </header>
    );
}
