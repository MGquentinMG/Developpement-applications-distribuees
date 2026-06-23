"use client";

import { Image as ImageIcon, Send, X } from "lucide-react";
import { MessageInputProps } from "../../types/MessageType";
import { useMessageInput } from "../../hooks/useMessageInput";

export default function MessageInput({ value, onChange, onSend, placeholder, disabled, onImageSelect, imagePreview, onRemoveImage }: MessageInputProps) {
  const { fileInputRef, handleKeyPress, handleImageClick, handleFileChange } = useMessageInput(value, onSend, onImageSelect);

  const canSend = !!value.trim() || !!imagePreview;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 pb-6 px-4 pt-4 bg-[#FDFDFD] dark:bg-[#121212] transition-colors duration-300">
      {imagePreview && (
        <div className="relative w-20 h-20 mb-2 ml-1">
          <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover rounded-xl border border-[#D0C9E8] dark:border-[#2A2438]" />
          {onRemoveImage && (
            <button
              onClick={onRemoveImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800/70 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
            >
              <X size={11} strokeWidth={3} />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 bg-[#F3F0FF] dark:bg-[#1A1A2E] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-none rounded-full px-5 py-3.5 transition-colors duration-300 border border-white dark:border-[#2A2438]">
        <input
          id="message-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-[#1E1E40] dark:text-[#F9F9FB] placeholder-[#8B7BB5] dark:placeholder-[#6B5B8B] text-[15px] transition-colors duration-300 disabled:opacity-50"
        />

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          data-testid="file-input"
        />

        <div className="flex items-center gap-2 pl-2 border-l border-[#D0C9E8] dark:border-[#2A2438] transition-colors duration-300">
          <button
            onClick={handleImageClick}
            disabled={disabled}
            className="text-[#8B7BB5] dark:text-[#A395DA] hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ImageIcon size={22} strokeWidth={2.5} />
          </button>
          <button
            onClick={onSend}
            disabled={disabled || !canSend}
            className="bg-[#492775] dark:bg-[#A395DA] text-white dark:text-[#1E1E40] p-1.5 rounded-full hover:bg-[#3a1f5d] dark:hover:bg-[#C4B5E8] transition-colors duration-300 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={16} strokeWidth={2.5} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}