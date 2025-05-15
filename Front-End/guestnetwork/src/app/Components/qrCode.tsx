'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import { FaWifi } from 'react-icons/fa';
import QRCodePdfLayout from './qrCodePdfLayout';
import { RiFileDownloadLine } from "react-icons/ri";
import { QRCode } from 'react-qrcode-logo';


interface QRCodeComponentProps {
  ssid?: string;
  password?: string;
}

export function QRCodeComponent({ssid = 'BP Groep 10 (PSK)', password = 'groep10QRCodeTest123@'}: QRCodeComponentProps) {
  const pdfRef = React.useRef<HTMLDivElement | null>(null);

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
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:mt-6">
      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-xl md:text-2xl font-bold">Get access to</h1>
        <h1 className="text-xl md:text-2xl font-bold mb-2">{ssid} Network</h1>
        <FaWifi size={40} className="md:flex hidden" />
        <h2 className="font-semibold mt-2 text-sm text-accent">
          Scan QR code for access
        </h2>
      </div>

      <div className="flex flex-col items-center w-60 h-80 md:w-80 md:h-96">
        <div
          className="bg-[#9FDAF9] p-6 rounded-lg shadow-lg w-full flex flex-col items-center justify-around relative "
        >
          <button
            onClick={() => handleDownloadPdf()}
            type="button"
            className="absolute top-2 right-2 text-[#002757] hover:bg-[#e6f4fb] rounded-full p-1 transition duration-200"
            aria-label="Download as PDF"
          >
            <RiFileDownloadLine size={18} />
          </button>
          <QRCode value={`WIFI:S:${ssid};H:true;T:WPA;P:${password};;`} 
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
          <div className="mt-4 text-left w-full">
            <p className="text-sm font-semibold">
              SSID: <span className="font-normal">{ssid}</span>
            </p>
            <p className="text-sm font-semibold">
              Password: <span className="font-normal">{password}</span>
            </p>
          </div>
        </div>
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

        <h2 className="hidden md:flex font-semibold mt-4 text-sm text-center">
          This QR code is valid for 7 days. After that,
          <br />
          you will need to scan the QR code again.
        </h2>
        <h2 className="md:hidden flex font-semibold mt-4 text-sm text-center">
          This QR code is valid for 7 days.
        </h2>
      </div>
    </div>
  );
}

export default QRCodeComponent;