"use client";

import BackButton from "../BackButton/BackButton";
import Avatar from "../Avatar/Avatar";
import { ConversationHeaderProps } from "../../types/MessageType";

export default function ConversationHeader({ title, status, avatarUrl }: ConversationHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-20 backdrop-blur-xl bg-[#FDFDFD]/80 dark:bg-[#121212]/80 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <BackButton />
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar src={avatarUrl} alt={title} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#009650] border-2 border-white dark:border-[#121212] rounded-full transition-colors duration-300"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-[16px] leading-tight transition-colors duration-300">
              {title}
            </h1>
            <span className="text-[#8B7BB5] dark:text-[#A395DA] text-[12px] font-medium transition-colors duration-300">
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}