"use client";
import Image from "next/image";
import { LanguageComponent } from "./Language";
import { useState } from "react";

export function HeaderComponent() {
    const [language, setLanguage] = useState("EN");

    const logoSrc = language === 'NL' ? '/Images/Logo_UCLL_NL.png' : '/Images/Logo_UCLL_EN.png';

    return (
        <header className="flex flex-col md:flex-row items-center md:justify-around mt-4 mb-2">
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
            <h1 className="text-2xl font-bold text-center md:text-left mt-4 md:mt-0">
                {language === 'NL' ? 'UCLL Gastennetwerk' : 'UCLL Guest Network'}
            </h1>   
            <LanguageComponent language={language} setLanguage={setLanguage} />
        </header>
    );
}
