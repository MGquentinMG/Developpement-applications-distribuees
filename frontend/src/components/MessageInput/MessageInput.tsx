"use client";

import { Image as ImageIcon, Send } from "lucide-react";
import { MessageInputProps } from "../../types/MessageType";
import { useMessageInput } from "../../hooks/useMessageInput";

export default function MessageInput({ value, onChange, onSend, placeholder, onImageSelect }: MessageInputProps) {
  const { fileInputRef, handleKeyPress, handleImageClick, handleFileChange } = useMessageInput(value, onSend, onImageSelect);

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 pb-6 px-4 pt-4 bg-[#FDFDFD] dark:bg-[#121212] transition-colors duration-300">
      <div className="flex items-center gap-3 bg-[#F3F0FF] dark:bg-[#1A1A2E] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-none rounded-full px-5 py-3.5 transition-colors duration-300 border border-white dark:border-[#2A2438]">
        <input
          id="message-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[#1E1E40] dark:text-[#F9F9FB] placeholder-[#8B7BB5] dark:placeholder-[#6B5B8B] text-[15px] transition-colors duration-300"
        />
        
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          data-testid="file-input"
        />

        <div className="flex items-center gap-3 pl-2 border-l border-[#D0C9E8] dark:border-[#2A2438] transition-colors duration-300">
          {!value.trim() ? (
            <button 
              onClick={handleImageClick}
              className="text-[#8B7BB5] dark:text-[#A395DA] hover:text-[#492775] dark:hover:text-[#D0C9E8] transition-colors duration-300 cursor-pointer"
            >
              <ImageIcon size={22} strokeWidth={2.5} />
            </button>
          ) : (
            <button 
              onClick={onSend}
              className="bg-[#492775] dark:bg-[#A395DA] text-white dark:text-[#1E1E40] p-1.5 rounded-full hover:bg-[#3a1f5d] dark:hover:bg-[#C4B5E8] transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <Send size={16} strokeWidth={2.5} className="ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}