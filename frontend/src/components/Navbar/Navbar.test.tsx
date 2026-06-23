import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import Navbar from "./Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../utils/NavigationUtil", () => ({
  navLinks: [
    { name: "Home", href: "/feed", icon: () => <svg data-testid="icon-home" /> },
    { name: "Profile", href: "/profile", icon: () => <svg data-testid="icon-profile" /> },
  ]
}));

describe("Navbar", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useAuth as Mock).mockReturnValue({ user: { role: "user" } });
  });

  it("ne doit pas s'afficher sur la page d'accueil (/)", () => {
    (usePathname as Mock).mockReturnValue("/");
    const { container } = render(<Navbar />);
    expect(container).toBeEmptyDOMElement();
  });

  it("ne doit pas s'afficher sur la page d'un post détaillé", () => {
    (usePathname as Mock).mockReturnValue("/post/12345");
    const { container } = render(<Navbar />);
    expect(container).toBeEmptyDOMElement();
  });

  it("doit s'afficher sur la page /feed", () => {
    (usePathname as Mock).mockReturnValue("/feed");
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("doit rediriger vers /create-post au clic sur le bouton central", () => {
    (usePathname as Mock).mockReturnValue("/feed");
    render(<Navbar />);
    
    const createButton = screen.getByRole("button", { name: /créer un post/i });
    fireEvent.click(createButton);
    
    expect(mockPush).toHaveBeenCalledWith("/create-post");
  });

  it("doit afficher l'icône Admin si l'utilisateur a le rôle admin", () => {
    (usePathname as Mock).mockReturnValue("/feed");
    (useAuth as Mock).mockReturnValue({ user: { role: "admin" } });
    
    const { container } = render(<Navbar />);
    const adminLink = container.querySelector("a[href='/admin']");
    
    expect(adminLink).toBeInTheDocument();
  });
});