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
    <div className="flex flex-col items-center justify-between h-full w-full px-10 py-6">
      <div className="w-full sm:max-w-[80%] md:max-w-[850px]">
        <div className="bg-[#9FDAF9] px-2 py-4 rounded-lg shadow-lg w-full flex flex-col md:flex-row items-center justify-around gap-4">

          {/* QR Code + Details or Form based on screen & activeView */}
          <div className="flex flex-col items-center mx-6 w-full md:w-auto">
            {/* On md+ show all side-by-side */}
            <div className="hidden md:flex md:flex-col md:items-center">
              <h1 className="text-2xl font-bold text-center">{ssid}</h1>
              <FaWifi size={40} />
              <h2 className="font-semibold my-4 text-sm text-accent">Scan QR code for access</h2>
              {password ? (
                <QRCode
                  value={`WIFI:S:${ssid};H:true;T:WPA;P:${password};;`}
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
              <div className="mt-4 text-left w-full max-w-[300px]">
                <p className="text-sm font-semibold">
                  SSID: <span className="font-normal">{ssid}</span>
                </p>
                <p className="text-sm font-semibold mb-4">
                  Password: <span className="font-normal">{password ?? 'Loading...'}</span>
                </p>
                <button
                  onClick={handleDownloadPdf}
                  className="bg-[#002757] text-white hover:bg-[#FA1651] flex items-center justify-center gap-2 text-sm rounded-lg p-2 transition duration-200"
                >
                  <RiFileDownloadLine size={14} /> download PDF
                </button>
              </div>
            </div>

            {/* On md and smaller show the QR or form based on activeView */}
            <div className="md:hidden w-full flex flex-col items-center justify-center">
            {activeView === 'qr' && (
              <>
                <h1 className="text-2xl font-bold text-center">{ssid}</h1>
                <FaWifi size={40} className="mx-auto" />
                <h2 className="font-semibold my-4 text-sm text-accent text-center">Scan QR code for access</h2>
                  {password ? (
                    <QRCode
                      value={`WIFI:S:${ssid};H:true;T:WPA;P:${password};;`}
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
                  <div className="mt-4 mx-auto w-full max-w-[200px] text-left">
                    <p className="text-sm font-semibold">
                      SSID: <span className="font-normal">{ssid}</span>
                    </p>
                    <p className="text-sm font-semibold mb-4">
                      Password: <span className="font-normal">{password ?? 'Loading...'}</span>
                    </p>
                    <button
                      onClick={handleDownloadPdf}
                      className="bg-[#002757] text-white hover:bg-[#FA1651] flex items-center justify-center gap-2 text-sm rounded-lg p-2 transition duration-200 w-full mb-2"
                    >
                      <RiFileDownloadLine size={14} /> download PDF
                    </button>
                  </div>
                </>
              )}

              {activeView === 'single' && <SingleUserComponent />}
              {activeView === 'group' && <GroupSelectComponent />}
            </div>
          </div>

          {/* On md+ show the forms always next to QR code */}
          <div className="hidden md:flex w-[60%] flex-col gap-4 p-6">
            <SingleUserComponent />
            <GroupSelectComponent />
          </div>
        </div>

        {/* On md and smaller: buttons to toggle views */}
        <div className="md:hidden flex justify-center gap-4 mt-4">
          <button
            onClick={() => setActiveView('single')}
            className={`bg-[#002757] text-white px-4 py-2 rounded-lg ${
              activeView === 'single' ? 'ring-2 ring-white' : ''
            }`}
          >
            Create User
          </button>
          <button
            onClick={() => setActiveView('group')}
            className={`bg-[#002757] text-white px-4 py-2 rounded-lg ${
              activeView === 'group' ? 'ring-2 ring-white' : ''
            }`}
          >
            Create Group
          </button>
          <button
            onClick={() => setActiveView('qr')}
            className={`bg-[#002757] text-white px-4 py-2 rounded-lg ${
              activeView === 'qr' ? 'ring-2 ring-white' : ''
            }`}
          >
            Show QR
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm font-semibold">
            This QR code is valid for 7 days.
            <span className="hidden md:inline"> After that, you will need to scan it again.</span>
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <div
          ref={pdfRef}
          style={{ width: '794px', height: '1123px' }}
          className="flex flex-col items-center justify-around"
        >
          <QRCodePdfLayout ssid={ssid} password={password} />
        </div>
      </div>
    </div>
  );
}

export default QRCodeComponent;