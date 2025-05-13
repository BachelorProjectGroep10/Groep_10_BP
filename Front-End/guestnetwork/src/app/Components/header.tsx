"use client";
import Image from "next/image";
import { LanguageComponent } from "./Language";
import { useState } from "react";


export function HeaderComponent() {
    const [language, setLanguage] = useState("NL");

    const logoSrc = language === 'NL' ? '/Images/Logo_UCLL_NL.png' : '/Images/Logo_UCLL_EN.png';
    return (
        <header className="flex flex-col md:flex-row items-center md:justify-around bg-white mt-10">
            <div className="flex items-center">
                <Image
                    src={logoSrc}
                    alt="Logo"
                    width={200}
                    height={100}
                    className="mr-2"
                />
            </div>
            <LanguageComponent language={language} setLanguage={setLanguage} />
        </header>
    );
}