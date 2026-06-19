import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Avatar from "./Avatar";

describe("Composant Avatar", () => {
  it("doit afficher l'image quand une URL src est fournie", () => {
    const testUrl = "https://exemple.com/image.jpg";
    render(<Avatar src={testUrl} alt="Photo de Panda" />);

    const imgElement = screen.getByAltText("Photo de Panda");
    
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", testUrl);
  });

  it("doit afficher l'icône par défaut quand aucune src n'est fournie", () => {
    const { container } = render(<Avatar alt="Avatar par défaut" />);

    const imgElement = screen.queryByAltText("Avatar par défaut");
    expect(imgElement).not.toBeInTheDocument();

    const svgIcon = container.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();
  });
});