"use client";

import { useState, useEffect } from "react";
import { AuthModalProps } from "../../types/AuthType";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/50 backdrop-blur-sm transition-opacity px-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {mode === "login" ? (
          <LoginForm onClose={onClose} onSwitchMode={() => setMode("register")} />
        ) : (
          <RegisterForm onClose={onClose} onSwitchMode={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}