import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:bg-slate-800/70 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
