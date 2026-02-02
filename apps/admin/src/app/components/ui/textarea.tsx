import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[6px]">
            {label}
            {props.required && <span className="text-[#F36A4F] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full min-h-[100px] px-[14px] py-[12px] text-[16px] leading-[24px] bg-white border ${
            error ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
          } rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 disabled:bg-[#F3F3F3] disabled:cursor-not-allowed resize-none ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[13px] leading-[18px] text-[#F36A4F]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-[13px] leading-[18px] text-[#6E6E6E]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
