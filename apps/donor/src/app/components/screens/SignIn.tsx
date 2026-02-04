import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { validateForm as globalValidateForm, validationRules, validationMessages } from '../../utils/validations';
import { useApi } from '@/app/context/ApiContext';
import { useDonationFormStatus } from '@/app/hooks/useDonationFormStatus';

export function SignIn() {
  const navigate = useNavigate();
  const { login, sendOtp, isAuthenticated } = useApi();
  const { otpVerification, mobileRequired } = useDonationFormStatus();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  // isMobile is true if input matches 10 digits
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const trimmed = emailOrPhone.trim();
    // 10 purely numeric characters = mobile number
    const isPhone = /^\d{10}$/.test(trimmed);
    setIsMobile(isPhone);

    // Clear password only if switching to mobile AND OTP is enabled
    if (isPhone && otpVerification) {
      setPassword('');
    }
  }, [emailOrPhone, otpVerification]);

  const handleSubmit = async () => {
    // Only use OTP flow if input is mobile AND OTP verification is enabled
    if (isMobile && otpVerification) {
      setIsLoading(true);
      try {
        const res = await sendOtp(emailOrPhone.trim());
        if (res.success) {
          toast.success('OTP sent successfully');
          navigate('/verify-otp', { state: { phone: emailOrPhone.trim() } });
        } else {
          toast.error(res.error || 'Failed to send OTP');
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Standard Login Flow (Email OR Mobile+Password)
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
        const result = await login(emailOrPhone.trim(), password);
        if (result.success) {
          toast.success('Signed in successfully!');
          navigate('/donate');
        } else {
          toast.error(result.error ?? 'Sign in failed');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Dynamic Label
  // If mobileRequired is true -> "Email or Phone" (or just "Phone" if strictly phone?)
  // User asked: "if disable means email label should come".
  // "if enable mobile number... email or mobile number label"
  const loginLabel = mobileRequired ? "Email or Mobile Number" : "Email Address";
  const loginPlaceholder = mobileRequired ? "Enter your email or mobile number" : "Enter your email address";
  
  // Is password disabled? Only if using Mobile AND OTP is ON.
  const isPasswordDisabled = isMobile && otpVerification;

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-[24px]">
      <AramCard className="w-full max-w-[520px]">
        <div className="flex flex-col gap-[24px]">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
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
              label={loginLabel}
              placeholder={loginPlaceholder}
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
                required={!isPasswordDisabled}
                error={errors.password}
                disabled={isPasswordDisabled}
              />
              {!isPasswordDisabled && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-[38px]"
                >
                  {showPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
                </button>
              )}
            </div>

            {!isPasswordDisabled && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
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
              {isLoading ? (isPasswordDisabled ? 'Sending...' : 'Signing in...') : (isPasswordDisabled ? 'Get OTP' : 'Sign in')}
            </AramButton>
            <div className="text-center">
              <button
                onClick={() => navigate('/create-account')}
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