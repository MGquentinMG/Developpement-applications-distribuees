"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function ChangePasswordModal() {
  const { user, updateUser } = useAuth();

  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [error, setError]                     = useState<string | null>(null);

  if (!user?.mustChangePassword) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSaving(true);
    try {
      await api.patch("/api/users/me/password", { newPassword });
      updateUser({ mustChangePassword: false });
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800">

        {/* Icône + titre */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#EDE9F7] dark:bg-[#492775]/30 flex items-center justify-center mb-4">
            <ShieldCheck size={32} className="text-[#492775] dark:text-[#A395DA]" />
          </div>
          <h2 className="text-xl font-bold text-[#1E1E40] dark:text-[#F9F9FB]">
            Bienvenue, {user.username} !
          </h2>
          <p className="text-sm text-gray-500 dark:text-[#A395DA] mt-2">
            Pour sécuriser votre compte, veuillez définir un nouveau mot de passe avant de continuer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Nouveau mot de passe */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A395DA]">
              <KeyRound size={16} />
            </div>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              required
              autoFocus
              className="w-full pl-9 pr-10 py-3 rounded-2xl border border-[#D0C9E8] dark:border-[#2A2438] bg-[#F9F9FB] dark:bg-[#121212] text-[#1E1E40] dark:text-[#F9F9FB] text-sm focus:outline-none focus:ring-2 focus:ring-[#A395DA] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirmer */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A395DA]">
              <KeyRound size={16} />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
              className="w-full pl-9 pr-10 py-3 rounded-2xl border border-[#D0C9E8] dark:border-[#2A2438] bg-[#F9F9FB] dark:bg-[#121212] text-[#1E1E40] dark:text-[#F9F9FB] text-sm focus:outline-none focus:ring-2 focus:ring-[#A395DA] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving || !newPassword || !confirmPassword}
            className="mt-2 w-full py-3 bg-[#492775] hover:bg-[#3a1f5c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full text-sm transition-colors cursor-pointer"
          >
            {saving ? "Enregistrement..." : "Définir mon mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
