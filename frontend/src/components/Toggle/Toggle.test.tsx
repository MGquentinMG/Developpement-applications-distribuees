import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Toggle from "./Toggle";

describe("Toggle", () => {
  it("doit afficher le label transmis", () => {
    render(<Toggle label="Activer le mode sombre" checked={false} onChange={vi.fn()} />);
    expect(screen.getByText("Activer le mode sombre")).toBeInTheDocument();
  });

  it("doit transmettre la propriété checked à l'input caché", () => {
    render(<Toggle label="Notifications" checked={true} onChange={vi.fn()} />);
    
    // Le checkbox est caché par Tailwind (className="hidden"), on doit donc utiliser { hidden: true }
    const checkbox = screen.getByRole("checkbox", { hidden: true });
    expect(checkbox).toBeChecked();
  });

  it("doit appeler onChange quand on clique sur le composant", () => {
    const handleChange = vi.fn();
    render(<Toggle label="Son" checked={false} onChange={handleChange} />);
    
    // On clique sur le parent qui englobe tout (le label)
    const toggleLabel = screen.getByText("Son");
    fireEvent.click(toggleLabel);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});