import { useRef, useCallback } from "react";

export function useMessageInput(value: string, onSend: () => void, onImageSelect?: (file: File) => void) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageSelect) {
      onImageSelect(e.target.files[0]);
      e.target.value = "";
    }
  };

  return {
    fileInputRef,
    textareaRef,
    adjustHeight,
    handleKeyPress,
    handleImageClick,
    handleFileChange,
  };
}
