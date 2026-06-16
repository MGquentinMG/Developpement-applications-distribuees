import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
  icon?: ReactNode;
}

export function SubmitButton({ 
  children, 
  isLoading = false, 
  variant = 'primary', 
  icon,
  ...props 
}: SubmitButtonProps) {
  const baseStyle = "w-full flex items-center justify-center gap-3 font-medium rounded-full text-sm px-5 py-3 transition-colors focus:outline-none";
  
  const variantStyle = variant === 'primary' 
    ? "text-white bg-[#A098E5] hover:bg-[#8A82D0]" 
    : "text-gray-700 bg-[#F4F4F5] hover:bg-[#E4E4E7]";

  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span>Chargement...</span>
      ) : (
        <>
          {icon && <span className="flex items-center justify-center w-5 h-5">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}