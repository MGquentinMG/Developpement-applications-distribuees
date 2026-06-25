"use client";

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  
  return (
    <p className="text-red-500 text-xs font-medium mt-1 animate-pulse">
      {message}
    </p>
  );
}