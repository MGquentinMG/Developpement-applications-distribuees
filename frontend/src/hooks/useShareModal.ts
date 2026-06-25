import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useShareModal(isOpen: boolean, onClose: () => void, url: string) {
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState<string[]>([]);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setSentTo([]);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToContact = async (recipientId: string) => {
    if (sentTo.includes(recipientId) || sending === recipientId) return;
    setSending(recipientId);
    try {
      await api.post("/api/messages", { recipientId, content: url });
      setSentTo((prev) => [...prev, recipientId]);
    } catch {}
    setSending(null);
  };

  return {
    copied,
    sentTo,
    sending,
    handleClose,
    handleCopy,
    handleSendToContact,
  };
}
