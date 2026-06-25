"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Copy, Check, Mail, MessageSquare } from "lucide-react";
import { ShareModalProps } from "../../types/ModalType";
import Avatar from "../Avatar/Avatar";
import { useShareModal } from "../../hooks/useShareModal";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import "../../i18n";

interface Contact {
  _id: string;
  username: string;
  avatar?: string;
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { copied, sentTo, sending, handleClose, handleCopy, handleSendToContact } = useShareModal(isOpen, onClose, url);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      api.get<Contact[]>(`/api/users/${user._id}/following`)
        .then((data) => setContacts(Array.isArray(data) ? data : []))
        .catch(() => setContacts([]));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const shareLinks = [
    { icon: MessageSquare, name: t("share.message"), color: "bg-[#25D366]", href: `sms:?&body=${encodeURIComponent(url)}` },
    { icon: Mail, name: t("share.email"), color: "bg-gray-500", href: `mailto:?subject=${encodeURIComponent(title || "")}&body=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-end bg-black/50 backdrop-blur-sm transition-opacity" onClick={handleClose}>
      <div 
        className="w-full max-w-md bg-white dark:bg-[#1A1A2E] rounded-t-[32px] p-6 animate-in slide-in-from-bottom-full duration-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#1E1E40] dark:text-[#F9F9FB] text-lg font-bold">{t("share.title")}</h2>
          <button onClick={handleClose} className="p-2 bg-gray-100 dark:bg-[#2A2438] rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3A304D] transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {contacts.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4 mb-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {contacts.map((contact) => {
              const isSent = sentTo.includes(contact._id);
              return (
                <div key={contact._id} className="flex flex-col items-center gap-2 min-w-[72px]">
                  <div className="relative w-14 h-14">
                    <Avatar src={contact.avatar} alt={contact.username} />
                    {isSent && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#009650] border-2 border-white dark:border-[#1A1A2E] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-[#1E1E40] dark:text-[#F9F9FB] font-medium truncate w-full text-center">
                    {contact.username}
                  </span>
                  <button
                    onClick={() => handleSendToContact(contact._id)}
                    disabled={isSent || sending === contact._id}
                    className={`text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors w-full cursor-pointer ${
                      isSent
                        ? "bg-gray-100 dark:bg-[#2A2438] text-gray-400 dark:text-gray-500"
                        : sending === contact._id
                        ? "bg-[#A395DA] text-white opacity-70"
                        : "bg-[#492775] text-white hover:bg-[#3a1f5d]"
                    }`}
                  >
                    {isSent ? t("share.sent") : sending === contact._id ? "..." : t("share.send")}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="h-[1px] w-full bg-gray-100 dark:bg-[#2A2438] mb-6"></div>

        <div className="flex justify-center gap-8 mb-8">
          {shareLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a key={link.name} href={link.href} className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${link.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs text-[#1E1E40] dark:text-[#D0C9E8] font-medium">{link.name}</span>
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2A2438] rounded-2xl border border-gray-100 dark:border-gray-800">
          <input 
            type="text" 
            value={url} 
            readOnly 
            className="flex-1 bg-transparent outline-none text-sm text-gray-500 dark:text-[#A395DA] truncate pl-2"
          />
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#492775] text-white transition-colors hover:bg-[#3a1f5d] shrink-0 cursor-pointer"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}