'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import { useEffect, useState } from "react";
import { FaWifi } from 'react-icons/fa';
import QRCodePdfLayout from './qrCodePdfLayout';
import { RiFileDownloadLine } from "react-icons/ri";
import { QRCode } from 'react-qrcode-logo';
import { IoPersonSharp } from "react-icons/io5";
import { HiMiniUserGroup } from "react-icons/hi2";
import PasswordService from "../Services/PasswordService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

export function QRCodeComponent() {
  const pdfRef = React.useRef<HTMLDivElement | null>(null);

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
    ? `WIFI:S:${ssid};H:true;T:WPA;P:${password};;`
    : '';

  const handleDownloadPdf = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true 
    });

    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'px', 'a4'); 
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('qr_code.pdf');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-xl md:text-2xl font-bold">Get access to</h1>
        <h1 className="text-xl md:text-2xl font-bold mb-2">{ssid} Network</h1>
        <FaWifi size={40} className="md:flex hidden" />
        <h2 className="font-semibold mt-2 text-sm text-accent">
          Scan QR code for access
        </h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative">
          {activeView === "qr" && (<button
            onClick={() => handleDownloadPdf()}
            type="button"
            className="absolute top-1 right-1 text-black hover:bg-[#e6f4fb] rounded-full p-1 transition duration-200"
            aria-label="Download as PDF"
          >
            <RiFileDownloadLine size={16} />
          </button>)}
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
                  <QRCode value={qrValue} 
                    size={160} 
                    logoImage='/Images/Logo_UCLL_ROUND.png'
                    logoWidth={40}
                    logoHeight={40}
                    logoOpacity={1}
                    logoPadding={0.5}
                    logoPaddingStyle='circle'
                    quietZone={10}
                    style={{ borderRadius: '0.75rem' }}
                    qrStyle="dots"
                    eyeRadius={10}
                  />
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
      </div>
      <div className="flex flex-col items-center mt-4">
        <h2 className="hidden md:flex font-semibold mt-4 text-sm text-center">
          This QR code is valid for 7 days. After that,
          <br />
          you will need to scan the QR code again.
        </h2>
        <h2 className="md:hidden flex font-semibold mt-4 text-sm text-center">
          This QR code is valid for 7 days.
        </h2>
      </div>
      <div>
        <div
          style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}
        >
          <div
            ref={pdfRef}
            style={{ width: '794px', height: '1123px' }}
            className="flex flex-col items-center justify-around"
          >
            <QRCodePdfLayout ssid={ssid} password={password} />
          </div>
        </div>

      </div>
  </div>
  );
}

export default QRCodeComponent;