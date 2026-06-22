import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchBar from "./Searchbar";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() }
}));

describe("SearchBar", () => {
  it("doit afficher la valeur et le placeholder correctement", () => {
    render(<SearchBar value="Test" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
  });

  it("doit appeler onChange lors de la saisie", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} placeholder="Chercher" />);
    
    const input = screen.getByPlaceholderText("Chercher");
    fireEvent.change(input, { target: { value: "Hello" } });
    
    expect(handleChange).toHaveBeenCalledWith("Hello");
  });

  it("doit afficher le bouton clear uniquement si une valeur est présente", () => {
    const { rerender } = render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(<SearchBar value="Texte" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("doit vider le champ au clic sur le bouton clear", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="Texte" onChange={handleChange} />);
    
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);
    
    expect(handleChange).toHaveBeenCalledWith("");
  });
});