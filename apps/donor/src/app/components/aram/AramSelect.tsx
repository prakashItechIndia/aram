import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AramSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function AramSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  className = ''
}: AramSelectProps) {
  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      {label && (
        <label style={{ fontSize: '13px', lineHeight: '18px', fontWeight: 500, color: '#6E6E6E' }}>
          {label}
          {required && <span className="text-[#F36A4F]"> *</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`h-[44px] w-full px-[14px] py-[12px] rounded-[16px] border ${
            error ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
            
          } bg-white focus:outline-none focus:border-[#F36A4F] appearance-none pr-[40px] disabled:bg-[#F3F3F3] disabled:cursor-not-allowed`}
          style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400, color: '#3D3D3D' }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none" size={18} color="#6E6E6E" />
      </div>
      {error && (
        <span style={{ fontSize: '13px', lineHeight: '18px', color: '#F36A4F' }}>
          {error}
        </span>
      )}
    </div>
  );
}
