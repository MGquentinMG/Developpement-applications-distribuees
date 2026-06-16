import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ThemeSuggestions from "./Suggestionsbar";

describe("Composant Suggestionbar", () => {
  // On crée un petit jeu de données de test
  const mockThemes = ["BestPet", "CatTheBest", "CuteCats"];

  it("doit afficher les boutons avec les bons labels", () => {
    render(<ThemeSuggestions themes={mockThemes} />);

    expect(screen.getByText("#BestPet")).toBeInTheDocument();
    expect(screen.getByText("#CatTheBest")).toBeInTheDocument();
    expect(screen.getByText("#CuteCats")).toBeInTheDocument();
  });

  it("doit avoir le thème 'CatTheBest' actif par défaut (index 1)", () => {
    render(<ThemeSuggestions themes={mockThemes} />);

    const activeBtn = screen.getByText("#CatTheBest");

    expect(activeBtn.className).toContain("FFFFFF");
    expect(activeBtn.className).toContain("bg-[#A395DA]");
  });

  it("doit avoir le thème 'BestPet' inactif par défaut (index 0)", () => {
    render(<ThemeSuggestions themes={mockThemes} />);

    const inactiveBtn = screen.getByText("#BestPet");

    expect(inactiveBtn.className).toContain("text-[#492775]");
    expect(inactiveBtn.className).toContain("bg-[#A395DA]/[0.14]");
  });
});