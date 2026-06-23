"use client";

import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import PostAction from "../PostAction/PostAction";
import ShareModal from "../ShareModal/ShareModal";
import { Heart, MessageCircle, Upload } from "lucide-react";
import { PostCardProps } from "../../types/PostCardType";
import { renderContentWithHashtags, truncateAuthor } from "../../utils/TextUtil";
import { usePostCard } from "../../hooks/usePostCard";

export default function PostCard({
  id,
  author,
  timeAgo,
  content,
  likes,
  comments,
  shares,
  avatarUrl,
  imageUrl,
  isLiked: isLikedProp,
  onRequireAuth,
  onCommentClick,
  onLike,
}: PostCardProps) {
  const initialLikes = typeof likes === "number" ? likes : parseInt(likes as string, 10) || 0;

  const {
    isLiked,
    likesCount, 
    isShareModalOpen,
    setIsShareModalOpen,
    postUrl,
    handleCardClick,
    handleLike,
    handleCommentClick,
    handleShareClick
  } = usePostCard(id, initialLikes, onRequireAuth, onCommentClick);

  const displayAuthor = truncateAuthor(author);

  return (
    <>
      <article onClick={handleCardClick} className="block relative bg-[#A395DA]/[0.14] dark:bg-[#2A2438] rounded-3xl p-4 pt-9 mb-8 ml-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors duration-300 cursor-pointer hover:opacity-95">
        <Link 
          href={`/profile/${author}`}
          className="absolute -top-4 -left-4 flex items-center max-w-[50%] hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="z-10 relative shrink-0">
            <Avatar src={avatarUrl} alt={author} />
          </div>
          <div className="bg-[#A395DA] dark:bg-[#492775] pl-6 pr-3 py-1 rounded-r-full text-white -ml-4 shadow-sm min-w-0 transition-colors duration-300">
            <h3 className="font-bold text-[13px] leading-tight truncate">
              {displayAuthor}
            </h3>
            <span className="text-[10px] opacity-90 block truncate">{timeAgo}</span>
          </div>
        </Link>

        <div className="absolute top-3 right-4 flex items-center gap-3">
          <PostAction icon={Heart} count={likesCount} filled={isLiked} onClick={handleLike} />
          <PostAction icon={MessageCircle} count={comments} filled={false} onClick={handleCommentClick} />
          <PostAction icon={Upload} count={shares} filled={false} onClick={handleShareClick} />
        </div>

        <p className="text-[12px] text-[#492775] dark:text-[#D0C9E8] font-medium leading-relaxed mt-2 mb-3 transition-colors duration-300">
          {renderContentWithHashtags(content)}
        </p>

        {imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-3 bg-[#F5F0FF] dark:bg-[#1A1A2E] transition-colors duration-300">
            <img src={imageUrl} alt="post visual" className="w-full object-cover max-h-64" />
          </div>
        )}
      </article>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={postUrl} 
        title={`Breezy de ${author}`} 
      />
    </>
  );
}