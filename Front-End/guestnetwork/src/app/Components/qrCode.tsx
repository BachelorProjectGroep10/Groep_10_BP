'use client';

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { HiMiniUserGroup } from "react-icons/hi2";
import PasswordService from "../Services/PasswordService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

export function QRCodeComponent() {
  const [activeView, setActiveView] = useState<'qr' | 'single' | 'group'>('qr');
  const ssid = 'UCLL_GUEST';

  const fetchPassword = async () => {
    const response = await PasswordService.getPassword();
    const fetchedPassword = await response.json();
    return fetchedPassword.password;
  };

  const { data: password, isLoading } = useSWR('password', fetchPassword);

  useInterval(() => {
    mutate('password', fetchPassword);
  }, 2000);

  const qrValue = password
    ? `WIFI:T:WPA;S:${ssid};P:${password};;`
    : '';

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:mt-6">
      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-2xl font-bold">Get access to</h1>
        <h1 className="text-2xl font-bold mb-2">UCLL Guest Network</h1>
        <FaWifi size={40} className="md:flex hidden" />
        <h2 className="font-semibold mt-2 text-sm text-accent">Scan QR code for access</h2>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          {/* QR / Forms Card */}
          <div className="bg-[#9FDAF9] p-6 rounded-lg shadow-lg h-80 w-60 flex flex-col items-center justify-around">
            {activeView === 'single' && (
              <form className="flex flex-col items-center w-full space-y-3">
                <h3 className="text-xl font-bold pb-4">User registration</h3>
                <input
                  type="mac-address"
                  placeholder="Mac Address"
                  className="bg-white text-black rounded-full px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="bg-white text-black rounded-full px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="text"
                  placeholder="Time needed"
                  className="bg-white text-black rounded-full px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="mt-4 bg-[#002757] text-white py-1 px-4 rounded-md text-sm"
                >
                  Submit
                </button>
              </form>
            )}

            {activeView === 'group' && (
              <form className="flex flex-col items-center w-full space-y-3">
                <h3 className="text-xl font-bold pb-4">Group registration</h3>
                <input
                  type="text"
                  placeholder="Group Name"
                  className="bg-white text-black rounded-full px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="text"
                  placeholder="Time needed"
                  className="bg-white text-black rounded-full px-4 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="mt-4 bg-[#002757] text-white py-1 px-4 rounded-md text-sm"
                >
                  Submit
                </button>
              </form>
            )}

            {activeView === 'qr' && (
              <>
                {password ? (
                  <QRCodeSVG value={qrValue} size={140} />
                ) : (
                  <p>Loading QR...</p>
                )}
                <div className="mt-2 text-left w-full">
                  <p className="text-sm font-semibold">
                    SSID: <span className="font-normal">{ssid}</span>
                  </p>
                  <p className="text-sm font-semibold">
                    Password: <span className="font-normal">{password ?? 'Loading...'}</span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Bookmark Buttons */}
          <div className="absolute right-[-40px] top-8 bg-[#002757] text-md font-bold py-2 px-2 rounded-r-md shadow-md flex flex-col">
            <button
              onClick={() =>
                setActiveView((prev) => (prev === 'single' ? 'qr' : 'single'))
              }
              className={`flex mb-2 items-center bg-[#9FDAF9] rounded-md py-1 px-1 ${activeView === 'single' ? 'ring-2 ring-white' : ''}`}
            >
              <IoPersonSharp />
            </button>
            <button
              onClick={() =>
                setActiveView((prev) => (prev === 'group' ? 'qr' : 'group'))
              }
              className={`flex items-center bg-[#9FDAF9] rounded-md py-1 px-1 ${activeView === 'group' ? 'ring-2 ring-white' : ''}`}
            >
              <HiMiniUserGroup />
            </button>
          </div>
        </div>


        <h2 className="hidden md:flex font-semibold mt-4 text-sm text-accent text-center">
          This QR code is valid for 7 days. After that,<br />
          you will need to scan the QR code again to get access to the UCLL Guest Network.
        </h2>
        <h2 className="md:hidden flex font-semibold mt-4 text-sm text-accent text-center">This QR code is valid for 7 days.</h2>
      </div>
    </div>
  );
}
