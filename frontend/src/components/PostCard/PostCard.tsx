"use client";

import Avatar from "../../components/Avatar/Avatar";
import PostAction from "../../components/PostAction/PostAction";
import { Heart, MessageCircle, Upload } from "lucide-react";
import { PostCardProps } from "@/src/types/PostCardType";
import { renderContentWithHashtags, truncateAuthor } from "../../utils/TextUtil";
import { usePostActions } from "../../hooks/usePostAction";

export default function PostCard({ author, timeAgo, content, likes, comments, shares, avatarUrl }: PostCardProps) {
  const displayAuthor = truncateAuthor(author);
  const { isLiked, handleLike, handleComment, handleShare } = usePostActions(author);

  return (
    <article className="relative bg-[#A395DA]/[0.14] rounded-3xl p-4 pt-9 mb-8 ml-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      
      <div className="absolute -top-4 -left-4 flex items-center max-w-[50%]">
        <div className="z-10 relative shrink-0">
          <Avatar src={avatarUrl} alt={author} />
        </div>
        
        <div className="bg-[#A395DA] pl-6 pr-3 py-1 rounded-r-full text-white -ml-4 shadow-sm min-w-0">
          <h3 className="font-bold text-[13px] leading-tight truncate" title={author}>
            {displayAuthor}
          </h3>
          <span className="text-[10px] opacity-90 block truncate">{timeAgo}</span>
        </div>
      </div>

      <div className="absolute top-3 right-4 flex items-center gap-3">
        <PostAction icon={Heart} count={likes} filled={isLiked} onClick={handleLike} />
        <PostAction icon={MessageCircle} count={comments} filled={false} onClick={handleComment} />
        <PostAction icon={Upload} count={shares} filled={false} onClick={handleShare} />
      </div>

      <p className="text-[12px] text-[#492775] font-medium leading-relaxed mt-2">
        {renderContentWithHashtags(content)}
      </p>
      
    </article>
  );
}