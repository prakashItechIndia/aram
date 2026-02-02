import { HTMLAttributes, forwardRef } from 'react';

export type BadgeVariant = 'created' | 'processing' | 'success' | 'failed' | 'refunded' | 'disputed';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'created', className = '', ...props }, ref) => {
    const variantStyles: Record<BadgeVariant, string> = {
      created: 'bg-[#FEF1EE] text-[#F36A4F] border border-[#FCD9D3]',
      processing: 'bg-[#FEF1EE] text-[#F36A4F] border border-[#FCD9D3]',
      success: 'bg-[#F1EEED] text-[#734F48] border border-[#E3DCDA]',
      failed: 'bg-[#F3F3F3] text-[#6E6E6E] border border-[#DBDBDB]',
      refunded: 'bg-[#FEF7F6] text-[#FF8870] border border-[#FCD9D3]',
      disputed: 'bg-[#F3F3F3] text-[#3D3D3D] border border-[#DBDBDB]',
    };
    
    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-[12px] py-[4px] text-[13px] leading-[18px] font-medium rounded-[999px] ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
