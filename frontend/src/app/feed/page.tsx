"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import "../../i18n";
import SearchBar from "../../components/Searchbar/Searchbar";
import ThemeSuggestions from "../../components/Suggestionsbar/Suggestionsbar";
import PostCard from "../../components/PostCard/PostCard";
import { api, timeAgo, formatCount } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface ApiPost {
  _id: string;
  content: string;
  author: { _id: string; username: string; avatar?: string };
  likes: string[];
  comments: string[];
  tags: string[];
  image?: string;
  createdAt: string;
}

export default function FeedPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [trendingThemes, setTrendingThemes] = useState<string[]>([]);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiPost[]>("/api/posts")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setPosts(list);
        const tagCounts: Record<string, number> = {};
        list.forEach((p) =>
          p.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          })
        );
        const sorted = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([tag]) => tag);
        setTrendingThemes(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeTheme) result = result.filter((p) => p.tags.includes(activeTheme));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().replace(/^#/, "");
      result = result.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.author?.username?.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeTheme, searchQuery, posts]);

  const handleLike = async (id: string) => {
    try {
      await api.post(`/api/posts/${id}/like`, {});
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== id) return p;
          const alreadyLiked = user ? p.likes.includes(user._id) : false;
          return {
            ...p,
            likes: alreadyLiked
              ? p.likes.filter((uid) => uid !== user?._id)
              : [...p.likes, user?._id ?? ""],
          };
        })
      );
    } catch {}
  };

  return (
    <main className="min-h-screen bg-[#F9F9FB] dark:bg-[#121212] pb-32 transition-colors duration-300">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 sticky top-0 bg-[#F9F9FB] dark:bg-[#121212] z-40 transition-colors duration-300">
        <div
          className="w-9 h-9 rounded-full bg-[#1E1E40] dark:bg-[#2A2438] flex items-center justify-center flex-shrink-0 transition-colors duration-300 cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          )}
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <button
          onClick={() => router.push("/notifications")}
          className="w-9 h-9 rounded-full bg-[#EDE9F7] dark:bg-[#2A2438] flex items-center justify-center text-[#492775] dark:text-[#A395DA] hover:bg-[#E0D8F0] dark:hover:bg-[#3A304D] transition-colors flex-shrink-0 cursor-pointer duration-300"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-5 pb-2 mt-2">
        <h2 className="text-xs font-bold text-[#1E1E40] dark:text-[#F9F9FB] mb-3 transition-colors duration-300">
          {t("feed.topHtag")}
        </h2>
        <ThemeSuggestions
          themes={trendingThemes}
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
        />
      </div>

      <section className="px-4 pt-4">
        {loading && (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm">
            Chargement...
          </p>
        )}

        {!loading &&
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              author={post.author?.username ?? "Anonyme"}
              timeAgo={timeAgo(post.createdAt)}
              content={post.content}
              likes={formatCount(post.likes.length)}
              comments={formatCount(post.comments.length)}
              shares="0"
              avatarUrl={post.author?.avatar}
              imageUrl={post.image}
              isLiked={user ? post.likes.includes(user._id) : false}
              onLike={user ? () => handleLike(post._id) : undefined}
              onRequireAuth={!user ? () => router.push("/login") : undefined}
            />
          ))}

        {!loading && filteredPosts.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm transition-colors duration-300">
            {t("feed.noPosts")}
          </p>
        )}
      </section>
    </main>
  );
}
