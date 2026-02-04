import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { label, error, helperText, className = '', ...rest } = props;
    const { type, min, onChange, ...inputProps } = rest as any;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[6px]">
            {label}
            {required && <span className="text-[#F36A4F] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          min={type === 'number' ? (min ?? '0') : min}
          onChange={(e) => {
            if (type === 'number' && e.target.value !== '' && parseFloat(e.target.value) < 0) return;
            onChange?.(e);
          }}
          className={`w-full h-[44px] px-[14px] py-[12px] text-[16px] leading-[24px] bg-white border ${error ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
            } rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 disabled:bg-[#F3F3F3] disabled:cursor-not-allowed ${className}`}
          {...inputProps}
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

Input.displayName = 'Input';
