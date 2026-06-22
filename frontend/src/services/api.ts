import { ApiResponse } from "../types/ApiResponseType";

const API_BASE_URL = "http://localhost:3001/api";

export async function handleApiCall<T>(
  endpoint: string, 
  method: string, 
  data?: object
): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erreur lors de la requête");
  }

  return result;
}