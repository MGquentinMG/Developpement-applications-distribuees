import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MessageBubble from "./MessageBubble";

// Mock de la fonction utilitaire pour éviter des erreurs liées au formatage du texte
vi.mock("../../utils/TextUtil", () => ({
  renderContentWithHashtags: (text: string) => text,
}));

describe("MessageBubble", () => {
  it("doit afficher un message texte correctement", () => {
    render(<MessageBubble content="Coucou, tu vas bien ?" isSelf={true} />);
    expect(screen.getByText("Coucou, tu vas bien ?")).toBeInTheDocument();
  });

  it("doit créer un lien vers le profil de l'auteur si le message n'est pas le nôtre", () => {
    render(<MessageBubble content="Salut" isSelf={false} author="Marc" />);
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/Marc");
  });

  it("doit afficher une image fermée par défaut, l'ouvrir au clic, puis la fermer", () => {
    render(
      <MessageBubble 
        content="" 
        isSelf={true} 
        isImage={true} 
        imageUrl="/test-image.jpg" 
      />
    );
    
    const img = screen.getByAltText("Shared visual");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-image.jpg");

    expect(screen.queryByAltText("Full screen visual")).not.toBeInTheDocument();

    fireEvent.click(img);
    const fullScreenImg = screen.getByAltText("Full screen visual");
    expect(fullScreenImg).toBeInTheDocument();

    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);
    
    expect(screen.queryByAltText("Full screen visual")).not.toBeInTheDocument();
  });
});