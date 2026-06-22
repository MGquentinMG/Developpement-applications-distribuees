"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import BackButton from "../../../components/BackButton/BackButton";
import PostCard from "../../../components/PostCard/PostCard";
import CommentCard from "../../../components/CommentCard/CommentCard";
import MessageInput from "../../../components/MessageInput/MessageInput";
import { api, timeAgo, formatCount } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

interface ApiComment {
  _id: string;
  content: string;
  author: { _id: string; username: string; avatar?: string } | string;
  createdAt: string;
  likes?: string[];
}

interface ApiPost {
  _id: string;
  content: string;
  author: { _id: string; username: string; avatar?: string };
  likes: string[];
  comments: ApiComment[];
  tags: string[];
  image?: string;
  createdAt: string;
}

export default function PostDetailsPage() {
  const params = useParams();
  const postId = params?.id as string;
  const { user } = useAuth();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [post, setPost] = useState<ApiPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!postId) return;
    api
      .get<ApiPost>(`/api/posts/${postId}`)
      .then((data) => setPost(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSendComment = async () => {
    if (!commentText.trim() || !user || sending) return;
    setSending(true);
    try {
      const newComment = await api.post<ApiComment>(`/api/comments/${postId}`, {
        content: commentText.trim(),
      });
      setPost((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
      );
      setCommentText("");
    } catch {
    } finally {
      setSending(false);
    }
  };

  const handleReply = (author: string) => {
    setCommentText(`@${author} `);
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const focusInput = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const getAuthorName = (author: ApiComment["author"]): string => {
    if (typeof author === "object" && author !== null) return author.username;
    return "Utilisateur";
  };

  const getAuthorAvatar = (author: ApiComment["author"]): string | undefined => {
    if (typeof author === "object" && author !== null) return author.avatar;
    return undefined;
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] pb-32 transition-colors duration-300 relative">
      <div className="flex items-center gap-4 px-4 py-4 sticky top-0 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md z-20 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <BackButton />
        <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-[17px] transition-colors duration-300">
          Breezy
        </h1>
      </div>

      {loading && (
        <p className="text-center text-gray-400 dark:text-gray-500 mt-16 text-sm">
          Chargement...
        </p>
      )}

      {!loading && !post && (
        <p className="text-center text-gray-400 dark:text-gray-500 mt-16 text-sm">
          Post introuvable.
        </p>
      )}

      {!loading && post && (
        <>
          <div className="pt-6">
            <PostCard
              id={post._id}
              author={post.author?.username ?? "Anonyme"}
              timeAgo={timeAgo(post.createdAt)}
              content={post.content}
              imageUrl={post.image}
              likes={formatCount(post.likes.length)}
              comments={formatCount(post.comments.length)}
              shares="0"
              avatarUrl={post.author?.avatar}
              onCommentClick={focusInput}
            />
          </div>

          <div className="px-5 mt-2">
            <div className="h-[1px] w-full bg-gray-100 dark:bg-[#2A2438] mb-6 transition-colors duration-300" />

            {post.comments.length === 0 && (
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm italic mb-6">
                Aucun commentaire pour le moment.
              </p>
            )}

            {post.comments.map((comment) => (
              <CommentCard
                key={comment._id}
                id={comment._id}
                author={getAuthorName(comment.author)}
                avatarUrl={getAuthorAvatar(comment.author)}
                timeAgo={timeAgo(comment.createdAt)}
                content={comment.content}
                likes={formatCount(comment.likes?.length ?? 0)}
                onReply={handleReply}
              />
            ))}
          </div>
        </>
      )}

      <MessageInput
        inputRef={inputRef}
        value={commentText}
        onChange={setCommentText}
        onSend={handleSendComment}
        placeholder={user ? "Ajouter un commentaire..." : "Connecte-toi pour commenter"}
        disabled={!user || sending}
      />
    </main>
  );
}
