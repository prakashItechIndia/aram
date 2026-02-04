import React from 'react';

interface AramCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function AramCard({ children, className = '', noPadding = false }: AramCardProps) {
  return (
    <div
      className={`bg-white rounded-[16px] border border-[#DBDBDB] ${noPadding ? '' : 'p-[24px]'} ${className}`}
    >
      {children}
    </div>
  );
}
