'use client';

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaWifi } from "react-icons/fa";
import AdminService from "../Services/AdminService";


export default function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const admin = {
      username: username,
      password: password,
    };

    const response = await AdminService.getAdmin(admin);

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("admin", JSON.stringify(data));
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      console.error("Login failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="bg-[#9FDAF9] p-5 rounded-lg shadow-lg"> 
        <form onSubmit={handleLogin} className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <p className="text-gray-600 mb-4">Please enter your credentials to get access</p>    
          <div className="mb-4 flex flex-col">
            <label className="font-semibold"  htmlFor="username">Username:</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 bg-white rounded-md p-2 mb-4"
            />
          </div>
          
          <div className="mb-4 flex flex-col">
            <label className="font-semibold" htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 bg-white rounded-md p-2 mb-4"
            />
          </div>

          <button type="submit" className="bg-[#002757] hover:bg-[#FA1651] text-white rounded p-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}