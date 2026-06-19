"use client";

import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import { ConversationListProps } from "../../types/MessageType";

export default function MessageListCard({
  id,
  author,
  timeAgo,
  preview,
  isUnread,
  avatarUrl,
}: ConversationListProps) {
  return (
    <Link 
      href={`/messages/${id}`}
      className="flex items-center gap-3 p-3 rounded-[32px] border border-[#E0D8F0] dark:border-[#2A2438] bg-white dark:bg-[#1A1A2E] mb-3 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-[#2A2438]"
    >
      <div className="shrink-0 relative">
        <Avatar src={avatarUrl} alt={author} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <div className="bg-[#A395DA] px-3 py-0.5 rounded-full flex gap-1 items-center">
            <span className="text-white font-bold text-[13px]">{author}</span>
            <span className="text-white/80 text-[10px]">{timeAgo}</span>
          </div>
        </div>
        <p className="text-[#1E1E40] dark:text-[#D0C9E8] text-[12px] mt-1 font-medium truncate pr-4 transition-colors duration-300">
          {preview}
        </p>
      </div>

      {isUnread && (
        <div className="w-3.5 h-3.5 bg-[#FF0000] rounded-full shrink-0 mr-2 shadow-sm"></div>
      )}
    </Link>
  );
}