"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function AdminConfirmModal({ isOpen, title, description, onConfirm, onCancel }: AdminConfirmModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl p-6 w-full max-w-md shadow-2xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[17px] text-[#1E1E40] dark:text-[#F9F9FB]">{title}</h2>
          <button
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2A2438] flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3A304D] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{description}</p>

        <div className="mb-5">
          <label className="block text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-2">
            {t("admin.confirmReasonLabel")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder={t("admin.confirmReasonPlaceholder")}
            className="w-full bg-[#F4F2F9] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#F9F9FB] rounded-2xl px-4 py-3 text-[13px] outline-none resize-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-full text-[13px] font-semibold bg-[#F4F2F9] dark:bg-[#2A2A40] text-[#5A4B81] dark:text-[#D0C9E8] hover:bg-[#e4dff0] dark:hover:bg-[#3A3A55] transition-colors"
          >
            {t("admin.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="flex-1 py-2.5 rounded-full text-[13px] font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t("admin.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
