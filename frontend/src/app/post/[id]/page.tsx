"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../i18n";
import BackButton from "../../../components/BackButton/BackButton";
import PostCard from "../../../components/PostCard/PostCard";
import CommentCard from "../../../components/CommentCard/CommentCard";
import MessageInput from "../../../components/MessageInput/MessageInput";

export default function PostDetailsPage() {
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState("");

  const mainPost = {
    id: "1",
    author: "GarfieldReal",
    timeAgo: "8h",
    content: "Je veux juste des lasagnes. Laissez-moi tranquille. #FreeOrangeCat #CatTheBest",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80",
    likes: "25K",
    comments: "2",
    shares: "12K",
  };

  const mockComments = [
    { id: 1, author: "OdieDog", timeAgo: "7h", content: "Moi je veux bien jouer avec toi !", likes: "120" },
    { id: 2, author: "JonArbuckle", timeAgo: "6h", content: "Les lasagnes sont dans le four, patience...", likes: "8K" },
  ];

  const handleReply = (author: string) => {
    setCommentText(`@${author} `);
    const input = document.getElementById("message-input");
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const focusInput = () => {
    const input = document.getElementById("message-input");
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] pb-32 transition-colors duration-300 relative">
      <div className="flex items-center gap-4 px-4 py-4 sticky top-0 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md z-20 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <BackButton />
        <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-[17px] transition-colors duration-300">Breezy</h1>
      </div>

      <div className="pt-6">
        <PostCard {...mainPost} onCommentClick={focusInput} />
      </div>

      <div className="px-5 mt-2">
        <div className="h-[1px] w-full bg-gray-100 dark:bg-[#2A2438] mb-6 transition-colors duration-300"></div>
        
        {mockComments.map((comment) => (
          <CommentCard
            key={comment.id}
            id={comment.id}
            author={comment.author}
            timeAgo={comment.timeAgo}
            content={comment.content}
            likes={comment.likes}
            onReply={handleReply}
          />
        ))}
      </div>

      <MessageInput 
        value={commentText} 
        onChange={setCommentText} 
        onSend={() => setCommentText("")}
        placeholder="Ajouter un commentaire..." 
      />
    </main>
  );
}