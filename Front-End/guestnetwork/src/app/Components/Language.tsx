"use client";
import { useEffect, useState } from "react";
import i18n from "../i18n";

type LanguageComponentProps = {
  language: string;
  setLanguage: (lang: string) => void;
};

export function LanguageComponent({language, setLanguage}: LanguageComponentProps) {
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);

    i18n.changeLanguage(lang.toLowerCase());
  };

  const getButtonClass = (lang: string) =>
    `hover:text-[#9FDAF9] ${
      language === lang ? "text-[#E30147] font-bold" : "text-gray-700"
    }`;

  useEffect(() => {
    i18n.changeLanguage(language.toLowerCase());
  }, [language]);

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center space-x-2 font-semibold">
        <button
          onClick={() => handleLanguageChange("NL")}
          className={getButtonClass("NL")}
          type="button"
        >
          NL
        </button>
        <span>|</span>
        <button
          onClick={() => handleLanguageChange("EN")}
          className={getButtonClass("EN")}
          type="button"
        >
          EN
        </button>
      </div>
    </div>
  );
}
