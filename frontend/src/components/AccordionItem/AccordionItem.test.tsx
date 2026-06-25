import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AccordionItem from "./AccordionItem";

describe("AccordionItem", () => {
  it("doit afficher le titre correctement", () => {
    render(<AccordionItem title="Mon Titre">Contenu</AccordionItem>);
    expect(screen.getByText("Mon Titre")).toBeInTheDocument();
  });

  it("ne doit pas afficher le contenu par défaut (fermé)", () => {
    render(<AccordionItem title="Titre">Contenu secret</AccordionItem>);
    expect(screen.queryByText("Contenu secret")).not.toBeInTheDocument();
  });

  it("doit afficher le contenu immédiatement si defaultOpen est true", () => {
    render(<AccordionItem title="Titre" defaultOpen={true}>Contenu secret</AccordionItem>);
    expect(screen.getByText("Contenu secret")).toBeInTheDocument();
  });

  it("doit ouvrir et fermer le contenu au clic sur l'en-tête", () => {
    render(<AccordionItem title="Titre">Contenu cliquable</AccordionItem>);
    
    const header = screen.getByText("Titre");
    
    // Le contenu n'est pas là au début
    expect(screen.queryByText("Contenu cliquable")).not.toBeInTheDocument();

    // Clic pour ouvrir
    fireEvent.click(header);
    expect(screen.getByText("Contenu cliquable")).toBeInTheDocument();

    // Clic pour fermer
    fireEvent.click(header);
    expect(screen.queryByText("Contenu cliquable")).not.toBeInTheDocument();
  });
});