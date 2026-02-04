import React from 'react';

interface AramButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export function AramButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = ''
}: AramButtonProps) {
  const baseStyles = 'h-[44px] px-[18px] rounded-[999px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#F36A4F] hover:bg-[#D7563D] text-white',
    secondary: 'border border-[#DBDBDB] bg-white text-[#3D3D3D] hover:bg-[#F3F3F3]',
    ghost: 'bg-transparent text-[#3D3D3D] hover:bg-[#F3F3F3]',
    danger: 'bg-[#0D0D0D] hover:bg-[#3D3D3D] text-white'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 600 }}
    >
      {children}
    </button>
  );
}
