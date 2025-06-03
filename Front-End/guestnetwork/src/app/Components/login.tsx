'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminService from "../Services/StaffService";
import { useTranslation } from "react-i18next";
import { PulseLoader } from "react-spinners";
import '../i18n'; 
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

export default function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const router = useRouter();

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const staff = { username, password };

    try {
      const response = await AdminService.simpleLogin(staff);
      if (response.ok) {
        await sleep(1000);
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
        await sleep(1000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      await sleep(1000);
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/microsoft/login`;
  };

  return (
    <div className="flex items-start justify-center min-h-screen px-4 mt-6">
      <div className="w-full max-w-md bg-[#9FDAF9] p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{t('login.login')}</h1>
            <p className="text-gray-500 text-sm mt-2">{t('login.subtitle')}</p>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              {t('login.username')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('login.username')}
              className="mt-1 block w-full p-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.password')}
              className="mt-1 block w-full p-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center bg-[#002757] hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? <PulseLoader size={8} color="#ffffff" /> : t('login.login')}
          </button>

          <div className="flex items-center justify-center text-gray-500 text-sm py-2">
            — {t('login.or')} —
          </div>

          <button
            type="button"
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition duration-300"
          >
            <FaMicrosoft className="text-xl" />
            {t('login.microsoftLogin') || "Login with Microsoft"}
          </button>
        </form>
      </div>
    </div>
  );
}
