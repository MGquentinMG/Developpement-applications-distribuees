import ThemeSuggestions from "../components/Suggestionsbar/Suggestionsbar";
import PostCard from "../components/PostCard/PostCard";

export default function Home() {
   // LE FAUX BACKEND : Juste des données pures
  const trendingThemes = [
    "BestPet",
    "CatTheBest",
    "Dogdumb",
    "FreeOrangeCat",
    "FunnyDogs",
    "CuteCats"
  ];
  // LE FAUX BACKEND : Juste des données pures
  const mockPosts = [
    {
      id: 1,
      author: "PandaRouxdfdfdfdf",
      timeAgo: "2h",
      content: "Ailurus fulgens, le panda fuligineux, également désigné sous les noms de panda roux, panda éclatant. #BestPet #CatTheBest Une espèce de mammifères originaire de l'Inde.",
      likes: "2K",
      comments: "2K",
      shares: "2K",
      avatarUrl: "https://images.unsplash.com/photo-1552554474-06c888d1d860?w=150&q=80" 
    },
    {
      id: 2,
      author: "PandaRouxdsdsdsds",
      timeAgo: "2h",
      content: "Longtemps considérée comme un genre monotypique, elle est désormais reconnue comme une espèce distincte sur la base de données. #CuteCats",
      likes: "900",
      comments: "875",
      shares: "800",
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <ThemeSuggestions themes={trendingThemes} />
      <section className="mt-6 px-4">
        {mockPosts.map((post) => (
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
      </section>
    </main>
  );
}