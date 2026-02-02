import React, { useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { validateForm as globalValidateForm, validationRules, validationMessages } from '../../utils/validations';

interface SignInProps {
  onSignIn: (email: string, password: string) => void | Promise<void>;
  onCreateAccount: () => void;
  onBack: () => void;
}

export function SignIn({ onSignIn, onCreateAccount, onBack }: SignInProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const formData = {
      emailOrPhone: emailOrPhone.trim(),
      password,
    };

    const fieldRules = {
      emailOrPhone: validationRules.emailOrPhone,
      password: validationRules.password,
    };

    const fieldMessages = {
      emailOrPhone: validationMessages.emailOrPhone,
      password: validationMessages.password,
    };

    const newErrors = globalValidateForm(formData, fieldRules, fieldMessages);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await onSignIn(emailOrPhone.trim(), password);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-[24px]">
      <AramCard className="w-full max-w-[520px]">
        <div className="flex flex-col gap-[24px]">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-[8px] text-[#6E6E6E] hover:text-[#3D3D3D] transition-colors w-fit"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="text-center">
            <h1>Sign In</h1>
            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
              Welcome back! Sign in to continue
            </p>
          </div>

          <div className="flex flex-col gap-[16px]">
            <AramInput
              label="Email or Phone"
              placeholder="Enter your email or phone"
              value={emailOrPhone}
              onChange={setEmailOrPhone}
              required
              error={errors.emailOrPhone}
            />

            <div className="relative">
              <AramInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                required
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[14px] top-[38px]"
              >
                {showPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
              </button>
            </div>

            <div className="text-right">
              <button style={{ fontSize: '14px', lineHeight: '20px', color: '#F36A4F' }}>
                Forgot password?
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <AramButton onClick={handleSubmit} variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </AramButton>
            <div className="text-center">
              <button
                onClick={onCreateAccount}
                style={{ fontSize: '14px', lineHeight: '20px', color: '#F36A4F' }}
              >
                Don't have an account? Create one
              </button>
            </div>
          </div>
        </div>
      </AramCard>
    </div>
  );
}