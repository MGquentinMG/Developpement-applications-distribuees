"use client";

import { ToggleProps } from "../../types/ToggleType";

export default function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center justify-between py-3 cursor-pointer">
      <span className="text-[#1E1E40] dark:text-[#F9F9FB] text-[16px] transition-colors duration-300">{label}</span>
      <div 
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          checked ? "bg-[#492775] dark:bg-[#A395DA]" : "bg-gray-300 dark:bg-gray-700"
        }`}
      >
        <div 
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </div>
      <input 
        type="checkbox" 
        className="hidden" 
        checked={checked} 
        onChange={onChange} 
      />
    </label>
  );
}