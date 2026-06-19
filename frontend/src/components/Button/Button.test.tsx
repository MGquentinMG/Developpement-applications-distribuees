import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Composant Button", () => {
  it("doit afficher le label avec le hashtag par défaut", () => {
    render(<Button label="TestTheme" />);
    expect(screen.getByText("#TestTheme")).toBeInTheDocument();
  });

  it("ne doit pas afficher de hashtag si isHashtag est false", () => {
    render(<Button label="Connexion" isHashtag={false} variant="action" />);
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.queryByText("#Connexion")).not.toBeInTheDocument();
  });

  it("doit appeler la fonction onClick lors d'un clic", () => {
    const handleClick = vi.fn();
    render(<Button label="ClicMe" onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});