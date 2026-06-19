import { MousePointerClick } from "lucide-react";
import { ButtonProps } from "@/src/types/ButtonType";

export default function Button({ 
  label, 
  defaultActive = false, 
  isHashtag = true, 
  variant = "theme",
  onClick 
}: ButtonProps) {
  
  const inactiveClasses = variant === "theme" 
    ? "bg-[#A395DA]/[0.14] text-[#492775] hover:bg-[#A395DA]/30 dark:bg-[#2A2438] dark:text-[#D0C9E8] dark:hover:bg-[#3a304d]" 
    : "bg-white text-[#492775] shadow-sm hover:bg-[#F3F0FF] dark:bg-[#2A2438] dark:text-[#D0C9E8] dark:hover:bg-[#3a304d]";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 border-none cursor-pointer ${
        defaultActive 
          ? "bg-[#492775] text-white dark:bg-[#A395DA] dark:text-[#1E1E40] shadow-md" 
          : inactiveClasses
      }`}
    >
      {isHashtag && "#"}
      {label}
      {label === "Connexion" && <MousePointerClick size={14} />}
    </button>
  );
}