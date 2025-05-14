'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Image from "next/image";


interface QRCodePdfLayoutProps {
  ssid?: string;
  password?: string;
}

export function QRCodePdfLayout( { ssid, password }: QRCodePdfLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:mt-6">
      <h1 className="font-semibold mb-2">WiFi Access Details</h1>
      <div className='flex flex-col items-center mb-6 text-center bg-[#9FDAF9] p-6 rounded-lg shadow-lg'>
        <QRCodeSVG
          value={`WIFI:S:${ssid};T:WPA;P:${password};;`}
          className="mb-1"
          size={200}
        />
      </div>

      <div className="flex flex-col items-center w-full max-w-xs md:max-w-md">
        <p>
          <span className='font-semibold'>SSID:</span> {ssid}
        </p>
        <p>
          <span className='font-semibold'>Password:</span> {password}
        </p>
        <p className='text-sm'>
          This QR code is valid for 7 days. Please regenerate it after expiration.
        </p>
      </div>
    </div>
  );
}

export default QRCodePdfLayout;