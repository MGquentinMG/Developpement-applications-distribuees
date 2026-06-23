"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../services/api";

export function usePostCard(
  id: string | number, 
  initialLikesCount: number, 
  onRequireAuth?: () => void, 
  onCommentClick?: () => void
) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const postUrl = typeof window !== "undefined" ? `${window.location.origin}/post/${id}` : "";

  const isAuthenticated = () => {
    return typeof window !== "undefined" && localStorage.getItem("token") !== null;
  };

  const handleCardClick = () => {
    if (!isAuthenticated()) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (id && pathname !== `/post/${id}`) {
      router.push(`/post/${id}`);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();    
    
    if (!isAuthenticated()) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    
    const previousLiked = isLiked;
    
    setIsLiked(!isLiked);
    setLikesCount((prev) => (previousLiked ? prev - 1 : prev + 1));

    try {
      await api.post(`/api/posts/${id}/like`, {});
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount((prev) => (previousLiked ? prev + 1 : prev - 1));
      console.error("Erreur lors de l'envoi du like au backend :", error);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    
    if (onCommentClick) {
      onCommentClick();
    } else if (id && pathname !== `/post/${id}`) {
      router.push(`/post/${id}`);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    setIsShareModalOpen(true);
  };

  return {
    isLiked,
    likesCount,
    isShareModalOpen,
    setIsShareModalOpen,
    postUrl,
    handleCardClick,
    handleLike,
    handleCommentClick,
    handleShareClick
  };
}