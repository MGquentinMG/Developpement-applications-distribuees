"use client";

import { useTranslation } from "react-i18next";
import { SubmitButtonProps } from "../../types/AuthType";
import "../../i18n";

export function SubmitButton({ children, isLoading = false, variant = "primary", icon, ...props }: SubmitButtonProps) {
  const { t } = useTranslation();
  const baseStyle = "w-full flex items-center justify-center gap-3 font-medium rounded-full text-sm px-5 py-3 transition-colors focus:outline-none cursor-pointer";
  
  const variantStyle = variant === "primary" 
    ? "text-white bg-[#A098E5] dark:bg-[#492775] hover:bg-[#8A82D0] dark:hover:bg-[#3a1f5d]" 
    : "text-gray-700 dark:text-[#F9F9FB] bg-[#F4F4F5] dark:bg-[#2A2438] hover:bg-[#E4E4E7] dark:hover:bg-[#3A304D]";

  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span>{t("auth.loading")}</span>
      ) : (
        <>
          {icon && <span className="flex items-center justify-center w-5 h-5">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
