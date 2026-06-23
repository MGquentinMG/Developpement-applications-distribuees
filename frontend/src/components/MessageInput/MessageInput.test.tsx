import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MessageInput from "./MessageInput";

describe("MessageInput", () => {
  it("doit afficher l'input texte et l'input fichier caché", () => {
    render(<MessageInput value="" onChange={vi.fn()} onSend={vi.fn()} placeholder="Test" />);
    
    expect(screen.getByPlaceholderText("Test")).toBeInTheDocument();
    
    const fileInput = screen.getByTestId("file-input");
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveClass("hidden");
  });

  it("doit appeler onChange quand on tape du texte", () => {
    const handleChange = vi.fn();
    render(<MessageInput value="" onChange={handleChange} onSend={vi.fn()} placeholder="Tapez ici" />);
    
    const input = screen.getByPlaceholderText("Tapez ici");
    fireEvent.change(input, { target: { value: "Hello" } });
    
    expect(handleChange).toHaveBeenCalledWith("Hello");
  });

  it("doit déclencher onSend quand on appuie sur Entrée", () => {
    const handleSend = vi.fn();
    render(<MessageInput value="Test msg" onChange={vi.fn()} onSend={handleSend} />);
    
    const input = screen.getByDisplayValue("Test msg");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    
    expect(handleSend).toHaveBeenCalledTimes(1);
  });

  it("doit déclencher onImageSelect quand on sélectionne une image", () => {
    const handleImageSelect = vi.fn();
    render(<MessageInput value="" onChange={vi.fn()} onSend={vi.fn()} onImageSelect={handleImageSelect} />);
    
    const fileInput = screen.getByTestId("file-input");
    
    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(handleImageSelect).toHaveBeenCalledWith(file);
    expect(handleImageSelect).toHaveBeenCalledTimes(1);
  });
});