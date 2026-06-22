import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("ne doit rien afficher dans le DOM si aucun message n'est fourni", () => {
    const { container } = render(<ErrorMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it("doit afficher le message d'erreur quand la prop message est remplie", () => {
    render(<ErrorMessage message="Identifiants incorrects" />);
    
    const errorMessage = screen.getByText("Identifiants incorrects");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.className).toContain("text-red-500");
  });
});