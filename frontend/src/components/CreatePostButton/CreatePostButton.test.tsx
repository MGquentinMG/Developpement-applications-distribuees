import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import CreatePostButton from "./CreatePostButton";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("CreatePostButton", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("doit s'afficher avec le bon label d'accessibilité", () => {
    render(<CreatePostButton />);
    expect(screen.getByRole("button", { name: "Créer un post" })).toBeInTheDocument();
  });

  it("doit appeler router.push('/create-post') lors du clic", () => {
    render(<CreatePostButton />);
    
    const button = screen.getByRole("button", { name: "Créer un post" });
    fireEvent.click(button);
    
    expect(mockPush).toHaveBeenCalledWith("/create-post");
  });
});