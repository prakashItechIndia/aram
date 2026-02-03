interface AramInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  prefix?: React.ReactNode;
  style?: React.CSSProperties;
  maxLength?: number;
}

export function AramInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  prefix,
  maxLength
}: AramInputProps) {
  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      {label && (
        <label style={{ fontSize: '13px', lineHeight: '18px', fontWeight: 500, color: '#6E6E6E' }}>
          {label}
          {required && <span className="text-[#F36A4F]"> *</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <div
            className="absolute left-[14px] flex items-center h-full z-10"
          >
            {prefix}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`h-[44px] w-full py-[12px] rounded-[16px] border ${error ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
            } bg-white focus:outline-none focus:border-[#F36A4F] disabled:bg-[#F3F3F3] disabled:cursor-not-allowed`}
          style={{
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            color: '#3D3D3D',
            paddingLeft: prefix ? 'var(--prefix-width, 50px)' : '14px'
          }}
        />
      </div>
      {error && (
        <span style={{ fontSize: '12px', lineHeight: '16px', color: '#F36A4F' }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ fontSize: '12px', lineHeight: '16px', color: '#6E6E6E' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
