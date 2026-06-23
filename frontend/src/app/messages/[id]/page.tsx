"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import "../../../i18n";
import MessageBubble from "../../../components/MessageBubble/MessageBubble";
import MessageInput from "../../../components/MessageInput/MessageInput";
import ConversationHeader from "../../../components/ConversationHeader/ConversationHeader";
import { MessageBubbleProps } from "../../../types/MessageType";
import { api } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

interface ApiMessage {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

interface ApiUser {
  _id: string;
  username: string;
  avatar?: string;
}

export default function ConversationPage() {
  const { t } = useTranslation();
  const params = useParams();
  const recipientId = params?.id as string;
  const { user } = useAuth();

  const [recipient, setRecipient] = useState<ApiUser | null>(null);
  const [chat, setChat] = useState<MessageBubbleProps[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!recipientId) return;
    api.get<ApiUser>(`/api/users/${recipientId}`).then(setRecipient).catch(() => {});
  }, [recipientId]);

  useEffect(() => {
    if (!recipientId || !user) return;
    api
      .get<ApiMessage[]>(`/api/messages/${recipientId}`)
      .then((data) => {
        const messages = Array.isArray(data) ? data : [];
        setChat(
          messages.reverse().map((m) => ({
            content: m.content,
            isSelf: m.sender === user._id,
            author: m.sender !== user._id ? recipient?.username : undefined,
            isImage: !!m.imageUrl,
            imageUrl: m.imageUrl,
          }))
        );
      })
      .catch(() => {});
  }, [recipientId, user, recipient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = async () => {
    if (!inputText.trim() || !recipientId || sending) return;
    const text = inputText.trim();
    setInputText("");
    setSending(true);
    setChat((prev) => [...prev, { content: text, isSelf: true }]);
    try {
      await api.post("/api/messages", { recipientId, content: text });
    } catch {
      setChat((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = async (file: File) => {
    if (!recipientId || sending) return;
    setSending(true);
    const tempUrl = URL.createObjectURL(file);
    setChat((prev) => [...prev, { content: "", isSelf: true, isImage: true, imageUrl: tempUrl }]);
    try {
      const permanentUrl = await api.uploadImage(file);
      await api.post("/api/messages", { recipientId, imageUrl: permanentUrl });
      setChat((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, imageUrl: permanentUrl } : m
        )
      );
    } catch {
      setChat((prev) => prev.slice(0, -1));
    } finally {
      URL.revokeObjectURL(tempUrl);
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-[#121212] flex flex-col transition-colors duration-300 relative">
      <ConversationHeader
        title={recipient ? `@${recipient.username}` : "..."}
        status=""
        avatarUrl={recipient?.avatar}
      />

      <div className="flex-1 px-4 pt-6 overflow-y-auto pb-32">
        <div className="flex justify-center mb-6">
          <span className="bg-gray-100 dark:bg-[#1A1A2E] text-gray-500 dark:text-gray-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">
            {t("messages.today", "Aujourd'hui")}
          </span>
        </div>

        {chat.map((msg, idx) => (
          <MessageBubble
            key={idx}
            content={msg.content}
            isSelf={msg.isSelf}
            isImage={msg.isImage}
            imageUrl={msg.imageUrl}
            author={msg.author}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        value={inputText}
        onChange={setInputText}
        onSend={handleSend}
        onImageSelect={handleImageSelect}
        placeholder={t("messages.inputPlaceholder")}
      />
    </main>
  );
}
