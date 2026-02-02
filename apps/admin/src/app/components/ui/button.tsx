import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', loading = false, fullWidth = false, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'h-[44px] px-[18px] inline-flex items-center justify-center gap-2 text-[14px] leading-[20px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'bg-[#F36A4F] text-white hover:bg-[#D7563D] rounded-[999px]',
      secondary: 'bg-white text-[#3D3D3D] border border-[#DBDBDB] hover:bg-[#F3F3F3] rounded-[999px]',
      outline: 'bg-transparent text-[#3D3D3D] border border-[#DBDBDB] hover:bg-[#F3F3F3] rounded-[999px]',
      ghost: 'bg-transparent text-[#3D3D3D] hover:bg-[#F3F3F3] rounded-[999px]',
      danger: 'bg-[#0D0D0D] text-white hover:bg-[#3D3D3D] rounded-[999px]',
    };
    
    const widthStyles = fullWidth ? 'w-full' : '';
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
