"use client";

import { useTranslation } from "react-i18next";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  variant?: "default" | "messages";
  placeholder?: string;
}

export default function SearchBar({ value, onChange, variant = "default", placeholder }: SearchBarProps) {
  const { t } = useTranslation();
  
  const isMessages = variant === "messages";
  
  const containerClasses = isMessages
    ? "bg-[#C8BFE9] dark:bg-[#2A2438]"
    : "bg-[#EDE9F7] dark:bg-[#2A2438]";
    
  const textClasses = isMessages
    ? "text-white dark:text-[#F9F9FB] placeholder-white/80 dark:placeholder-[#A395DA]"
    : "text-[#1E1E40] dark:text-[#F9F9FB] placeholder-[#8B7BB5] dark:placeholder-[#A395DA]";
    
  const iconColor = isMessages ? "text-white/80 dark:text-[#A395DA]" : "text-[#8B7BB5] dark:text-[#A395DA]";

  return (
    <div className={`flex items-center gap-3 rounded-full px-4 py-2.5 flex-1 transition-colors duration-300 ${containerClasses}`}>
      {!isMessages && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || t("feed.searchPlaceholder")}
        className={`bg-transparent outline-none text-sm w-full font-medium transition-colors duration-300 ${textClasses}`}
      />
      {value && (
        <button onClick={() => onChange("")} className={`${iconColor} hover:opacity-70 transition-colors`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}