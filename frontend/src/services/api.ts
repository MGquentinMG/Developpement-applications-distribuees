const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

console.log("[API] Base URL:", API_URL);

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fullUrl = `${API_URL}${path}`;
  console.log(`[API] ${options.method ?? "GET"} ${fullUrl}`);

  let res: Response;
  try {
    res = await fetch(fullUrl, { ...options, headers });
  } catch (networkErr) {
    console.error("[API] Network error (backend inaccessible?):", networkErr);
    throw new Error("Backend inaccessible — vérifie que le serveur tourne sur " + API_URL);
  }

  console.log(`[API] Response: ${res.status} ${res.statusText}, Content-Type: ${res.headers.get("content-type")}`);

  const text = await res.text();
  console.log("[API] Raw response (first 200 chars):", text.slice(0, 200));

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("[API] Response is not JSON. Le backend renvoie du HTML — mauvais port ou backend non démarré.");
    throw new Error(
      `Le backend sur ${API_URL} renvoie du HTML (erreur ${res.status}). Vérifie que le backend est démarré sur le bon port.`
    );
  }

  if (!res.ok) {
    const j = json as { message?: string; error?: string };
    const msg = j.error || j.message || "Erreur serveur";
    console.error("[API] Error response:", json);
    throw new Error(msg);
  }

  const data = (json as { data?: T })?.data ?? (json as T);
  return data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  uploadImage: async (file: File): Promise<string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/upload/image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await res.json() as { data?: { url: string }; success?: boolean };
    if (!res.ok || !json.data?.url) throw new Error("Échec de l'upload");
    return json.data.url;
  },
};

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function timeAgo(dateString: string): string {
  const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}j`;
  return `${Math.floor(diff / 604800)}sem`;
}


export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

const API_BASE_URL = "http://localhost";

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
