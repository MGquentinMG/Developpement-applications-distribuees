import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SubmitButton } from "./SubmitButton";

describe("SubmitButton", () => {
  it("doit afficher le texte enfant (children) par défaut", () => {
    render(<SubmitButton>Valider</SubmitButton>);
    expect(screen.getByRole("button", { name: "Valider" })).toBeInTheDocument();
  });

  it("doit afficher 'Chargement...' et être désactivé quand isLoading est true", () => {
    render(<SubmitButton isLoading={true}>Se connecter</SubmitButton>);
    
    const button = screen.getByRole("button", { name: "Chargement..." });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    // Le texte original ne doit plus être affiché pendant le chargement
    expect(screen.queryByText("Se connecter")).not.toBeInTheDocument();
  });

  it("doit exécuter la fonction onClick quand on clique dessus", () => {
    const handleClick = vi.fn();
    render(<SubmitButton onClick={handleClick}>Cliquez-moi</SubmitButton>);
    
    const button = screen.getByRole("button", { name: "Cliquez-moi" });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("doit afficher une icône si la prop icon est fournie", () => {
    const MockIcon = <svg data-testid="test-icon" />;
    render(<SubmitButton icon={MockIcon}>Connexion Google</SubmitButton>);
    
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Connexion Google")).toBeInTheDocument();
  });

  it("doit rester désactivé si la prop disabled est passée manuellement", () => {
    render(<SubmitButton disabled={true}>Inactif</SubmitButton>);
    expect(screen.getByRole("button", { name: "Inactif" })).toBeDisabled();
  });
});