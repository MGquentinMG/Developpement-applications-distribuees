import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AdminDashboard } from "./AdminDashboard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

describe("AdminDashboard", () => {
  it("doit afficher la liste des utilisateurs par défaut", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Gusty")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("doit afficher le message 'Sélectionnez un utilisateur' au démarrage", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Sélectionnez un utilisateur")).toBeInTheDocument();
  });

  it("doit afficher les détails et les posts d'un utilisateur au clic", () => {
    render(<AdminDashboard />);
    
    const gustyButton = screen.getByText("Gusty").closest("button");
    fireEvent.click(gustyButton!);

    expect(screen.getByText("Superbe journée pour coder !")).toBeInTheDocument();
    expect(screen.queryByText("Sélectionnez un utilisateur")).not.toBeInTheDocument();
  });

  it("doit filtrer la liste des utilisateurs quand on utilise la recherche", () => {
    render(<AdminDashboard />);
    
    const searchInput = screen.getByPlaceholderText("Rechercher...");
    fireEvent.change(searchInput, { target: { value: "ali" } });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Gusty")).not.toBeInTheDocument();
  });
});