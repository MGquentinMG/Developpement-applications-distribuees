import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { AuthModal } from "./AuthModal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ErrorMessage } from "./ErrorMessage";
import { InputField } from "./InputField";
import { SubmitButton } from "./SubmitButton";
import { useAuthLogic } from "../../hooks/useAuthLogic";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../i18n", () => ({}));

vi.mock("../../hooks/useAuthLogic", () => ({
  useAuthLogic: vi.fn(),
}));

describe("Authentication Components", () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthLogic as Mock).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      isLoading: false,
      error: null,
    });
  });

  describe("ErrorMessage", () => {
    it("ne doit rien afficher si aucun message n'est fourni", () => {
      const { container } = render(<ErrorMessage />);
      expect(container).toBeEmptyDOMElement();
    });

    it("doit afficher le message s'il est fourni", () => {
      render(<ErrorMessage message="Erreur de test" />);
      expect(screen.getByText("Erreur de test")).toBeInTheDocument();
    });
  });

  describe("InputField", () => {
    it("doit appliquer la bordure rouge si une erreur est présente", () => {
      render(<InputField error="Ceci est une erreur" placeholder="Test Input" />);
      const input = screen.getByPlaceholderText("Test Input");
      expect(input).toHaveClass("border-red-500");
    });

    it("ne doit pas avoir de bordure rouge sans erreur", () => {
      render(<InputField error={undefined} placeholder="Test Input" />);
      const input = screen.getByPlaceholderText("Test Input");
      expect(input).toHaveClass("border-transparent");
    });
  });

  describe("SubmitButton", () => {
    it("doit afficher le texte par défaut quand il ne charge pas", () => {
      render(<SubmitButton>Valider</SubmitButton>);
      expect(screen.getByText("Valider")).toBeInTheDocument();
    });

    it("doit afficher le texte de chargement et être désactivé si isLoading est true", () => {
      render(<SubmitButton isLoading={true}>Valider</SubmitButton>);
      const button = screen.getByRole("button");
      expect(screen.getByText("auth.loading")).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  describe("AuthModal", () => {
    it("ne doit rien afficher si isOpen est false", () => {
      const { container } = render(<AuthModal isOpen={false} onClose={vi.fn()} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("doit afficher LoginForm si initialMode est 'login'", () => {
      render(<AuthModal isOpen={true} initialMode="login" onClose={vi.fn()} />);
      expect(screen.getByText("auth.loginTitle")).toBeInTheDocument();
    });

    it("doit afficher RegisterForm si initialMode est 'register'", () => {
      render(<AuthModal isOpen={true} initialMode="register" onClose={vi.fn()} />);
      expect(screen.getByText("auth.registerTitle")).toBeInTheDocument();
    });
  });

  describe("LoginForm", () => {
    it("doit passer à l'étape 2 et soumettre correctement le formulaire", async () => {
      render(<LoginForm onClose={vi.fn()} onSwitchMode={vi.fn()} />);
      
      const emailLoginBtn = screen.getByText("auth.emailLogin");
      fireEvent.click(emailLoginBtn);

      const emailInput = screen.getByPlaceholderText("auth.emailLabel");
      const passwordInput = screen.getByPlaceholderText("auth.passwordLabel");
      const submitBtn = screen.getByText("auth.submit");

      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitBtn);

      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith({ email: "test@test.com", password: "password123" });
    });
  });

  describe("RegisterForm", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-06-23T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("doit soumettre le formulaire avec l'âge calculé correctement", async () => {
      render(<RegisterForm onClose={vi.fn()} onSwitchMode={vi.fn()} />);
      
      const emailRegisterBtn = screen.getByText("auth.emailRegister");
      fireEvent.click(emailRegisterBtn);

      const pseudoInput = screen.getByPlaceholderText("auth.pseudoPlaceholder");
      const emailInput = screen.getByPlaceholderText("auth.emailLabel");
      const passwordInput = screen.getByPlaceholderText("auth.passwordLabel");
      
      fireEvent.change(pseudoInput, { target: { value: "Gusty" } });
      fireEvent.change(emailInput, { target: { value: "gusty@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "pass123" } });

      const selects = screen.getAllByRole("combobox");
      fireEvent.change(selects[0], { target: { value: "15" } });
      fireEvent.change(selects[1], { target: { value: "4" } });
      fireEvent.change(selects[2], { target: { value: "2000" } });

      const termsCheckbox = screen.getByRole("checkbox");
      fireEvent.click(termsCheckbox);

      const submitBtn = screen.getByText("auth.submit");
      fireEvent.click(submitBtn);

      expect(mockRegister).toHaveBeenCalledTimes(1);
      expect(mockRegister).toHaveBeenCalledWith({
        username: "Gusty",
        email: "gusty@test.com",
        password: "pass123",
        age: 26 
      });
    });

    it("ne doit pas soumettre si les conditions ne sont pas acceptées", () => {
      render(<RegisterForm onClose={vi.fn()} onSwitchMode={vi.fn()} />);
      
      fireEvent.click(screen.getByText("auth.emailRegister"));
      
      const selects = screen.getAllByRole("combobox");
      fireEvent.change(selects[0], { target: { value: "15" } });
      fireEvent.change(selects[1], { target: { value: "4" } });
      fireEvent.change(selects[2], { target: { value: "2000" } });

      const submitBtn = screen.getByText("auth.submit");
      fireEvent.click(submitBtn);

      expect(mockRegister).not.toHaveBeenCalled();
    });
  });
});