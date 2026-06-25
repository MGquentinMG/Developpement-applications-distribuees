"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "../Avatar/Avatar";
import PostAction from "../PostAction/PostAction";
import ShareModal from "../ShareModal/ShareModal";
import ReportModal from "../ReportModal/ReportModal";
import EditModal from "../EditModal/EditModal";
import { Heart, MessageCircle, Upload, MoreHorizontal, Flag, Pencil, Trash2 } from "lucide-react";
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
  onEdit,
  onDelete,
}: PostCardProps) {
  const {
    isLiked,
    isShareModalOpen,
    setIsShareModalOpen,
    postUrl,
    handleCardClick,
    handleLike,
    handleCommentClick,
    handleShareClick,
  } = usePostCard(id, onRequireAuth, onCommentClick, onLike, isLikedProp);

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const displayAuthor = truncateAuthor(author);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRequireAuth) { onRequireAuth(); return; }
    router.push(`/profile/${author}`);
  };

  const handleMenuOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRequireAuth) { onRequireAuth(); return; }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    if (!confirm("Supprimer ce post ?")) return;
    setDeleting(true);
    try {
      await onDelete?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <article
        onClick={handleCardClick}
        className={`block relative bg-[#A395DA]/[0.14] dark:bg-[#2A2438] rounded-3xl p-4 pt-9 mb-8 mx-4 md:mx-0 shadow-[0_2px_15px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors duration-300 cursor-pointer hover:opacity-95 ${isMenuOpen ? "z-50" : ""} ${deleting ? "opacity-40 pointer-events-none" : ""}`}
      >
        <button
          onClick={handleProfileClick}
          className="absolute -top-4 -left-4 flex items-center max-w-[50%] hover:opacity-80 transition-opacity"
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
        </button>

        <div className="absolute top-3 right-4 flex items-center gap-3">
          <PostAction icon={Heart} count={likes} filled={isLiked} onClick={handleLike} />
          <PostAction icon={MessageCircle} count={comments} filled={false} onClick={handleCommentClick} />
          <PostAction icon={Upload} count={shares} filled={false} onClick={handleShareClick} />
          <div className="relative">
            <button
              onClick={handleMenuOpen}
              className="text-[#A395DA] dark:text-[#8B7BB5] hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors duration-300 cursor-pointer"
            >
              <MoreHorizontal size={18} strokeWidth={2} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-7 bg-white dark:bg-[#1A1A2E] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-[100] overflow-hidden min-w-[150px]">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setIsReportModalOpen(true); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Flag size={14} strokeWidth={2} />
                  Signaler
                </button>
                {onEdit && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(false); setIsEditModalOpen(true); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-[#492775] dark:text-[#A395DA] hover:bg-[#F5F0FF] dark:hover:bg-[#492775]/20 transition-colors"
                  >
                    <Pencil size={14} strokeWidth={2} />
                    Modifier
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                    Supprimer
                  </button>
                )}
              </div>
            )}
          </div>
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
      <ReportModal
        isOpen={isReportModalOpen}
        postId={id}
        onClose={() => setIsReportModalOpen(false)}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={async (c) => { await onEdit?.(c); }}
        initialContent={content}
        title="Modifier le post"
      />
    </>
  );
}
