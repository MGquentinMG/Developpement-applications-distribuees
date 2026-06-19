"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "../../utils/NavigationUtil";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/create-post" || pathname === "/legal") {
    return null;
  }

  const half = Math.floor(navLinks.length / 2);
  const leftLinks = navLinks.slice(0, half);
  const rightLinks = navLinks.slice(half);

  return (
    <nav className="fixed bottom-6 left-4 right-4 max-w-md mx-auto bg-[#C8BFE9] dark:bg-[#2A2438] rounded-3xl sm:hidden z-50 shadow-lg transition-colors duration-300">
      <div className="flex justify-around items-center h-20 px-4">
        {leftLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}

        <button
          onClick={() => router.push("/create-post")}
          className="flex items-center justify-center w-14 h-14 bg-[#492775] dark:bg-[#8B7BB5] rounded-2xl shadow-[0_4px_20px_rgba(73,39,117,0.35)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-[#3a1f5d] dark:hover:bg-[#6B5B8B] active:scale-95 transition-all duration-300"
          aria-label="Créer un post"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {rightLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5"
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