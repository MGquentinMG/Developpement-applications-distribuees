"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import SearchBar from "../../components/Searchbar/Searchbar";
import ThemeSuggestions from "../../components/Suggestionsbar/Suggestionsbar";
import PostCard from "../../components/PostCard/PostCard";
import { PostCardProps } from "../../types/PostCardType";

export default function FeedPage() {
  const { t } = useTranslation();
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const trendingThemes = [
    "BestPet", "CatTheBest", "Dogdumb", "FreeOrangeCat", "FunnyDogs", "CuteCats"
  ];

  const mockPosts: PostCardProps[] = [
    {
      id: 1,
      author: "4theC@",
      timeAgo: "2h",
      content: "Le Chat domestique (Felis catus) est une espèce de mammifères de l'Ordre des Carnivores, de la famille des félins (Félidés). #CuteCats #BestPet",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80",
      likes: "2K", comments: "2K", shares: "2K",
    },
    {
      id: 2,
      author: "PandaRoux",
      timeAgo: "2h",
      content: "Ailurus fulgens, le panda fuligineux, également désigné sous les noms de panda roux, panda éclatant, ou encore Petit panda de l'Inde. Longtemps considérée comme un genre monotypique. #BestPet",
      likes: "2K", comments: "2K", shares: "2K",
    },
    {
      id: 3,
      author: "DogLover99",
      timeAgo: "3h",
      content: "Les chiens sont vraiment les meilleurs amis de l'homme ! #FunnyDogs #Dogdumb",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80",
      likes: "8.4K", comments: "1.2K", shares: "5K",
    },
    {
      id: 4,
      author: "GarfieldReal",
      timeAgo: "8h",
      content: "Je veux juste des lasagnes. Laissez-moi tranquille. #FreeOrangeCat #CatTheBest",
      imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80",
      likes: "25K", comments: "8K", shares: "12K",
    },
    {
      id: 5,
      author: "MiaouMaster",
      timeAgo: "5h",
      content: "Rien de mieux qu'un chat qui dort au soleil. La vie est belle. #CuteCats #CatTheBest",
      imageUrl: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&q=80",
      likes: "15K", comments: "4K", shares: "10K",
    },
    {
      id: 6,
      author: "PuppyTales",
      timeAgo: "6h",
      content: "Ce chiot essaie d'attraper sa propre queue depuis 10 minutes. On l'encourage. #FunnyDogs",
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
      likes: "6K", comments: "500", shares: "1K",
    },
  ];

  const filteredPosts = useMemo(() => {
    let result = mockPosts;

    if (activeTheme) {
      result = result.filter(post => post.content.includes(`#${activeTheme}`));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().replace(/^#/, "");
      result = result.filter(post => 
        post.content.toLowerCase().includes(q) || 
        post.author.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeTheme, searchQuery]);

  return (
    <main className="min-h-screen bg-[#F9F9FB] pb-32">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 sticky top-0 bg-[#F9F9FB] z-40">
        <div className="w-9 h-9 rounded-full bg-[#1E1E40] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="px-5 pb-2 mt-2">
        <h2 className="text-xs font-bold text-[#1E1E40] mb-3">{t("feed.topHtag")}</h2>
        <ThemeSuggestions
          themes={trendingThemes}
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
        />
      </div>

      <section className="px-4 pt-4">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            author={post.author}
            timeAgo={post.timeAgo}
            content={post.content}
            imageUrl={post.imageUrl}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
            avatarUrl={post.avatarUrl}
          />
        ))}

        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-400 mt-10 text-sm">
            {t("feed.noPosts")}
          </p>
        )}
      </section>
    </main>
  );
}