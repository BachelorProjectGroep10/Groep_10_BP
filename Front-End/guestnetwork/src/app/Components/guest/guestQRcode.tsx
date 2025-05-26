'use client'

import PasswordService from "@/app/Services/PasswordService";
import { useEffect, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";


export default function GuestQRcode() {
  const [monday, setMonday] = useState<string>();
  const [sunday, setSunday] = useState<string >();
  const ssid = 'BP Groep 10 - Gast Test';

  const fetchPassword = async () => {
    const response = await PasswordService.getPassword();
    const fetchedPassword = await response.json();
    return fetchedPassword.password;
  };

  const getWeekDates = () => {
    const today = new Date();
    const day = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondaydate =  monday.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' , year: 'numeric' });
    const sundaydate =  sunday.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' , year: 'numeric' });

    setMonday(mondaydate);
    setSunday(sundaydate);
  };

  useEffect(() => {
    getWeekDates();
  }, []);


  const { data: password, isLoading } = useSWR('password', fetchPassword);

  useInterval(() => {
    mutate('password', fetchPassword);
  }, 2000);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-10">
        <div className="mb-2 flex flex-col items-center justify-center">
          <div className=" mb-4 flex items-center justify-center">
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

        <div className="bg-[#9FDAF9] p-10 rounded-xl shadow mb-4 flex flex-col items-center justify-center">
          <QRCode
            value={`WIFI:S:${ssid};H:true;T:WPA;P:${password};;`}
            size={340}
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
          <h3 className='font-semibold text-2xl mt-2'>Scan Me</h3>
          <div className='flex flex-col items-start justify-center bg-white p-4 rounded-lg mt-4'>
            <p className="text-md">
              <span className="font-semibold">NETWERK / NETWORK:</span> {ssid}
            </p>
            <p className="text-md mt-2">
              <span className="font-semibold">WACHTWOORD / PASSWORD:</span> {password}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-1 text-lg text-black">
          <p className="font-semibold">Valid</p>
          <p className="font-semibold">
            From: <span className="font-normal">{monday}</span>
          </p>
          <span className="mx-1">-</span>
          <p className="font-semibold">
            Till: <span className="font-normal">{sunday}</span>
          </p>
        </div>
      </div>
    </div>
  )
}