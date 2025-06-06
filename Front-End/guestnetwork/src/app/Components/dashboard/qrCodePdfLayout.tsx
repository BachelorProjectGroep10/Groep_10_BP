'use client';

import React, { useState } from 'react';
import Background from '../Utils/background';
import { QRCode } from 'react-qrcode-logo';
import { WeeklyPassword } from '@/app/Types';

interface QRCodePdfLayoutProps {
  name: string;
  ssid?: string;
  password?: WeeklyPassword[];
  showBackground?: boolean;
  startDate: string;
  endDate: string;
}

export function QRCodePdfLayout({
  name, 
  ssid,
  password,
  showBackground = true, 
  startDate,
  endDate
}: QRCodePdfLayoutProps) {
  return (
    <div
      className="relative bg-white overflow-hidden"
      style={{ width: '794px', height: '1123px' }}
    >
      {showBackground && (
        <div
          className="absolute top-0 left-0"
          style={{ width: '794px', height: '1123px', zIndex: 0 }}
        >
          <Background />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-20">
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className=" mb-4 flex items-center justify-center">
            <img
              src="/Images/Logo_UCLL_ROUND.png"
              alt="UCLL Logo"
              className="w-24 h-24 sm:w-40 sm:h-40 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            UCLL Guest Network
          </h1>
          <p className="text-lg">
            Scan the QR code below to connect to the UCLL Guest WiFi
          </p>
        </div>

        <div className="bg-[#9FDAF9] p-10 rounded-xl shadow flex flex-col items-center justify-center">
          {name && name.trim() !== "" && (
            <h2 className="text-3xl pb-6 text-black">{name}</h2>
          )}
          <QRCode
            value={`WIFI:S:${ssid};H:true;T:WPA;P:${password?.find(pwd => pwd.validNow)?.value || password?.[0]?.value || ''};;`}
            size={300}
            logoImage="/Images/Logo_UCLL_ROUND.png"
            logoWidth={45}
            logoHeight={45}
            logoOpacity={1}
            logoPadding={3}
            logoPaddingStyle="circle"
            quietZone={10}
            style={{ borderRadius: '0.75rem' }}
            qrStyle="dots"
            eyeRadius={10}
          />
          <h3 className='font-semibold text-2xl'>Scan Me</h3>
          <div className='flex flex-col items-start justify-center bg-white p-4 rounded-lg mt-4'>
            <p className="text-md mt-4">
              <span className="font-semibold">NETWERK / NETWORK:</span> {ssid}
            </p>
            <p className="text-md mt-2">
              <span className="font-semibold">WACHTWOORD / PASSWORD:</span> {password?.map(pwd => pwd.value).join(', ') || '-'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-1 mt-2 text-lg text-black">
          <p className="font-semibold">Valid</p>
          <p className="font-semibold">
            From: <span className="font-normal">{startDate}</span>
          </p>
          <span className="mx-1">-</span>
          <p className="font-semibold">
            Till: <span className="font-normal">{endDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default QRCodePdfLayout;
