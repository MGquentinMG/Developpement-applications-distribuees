import { useRef } from "react";

export function useMessageInput(value: string, onSend: () => void, onImageSelect?: (file: File) => void) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSend();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageSelect) {
      onImageSelect(e.target.files[0]);
    }
  };

  return {
    fileInputRef,
    handleKeyPress,
    handleImageClick,
    handleFileChange
  };
}