import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "./Button";

describe("Composant Button (Tag)", () => {
  it("doit afficher les bonnes couleurs par défaut (Inactif)", () => {
    const { getByRole } = render(<Button label="Test" />);
    const button = getByRole("button");

    expect(button.className).toContain("text-[#492775]");
    expect(button.className).toContain("bg-[#A395DA]/[0.14]");
  });

  it("doit changer de couleur après un clic (Actif)", () => {
    const { getByRole } = render(<Button label="Test" />);
    const button = getByRole("button");

    fireEvent.click(button);

    expect(button.className).toContain("text-[#FFFFFF]");
    expect(button.className).toContain("bg-[#A395DA]");
  });

  it("doit revenir aux couleurs de base après un deuxième clic", () => {
    const { getByRole } = render(<Button label="Test" />);
    const button = getByRole("button");

    fireEvent.click(button); 
    fireEvent.click(button); 

    expect(button.className).toContain("text-[#492775]");
  });
});