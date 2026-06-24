"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "../../services/api";

interface ReportModalProps {
  isOpen: boolean;
  postId?: string | number;
  commentId?: string | number;
  onClose: () => void;
}

const REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harcèlement" },
  { value: "inappropriate", label: "Contenu inapproprié" },
  { value: "other", label: "Autre" },
];

export default function ReportModal({ isOpen, postId, commentId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason) return;
    setSending(true);
    try {
      const payload = commentId
        ? { reportedCommentId: commentId, reason, description }
        : { reportedPostId: postId, reason, description };
      await api.post("/api/reports", payload);
      setSent(true);
    } catch {
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setDescription("");
    setSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={handleClose}>
      <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[17px] text-[#1E1E40] dark:text-[#F9F9FB]">{commentId ? "Signaler ce commentaire" : "Signaler ce post"}</h2>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2A2438] flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3A304D] transition-colors">
            <X size={16} />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <p className="text-[#492775] dark:text-[#A395DA] font-semibold mb-1">Signalement envoyé</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Merci, notre équipe va examiner ce contenu.</p>
            <button onClick={handleClose} className="mt-5 w-full py-2.5 rounded-full text-[13px] font-semibold bg-[#492775] text-white hover:bg-[#3a1f5d] transition-colors">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-2">Raison <span className="text-red-500">*</span></p>
              <div className="flex flex-col gap-2">
                {REASONS.map((r) => (
                  <label key={r.value} className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl cursor-pointer border transition-colors ${reason === r.value ? "border-[#492775] bg-[#F5F0FF] dark:bg-[#2A2438] dark:border-[#A395DA]" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2A2438]"}`}>
                    <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} className="accent-[#492775]" />
                    <span className="text-[13px] text-[#1E1E40] dark:text-[#F9F9FB]">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[12px] font-semibold text-[#492775] dark:text-[#A395DA] mb-2">Description (optionnel)</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Donnez plus de détails..."
                className="w-full bg-[#F4F2F9] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#F9F9FB] rounded-2xl px-4 py-3 text-[13px] outline-none resize-none placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 py-2.5 rounded-full text-[13px] font-semibold bg-[#F4F2F9] dark:bg-[#2A2A40] text-[#5A4B81] dark:text-[#D0C9E8] hover:bg-[#e4dff0] transition-colors">
                Annuler
              </button>
              <button onClick={handleSubmit} disabled={!reason || sending} className="flex-1 py-2.5 rounded-full text-[13px] font-semibold bg-[#492775] text-white hover:bg-[#3a1f5d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {sending ? "Envoi..." : "Signaler"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
