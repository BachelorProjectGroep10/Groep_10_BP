import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import "./Styles/globals.css";
import Background from "./Components/background";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Background />
      </div>
      <div className="relative z-2">
        <Image
          src="/Images/UCLL-logo.jpg"
          alt="UCLL logo"
          width={200}
          height={200}
          className="rounded-lg mx-40 m-10"
          priority
        ></Image>
        <QRCodeSVG value="https://reactjs.org/" />
      </div>
    </div>
  );
}