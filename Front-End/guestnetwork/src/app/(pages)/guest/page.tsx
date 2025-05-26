import GuestQRcode from "@/app/Components/guest/guestQRcode";
import Background from "@/app/Components/Utils/background";

export default function GuestView() {

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 ">
        <Background />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <GuestQRcode />
      </div>
    </div>
  )
}