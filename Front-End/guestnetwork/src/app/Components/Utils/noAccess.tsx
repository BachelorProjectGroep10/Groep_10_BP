import Link from "next/link";
import { useRouter } from "next/navigation";


export default function NoAccess() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className=" mb-4 flex items-center justify-center">
        <img
          src="/Images/Logo_UCLL_ROUND.png"
          alt="UCLL Logo"
          className="w-24 h-24 sm:w-40 sm:h-40 rounded-full"
        />
      </div>
      <h1 className="text-4xl font-bold text-[#002757]">Access Denied</h1>
      <p className="mt-4 text-lg">You do not have permission to access this page.</p>
      <button onClick={() => router.push('/')} className="mt-6 px-4 py-2 bg-[#002757] text-lg font-semibold text-white rounded hover:bg-[#FA1651] transition-colors cursor-pointer">
        Login
      </button>
    </div>
  );
}