"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import "../../i18n";
import SearchBar from "../../components/Searchbar/Searchbar";
import ThemeSuggestions from "../../components/Suggestionsbar/Suggestionsbar";
import PostCard from "../../components/PostCard/PostCard";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
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
  const [activeTab, setActiveTab] = useState<"all" | "following">("all");

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

  const followingIds = useMemo(
    () => new Set((user?.following ?? []).map((f) => f._id)),
    [user]
  );

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeTab === "following") result = result.filter((p) => followingIds.has(p.author._id));
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
  }, [activeTab, activeTheme, searchQuery, posts, followingIds]);

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

  const handleEditPost = async (id: string, newContent: string) => {
    try {
      await api.patch(`/api/posts/${id}`, { content: newContent });
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, content: newContent } : p))
      );
    } catch {}
  };

  const handleDeletePost = async (id: string) => {
    try {
      await api.delete(`/api/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {}
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">

      <aside className="hidden lg:flex lg:flex-col w-[350px] sticky top-0 h-screen overflow-y-auto scrollbar-none pt-4 pl-4 xl:pl-0 pr-8">
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="bg-[#F3F4F6] dark:bg-[#1A1A2E] rounded-2xl py-6 px-5 shadow-sm border border-transparent dark:border-gray-800">
          <h2 className="text-lg font-black text-[#1E1E40] dark:text-[#F9F9FB] mb-5">Tendances pour vous</h2>
          <div className="flex flex-col gap-4">
            {trendingThemes.map((theme) => (
              <div key={theme} className="flex items-center">
                <Button
                  label={theme}
                  defaultActive={activeTheme === theme}
                  onClick={() => setActiveTheme(activeTheme === theme ? null : theme)}
                />
              </div>
            ))}
            {trendingThemes.length === 0 && !loading && (
              <p className="text-sm text-gray-500">Aucune tendance pour le moment.</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-6 px-4 text-[12px] text-gray-500">
          <a href="/legal" className="hover:underline">Conditions utilisation</a>
          <a href="/legal" className="hover:underline">Politique de confidentialité</a>
          <a href="/legal" className="hover:underline">Accessibilité</a>
          <span>© 2026 Breezy</span>
        </div>
      </aside>

      <main className="w-full max-w-2xl min-h-screen bg-[#F9F9FB] dark:bg-[#121212] border-x border-gray-200 dark:border-gray-800 pb-32 md:pb-0 transition-colors duration-300">
        <div className="sticky top-0 z-40 bg-[#F9F9FB]/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">

          <div className="flex items-center justify-between lg:hidden px-4 pt-4 pb-2">
            <div className="w-9 h-9 rounded-full bg-[#1E1E40] dark:bg-[#2A2438] flex items-center justify-center cursor-pointer overflow-hidden" onClick={() => router.push("/profile")}>
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <div className="w-4 h-4 bg-white rounded-full" />}
            </div>
            <div className="flex-1 mx-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <button onClick={() => router.push("/notifications")} className="w-9 h-9 rounded-full bg-[#EDE9F7] dark:bg-[#2A2438] flex items-center justify-center text-[#492775] dark:text-[#A395DA]">
              <Bell size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="hidden lg:flex items-center px-6 pt-6 pb-2">
            <h1 className="text-xl font-bold text-[#1E1E40] dark:text-[#F9F9FB]">Accueil</h1>
          </div>

          <div className="flex px-5 mt-1 lg:gap-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-3 text-[15px] font-bold transition-all border-b-[3px] -mb-[1px] ${
                activeTab === "all" ? "border-[#492775] text-[#1E1E40] dark:text-[#F9F9FB] dark:border-[#A395DA]" : "border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2A2438]/50"
              }`}
            >
              Pour vous
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-3 text-[15px] font-bold transition-all border-b-[3px] -mb-[1px] ${
                activeTab === "following" ? "border-[#492775] text-[#1E1E40] dark:text-[#F9F9FB] dark:border-[#A395DA]" : "border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2A2438]/50"
              }`}
            >
              Abonnements
            </button>
          </div>
        </div>

        <div className="lg:hidden px-5 pt-4 pb-2">
          <h2 className="text-xs font-bold text-[#1E1E40] dark:text-[#F9F9FB] mb-3">Tendances</h2>
          <ThemeSuggestions themes={trendingThemes} activeTheme={activeTheme} onThemeChange={setActiveTheme} />
        </div>

        <section className="pt-2 px-4">
          {loading && (
            <div className="flex justify-center mt-10">
              <p className="text-center text-[#492775] dark:text-[#A395DA] font-bold text-sm animate-pulse">Chargement...</p>
            </div>
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
                onEdit={user && user._id === post.author._id ? (newContent) => handleEditPost(post._id, newContent) : undefined}
                onDelete={user && user._id === post.author._id ? () => handleDeletePost(post._id) : undefined}
              />
            ))}

          {!loading && filteredPosts.length === 0 && (
            <p className="text-center text-gray-400 mt-10 text-sm">
              {activeTab === "following" ? "Abonne-toi pour voir des posts ici." : t("feed.noPosts")}
            </p>
          )}
        </section>
      </main>

      <Navbar />

    </div>
  );
}