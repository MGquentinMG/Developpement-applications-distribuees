import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotificationCard from "./NotificationCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("NotificationCard", () => {
  const baseProps = {
    id: "1",
    username: "@Ambroise",
    time: "17:02",
    isRead: false,
  };

  it("doit afficher le nom d'utilisateur et l'heure", () => {
    render(<NotificationCard {...baseProps} action="like" />);
    
    expect(screen.getByText("@Ambroise")).toBeInTheDocument();
    expect(screen.getByText("17:02")).toBeInTheDocument();
  });

  it("doit afficher la traduction correcte pour l'action 'like'", () => {
    render(<NotificationCard {...baseProps} action="like" />);
    expect(screen.getByText(/notifications\.liked/)).toBeInTheDocument();
  });

  it("doit afficher la traduction correcte pour l'action 'comment'", () => {
    render(<NotificationCard {...baseProps} action="comment" />);
    expect(screen.getByText(/notifications\.commented/)).toBeInTheDocument();
  });

  it("doit afficher la traduction correcte pour l'action 'share'", () => {
    render(<NotificationCard {...baseProps} action="share" />);
    expect(screen.getByText(/notifications\.shared/)).toBeInTheDocument();
  });

  it("doit afficher la traduction correcte pour l'action 'follow'", () => {
    render(<NotificationCard {...baseProps} action="follow" />);
    expect(screen.getByText(/notifications\.addedFriend/)).toBeInTheDocument();
  });
});