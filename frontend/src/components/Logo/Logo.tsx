import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      
      <Image 
        src="/Breezy_logo.png"
        alt="Logo Breezy" 
        width={80} 
        height={80} 
        className="w-20 h-20 object-contain"
      />
    </Link>
  );
}