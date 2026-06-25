import { useState } from "react";

export const usePostActions = (author: string) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleComment = () => console.log("Ouvrir overlay Commentaire pour", author);
  const handleShare = () => console.log("Ouvrir overlay Partage pour", author);

  return {
    isLiked,
    handleLike,
    handleComment,
    handleShare
  };
};