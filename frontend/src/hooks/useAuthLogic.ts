import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleApiCall } from "../services/api";
import { LoginData, RegisterData, LoginResponse } from "../types/AuthType";

export function useAuthLogic() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await handleApiCall("/auth/register", "POST", userData);
      router.push("/feed");
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inscription");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await handleApiCall<LoginResponse>("/auth/login", "POST", credentials);
      
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      router.push("/feed");
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Identifiants invalides");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, login, isLoading, error };
}
