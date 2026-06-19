import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import TopBanner from "./TopBanner";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../Logo/Logo", () => ({
  default: () => <div data-testid="mock-logo" />
}));

describe("TopBanner", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("doit afficher les textes provenant des traductions", () => {
    render(<TopBanner />);
    expect(screen.getByText(/topBanner\.title1/)).toBeInTheDocument();
    expect(screen.getByText("topBanner.subtitle")).toBeInTheDocument();
  });

  it("doit afficher le bouton de connexion traduit", () => {
    render(<TopBanner />);
    expect(screen.getByText("topBanner.login")).toBeInTheDocument();
  });

  it("doit rediriger vers /login au clic sur le bouton", () => {
    render(<TopBanner />);
    const loginButton = screen.getByText("topBanner.login");
    
    fireEvent.click(loginButton);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});