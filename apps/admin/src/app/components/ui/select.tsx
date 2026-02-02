import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full relative">
        {label && (
          <label className="block text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[6px]">
            {label}
            {props.required && <span className="text-[#F36A4F] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full h-[44px] px-[14px] py-[12px] text-[16px] leading-[24px] bg-white border ${
              error ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
            } rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 disabled:bg-[#F3F3F3] disabled:cursor-not-allowed appearance-none pr-[40px] ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E] pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1 text-[13px] leading-[18px] text-[#F36A4F]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
