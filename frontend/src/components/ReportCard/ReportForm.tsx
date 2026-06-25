"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import "../../i18n";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export function ReportForm({ postId }: { postId: string | number }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason) return;
    setError("");
    setLoading(true);
    try {
      await api.post("/api/reports", { reportedPostId: postId, reason, description });
      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors du signalement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] w-full max-w-md md:max-w-lg p-8 md:p-10 relative transition-colors duration-300">
      <button 
        onClick={() => router.back()}
        className="absolute top-4 right-4 bg-gray-200 dark:bg-[#2A2A40] hover:bg-gray-300 dark:hover:bg-[#3A3A55] rounded-full w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors cursor-pointer border-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div className="text-center mb-10">
        <h2 className="text-[32px] font-bold text-black dark:text-[#F9F9FB] tracking-tight leading-tight">
          {t("report.title")}
        </h2>
      </div>

      {isSubmitted ? (
        <div className="text-center py-10 space-y-2">
          <p className="text-gray-900 dark:text-[#F9F9FB] font-medium text-lg">{t("report.successMsg")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {!user && (
            <p className="text-amber-500 text-sm text-center">
              {t("report.loginWarning", "Tu dois être connecté pour signaler du contenu.")}
            </p>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-[#F9F9FB] mb-2">{t("report.reasonLabel")}</label>
            <div className="relative w-full">
              <select
                className="bg-[#F3F4F6] dark:bg-[#2A2A40] text-gray-700 dark:text-[#F9F9FB] text-sm rounded-xl p-4 w-full outline-none appearance-none cursor-pointer pr-10 transition-colors"
                value={reason}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setReason(e.target.value)}
                required
              >
                <option value="" disabled hidden>{t("report.selectReason", "Sélectionner un motif...")}</option>
                <option value="Incitation à la haine">{t("report.reasons.hate", "Incitation à la haine")}</option>
                <option value="Violence">{t("report.reasons.violence", "Violence")}</option>
                <option value="Désinformation">{t("report.reasons.disinfo", "Désinformation")}</option>
                <option value="Activités illégal">{t("report.reasons.illegal", "Activités illégales")}</option>
                <option value="Fraudes">{t("report.reasons.fraud", "Fraudes")}</option>
                <option value="Autres">{t("report.reasons.other", "Autres")}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-[#F9F9FB] mb-2">
              {t("report.descriptionLabel", "Description :")}
            </label>
            <textarea
              rows={4}
              placeholder="..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#F3F4F6] dark:bg-[#2A2A40] text-gray-900 dark:text-[#F9F9FB] text-sm rounded-xl p-4 w-full outline-none transition-colors resize-none"
            />
          </div>

          <div className="mt-8 text-[10px] text-gray-500 dark:text-gray-400 leading-tight text-center">
            {t("report.legalWarning")}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !user}
              className="bg-[#A69ACA] text-white font-bold rounded-full text-sm px-8 py-4 hover:bg-[#9084b8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? t("report.sending", "Envoi...") : t("report.submitBtn", "Signaler")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}