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
    ? "bg-[#A395DA]/[0.14] text-[#492775] hover:bg-[#A395DA]/30" 
    : "bg-white text-[#492775] shadow-sm hover:bg-[#F3F0FF]";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 border-none cursor-pointer ${
        defaultActive 
          ? "bg-[#492775] text-white shadow-md" 
          : inactiveClasses
      }`}
    >
      {isHashtag && "#"}
      {label}
      {label === "Connexion" && <MousePointerClick size={14} />}
    </button>
  );
}