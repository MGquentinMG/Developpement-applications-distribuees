"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { InputField } from "../LoginCard/common/InputField"; 

export function ReportForm() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => setReason(e.target.value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason) return;
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] w-full max-w-[400px] p-8 pt-10 relative transition-colors duration-300">
      
      <button className="absolute top-4 right-4 bg-gray-200 dark:bg-[#2A2A40] hover:bg-gray-300 dark:hover:bg-[#3A3A55] rounded-full w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-[32px] font-bold text-black dark:text-[#F9F9FB] tracking-tight leading-tight">
          {t("report.title")}
        </h2>
      </div>

      {isSubmitted ? (
        <div className="text-center py-10 space-y-2">
          <p className="text-gray-900 dark:text-[#F9F9FB] font-medium">{t("report.successMsg")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-900 dark:text-[#F9F9FB] mb-2">{t("report.reasonLabel")}</label>
            <div className="relative w-full">
              <select className="bg-[#F3F4F6] dark:bg-[#2A2A40] text-gray-500 dark:text-[#F9F9FB] text-sm rounded-lg p-3 w-full outline-none appearance-none cursor-pointer pr-8 transition-colors" value={reason} onChange={handleSelectChange} required>
                <option value="" disabled hidden>{t("report.selectReason")}</option>
                <option value="Incitation à la haine">{t("report.reasons.hate")}</option>
                <option value="Violence">{t("report.reasons.violence")}</option>
                <option value="Désinformation">{t("report.reasons.disinfo")}</option>
                <option value="Activités illégal">{t("report.reasons.illegal")}</option>
                <option value="Fraudes">{t("report.reasons.fraud")}</option>
                <option value="Autres">{t("report.reasons.other")}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-900 dark:text-[#F9F9FB] mb-2">{t("report.descriptionLabel")}</label>
            <InputField type="text" placeholder="..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          
          <div className="mt-6 text-[8px] text-gray-500 dark:text-gray-400 leading-tight">
            {t("report.legalWarning")}
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-[#A69ACA] text-white font-medium rounded-full text-sm px-6 py-2 hover:bg-[#9084b8] transition-colors">
              {t("report.submitBtn")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}