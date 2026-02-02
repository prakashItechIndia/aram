import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onShow2FA: () => void;
}

export function Login({ onLogin, onShow2FA }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await onLogin(email, password);
      if (result.success) {
        // Parent re-renders with isAuthenticated; no 2FA for now
        return;
      }
      setError(result.error ?? 'Login failed');
      // If backend later returns requires2FA, call onShow2FA() here
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
      <Card className="w-full max-w-[480px]">
        <div className="text-center mb-[32px]">
          <div className="w-16 h-16 bg-[#F36A4F] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
            Aram Foundation
          </h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Admin Portal Login
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-[20px]">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@aram.org"
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          
          {error && (
            <p className="text-[14px] text-red-600 bg-red-50 p-2 rounded" role="alert">
              {error}
            </p>
          )}
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="text-[14px] leading-[20px] text-[#F36A4F] hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>
        
        <div className="mt-[24px] pt-[24px] border-t border-[#DBDBDB] text-center">
          <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
            Secure login protected by 2FA
          </p>
        </div>
      </Card>
    </div>
  );
}

interface TwoFactorAuthProps {
  onVerify: (code: string) => void;
  onResend: () => void;
}

export function TwoFactorAuth({ onVerify, onResend }: TwoFactorAuthProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
      
      // Auto-submit when all filled
      if (newCode.every((digit) => digit) && index === 5) {
        handleVerify(newCode.join(''));
      }
    }
  };
  
  const handleVerify = async (fullCode: string) => {
    setLoading(true);
    setTimeout(() => {
      onVerify(fullCode);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
      <Card className="w-full max-w-[480px]">
        <div className="text-center mb-[32px]">
          <div className="w-16 h-16 bg-[#F36A4F] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔐</span>
          </div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        
        <div className="space-y-[24px]">
          <div className="flex gap-[12px] justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="w-[56px] h-[56px] text-center text-[24px] font-bold bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
              />
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={onResend}
              className="text-[14px] leading-[20px] text-[#F36A4F] hover:underline"
            >
              Resend code
            </button>
          </div>
          
          <Button
            fullWidth
            onClick={() => handleVerify(code.join(''))}
            disabled={!code.every((digit) => digit)}
            loading={loading}
          >
            Verify & Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
