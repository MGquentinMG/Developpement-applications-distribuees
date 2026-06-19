import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ThemeSuggestions from "./Suggestionsbar";

describe("Composant ThemeSuggestions", () => {
  const mockThemes = ["Cats", "Dogs"];

  it("doit afficher tous les thèmes passés en props", () => {
    render(
      <ThemeSuggestions 
        themes={mockThemes} 
        activeTheme={null} 
        onThemeChange={vi.fn()} 
      />
    );
    expect(screen.getByText("#Cats")).toBeInTheDocument();
    expect(screen.getByText("#Dogs")).toBeInTheDocument();
  });

  it("doit renvoyer le nom du thème quand on clique sur un thème inactif", () => {
    const handleChange = vi.fn();
    render(
      <ThemeSuggestions 
        themes={mockThemes} 
        activeTheme={null} 
        onThemeChange={handleChange} 
      />
    );

    fireEvent.click(screen.getByText("#Cats"));
    expect(handleChange).toHaveBeenCalledWith("Cats");
  });

  it("doit renvoyer null quand on clique sur le thème déjà actif (désélection)", () => {
    const handleChange = vi.fn();
    render(
      <ThemeSuggestions 
        themes={mockThemes} 
        activeTheme="Cats" 
        onThemeChange={handleChange} 
      />
    );

    fireEvent.click(screen.getByText("#Cats"));
    expect(handleChange).toHaveBeenCalledWith(null);
  });
});