"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Avatar from "../Avatar/Avatar";
import PostAction from "../PostAction/PostAction";
import EditModal from "../EditModal/EditModal";
import { Heart, MessageCircle, MoreHorizontal, Flag, Pencil, Trash2 } from "lucide-react";
import { CommentProps } from "../../types/CommentType";
import "../../i18n";

export default function CommentCard({
  id,
  author,
  timeAgo,
  content,
  likes,
  avatarUrl,
  imageUrl,
  isLiked: isLikedProp,
  onLike,
  onReply,
  onReport,
  onEdit,
  onDelete,
}: CommentProps) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(isLikedProp ?? false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hasMenu = !!(onReport || onEdit || onDelete);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (!confirm("Supprimer ce commentaire ?")) return;
    setDeleting(true);
    try {
      await onDelete?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`flex gap-3 mb-5 ${deleting ? "opacity-40 pointer-events-none" : ""}`}>
      <Link href={`/profile/${author}`} className="shrink-0 w-10 h-10 hover:opacity-80 transition-opacity">
        <Avatar src={avatarUrl} alt={author} />
      </Link>
      <div className="flex-1 bg-[#F3F0FF] dark:bg-[#2A2438] rounded-2xl rounded-tl-none p-3.5 transition-colors duration-300">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/profile/${author}`} className="font-bold text-[13px] text-[#1E1E40] dark:text-[#F9F9FB] hover:underline">
            {author}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 dark:text-[#A395DA]">{timeAgo}</span>
            {hasMenu && (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                  className="text-gray-400 dark:text-gray-600 hover:text-[#492775] dark:hover:text-[#A395DA] transition-colors cursor-pointer"
                >
                  <MoreHorizontal size={15} strokeWidth={2} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 top-5 bg-white dark:bg-[#1A1A2E] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-20 overflow-hidden min-w-[150px]">
                    {onReport && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onReport(); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Flag size={13} strokeWidth={2} />
                        Signaler
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsEditModalOpen(true); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-[#492775] dark:text-[#A395DA] hover:bg-[#F5F0FF] dark:hover:bg-[#492775]/20 transition-colors"
                      >
                        <Pencil size={13} strokeWidth={2} />
                        Modifier
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={13} strokeWidth={2} />
                        Supprimer
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {content && (
          <p className="text-[#492775] dark:text-[#D0C9E8] text-[13px] leading-snug mb-3">
            {content}
          </p>
        )}
        {imageUrl && (
          <div className="rounded-xl overflow-hidden mb-3">
            <img src={imageUrl} alt="image du commentaire" className="w-full max-h-48 object-cover" />
          </div>
        )}
        <div className="flex items-center gap-4">
          <PostAction
            icon={Heart}
            count={likes}
            filled={isLiked}
            onClick={() => { setIsLiked(!isLiked); onLike?.(); }}
          />
          <button
            onClick={() => onReply && onReply(author)}
            className="flex items-center gap-1 group cursor-pointer text-[#A395DA] dark:text-[#8B7BB5] hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors duration-300"
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            <span className="font-bold text-[12px]">{t("post.reply")}</span>
          </button>
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={async (c) => { await onEdit?.(c); }}
        initialContent={content}
        title="Modifier le commentaire"
      />
    </div>
  );
}
