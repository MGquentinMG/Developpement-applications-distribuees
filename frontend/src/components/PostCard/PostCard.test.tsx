import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PostCard from "./PostCard";

describe("Composant PostCard", () => {
  const mockPostData = {
    author: "PandaRouxTest",
    timeAgo: "1h",
    content: "Ceci est un test avec un #SuperTag pour vérifier.",
    likes: "150",
    comments: "25",
    shares: "5",
  };

  it("doit afficher toutes les données textuelles du post", () => {
    render(<PostCard {...mockPostData} />);

    // Vérification de l'en-tête
    expect(screen.getByText("PandaRouxTest")).toBeInTheDocument();
    expect(screen.getByText("1h")).toBeInTheDocument();

    // Vérification des actions (Likes, Commentaires, Partages)
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("doit formater correctement les hashtags dans le contenu", () => {
    render(<PostCard {...mockPostData} />);

    // Le composant TextUtil devrait avoir isolé le mot-clé
    const hashtagElement = screen.getByText("#SuperTag");
    
    expect(hashtagElement).toBeInTheDocument();
    // On vérifie qu'il a bien reçu les classes Tailwind prévues pour les hashtags
    expect(hashtagElement.className).toContain("text-[#A395DA]");
    expect(hashtagElement.className).toContain("hover:underline");
  });

  it("doit tronquer un nom d'auteur trop long", () => {
    const longAuthorData = {
      ...mockPostData,
      author: "UnPseudoVraimentBeaucoupTropLong",
    };

    render(<PostCard {...longAuthorData} />);
    
    expect(screen.getByText("UnPseudoVraiment...")).toBeInTheDocument();
    
    expect(screen.queryByText("UnPseudoVraimentBeaucoupTropLong")).not.toBeInTheDocument();
  });
});