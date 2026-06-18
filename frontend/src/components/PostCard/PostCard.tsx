"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "../Avatar/Avatar";
import PostAction from "../PostAction/PostAction";
import { Heart, MessageCircle, Upload } from "lucide-react";
import { PostCardProps } from "../../types/PostCardType";
import { renderContentWithHashtags, truncateAuthor } from "../../utils/TextUtil";

export default function PostCard({
  author,
  timeAgo,
  content,
  likes,
  comments,
  shares,
  avatarUrl,
  imageUrl,
  onRequireAuth
}: PostCardProps) {
  const { t } = useTranslation();
  const displayAuthor = truncateAuthor(author);
  
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (onRequireAuth) {
      onRequireAuth();
    } else {
      setIsLiked(!isLiked);
    }
  };

  const handleGenericAction = () => {
    if (onRequireAuth) {
      onRequireAuth();
    }
  };

  return (
    <article className="relative bg-[#A395DA]/[0.14] rounded-3xl p-4 pt-9 mb-8 ml-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      <div 
        className="absolute -top-4 -left-4 flex items-center max-w-[50%] cursor-pointer"
        onClick={handleGenericAction}
      >
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
        <PostAction icon={MessageCircle} count={comments} filled={false} onClick={handleGenericAction} />
        <PostAction icon={Upload} count={shares} filled={false} onClick={handleGenericAction} />
      </div>

      <p className="text-[12px] text-[#492775] font-medium leading-relaxed mt-2 mb-3">
        {renderContentWithHashtags(content)}
      </p>

      {imageUrl && (
        <div className="rounded-2xl overflow-hidden mb-3 bg-[#F5F0FF]">
          <img src={imageUrl} alt="post visual" className="w-full object-cover max-h-64" />
        </div>
      )}
    </article>
  );
}