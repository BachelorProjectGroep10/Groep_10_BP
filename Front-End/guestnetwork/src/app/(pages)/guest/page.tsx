import Background from "@/app/Components/Utils/background";
import QRCodePdfLayout from "@/app/Components/qrCodePdfLayout";

export default function GuestView() {

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 ">
        <Background />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
      </div>
    </div>
  )
}