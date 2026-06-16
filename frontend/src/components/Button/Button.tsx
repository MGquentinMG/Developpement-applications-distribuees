"use client";

import { useState } from "react";
import { ButtonProps } from "@/src/types/Button";

export default function Button({ label, defaultActive = false }: ButtonProps) {
  const [isActive, setIsActive] = useState(defaultActive);

  return (
    <button
      onClick={() => setIsActive(!isActive)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-none cursor-pointer ${
        isActive
          ? "bg-[#A395DA] text-[#FFFFFF]"
          : "bg-[#A395DA]/[0.14] text-[#492775]" 
      }`}
    >
      #{label}
    </button>
  );
}