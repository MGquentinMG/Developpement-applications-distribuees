"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";

export function AdminCreateUser() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState<"user" | "moderator">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/users/admin-create", {
        username,
        email,
        password,
        age: age ? Number(age) : 18,
        role,
      });
      setSuccess(`@${username} (${role})`);
      setUsername("");
      setEmail("");
      setPassword("");
      setAge("");
      setRole("user");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors">
        <h2 className="text-[16px] font-bold text-[#1A1A2E] dark:text-[#F9F9FB] mb-6">
          {t("admin.createTitle", "Créer un compte manuellement")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-1.5">
              {t("admin.usernameLabel", "Nom d'utilisateur")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: johndoe"
              required
              className="w-full bg-[#F4F2F9] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#F9F9FB] rounded-xl px-4 py-2.5 text-[13px] outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: john@example.com"
              required
              className="w-full bg-[#F4F2F9] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#F9F9FB] rounded-xl px-4 py-2.5 text-[13px] outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-1.5">
              {t("auth.passwordLabel", "Mot de passe")} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#F4F2F9] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#F9F9FB] rounded-xl px-4 py-2.5 text-[13px] outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-1.5">
              {t("admin.ageLabel", "Âge")}
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="18"
              min="13"
              max="120"
              className="w-full bg-[#F4F2F9] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#F9F9FB] rounded-xl px-4 py-2.5 text-[13px] outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-1.5">
              {t("admin.roleLabel", "Rôle")}
            </label>
            <div className="flex gap-3">
              {(["user", "moderator"] as const).map((r) => (
                <label
                  key={r}
                  className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer border transition-colors ${
                    role === r
                      ? "border-[#492775] bg-[#F5F0FF] dark:bg-[#2A2438] dark:border-[#A395DA]"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2A2438]"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="accent-[#492775]"
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-[#1E1E40] dark:text-[#F9F9FB] capitalize">{r}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      {r === "user"
                        ? t("admin.roleUserDesc", "Accès standard")
                        : t("admin.roleModeratorDesc", "Modération des contenus")}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-[12px] bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 dark:text-green-400 text-[12px] bg-green-50 dark:bg-green-900/20 px-4 py-2.5 rounded-xl">
              ✓ {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username || !email || !password}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[#492775] text-white hover:bg-[#3a1f5d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? t("admin.creating", "Création en cours...") : t("admin.createBtn", "Créer le compte")}
          </button>
        </form>
      </div>
    </div>
  );
}
