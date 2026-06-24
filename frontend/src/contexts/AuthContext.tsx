"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "../services/api";

export interface AuthUser {
  _id: string;
  username: string;
  role: string;
  avatar?: string;
  bio?: string;
  followers: { _id: string; username: string; avatar?: string }[];
  following: { _id: string; username: string; avatar?: string }[];
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    age: number;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (!saved) {
      setLoading(false);
      return;
    }
    setToken(saved);
    api
      .get<AuthUser>("/api/users/me")
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: { username: string; role: string } }>(
      "/api/auth/login",
      { email, password }
    );
    localStorage.setItem("token", data.token);
    setToken(data.token);
    const me = await api.get<AuthUser>("/api/users/me");
    setUser(me);
    router.push("/feed");
  };

  const register = async (payload: {
    username: string;
    email: string;
    password: string;
    age: number;
  }) => {
    await api.post("/api/auth/register", payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
