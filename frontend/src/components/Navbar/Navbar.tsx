"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/src/utils/Navigation"; 

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-4 right-4 max-w-md mx-auto bg-[#C8BFE9] rounded-3xl sm:hidden z-50 shadow-lg">
      <div className="flex justify-around items-center h-20 px-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-white/40 text-gray-900 shadow-sm"
                  : "text-gray-700 hover:bg-white/20"   
              }`}
            >
              <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}