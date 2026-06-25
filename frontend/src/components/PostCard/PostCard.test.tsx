import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PostCard from "./PostCard";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/"),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() }
}));

// Mock du composant ShareModal pour isoler PostCard
vi.mock("../ShareModal/ShareModal", () => ({
  default: () => <div data-testid="mock-share-modal" />
}));

describe("PostCard", () => {
  const defaultProps = {
    id: "1",
    author: "UnAuteurAvecUnNomTresLong",
    timeAgo: "2h",
    content: "Un super contenu avec un #hashtag",
    likes: "10",
    comments: "5",
    shares: "2",
  };

  it("doit afficher toutes les données textuelles du post", () => {
    render(<PostCard {...defaultProps} />);
    
    expect(screen.getByText("Un super contenu avec un")).toBeInTheDocument();
    expect(screen.getByText("2h")).toBeInTheDocument();
  });

  it("doit formater correctement les hashtags dans le contenu", () => {
    render(<PostCard {...defaultProps} />);
    
    const hashtag = screen.getByText("#hashtag");
    expect(hashtag).toBeInTheDocument();
    expect(hashtag.tagName).toBe("SPAN");
  });
});