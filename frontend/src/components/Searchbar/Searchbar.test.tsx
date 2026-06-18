import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchBar from "./Searchbar";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("SearchBar", () => {
  it("doit afficher la valeur passée en props", () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });

  it("doit afficher le bon placeholder traduit", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("feed.searchPlaceholder")).toBeInTheDocument();
  });

  it("doit appeler onChange lors d'une frappe au clavier", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText("feed.searchPlaceholder");
    fireEvent.change(input, { target: { value: "hello" } });
    
    expect(handleChange).toHaveBeenCalledWith("hello");
  });

  it("doit afficher le bouton d'effacement uniquement si le champ n'est pas vide", () => {
    const { rerender } = render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(<SearchBar value="hello" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("doit renvoyer une chaîne vide quand on clique sur la croix", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="texte à effacer" onChange={handleChange} />);
    
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);
    
    expect(handleChange).toHaveBeenCalledWith("");
  });
});