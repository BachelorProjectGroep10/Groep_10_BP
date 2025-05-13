export default function Background() {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <div className="absolute bg-[#9FDAF9] sm:bg-[#FA1651] w-40 h-40 rounded-full top-[-90px] left-[-70px]"></div>
            <div className="absolute bg-[#002757] w-25 h-25 rounded-full right-[50px] bottom-[-60px]"></div>
            <div className="absolute bg-[#FA1651] w-45 h-45 rounded-full bottom-[-60px] right-[-100px]"></div>
            <div className="absolute bg-[#9FDAF9] w-25 h-25 rounded-full bottom-[40px] left-[-50px] hidden sm:block"></div>
            <div className="absolute bg-[#FA1651] w-35 h-35 rounded-full bottom-[-60px] left-[-40px] hidden sm:block"></div>
            <div className="absolute bg-[#002757] w-25 h-25 rounded-full top-[-20px] right-[-30px] hidden sm:block"></div>
            <div className="absolute bg-[#9FDAF9] w-40 h-40 rounded-full top-[30px] right-[-120px] hidden sm:block"></div>
        </div>
    );
}
