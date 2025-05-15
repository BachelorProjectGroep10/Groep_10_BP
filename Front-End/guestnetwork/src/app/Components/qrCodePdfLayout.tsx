'use client';

import React from 'react';
import Background from './background';
import { QRCode } from 'react-qrcode-logo';

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
