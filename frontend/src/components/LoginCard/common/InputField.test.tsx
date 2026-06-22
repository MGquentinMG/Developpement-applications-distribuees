import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InputField } from "./InputField";

describe("InputField", () => {
  it("doit s'afficher correctement avec un placeholder", () => {
    render(<InputField placeholder="Mon super champ" />);
    expect(screen.getByPlaceholderText("Mon super champ")).toBeInTheDocument();
  });

  it("doit s'afficher sans bordure rouge par défaut", () => {
    render(<InputField placeholder="Email par défaut" />);
    const input = screen.getByPlaceholderText("Email par défaut");
    expect(input.className).toContain("border-transparent");
  });

  it("doit appliquer la bordure rouge en cas d'erreur", () => {
    render(<InputField placeholder="Email avec erreur" error="Email invalide" />);
    const input = screen.getByPlaceholderText("Email avec erreur");
    expect(input.className).toContain("border-red-500");
  });
});