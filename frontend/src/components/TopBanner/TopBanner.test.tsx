import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TopBanner from "./TopBanner";

describe("TopBanner", () => {
  it("affiche les titres principaux", () => {
    render(<TopBanner />);
    expect(screen.getByText(/Partagez/i)).toBeInTheDocument();
    expect(screen.getByText(/Réagissez/i)).toBeInTheDocument();
    expect(screen.getByText(/Découvrez/i)).toBeInTheDocument();
  });

  it("affiche le bouton de connexion", () => {
    render(<TopBanner />);
    expect(screen.getByText("Connexion")).toBeInTheDocument();
  });
});