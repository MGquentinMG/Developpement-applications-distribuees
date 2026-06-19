import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConversationHeader from "./ConversationHeader";

// 1. On mock le router pour le BackButton
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ back: vi.fn() })),
}));

// 2. On mock l'Avatar pour forcer la présence de l'attribut alt dynamique
vi.mock("../Avatar/Avatar", () => ({
  default: ({ alt }: { alt: string }) => <img data-testid="mock-avatar" alt={alt || "Avatar"} />
}));

describe("ConversationHeader", () => {
  it("doit afficher le titre et le statut correctement", () => {
    render(<ConversationHeader title="Alice" status="En ligne" />);
    
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("En ligne")).toBeInTheDocument();
  });

  it("doit afficher l'avatar avec le bon alt", () => {
    render(<ConversationHeader title="Bob" status="Hors ligne" />);
    
    // Grâce au mock, on est sûr que le alt="Bob" sera bien passé à l'image
    const avatar = screen.getByAltText("Bob");
    expect(avatar).toBeInTheDocument();
  });
});