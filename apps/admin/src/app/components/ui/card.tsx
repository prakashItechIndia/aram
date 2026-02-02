import { HTMLAttributes, forwardRef, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, noPadding = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white border border-[#DBDBDB] rounded-[16px] ${
          noPadding ? '' : 'p-[24px]'
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`mb-[16px] ${className}`} {...props}>
        <div className="flex items-start justify-between">
          <div>
            {title && <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">{title}</h3>}
            {subtitle && <p className="text-[14px] leading-[20px] text-[#6E6E6E] mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';
