import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginForm } from "./LoginForm";

// Mock des traductions
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultText: string) => defaultText || key,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doit afficher l'étape 1 par défaut avec les boutons de choix sociaux", () => {
    render(<LoginForm />);
    expect(screen.getByText("Connexion avec google")).toBeInTheDocument();
    expect(screen.getByText("Connexion avec identifiants")).toBeInTheDocument();
  });

  it("doit passer à l'étape 2 quand on clique sur 'Connexion avec identifiants'", () => {
    render(<LoginForm />);
    
    const identifierButton = screen.getByText("Connexion avec identifiants");
    fireEvent.click(identifierButton);

    expect(screen.getByPlaceholderText("Adresse e-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Valider" })).toBeInTheDocument();
  });

  it("doit permettre la saisie dans les champs email et mot de passe", () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByText("Connexion avec identifiants"));

    const emailInput = screen.getByPlaceholderText("Adresse e-mail") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("Mot de passe") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@breezy.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@breezy.com");
    expect(passwordInput.value).toBe("password123");
  });
});