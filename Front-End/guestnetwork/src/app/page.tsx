import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Image
        src="/images/guestnetwork.png"
        alt="Guest Network Logo"
        width={500}
        height={500}
      />
    </div>
  );
}
