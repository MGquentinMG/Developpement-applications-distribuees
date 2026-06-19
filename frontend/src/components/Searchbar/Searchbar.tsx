"use client";

import { useTranslation } from "react-i18next";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-3 bg-[#EDE9F7] dark:bg-[#2A2438] rounded-full px-4 py-2.5 flex-1 transition-colors duration-300">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#8B7BB5] dark:text-[#A395DA]" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("feed.searchPlaceholder")}
        className="bg-transparent outline-none text-[#1E1E40] dark:text-[#F9F9FB] placeholder-[#8B7BB5] dark:placeholder-[#A395DA] text-sm w-full transition-colors duration-300"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-[#8B7BB5] dark:text-[#A395DA] hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}