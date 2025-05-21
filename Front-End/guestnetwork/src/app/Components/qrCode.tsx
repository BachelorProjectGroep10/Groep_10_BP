'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { MdDashboardCustomize } from "react-icons/md";
import React from 'react';
import { useEffect, useState } from "react";
import { FaWifi } from 'react-icons/fa';
import QRCodePdfLayout from './qrCodePdfLayout';
import { RiFileDownloadLine } from "react-icons/ri";
import { QRCode } from 'react-qrcode-logo';
import PasswordService from "../Services/PasswordService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import SingleUserComponent from './singleUser';
import GroupSelectComponent from './groupSelect';
import { IoQrCodeSharp } from "react-icons/io5";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { useTranslation } from "react-i18next";
import '../i18n'; 


export function QRCodeComponent() {
  const [showBackground, setShowBackground] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const pdfRef = React.useRef<HTMLDivElement | null>(null);

  const [activeView, setActiveView] = useState<'qr' | 'single' | 'group'>('qr');
  const ssid = 'BP Groep 10 - Gast Test';

  const { t } = useTranslation();

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
    <div className="flex flex-col items-center w-full mt-4 mb-10">
      <div className="w-full max-w-screen-md mx-auto px-4">
        <div className="bg-[#9FDAF9] px-2 py-2 rounded-lg shadow-lg w-full flex flex-col md:flex-row items-center justify-around gap-4 ">
          <div className="flex flex-col items-center mx-8 w-full md:w-auto">
            <div className="hidden md:flex md:flex-col md:items-center py-4">
              <h1 className="text-2xl font-bold text-center">{t('qrcode.title')}</h1>
              <FaWifi size={40} />
              <h2 className="font-semibold my-2 text-sm text-accent">{t('qrcode.smallMessage')}</h2>
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
                <p>{t('qrcode.loading')}</p>
              )}
              <div className="mt-2 text-left w-full max-w-[300px]">
                <p className="text-sm font-semibold">
                  SSID: <span className="font-normal">{ssid}</span>
                </p>
                <p className="text-sm font-semibold mb-4">
                  {t('qrcode.password')}: <span className="font-normal">{password ?? t('qrcode.loading')}</span>
                </p>
                <div className="mt-4 mx-left w-full max-w-[200px] flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadPdf}
                      className="bg-[#002757] text-white hover:bg-[#FA1651] flex items-center justify-center gap-2 text-sm rounded-lg p-2 transition duration-200 mb-2"                    >
                      <RiFileDownloadLine size={14} /> download PDF
                    </button>
                    <button 
                      onClick={() => setShowModal(true)}
                      className="bg-[#002757] text-white hover:bg-[#FA1651] flex items-center justify-center gap-2 text-sm rounded-lg p-2 transition duration-200 mb-2"                    >
                      <MdDashboardCustomize />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* On md and smaller show the QR or form based on activeView */}
            <div className="md:hidden w-full flex flex-col items-center justify-center p-2">
            {activeView === 'qr' && (
              <>
                <h1 className="text-2xl font-bold text-center">{ssid}</h1>
                <FaWifi size={40} className="mx-auto" />
                <h2 className="font-semibold my-4 text-sm text-accent text-center">{t('qrcode.smallMessage')}</h2>
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
                    <p>{t('qrcode.loading')}</p>
                  )}
                  <div className="mt-4 mx-auto w-full max-w-[200px] text-left">
                    <p className="text-sm font-semibold">
                      SSID: <span className="font-normal">{ssid}</span>
                    </p>
                    <p className="text-sm font-semibold mb-4">
                      {t('qrcode.password')}: <span className="font-normal">{password ?? t('qrcode.loading')}</span>
                    </p>
                    <div className="mt-4 mx-left w-full max-w-[200px] flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={handleDownloadPdf}
                          className="bg-[#002757] text-white hover:bg-[#FA1651] flex items-center justify-center gap-2 text-sm rounded-lg p-2 transition duration-200 mb-2"                    >
                          <RiFileDownloadLine size={14} /> download PDF
                        </button>
                        <button 
                          onClick={() => setShowModal(true)}
                          className="bg-[#002757] text-white hover:bg-[#FA1651] flex items-center justify-center gap-2 text-sm rounded-lg p-2 transition duration-200 mb-2"                    >
                          <MdDashboardCustomize />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeView === 'single' && <SingleUserComponent isMobile={true} />}
              {activeView === 'group' && <GroupSelectComponent isMobile={true} />}
            </div>
          </div>

          {/* On md+ show the forms always next to QR code */}
          <div className="hidden md:flex flex-col items-center justify-center gap-4">
            <SingleUserComponent isMobile={false} />
            <GroupSelectComponent isMobile={false} />
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
            <IoPersonAddSharp size={20} />
          </button>
          <button
            onClick={() => setActiveView('group')}
            className={`bg-[#002757] text-white px-4 py-2 rounded-lg ${
              activeView === 'group' ? 'ring-2 ring-white' : ''
            }`}
          >
            <MdGroups size={30} />

          </button>
          <button
            onClick={() => setActiveView('qr')}
            className={`bg-[#002757] text-white px-4 py-2 rounded-lg ${
              activeView === 'qr' ? 'ring-2 ring-white' : ''
            }`}
          >
            <IoQrCodeSharp size={20} />
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm font-semibold">
            {t('qrcode.footerMessage')}
            <span className="hidden md:inline"> {t('qrcode.footerMessage2')}</span>
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <div
          ref={pdfRef}
          style={{ width: '794px', height: '1123px' }}
          className="flex flex-col items-center justify-around"
        >
          <QRCodePdfLayout ssid={ssid} password={password} showBackground={showBackground} />
        </div>
      </div>

      {/* Customize Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Customize PDF Layout</h2>

            <label className="flex items-center mb-4 cursor-pointer text-gray-800">
              <input
                type="checkbox"
                checked={showBackground}
                onChange={(e) => setShowBackground(e.target.checked)}
                className="form-checkbox h-5 w-5 text-[#002757] rounded border-gray-300 focus:ring-[#002757] focus:ring-2"
              />
              <span className="ml-2 select-none">Show background ("rounds")</span>
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#002757] text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRCodeComponent;