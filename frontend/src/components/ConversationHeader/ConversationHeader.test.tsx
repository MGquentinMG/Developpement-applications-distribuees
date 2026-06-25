import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConversationHeader from "./ConversationHeader";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ back: vi.fn() })),
}));

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
    
    const avatar = screen.getByAltText("Bob");
    expect(avatar).toBeInTheDocument();
  });
});