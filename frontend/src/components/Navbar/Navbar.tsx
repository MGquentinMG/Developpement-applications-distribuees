"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "../../utils/NavigationUtil";
import { useAuth } from "../../contexts/AuthContext";
import { Shield, Bell } from "lucide-react";
import Logo from "../Logo/Logo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const isIndividualMessage = pathname.startsWith("/messages/") && pathname !== "/messages";
  const isPostPage = pathname.startsWith("/post/");
  const hiddenRoutes = ["/login", "/register", "/create-post", "/legal"];

  if (hiddenRoutes.includes(pathname) || isIndividualMessage || isPostPage) {
    return null;
  }

  const dynamicLinks = [...navLinks];

  if ((user?.role === "admin" || user?.role === "moderator") && !dynamicLinks.some(link => link.href === "/admin")) {
    dynamicLinks.push({ name: "Admin", href: "/admin", icon: Shield });
  }

  const half = Math.floor(dynamicLinks.length / 2);
  const leftLinks = dynamicLinks.slice(0, half);
  const rightLinks = dynamicLinks.slice(half);

  return (
    <>
      <nav className="md:hidden fixed bottom-6 left-4 right-4 max-w-md mx-auto bg-[#C8BFE9] dark:bg-[#2A2438] rounded-3xl z-50 shadow-lg transition-colors duration-300">
        <div className="flex justify-around items-center h-20 px-4">
          {leftLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${isActive ? "bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-700 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5"}`}>
                <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}

          <button onClick={() => router.push("/create-post")} className="flex items-center justify-center w-14 h-14 bg-[#492775] dark:bg-[#8B7BB5] rounded-2xl shadow-[0_4px_20px_rgba(73,39,117,0.35)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-[#3a1f5d] dark:hover:bg-[#6B5B8B] active:scale-95 transition-all duration-300 shrink-0 cursor-pointer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>

          {rightLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${isActive ? "bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-700 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5"}`}>
                <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="hidden md:flex sticky top-0 h-screen w-[80px] lg:w-[275px] flex-col border-l border-gray-100 dark:border-gray-800 pt-6 px-2 lg:px-6 bg-white dark:bg-[#121212] transition-colors duration-300 z-40">
        <div className="mb-8 ml-2 lg:ml-4 transform hover:scale-105 transition-transform duration-300 flex justify-center lg:justify-start cursor-pointer" onClick={() => router.push("/feed")}>
          <Logo />
        </div>

        <div className="flex flex-col gap-2 w-full">
          {dynamicLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} className="flex items-center gap-5 p-3 lg:py-3 lg:px-5 rounded-full transition-all duration-300 group hover:bg-gray-100 dark:hover:bg-[#2A2438] w-fit lg:w-full justify-center lg:justify-start">
                <Icon size={28} strokeWidth={isActive ? 2.5 : 2} className={`group-hover:text-[#492775] dark:group-hover:text-[#D0C9E8] transition-colors ${isActive ? "text-[#492775] dark:text-[#A395DA]" : "text-gray-800 dark:text-[#F9F9FB]"}`} />
                <span className={`hidden lg:block text-[19px] ${isActive ? "font-bold text-[#492775] dark:text-[#A395DA]" : "font-medium text-gray-800 dark:text-[#F9F9FB]"}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
          <Link href="/notifications" className="hidden md:flex items-center gap-5 p-3 lg:py-3 lg:px-5 rounded-full transition-all duration-300 group hover:bg-gray-100 dark:hover:bg-[#2A2438] w-fit lg:w-full justify-center lg:justify-start">
            <Bell size={28} className={`group-hover:text-[#492775] dark:group-hover:text-[#D0C9E8] transition-colors ${pathname === "/notifications" ? "text-[#492775] dark:text-[#A395DA]" : "text-gray-800 dark:text-[#F9F9FB]"}`} />
            <span className={`hidden lg:block text-[19px] ${pathname === "/notifications" ? "font-bold text-[#492775] dark:text-[#A395DA]" : "font-medium text-gray-800 dark:text-[#F9F9FB]"}`}>Notifications</span>
          </Link>
        </div>

        <div className="mt-6 lg:mt-8 w-full flex justify-center lg:justify-start lg:px-2">
          <button onClick={() => router.push("/create-post")} className="flex items-center justify-center bg-[#492775] text-white dark:bg-[#A395DA] dark:text-[#1E1E40] w-14 h-14 rounded-full shadow-[0_4px_15px_rgba(73,39,117,0.4)] lg:w-full lg:h-14 lg:rounded-full cursor-pointer hover:bg-[#3a1f5d] dark:hover:bg-[#8B7BB5] transition-all transform hover:scale-105 duration-300">
            <svg className="lg:hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            <span className="hidden lg:block font-bold text-[17px]">Poster</span>
          </button>
        </div>
      </nav>
    </>
  );
}