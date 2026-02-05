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
  const { login, sendOtp, isAuthenticated, enableAccount } = useApi();
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



  // Dynamic state for scenarios
  const isScenario1 = !mobileRequired;
  const isScenario2 = mobileRequired && !otpVerification;
  const isScenario3 = mobileRequired && otpVerification;

  // Dynamic Label and Placeholder
  const loginLabel = isScenario1 ? "Email" : "Phone Number";
  const loginPlaceholder = isScenario1 ? "Email" : "Phone Number";

  const handleSubmit = async () => {
    const trimmedInput = emailOrPhone.trim();

    if (isScenario3) {
      // Scenario 3: Phone + OTP
      if (!/^\d+$/.test(trimmedInput) || trimmedInput.length !== 10) {
        setErrors({ emailOrPhone: 'Please enter a valid 10-digit phone number' });
        return;
      }

      setIsLoading(true);
      try {
        const res = await sendOtp(trimmedInput);
        if (res.success) {
          toast.success('OTP sent successfully');
          navigate('/verify-otp', { state: { phone: trimmedInput } });
        } else {
          toast.error(res.error || 'Failed to send OTP');
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Scenario 1 & 2: Email/Password or Phone/Password
    const formData = {
      emailOrPhone: trimmedInput,
      password,
    };

    const fieldRules: any = {
      password: validationRules.password,
    };

    const fieldMessages: any = {
      password: validationMessages.password,
    };

    if (isScenario2) {
      // Scenario 2 validation: Phone number numeric <= 10
      if (!/^\d+$/.test(trimmedInput) || trimmedInput.length > 10 || trimmedInput.length === 0) {
        setErrors({ emailOrPhone: 'Please enter a valid phone number (up to 10 digits)' });
        return;
      }
    } else {
      // Scenario 1 validation: Email
      fieldRules.emailOrPhone = validationRules.email;
      fieldMessages.emailOrPhone = validationMessages.email;
    }

    const newErrors = globalValidateForm(formData, fieldRules, fieldMessages);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const result = await login(trimmedInput, password);
        if (result.success) {
          toast.success('Logged in successfully');
          navigate('/donate');
        } else {
          if (result.error?.toLowerCase().includes('disabled')) {
            toast('Your account is disabled', {
              description: 'Click Okay to enable your account',
              action: {
                label: 'Okay',
                onClick: async () => {
                  const res = await enableAccount(trimmedInput);
                  if (res.success) {
                    toast.success('Account enabled successfully! Please sign in again.');
                    handleSubmit();
                  } else {
                    toast.error(res.error || 'Failed to enable account');
                  }
                },
              },
              cancel: {
                label: 'Cancel',
                onClick: () => {
                  toast.error('You cannot login while account is disabled');
                }
              }
            });
          } else {
            toast.error(result.error ?? 'Sign in failed');
          }
        }
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Sign in failed';
        toast.error(errorMsg);
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
              onChange={(val) => {
                // If phone scenario (2 or 3), only allow numeric input and up to 10 chars
                if (!isScenario1) {
                  if (/^\d*$/.test(val) && val.length <= 10) {
                    setEmailOrPhone(val);
                  }
                } else {
                  setEmailOrPhone(val);
                }
              }}
              required
              error={errors.emailOrPhone}
            />

            {!isScenario3 && (
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
            )}

            {!isScenario3 && (
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
              {isLoading ? (isScenario3 ? 'Sending...' : 'Signing in...') : (isScenario3 ? 'Get OTP' : 'Sign in')}
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