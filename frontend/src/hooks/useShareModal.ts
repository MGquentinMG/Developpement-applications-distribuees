import { useState, useEffect } from "react";

export function useShareModal(isOpen: boolean, onClose: () => void, url: string) {
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState<string[]>([]);

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

  const handleSendToContact = (id: string) => {
    if (!sentTo.includes(id)) {
      setSentTo((prev) => [...prev, id]);
    }
  };

  return {
    copied,
    sentTo,
    handleClose,
    handleCopy,
    handleSendToContact
  };
}