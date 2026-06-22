"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import TopBanner from "../components/TopBanner/TopBanner";
import ThemeSuggestions from "../components/Suggestionsbar/Suggestionsbar";
import PostCard from "../components/PostCard/PostCard";
import { useTheme } from "../contexts/ThemeContext";
import { AuthModal } from "../components/Auth/AuthModal"; 

export default function Home() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };
  
  const [cutoffY, setCutoffY] = useState<number>(0);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const trendingThemes = [
    "BestPet", "CatTheBest", "Dogdumb", "FreeOrangeCat", "FunnyDogs", "CuteCats"
  ];
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const mockPosts = [
    { id: 1, author: "PandaRoux", timeAgo: "2h", content: "Ailurus fulgens, le panda fuligineux... #BestPet", likes: "2K", comments: "2K", shares: "2K", avatarUrl: "https://images.unsplash.com/photo-1552554474-06c888d1d860?w=150&q=80" },
    { id: 2, author: "PandaRoux", timeAgo: "2h", content: "Longtemps considérée comme un genre monotypique... #CuteCats", likes: "900", comments: "875", shares: "800" },
    { id: 3, author: "PandaRoux", timeAgo: "2h", content: "Ailurus fulgens, le panda fuligineux... #Nature", likes: "5K", comments: "1K", shares: "2K" },
    { id: 4, author: "DogLover99", timeAgo: "3h", content: "Les chiens sont vraiment les meilleurs amis de l'homme... #FunnyDogs", likes: "8.4K", comments: "1.2K", shares: "5K" },
    { id: 5, author: "OrangeCatFan", timeAgo: "4h", content: "Avez-vous déjà vu un chat orange qui ne fait pas de bêtises ? #FreeOrangeCat", likes: "12K", comments: "3K", shares: "8K" },
    { id: 6, author: "MiaouMaster", timeAgo: "5h", content: "Rien de mieux qu'un chat qui dort au soleil. #CuteCats", likes: "15K", comments: "4K", shares: "10K" },
    { id: 7, author: "PuppyTales", timeAgo: "6h", content: "Ce chiot essaie d'attraper sa propre queue... #FunnyDogs", likes: "6K", comments: "500", shares: "1K" },
    { id: 8, author: "WildLifeDaily", timeAgo: "7h", content: "Le panda roux passe une grande partie de la journée à dormir... #BestPet", likes: "4.2K", comments: "320", shares: "800" },
    { id: 9, author: "GarfieldReal", timeAgo: "8h", content: "Je veux juste des lasagnes. Laissez-moi tranquille. #FreeOrangeCat", likes: "25K", comments: "8K", shares: "12K" },
    { id: 10, author: "DerpDoggo", timeAgo: "9h", content: "Mon chien a encore oublié comment fonctionner... #Dogdumb", likes: "9.1K", comments: "1.1K", shares: "3K" }
  ];

  const VISIBLE_COUNT = 4;

  const filteredPosts = activeTheme
    ? mockPosts.filter((post) => post.content.includes(`#${activeTheme}`))
    : mockPosts;

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
        <h2 className="text-sm font-bold text-[#1E1E40] dark:text-[#F9F9FB] mb-4 transition-colors duration-300">{t("home.trends")}</h2>
        <ThemeSuggestions
          themes={trendingThemes}
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
        />
      </div>

      <section ref={sectionRef} className="mt-6 px-4 pt-2 pb-80">
        {postsToShow.map((post, index) => (
          <div
            key={post.id}
            ref={(el) => { postRefs.current[index] = el; }}
            style={
              index >= VISIBLE_COUNT
                ? { filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }
                : {}
            }
          >
            <PostCard
              id={post.id}
              author={post.author}
              timeAgo={post.timeAgo}
              content={post.content}
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
              avatarUrl={post.avatarUrl}
              onRequireAuth={() => openAuthModal("register")} 
            />
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm transition-colors duration-300">{t("home.noPosts")}</p>
        )}
      </section>

      {cutoffY > 0 && (
        <div
          className="fixed left-0 right-0 bottom-0 z-30 flex flex-col items-center justify-end pb-16 pointer-events-none transition-colors duration-300"
          style={{
            top: `${cutoffY - 100}px`,
            background: theme === "dark" 
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