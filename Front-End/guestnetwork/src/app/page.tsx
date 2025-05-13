import Image from "next/image";
import {QRCodeSVG} from 'qrcode.react';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Image
        src="/Images/UCLL-logo.jpg"
        alt="UCLL logo"
        width={500}
        height={500}
        className="rounded-lg"
        priority
      ></Image>
      <QRCodeSVG value="https://reactjs.org/"/>
    </div>
  );
}
