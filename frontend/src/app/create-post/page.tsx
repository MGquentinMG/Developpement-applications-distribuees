"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "../../i18n";
import Avatar from "../../components/Avatar/Avatar";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function CreatePostPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTags = (text: string): string[] => {
    const matches = text.match(/#(\w+)/g) || [];
    return matches.map((t) => t.slice(1));
  };

  const handlePublish = async () => {
    if (!content.trim() && !imageFile) return;
    setPublishing(true);
    setError("");
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await api.uploadImage(imageFile);
      }
      await api.post("/api/posts", {
        content,
        tags: extractTags(content),
        ...(imageUrl ? { image: imageUrl } : {}),
      });
      router.push("/feed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la publication");
    } finally {
      setPublishing(false);
    }
  };

  const handleAddHashtag = () => {
    const newContent = content.endsWith(" ") || content === "" ? content + "#" : content + " #";
    setContent(newContent);
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setContent((prev) => prev + emojiObject.emoji);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const avatarUrl =
    user?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username ?? "user"}`;

  return (
    <main className="w-full max-w-2xl mx-auto min-h-screen bg-white dark:bg-[#121212] md:border-x border-gray-200 dark:border-gray-800 flex flex-col relative transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#121212] z-10 shrink-0 transition-colors duration-300">
        <button
          onClick={() => router.back()}
          className="text-gray-500 dark:text-gray-400 hover:text-[#492775] dark:hover:text-[#A395DA] transition-colors p-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-[15px] transition-colors duration-300">{t("createPost.title")}</h1>

        <button
          onClick={handlePublish}
          disabled={(!content.trim() && !imageFile) || publishing}
          className={`px-5 py-1.5 rounded-full font-bold text-[13px] transition-all duration-200 ${
            (content.trim() || imageFile) && !publishing
              ? "bg-[#492775] text-white dark:bg-[#A395DA] dark:text-[#1E1E40] shadow-md hover:bg-[#3a1f5d] dark:hover:bg-[#8B7BB5] cursor-pointer"
              : "bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-400 dark:text-[#8B7BB5] cursor-not-allowed"
          }`}
        >
          {publishing ? t("createPost.publishing", "Publication...") : t("createPost.publish")}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center px-4 pt-2">{error}</p>
      )}

      <div className="px-4 py-5 flex gap-3 flex-1 overflow-y-auto pb-24" onClick={() => setShowEmojiPicker(false)}>
        <div className="shrink-0 mt-1">
          <Avatar src={avatarUrl} alt={user?.username ?? "Utilisateur"} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("createPost.placeholder")}
            className="w-full bg-transparent resize-none outline-none text-[#1E1E40] dark:text-[#F9F9FB] text-[15px] min-h-[120px] placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
            autoFocus
          />

          {imagePreview && (
            <div className="relative rounded-2xl overflow-hidden bg-[#F5F0FF] dark:bg-[#1A1A2E] border border-[#E0D8F0] dark:border-[#2A2438] transition-colors duration-300">
              <img src={imagePreview} alt="Aperçu" className="w-full max-h-72 object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                className="absolute top-2 right-2 bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

      {showEmojiPicker && (
        <div className="fixed bottom-[72px] left-0 right-0 max-w-2xl mx-auto z-30 shadow-2xl">
          <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height={300} theme={theme === "dark" ? Theme.DARK : Theme.LIGHT} />
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 p-4 flex gap-5 z-20 transition-colors duration-300">
        <button onClick={() => fileInputRef.current?.click()} className="text-[#A395DA] dark:text-[#8B7BB5] hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors cursor-pointer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`${showEmojiPicker ? "text-[#492775] dark:text-[#D0C9E8]" : "text-[#A395DA] dark:text-[#8B7BB5]"} hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors cursor-pointer`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>
        <button onClick={handleAddHashtag} className="text-[#A395DA] dark:text-[#8B7BB5] hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors cursor-pointer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="20" y2="15" />
            <line x1="10" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="14" y2="21" />
          </svg>
        </button>
      </div>
    </main>
  );
}