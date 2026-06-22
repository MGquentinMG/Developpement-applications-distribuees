"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import TopBanner from "../components/TopBanner/TopBanner";
import ThemeSuggestions from "../components/Suggestionsbar/Suggestionsbar";
import PostCard from "../components/PostCard/PostCard";
import { AuthModal } from "../components/Auth/AuthModal";
import { useTheme } from "../contexts/ThemeContext";
import { api, timeAgo, formatCount } from "../services/api";

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

export default function Home() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [trendingThemes, setTrendingThemes] = useState<string[]>([]);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const VISIBLE_COUNT = 4;
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [cutoffY, setCutoffY] = useState(0);

  useEffect(() => {
    api
      .get<ApiPost[]>("/api/posts")
      .then((data) => {
        setPosts(data);
        const tagCounts: Record<string, number> = {};
        data.forEach((p) =>
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

  const filteredPosts = activeTheme
    ? posts.filter((p) => p.tags.includes(activeTheme))
    : posts;

  const postsToShow = filteredPosts.slice(0, 10);

  useEffect(() => {
    const compute = () => {
      let h = 0;
      for (let i = 0; i < VISIBLE_COUNT && i < postRefs.current.length; i++) {
        const el = postRefs.current[i];
        if (el) h += el.getBoundingClientRect().height;
      }
      const sectionTop = sectionRef.current?.getBoundingClientRect().top ?? 0;
      setCutoffY(sectionTop + window.scrollY + h);
    };
    const timer = setTimeout(compute, 100);
    window.addEventListener("resize", compute);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", compute);
    };
  }, [postsToShow.length]);

  return (
    <main className="min-h-screen bg-[#F9F9FB] dark:bg-[#121212] transition-colors duration-300">
      <TopBanner onLoginClick={() => openAuthModal("login")} />

      <div className="mt-4 px-5">
        <h2 className="text-sm font-bold text-[#1E1E40] dark:text-[#F9F9FB] mb-4 transition-colors duration-300">
          {t("home.trends")}
        </h2>
        <ThemeSuggestions
          themes={trendingThemes}
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
        />
      </div>

      <section ref={sectionRef} className="mt-6 px-4 pt-2 pb-80">
        {loading && (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm">
            Chargement...
          </p>
        )}

        {!loading &&
          postsToShow.map((post, index) => (
            <div
              key={post._id}
              ref={(el) => { postRefs.current[index] = el; }}
              style={
                index >= VISIBLE_COUNT
                  ? { filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }
                  : {}
              }
            >
              <PostCard
                id={post._id}
                author={post.author?.username ?? "Anonyme"}
                timeAgo={timeAgo(post.createdAt)}
                content={post.content}
                likes={formatCount(post.likes.length)}
                comments={formatCount(post.comments.length)}
                shares="0"
                avatarUrl={post.author?.avatar}
                imageUrl={post.image}
                onRequireAuth={() => openAuthModal("register")}
              />
            </div>
          ))}

        {!loading && filteredPosts.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm transition-colors duration-300">
            {t("home.noPosts")}
          </p>
        )}
      </section>

      {cutoffY > 0 && (
        <div
          className="fixed left-0 right-0 bottom-0 z-30 flex flex-col items-center justify-end pb-16 pointer-events-none transition-colors duration-300"
          style={{
            top: `${cutoffY - 100}px`,
            background:
              theme === "dark"
                ? "linear-gradient(to bottom, transparent 0%, rgba(18,18,18,0.7) 25%, rgba(18,18,18,0.95) 55%, #121212 75%)"
                : "linear-gradient(to bottom, transparent 0%, rgba(249,249,251,0.7) 25%, rgba(249,249,251,0.95) 55%, #F9F9FB 75%)",
          }}
        >
          <div className="pointer-events-auto">
            <button
              onClick={() => openAuthModal("register")}
              className="bg-[#492775] text-white dark:bg-[#A395DA] dark:text-[#1E1E40] px-8 py-3.5 rounded-full font-bold text-[14px] shadow-[0_4px_15px_rgba(73,39,117,0.3)] dark:shadow-[0_4px_15px_rgba(163,149,218,0.2)] hover:bg-[#3a1f5d] dark:hover:bg-[#8B7BB5] transition-all transform hover:scale-105 duration-300 cursor-pointer"
            >
              {t("home.signUpToSeeMore")}
            </button>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSwitchMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
      />
    </main>
  );
}
