import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import "./Styles/globals.css";
import Background from "./Components/background";
import { HeaderComponent } from "./Components/header";
import { QRCodeComponent } from "./Components/qrCode";

export default function Home() {
  return (
    <div className="relative w-screen overflow-x-hidden overflow-y-auto md:h-screen md:overflow-hidden">
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Background />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderComponent />
        <QRCodeComponent />
      </div>
    </div>
)}