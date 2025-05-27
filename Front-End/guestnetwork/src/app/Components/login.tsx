'use client';

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminService from "../Services/AdminService";
import { useTranslation } from "react-i18next";
import { DotLoader } from "react-spinners";
import '../i18n'; 


export default function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {t} = useTranslation();

  const router = useRouter();
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const admin = {
      username: username,
      password: password,
    };

    try {
      const response = await AdminService.getAdmin(admin);

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("admin", JSON.stringify(data));
        sessionStorage.setItem("token", data.token);

        await sleep(2000);

        router.push("/dashboard");
      } else {
        console.error("Login failed");

        await sleep(2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      await sleep(2000);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="bg-[#9FDAF9] p-5 rounded-lg shadow-lg"> 
        <form onSubmit={handleLogin} className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">{t('login.login')}</h1>
          <p className="text-gray-600 mb-4">{t('login.subtitle')}</p>    
          <div className="mb-4 flex flex-col">
            <label className="font-semibold"  htmlFor="username">{t('login.username')}:</label>
            <input
              type="text"
              placeholder={t('login.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 bg-white rounded-md p-2 mb-4"
            />
          </div>
          
          <div className="mb-4 flex flex-col">
            <label className="font-semibold" htmlFor="password">{t('login.password')}:</label>
            <input
              type="password"
              placeholder={t('login.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 bg-white rounded-md p-2 mb-4"
            />
          </div>

          <button
            type="submit"
            className="bg-[#002757] hover:bg-[#FA1651] text-white rounded p-2 cursor-pointer flex items-center justify-center min-w-[100px]"
            disabled={loading}
          >
            {loading ? <DotLoader size={20} color="#ffffff" /> : t('login.login')}
          </button>
        </form>
      </div>
    </div>
  );
}