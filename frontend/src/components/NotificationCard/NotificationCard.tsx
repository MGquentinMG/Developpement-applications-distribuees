"use client";

import { Heart, MessageCircle, Upload, UserPlus } from "lucide-react";
import { NotificationProps } from "../../types/NotificationType";
import { useTranslation } from "react-i18next";

export default function NotificationCard({ username, action, time, isRead }: NotificationProps) {
  const { t } = useTranslation();

  const getActionConfig = () => {
    switch (action) {
      case "like": return { icon: Heart, bgColor: "bg-[#9A89CC]", text: t("notifications.liked") };
      case "comment": return { icon: MessageCircle, bgColor: "bg-[#A798D3]", text: t("notifications.commented") };
      case "share": return { icon: Upload, bgColor: "bg-[#9A89CC]", text: t("notifications.shared") };
      case "follow": return { icon: UserPlus, bgColor: "bg-[#9A89CC]", text: t("notifications.addedFriend") };
      default: return { icon: Heart, bgColor: "bg-[#9A89CC]", text: "" };
    }
  };

  const { icon: Icon, bgColor, text } = getActionConfig();

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-xl mb-3 shadow-sm transition-all border ${
        isRead ? "bg-white border-gray-100" : "bg-[#F3EFFF] border-[#E0D8F0]"
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 ${bgColor}`}>
        <Icon size={24} fill={action === "like" ? "currentColor" : "none"} strokeWidth={action === "like" ? 0 : 2} />
      </div>
      <div className="flex flex-col">
        <p className="text-[#1E1E40] text-sm leading-tight">
          <span className="font-bold">{username}</span> {text}
        </p>
        <span className="text-gray-400 text-xs mt-0.5">{time}</span>
      </div>
    </div>
  );
}