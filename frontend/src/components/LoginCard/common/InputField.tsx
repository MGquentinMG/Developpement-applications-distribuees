import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function InputField({ error, ...props }: InputFieldProps) {
  return (
    <div className="w-full">
      <input
        className={`w-full bg-[#F4F4F5] text-gray-900 text-sm rounded-lg block p-3 outline-none transition-colors focus:ring-2 focus:ring-[#A098E5] ${
          error ? 'border border-red-500' : 'border border-transparent'
        }`}
        {...props}
      />
    </div>
  );
}