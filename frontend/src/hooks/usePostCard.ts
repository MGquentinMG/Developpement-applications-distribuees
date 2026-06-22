import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function usePostCard(id: string | number, onRequireAuth?: () => void, onCommentClick?: () => void, onLike?: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLiked, setIsLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const postUrl = typeof window !== "undefined" ? `${window.location.origin}/post/${id}` : "";

  const handleCardClick = () => {
    if (id && pathname !== `/post/${id}`) {
      router.push(`/post/${id}`);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRequireAuth) {
      onRequireAuth();
    } else {
      setIsLiked(!isLiked);
      onLike?.();
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onCommentClick) {
      onCommentClick();
    } else if (id && pathname !== `/post/${id}`) {
      router.push(`/post/${id}`);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  return {
    isLiked,
    isShareModalOpen,
    setIsShareModalOpen,
    postUrl,
    handleCardClick,
    handleLike,
    handleCommentClick,
    handleShareClick
  };
}