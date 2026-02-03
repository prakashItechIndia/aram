import { useState, useEffect } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { validateForm as globalValidateForm, validationRules, validationMessages } from '../../utils/validations';

interface SignInProps {
  onSignIn: (email: string, password: string) => void | Promise<void>;
  onGetOtp: (phone: string) => void;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
  initialEmailOrPhone?: string;
}

export function SignIn({ onSignIn, onGetOtp, onCreateAccount, onForgotPassword, onBack, initialEmailOrPhone = '' }: SignInProps) {
  const [emailOrPhone, setEmailOrPhone] = useState(initialEmailOrPhone);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const trimmed = emailOrPhone.trim();
    // 10 purely numeric characters = mobile number
    const isPhone = /^\d{10}$/.test(trimmed);
    setIsMobile(isPhone);

    // Clear password if switching to mobile
    if (isPhone) {
      setPassword('');
    }
  }, [emailOrPhone]);

  const handleSubmit = async () => {
    if (isMobile) {
      onGetOtp(emailOrPhone.trim());
      return;
    }

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
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-[24px]">
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
                required={!isMobile}
                error={errors.password}
                disabled={isMobile}
              />
              {!isMobile && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-[38px]"
                >
                  {showPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
                </button>
              )}
            </div>

            {!isMobile && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  style={{ fontSize: '14px', lineHeight: '20px', color: '#F36A4F' }}
                  className="hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[12px]">
            <AramButton onClick={handleSubmit} variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? (isMobile ? 'Sending...' : 'Signing in...') : (isMobile ? 'Get OTP' : 'Sign in')}
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