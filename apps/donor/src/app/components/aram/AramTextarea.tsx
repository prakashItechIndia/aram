

interface AramTextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  rows?: number;
  className?: string;
  maxLength?: number;
}

export function AramTextarea({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  helperText,
  rows = 4,
  className = '',
  maxLength
}: AramTextareaProps) {
  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      {label && (
        <label style={{ fontSize: '13px', lineHeight: '18px', fontWeight: 500, color: '#6E6E6E' }}>
          {label}
          {required && <span className="text-[#F36A4F]"> *</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`min-h-[100px] px-[14px] py-[12px] rounded-[16px] border ${error ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
          } bg-white focus:outline-none focus:border-[#F36A4F] resize-y`}
        style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400, color: '#3D3D3D' }}
      />
      {error && (
        <span style={{ fontSize: '13px', lineHeight: '18px', color: '#F36A4F' }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
