import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ShareModal from "./ShareModal";
import { useAuth } from "../../contexts/AuthContext";

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../i18n", () => ({}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "share.title": "Partager à",
        "share.sent": "Envoyé",
        "share.send": "Envoyer",
        "share.message": "Message",
        "share.email": "Email"
      };
      return translations[key] || key;
    }
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() }
}));

describe("ShareModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    url: "https://breezy.com/post/1",
    title: "Mon super post",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      user: {
        following: [
          { _id: "user1", username: "Contact 1", avatar: "" }
        ]
      }
    });
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it("ne doit rien afficher si isOpen est false", () => {
    const { container } = render(<ShareModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("doit afficher les boutons de partage et l'URL", () => {
    render(<ShareModal {...defaultProps} />);
    
    expect(screen.getByText("Partager à")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://breezy.com/post/1")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("doit copier le lien au clic sur le bouton de copie", () => {
    render(<ShareModal {...defaultProps} />);
    
    const copyButtons = screen.getAllByRole("button");
    const copyButton = copyButtons[copyButtons.length - 1]; 
    
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://breezy.com/post/1");
  });

  it("doit ajouter un contact à la liste des envoyés au clic", () => {
    render(<ShareModal {...defaultProps} />);
    
    const sendButtons = screen.getAllByText("Envoyer");
    expect(sendButtons.length).toBeGreaterThan(0);

    fireEvent.click(sendButtons[0]);
    
    expect(screen.getAllByText("Envoyé").length).toBeGreaterThan(0);
  });
});