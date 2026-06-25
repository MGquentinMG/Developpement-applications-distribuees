"use client";

import { Heart, MessageCircle, Upload, UserPlus } from "lucide-react";
import { NotificationProps } from "../../types/NotificationType";
import { useTranslation } from "react-i18next";

export default function NotificationCard({ username, action, time, isRead }: NotificationProps) {
  const { t } = useTranslation();

  const getActionConfig = () => {
    switch (action) {
      case "like": return { icon: Heart, bgColor: "bg-[#9A89CC] dark:bg-[#8B7BB5]", text: t("notifications.liked") };
      case "comment": return { icon: MessageCircle, bgColor: "bg-[#A798D3] dark:bg-[#7A6A9F]", text: t("notifications.commented") };
      case "share": return { icon: Upload, bgColor: "bg-[#9A89CC] dark:bg-[#8B7BB5]", text: t("notifications.shared") };
      case "follow": return { icon: UserPlus, bgColor: "bg-[#9A89CC] dark:bg-[#8B7BB5]", text: t("notifications.addedFriend") };
      default: return { icon: Heart, bgColor: "bg-[#9A89CC] dark:bg-[#8B7BB5]", text: "" };
    }
  };

  const { icon: Icon, bgColor, text } = getActionConfig();

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-xl mb-3 shadow-sm transition-all duration-300 border ${
        isRead 
          ? "bg-white dark:bg-[#1A1A2E] border-gray-100 dark:border-gray-800" 
          : "bg-[#F3EFFF] dark:bg-[#2A2438] border-[#E0D8F0] dark:border-[#492775]"
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 transition-colors duration-300 ${bgColor}`}>
        <Icon size={24} fill={action === "like" ? "currentColor" : "none"} strokeWidth={action === "like" ? 0 : 2} />
      </div>
      <div className="flex flex-col">
        <p className="text-[#1E1E40] dark:text-[#F9F9FB] text-sm leading-tight transition-colors duration-300">
          <span className="font-bold">{username}</span> {text}
        </p>
        <span className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 transition-colors duration-300">{time}</span>
      </div>
    </div>
  );
}