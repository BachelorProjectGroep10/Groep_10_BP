import { QRCodeSVG } from "qrcode.react";
import { FaWifi } from "react-icons/fa";

export function QRCodeComponent() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:mt-6">
      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-2xl font-bold">Get access to</h1>
        <h1 className="text-2xl font-bold mb-2">UCLL Guest Network</h1>
        <FaWifi size={40} className="md:flex hidden" />
        <h2 className="font-semibold mt-2 text-sm text-accent">Scan QR code for access</h2>
      </div>

      <div className="flex flex-col items-center w-full max-w-xs">
        <div className="bg-[#9FDAF9] p-6 rounded-lg shadow-lg w-full flex flex-col items-center justify-around">
          <QRCodeSVG 
            value="WIFI:T:WPA;S:UCLL_GUEST;P:UCLLPASSWORD;;"
            size={140}
          />
          <div className="mt-4 text-left w-full">
            <p className="text-sm font-semibold">SSID: <span className="font-normal">UCLL_GUEST</span></p>
            <p className="text-sm font-semibold">Password: <span className="font-normal">UCLLPASSWORD</span></p>
          </div>
        </div>

        <h2 className="hidden md:flex font-semibold mt-4 text-sm text-accent text-center">
          This QR code is valid for 7 days. After that,<br />
          you will need to scan the QR code again to get access to the UCLL Guest Network.
        </h2>
        <h2 className="md:hidden flex font-semibold mt-4 text-sm text-accent text-center">This QR code is valid for 7 days.</h2>
      </div>
    </div>
  );
}
