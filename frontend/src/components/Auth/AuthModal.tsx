"use client";

import { AuthModalProps } from "../../types/AuthType";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal({ isOpen, onClose, initialMode = "login", onSwitchMode }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      {initialMode === "login" ? (
        <LoginForm onSwitchMode={onSwitchMode || onClose} onClose={onClose} />
      ) : (
        <RegisterForm onSwitchMode={onSwitchMode || onClose} onClose={onClose} />
      )}
    </div>
  );
}