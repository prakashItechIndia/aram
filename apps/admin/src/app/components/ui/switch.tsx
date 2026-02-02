import { InputHTMLAttributes, forwardRef } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className="w-11 h-6 bg-[#CFCFCF] peer-focus:ring-2 peer-focus:ring-[#F36A4F] peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F36A4F]"></div>
        </label>
        {label && (
          <div className="flex-1">
            <span className="text-[14px] leading-[20px] font-medium text-[#0D0D0D]">{label}</span>
            {helperText && (
              <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-1">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
