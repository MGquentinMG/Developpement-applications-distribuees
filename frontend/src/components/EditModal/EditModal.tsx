"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newContent: string) => Promise<void> | void;
  initialContent: string;
  title?: string;
}

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  initialContent,
  title = "Modifier",
}: EditModalProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setContent(initialContent);
  }, [isOpen, initialContent]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    try {
      await onSave(content.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1A1A2E] rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[16px] text-[#1E1E40] dark:text-[#F9F9FB]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          autoFocus
          className="w-full rounded-2xl border border-[#D0C9E8] dark:border-[#2A2438] bg-[#F9F9FB] dark:bg-[#121212] text-[#1E1E40] dark:text-[#F9F9FB] text-[13px] px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#A395DA] transition-colors"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-[13px] font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="flex-1 py-2.5 rounded-full bg-[#492775] hover:bg-[#3a1f5c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-bold transition-colors cursor-pointer"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
