export default function Background() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Top-left circle - visible on all screens */}
      <div className="absolute bg-[#9FDAF9] w-32 h-32 sm:w-40 sm:h-40 rounded-full top-[-60px] left-[-60px]" />

      {/* Bottom-right small circle */}
      <div className="absolute bg-[#002757] w-16 h-16 rounded-full right-4 bottom-[-40px]" />

      {/* Bottom-right larger circle */}
      <div className="absolute bg-[#FA1651] w-32 h-32 sm:w-44 sm:h-44 rounded-full bottom-[-70px] right-[-70px]" />

      {/* Bottom-left small circle - only on sm+ */}
      <div className="hidden sm:block absolute bg-[#9FDAF9] w-20 h-20 rounded-full bottom-10 left-[-40px]" />

      {/* Bottom-left larger circle - only on sm+ */}
      <div className="hidden sm:block absolute bg-[#FA1651] w-28 h-28 rounded-full bottom-[-40px] left-[-30px]" />

      {/* Top-right small circle - only on sm+ */}
      <div className="hidden sm:block absolute bg-[#002757] w-20 h-20 rounded-full top-[-20px] right-[-20px]" />

      {/* Top-right large circle - only on sm+ */}
      <div className="hidden sm:block absolute bg-[#9FDAF9] w-32 h-32 rounded-full top-[20px] right-[-90px]" />
    </div>
  );
}
