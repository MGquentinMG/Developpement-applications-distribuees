"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Avatar from "../Avatar/Avatar";
import PostAction from "../PostAction/PostAction";
import { Heart, MessageCircle } from "lucide-react";
import { CommentProps } from "../../types/CommentType";
import "../../i18n";

export default function CommentCard({ id, author, timeAgo, content, likes, avatarUrl, onReply }: CommentProps) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flex gap-3 mb-5">
      <Link href={`/profile/${author}`} className="shrink-0 w-10 h-10 hover:opacity-80 transition-opacity">
        <Avatar src={avatarUrl} alt={author} />
      </Link>
      <div className="flex-1 bg-[#F3F0FF] dark:bg-[#2A2438] rounded-2xl rounded-tl-none p-3.5 transition-colors duration-300">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/profile/${author}`} className="font-bold text-[13px] text-[#1E1E40] dark:text-[#F9F9FB] hover:underline">
            {author}
          </Link>
          <span className="text-[10px] text-gray-500 dark:text-[#A395DA]">{timeAgo}</span>
        </div>
        <p className="text-[#492775] dark:text-[#D0C9E8] text-[13px] leading-snug mb-3">
          {content}
        </p>
        <div className="flex items-center gap-4">
          <PostAction icon={Heart} count={likes} filled={isLiked} onClick={() => setIsLiked(!isLiked)} />
          <button 
            onClick={() => onReply && onReply(author)}
            className="flex items-center gap-1 group cursor-pointer text-[#A395DA] dark:text-[#8B7BB5] hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors duration-300"
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            <span className="font-bold text-[12px]">{t("post.reply")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}