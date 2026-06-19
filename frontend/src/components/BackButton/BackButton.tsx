"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5D5286] text-white hover:bg-[#492775] transition-colors shadow-md"
    >
      <ChevronLeft size={20} strokeWidth={2.5} />
    </button>
  );
}