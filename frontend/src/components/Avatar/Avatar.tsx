import { User } from "lucide-react";
import { AvatarProps } from "@/src/types/AvatarType";

export default function Avatar({ src, alt = "Avatar" }: AvatarProps) {
  return (
    <div className="relative shrink-0">
      <div className="flex items-center justify-center w-12 h-12 bg-[#E5E7EB] rounded-full text-gray-500 shadow-sm overflow-hidden">
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <User size={24} />
        )}
      </div>
    </div>
  );
}