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
import SingleUserComponent from './singleUser';
import GroupSelectComponent from './groupSelect';

export function QRCodeComponent() {
  const pdfRef = React.useRef<HTMLDivElement | null>(null);

  const [activeView, setActiveView] = useState<'qr' | 'single' | 'group'>('qr');
  const ssid = 'GuestNetwork';

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
    <div className="flex flex-col items-center justify-between h-full w-full px-4 py-2 overflow-hidden">
      <div className="w-full max-w-[90%] md:max-w-[700px]">
        <div className="bg-[#9FDAF9] p-4 rounded-lg shadow-lg w-full flex flex-col md:flex-row items-center justify-around gap-4">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              <h1 className="text-2xl font-bold text-center">{ssid}</h1>
              <FaWifi size={40} className="md:flex hidden" />
              <h2 className="font-semibold mt-2 text-sm text-accent">Scan QR code for access</h2>
            </div>

            {password ? (
              <QRCode
                value={qrValue}
                size={200}
                logoImage='/Images/Logo_UCLL_ROUND.png'
                logoWidth={40}
                logoHeight={40}
                logoOpacity={1}
                logoPadding={0.5}
                logoPaddingStyle="circle"
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
              <p className="text-sm font-semibold mb-2">
                Password: <span className="font-normal">{password ?? 'Loading...'}</span>
              </p>
              <button
                onClick={handleDownloadPdf}
                className="bg-[#002757] text-white hover:bg-[#FA1651] flex items-center justify-center gap-2 text-sm rounded-lg p-1 transition duration-200"
              >
                <RiFileDownloadLine size={14} /> Download PDF
              </button>
            </div>

          </div>

          <div className="hidden md:flex flex-col gap-4 items-center">
            <SingleUserComponent />
            <GroupSelectComponent />
          </div>
        </div>

        {/* Toggle Buttons on Small Screens */}
        <div className="md:hidden absolute right-[-40px] top-8 bg-[#002757] text-md font-bold py-2 px-2 rounded-r-md shadow-md flex flex-col">
          <button
            onClick={() => setActiveView((prev) => (prev === 'single' ? 'qr' : 'single'))}
            className={`mb-2 bg-[#9FDAF9] rounded-md py-1 px-1 ${activeView === 'single' ? 'ring-2 ring-white' : ''}`}
          >
            <IoPersonSharp />
          </button>
          <button
            onClick={() => setActiveView((prev) => (prev === 'group' ? 'qr' : 'group'))}
            className={`bg-[#9FDAF9] rounded-md py-1 px-1 ${activeView === 'group' ? 'ring-2 ring-white' : ''}`}
          >
            <HiMiniUserGroup />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm font-semibold">
            This QR code is valid for 7 days.
            <span className="hidden md:inline"> After that, you will need to scan it again.</span>
          </p>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <div ref={pdfRef} style={{ width: '794px', height: '1123px' }} className="flex flex-col items-center justify-around">
          <QRCodePdfLayout ssid={ssid} password={password} />
        </div>
      </div>
    </div>
  );
}

export default QRCodeComponent;