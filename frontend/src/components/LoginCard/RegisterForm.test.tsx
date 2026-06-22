import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterForm } from "./RegisterForm";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultText: string) => defaultText || key,
  }),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doit afficher l'étape 1 par défaut", () => {
    render(<RegisterForm />);
    expect(screen.getByText("Inscription avec google")).toBeInTheDocument();
    expect(screen.getByText("Inscription avec e-mail")).toBeInTheDocument();
  });

  it("doit afficher tous les champs requis à l'étape 2", () => {
    render(<RegisterForm />);
    
    fireEvent.click(screen.getByText("Inscription avec e-mail"));

    expect(screen.getByPlaceholderText("Ton pseudo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Adresse e-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("doit permettre de cocher les conditions d'utilisation", () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByText("Inscription avec e-mail"));

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});