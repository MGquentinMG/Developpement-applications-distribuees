import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReportForm } from "./ReportForm";

// 1. Mock des traductions pour simuler le rendu en français
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const mockTranslations: Record<string, string> = {
        "report.title": "Signalement",
        "report.submitBtn": "Signaler",
        "report.successMsg": "Merci de votre signalement :)",
      };
      return mockTranslations[key] || key;
    },
  }),
}));

// 2. Mock du fichier de configuration i18n
vi.mock("../../i18n", () => ({}));

describe("ReportForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doit afficher le formulaire par défaut avec le bouton de soumission", () => {
    render(<ReportForm postId="test-id" />);

    // Le test va chercher les textes que nous avons définis dans le mock ci-dessus
    expect(screen.getByText("Signalement")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Signaler" })).toBeInTheDocument();
  });

  it("doit afficher le message de succès après la soumission", () => {
    render(<ReportForm postId="test-id" />);
    
    // Sélection d'un motif dans le menu déroulant
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Violence" } });

    // Soumission du formulaire
    const submitBtn = screen.getByRole("button", { name: "Signaler" });
    fireEvent.click(submitBtn);

    // Vérification de l'affichage de l'écran de succès
    expect(screen.getByText("Merci de votre signalement :)")).toBeInTheDocument();
  });
});