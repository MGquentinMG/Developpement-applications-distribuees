"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../../i18n";
import MessageBubble from "../../../components/MessageBubble/MessageBubble";
import MessageInput from "../../../components/MessageInput/MessageInput";
import ConversationHeader from "../../../components/ConversationHeader/ConversationHeader";
import { MessageBubbleProps } from "../../../types/MessageType";

export default function ConversationPage() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chat, setChat] = useState<MessageBubbleProps[]>([
    { content: "", isSelf: false, isImage: true, imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80", author: "Un pro chien" },
    { content: "Le Chat, plus spécifiquement désigné sous le nom de Chat domestique (Felis catus) est une espèce de mammifères de l'Ordre des Carnivores, de la famille des félins (Félidés).", isSelf: false, author: "Un pro chien" },
    { content: "Le Chien, plus précisément désigné sous le nom de Chien domestique (Canis familiaris ou Canis lupus familiaris), est une espèce de mammifère de la famille des Canidés (Canidae). Il s'agit de la forme domestiquée du loup gris (Canis lupus), laquelle comprend également le dingo, retourné à l'état sauvage.", isSelf: true },
    { content: "", isSelf: true, isImage: true, imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80" },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    setChat([...chat, { content: inputText, isSelf: true }]);
    setInputText("");
  };

  const handleImageSelect = (file: File) => {
    const fakeImageUrl = URL.createObjectURL(file);
    setChat([...chat, { content: "", isSelf: true, isImage: true, imageUrl: fakeImageUrl }]);
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-[#121212] flex flex-col transition-colors duration-300 relative">
      <ConversationHeader title="Un pro chien" status="En ligne" />

      <div className="flex-1 px-4 pt-6 overflow-y-auto pb-32">
        <div className="flex justify-center mb-6">
          <span className="bg-gray-100 dark:bg-[#1A1A2E] text-gray-500 dark:text-gray-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors duration-300">
            Aujourd'hui
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