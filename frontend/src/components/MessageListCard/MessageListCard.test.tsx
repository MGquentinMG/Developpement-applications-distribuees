import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MessageListCard from "./MessageListCard";

describe("MessageListCard", () => {
  const defaultProps = {
    id: "42",
    author: "Jeanne",
    timeAgo: "3h",
    preview: "On se voit demain ?",
    isUnread: false,
  };

  it("doit afficher l'auteur, le temps et l'aperçu du message", () => {
    render(<MessageListCard {...defaultProps} />);
    
    expect(screen.getByText("Jeanne")).toBeInTheDocument();
    expect(screen.getByText("3h")).toBeInTheDocument();
    expect(screen.getByText("On se voit demain ?")).toBeInTheDocument();
  });

  it("doit rediriger vers la bonne page de conversation", () => {
    render(<MessageListCard {...defaultProps} />);
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/messages/42");
  });

  it("doit afficher le point rouge de notification si le message n'est pas lu", () => {
    const { container } = render(<MessageListCard {...defaultProps} isUnread={true} />);
    
    const unreadIndicator = container.querySelector(".bg-\\[\\#FF0000\\]");
    expect(unreadIndicator).toBeInTheDocument();
  });

  it("ne doit pas afficher le point rouge de notification si le message est lu", () => {
    const { container } = render(<MessageListCard {...defaultProps} isUnread={false} />);
    
    const unreadIndicator = container.querySelector(".bg-\\[\\#FF0000\\]");
    expect(unreadIndicator).not.toBeInTheDocument();
  });
});