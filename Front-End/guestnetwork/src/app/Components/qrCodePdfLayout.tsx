'use client';

import React from 'react';
import Background from './background';
import { QRCode } from 'react-qrcode-logo';
import { FaWifi } from 'react-icons/fa';

interface QRCodePdfLayoutProps {
  ssid?: string;
  password?: string;
}

export function QRCodePdfLayout({ ssid, password }: QRCodePdfLayoutProps) {
  return (
    <div
      className="relative bg-white overflow-hidden"
      style={{ width: '794px', height: '1123px', position: 'relative' }}
    >
      <div  
        className="absolute top-0 left-0"
        style={{ width: '794px', height: '1123px', zIndex: 0 }}
      >
        <Background />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-20">
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="bg-[#9FDAF9] w-32 h-32 sm:w-40 sm:h-40 rounded-full mb-4 flex items-center justify-center">
            <img
              src="/Images/Logo_UCLL_ROUND.png"
              alt="UCLL Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            UCLL Guest Network
          </h1>
          <p className="text-lg">
            Scan the QR code below to connect to the UCLL Guest WiFi
          </p>
        </div>

        <div className="bg-[#9FDAF9] p-10 rounded-xl shadow mb-6">
          <QRCode
            value={`WIFI:S:${ssid};H:true;T:WPA;P:${password};;`}
            size={240}
            logoImage="/Images/Logo_UCLL_ROUND.png"
            logoWidth={40}
            logoHeight={40}
            logoOpacity={1}
            logoPadding={3}
            logoPaddingStyle="circle"
            quietZone={10}
            style={{ borderRadius: '0.75rem' }}
            qrStyle="dots"
            eyeRadius={10}
            
          />
          <p className="text-sm font-semibold mt-4">
            <span className="font-semibold">SSID:</span> {ssid}
            <br />
            <span className="font-semibold">Password:</span> {password}
          </p>
        </div>
        <div className="text-base">
          <p className="text-sm pt-2">This QR code is valid for 7 days.</p>
          <p className="text-sm">Please regenerate it after expiration.</p>
        </div>
      </div>
    </div>
  );
}

export default QRCodePdfLayout;
