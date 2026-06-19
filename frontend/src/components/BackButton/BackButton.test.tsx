import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import BackButton from "./BackButton";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("BackButton", () => {
  const mockBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ back: mockBack });
  });

  it("doit s'afficher correctement", () => {
    render(<BackButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("doit appeler router.back() lors du clic", () => {
    render(<BackButton />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});