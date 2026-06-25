import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CommentCard from "./CommentCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() }
}));

describe("CommentCard", () => {
  const defaultProps = {
    id: "1",
    author: "TestUser",
    timeAgo: "1h",
    content: "Ceci est un super commentaire !",
    likes: "5",
  };

  it("doit afficher l'auteur, le temps et le contenu du commentaire", () => {
    render(<CommentCard {...defaultProps} />);
    
    expect(screen.getByText("TestUser")).toBeInTheDocument();
    expect(screen.getByText("1h")).toBeInTheDocument();
    expect(screen.getByText("Ceci est un super commentaire !")).toBeInTheDocument();
  });

  it("doit contenir un lien vers le profil de l'auteur", () => {
    render(<CommentCard {...defaultProps} />);
    
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/profile/TestUser");
  });

  it("doit déclencher onReply avec le nom de l'auteur au clic sur répondre", () => {
    const handleReply = vi.fn();
    render(<CommentCard {...defaultProps} onReply={handleReply} />);
    
    const replyButton = screen.getByText("post.reply");
    fireEvent.click(replyButton);
    
    expect(handleReply).toHaveBeenCalledTimes(1);
    expect(handleReply).toHaveBeenCalledWith("TestUser");
  });
});