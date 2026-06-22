import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <Image 
        src="/breezy_logo.png"
        alt="Logo Breezy" 
        width={40} 
        height={40} 
        loading="eager"
        priority
        className="w-10 h-10 object-contain"
      />
    </Link>
  );
}