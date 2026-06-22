import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminDashboard } from "./AdminDashboard";

// Mock des traductions
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => {
      const mockTranslations: Record<string, string> = {
        "admin.searchPlaceholder": "Rechercher...",
        "admin.selectUser": "Sélectionnez un utilisateur",
        "admin.deleteAccount": "Supprimer le compte",
        "admin.noMessages": "Cet utilisateur n'a publié aucun message.",
      };
      return mockTranslations[key] || fallback;
    },
  }),
}));

// Mock du fichier de configuration i18n
vi.mock("../../i18n", () => ({}));

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // On simule "Oui" à chaque fois que window.confirm est appelé
    window.confirm = vi.fn().mockReturnValue(true); 
  });

  it("doit afficher la liste des utilisateurs et le message de sélection par défaut", () => {
    render(<AdminDashboard />);
    
    // Vérifier la présence des utilisateurs factices dans la colonne de gauche
    expect(screen.getByText("Gusty")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    
    // Vérifier que le panneau de droite demande de sélectionner un utilisateur
    expect(screen.getByText("Sélectionnez un utilisateur")).toBeInTheDocument();
  });

  it("doit afficher les détails et messages d'un utilisateur quand on clique dessus", () => {
    render(<AdminDashboard />);
    
    // Clic sur l'utilisateur Gusty
    const gustyButton = screen.getByText("gusty@breezy.com").closest("button");
    fireEvent.click(gustyButton!);

    // Le bouton supprimer doit apparaitre
    expect(screen.getByText("Supprimer le compte")).toBeInTheDocument();
    
    // Ses messages doivent s'afficher
    expect(screen.getByText("Superbe journée pour coder !")).toBeInTheDocument();
  });

  it("doit permettre de supprimer un utilisateur de la liste", () => {
    render(<AdminDashboard />);
    
    // On sélectionne Alice
    fireEvent.click(screen.getByText("alice@example.com").closest("button")!);
    
    // On clique sur Supprimer le compte
    const deleteBtn = screen.getByText("Supprimer le compte");
    fireEvent.click(deleteBtn);

    // Vérifie que window.confirm a été appelé
    expect(window.confirm).toHaveBeenCalledTimes(1);

    // Alice ne doit plus être dans le document
    expect(screen.queryByText("alice@example.com")).not.toBeInTheDocument();
    
    // Le panneau de droite doit être revenu à l'état par défaut
    expect(screen.getByText("Sélectionnez un utilisateur")).toBeInTheDocument();
  });
});