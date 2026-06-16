import ThemeSuggestions from "../components/Suggestionsbar/Suggestionsbar";

export default function Home() {
  // SIMULATION BACKEND : IL FAUDRA SUPPRIMER PLUS TARD ET FAIRE L'APPEL DU BACKEND
  const trendingThemes = [
    "BestPet",
    "CatTheBest",
    "Dogdumb",
    "FreeOrangeCat",
    "FunnyDogs",
    "CuteCats"
  ];
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <ThemeSuggestions themes={trendingThemes} />

    
    </main>
  );
}