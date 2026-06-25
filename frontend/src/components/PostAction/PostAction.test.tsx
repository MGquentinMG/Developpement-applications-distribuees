import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PostAction from "./PostAction";
import { Heart } from "lucide-react";

describe("Composant PostAction", () => {
  it("doit afficher le compteur avec la bonne valeur", () => {
    render(<PostAction icon={Heart} count="5K" />);
    
    expect(screen.getByText("5K")).toBeInTheDocument();
  });

  it("doit appeler la fonction onClick lors d'un clic", () => {
    const handleClick = vi.fn();
    
    render(<PostAction icon={Heart} count="10" onClick={handleClick} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button); 
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});