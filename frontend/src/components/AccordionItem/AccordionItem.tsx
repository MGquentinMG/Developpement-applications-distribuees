"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AccordionItemProps } from "../../types/AccordionItemType";

export default function AccordionItem({ title, children, defaultOpen = false, variant = "settings" }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isSettings = variant === "settings";

  const headerClasses = isSettings
    ? "flex items-center justify-between py-4 text-[#1E1E40] dark:text-[#F9F9FB] text-[17px] bg-transparent cursor-pointer transition-colors duration-300"
    : "flex items-center gap-3 px-4 py-4 text-[#1E1E40] dark:text-[#F9F9FB] text-[17px] bg-[#D0C9E8] dark:bg-[#2A2438] border-b border-[#B8AED3] dark:border-gray-800 cursor-pointer transition-colors duration-300";

  const containerClasses = isSettings
    ? `bg-white dark:bg-transparent overflow-hidden transition-all duration-300 ${isOpen ? "shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-none dark:bg-[#1A1A2E] rounded-2xl p-4 mb-4" : ""}`
    : "overflow-hidden transition-all duration-300";

  return (
    <div className={containerClasses}>
      <div className={headerClasses} onClick={() => setIsOpen(!isOpen)}>
        {!isSettings && (
          isOpen 
            ? <ChevronDown size={20} className="text-[#1E1E40] dark:text-[#F9F9FB] transition-colors duration-300" /> 
            : <ChevronRight size={20} className="text-[#1E1E40] dark:text-[#F9F9FB] transition-colors duration-300" />
        )}
        
        <span>{title}</span>
        
        {isSettings && (
          <ChevronDown size={20} className={`text-[#1E1E40] dark:text-[#F9F9FB] transition-all duration-300 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>
      
      {isOpen && (
        <div className={isSettings ? "pt-2 pb-2" : "p-6 bg-white dark:bg-[#121212] transition-colors duration-300"}>
          {children}
        </div>
      )}
    </div>
  );
}