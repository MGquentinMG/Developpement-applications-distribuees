"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import { MessageBubbleProps } from "../../types/MessageType";
import { renderContentWithHashtags } from "../../utils/TextUtil";
import { X } from "lucide-react";

export default function MessageBubble({ content, isSelf, avatarUrl, isImage, imageUrl, author = "user" }: MessageBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isImage && imageUrl) {
    return (
      <>
        <div className={`flex w-full mb-6 ${isSelf ? "justify-end" : "justify-start"}`}>
          {!isSelf && (
            <Link href={`/profile/${author}`} className="shrink-0 flex items-end mr-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8">
                <Avatar src={avatarUrl} alt={author} />
              </div>
            </Link>
          )}
          <div 
            onClick={() => setIsOpen(true)}
            className={`relative max-w-[70%] rounded-3xl overflow-hidden shadow-sm transition-all duration-300 cursor-pointer hover:opacity-90 ${isSelf ? "rounded-br-sm" : "rounded-bl-sm"}`}
          >
            <img src={imageUrl} alt="Shared visual" className="w-full h-auto object-cover max-h-64 bg-gray-100 dark:bg-[#1A1A2E]" />
          </div>
        </div>

        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full cursor-pointer"
            >
              <X size={24} />
            </button>
            <img 
              src={imageUrl} 
              alt="Full screen visual" 
              className="max-w-full max-h-full object-contain rounded-xl select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`flex w-full mb-6 ${isSelf ? "justify-end" : "justify-start"}`}>
      {!isSelf && (
        <Link href={`/profile/${author}`} className="shrink-0 flex items-end mr-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8">
            <Avatar src={avatarUrl} alt={author} />
          </div>
        </Link>
      )}
      
      <div
        className={`max-w-[75%] min-w-0 px-5 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300 ${
          isSelf
            ? "bg-[#492775] dark:bg-[#6B5B8B] text-white rounded-3xl rounded-br-sm"
            : "bg-[#F3F0FF] dark:bg-[#2A2438] text-[#1E1E40] dark:text-[#EAE5F3] rounded-3xl rounded-bl-sm"
        }`}
      >
        <p className="text-[14px] leading-relaxed break-all">
          {renderContentWithHashtags(content)}
        </p>
      </div>
    </div>
  );
}