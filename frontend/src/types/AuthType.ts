import { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from "react";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "outline";
  icon?: ReactNode;
}

export interface ErrorMessageProps {
  message?: string;
}

export interface AuthFormProps {
  onSwitchMode: () => void;
  onClose: () => void;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  onSwitchMode?: () => void;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  age: number;
}

export interface LoginData {
  email: string;
  password: string;
}