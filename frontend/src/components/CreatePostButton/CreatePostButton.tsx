"use client";

import { useRouter } from "next/navigation";

export default function CreatePostButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/create-post")}
      className="fixed bottom-24 left-6 z-30 w-14 h-14 bg-[#C4B5E8] dark:bg-[#492775] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(73,39,117,0.25)] hover:bg-[#b3a0e0] dark:hover:bg-[#3a1f5d] transition-all active:scale-95 duration-300"
      aria-label="Créer un post"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-[#492775] dark:stroke-white transition-colors duration-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}