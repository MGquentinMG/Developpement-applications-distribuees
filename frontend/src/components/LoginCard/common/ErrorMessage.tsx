import React from 'react';

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <p className="text-red-500 text-xs font-medium mt-1">
      {message}
    </p>
  );
}