"use client";
import Image from "next/image";
import { LanguageComponent } from "./Language";
import { useState } from "react";

export function HeaderComponent() {
    const [language, setLanguage] = useState("EN");

    const logoSrc = language === 'NL' ? '/Images/Logo_UCLL_NL.png' : '/Images/Logo_UCLL_EN.png';

    return (
        <header className="flex flex-col md:flex-row items-center md:justify-around mt-10 mb-4">
            <div className="flex items-center">
                <div className="relative w-[100px] h-[50px] md:w-[200px] md:h-[100px]">
                    <Image
                        src={logoSrc}
                        alt="Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
            <LanguageComponent language={language} setLanguage={setLanguage} />
        </header>
    );
}
