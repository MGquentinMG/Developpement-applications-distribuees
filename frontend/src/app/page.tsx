"use client";

import { useState } from "react";
import TopBanner from "../components/TopBanner/TopBanner";
import ThemeSuggestions from "../components/Suggestionsbar/Suggestionsbar";
import PostCard from "../components/PostCard/PostCard";

export default function Home() {
  const trendingThemes = [
    "BestPet", "CatTheBest", "Dogdumb", "FreeOrangeCat", "FunnyDogs", "CuteCats"
  ];
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const mockPosts = [
    {
      id: 1,
      author: "PandaRoux",
      timeAgo: "2h",
      content: "Ailurus fulgens, le panda fuligineux, également désigné sous les noms de panda roux, panda éclatant. #BestPet #CatTheBest Une espèce de mammifères originaire de l'Inde.",
      likes: "2K", comments: "2K", shares: "2K",
      avatarUrl: "https://images.unsplash.com/photo-1552554474-06c888d1d860?w=150&q=80" 
    },
    {
      id: 2,
      author: "PandaRoux",
      timeAgo: "2h",
      content: "Longtemps considérée comme un genre monotypique, elle est désormais reconnue comme une espèce distincte sur la base de données génétiques et morphologiques. #CuteCats",
      likes: "900", comments: "875", shares: "800",
    },
    {
      id: 3,
      author: "PandaRoux",
      timeAgo: "2h",
      content: "Ailurus fulgens, le panda fuligineux, également désigné sous les noms de panda roux, panda éclatant, ou encore Petit panda de l'Inde. #Nature",
      likes: "5K", comments: "1K", shares: "2K",
    }
  ];
  
  const filteredPosts = activeTheme 
    ? mockPosts.filter((post) => post.content.includes(`#${activeTheme}`))
    : mockPosts;

  return (
    <main className="min-h-screen bg-[#F9F9FB]">
      <TopBanner />
      
      <div className="mt-4 px-5">
        <h2 className="text-sm font-bold text-[#1E1E40] mb-4">Tendances</h2>
        <ThemeSuggestions 
          themes={trendingThemes} 
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme} 
        />
      </div>

      <section className="mt-6 px-4 pb-32">
        {filteredPosts.map((post) => (
          <PostCard 
            key={post.id}
            author={post.author}
            timeAgo={post.timeAgo}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
            avatarUrl={post.avatarUrl}
          />
        ))}
        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-400 mt-10 text-sm">Aucun post pour ce thème.</p>
        )}
      </section>
    </main>
  );
}