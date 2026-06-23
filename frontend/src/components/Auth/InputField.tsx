"use client";

import { InputFieldProps } from "../../types/AuthType";

export function InputField({ error, ...props }: InputFieldProps) {
  return (
    <div className="w-full">
      <input
        className={`w-full bg-[#F4F4F5] dark:bg-[#2A2438] text-gray-900 dark:text-[#F9F9FB] placeholder-gray-400 dark:placeholder-[#A395DA] text-sm rounded-lg block p-3 outline-none transition-colors focus:ring-2 focus:ring-[#A098E5] ${
          error ? "border border-red-500" : "border border-transparent"
        }`}
        {...props}
      />
    </div>
  );
}