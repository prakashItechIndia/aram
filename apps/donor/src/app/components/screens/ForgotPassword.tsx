import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AramButton } from '../aram/AramButton';
import { AramCard } from '../aram/AramCard';
import { AramInput } from '../aram/AramInput';
import { ArrowLeft, Pencil } from 'lucide-react';
import { validateField, validationRules, validationMessages } from '../../utils/validations';
import { useApi } from '@/app/context/ApiContext';
import { useDonationFormStatus } from '@/app/hooks/useDonationFormStatus';

export function ForgotPassword() {
    const navigate = useNavigate();
    const { forgotPassword, sendOtp, verifyOtp } = useApi();
    const { mobileRequired } = useDonationFormStatus();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [otpMode, setOtpMode] = useState(false);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resetLink, setResetLink] = useState<string | undefined>();
    const [resendTimer, setResendTimer] = useState(30);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (otpMode && resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpMode, resendTimer]);

    const hashedPhone = emailOrPhone.length >= 10
        ? `+91 ******${emailOrPhone.slice(-4)}`
        : emailOrPhone;

    const handleChange = (value: string) => {
        if (mobileRequired) {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setEmailOrPhone(value);
            }
        } else {
            setEmailOrPhone(value);
        }
    };

    const handleDigitChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...otpDigits];
        newDigits[index] = value.slice(-1);
        setOtpDigits(newDigits);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mobileRequired) {
            if (!/^\d+$/.test(emailOrPhone) || emailOrPhone.length > 10 || emailOrPhone.length === 0) {
                setError('Please enter a valid phone number (up to 10 digits)');
                return;
            }
            setIsLoading(true);
            try {
                const res = await sendOtp(emailOrPhone);
                if (res.success) {
                    toast.success('OTP sent successfully to the phone number');
                    setOtpMode(true);
                } else {
                    toast.error(res.error || 'Failed to send OTP');
                }
            } catch (err) {
                toast.error('An error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            const emailError = validateField(emailOrPhone, validationRules.email, validationMessages.email);
            if (emailError) {
                setError(emailError);
                return;
            }
            setIsLoading(true);
            try {
                const result = await forgotPassword(emailOrPhone);
                if (result.success) {
                    setSent(true);
                    toast.success('Link sent successfully');
                    if ((result as any).resetLink) setResetLink((result as any).resetLink);
                } else {
                    toast.error(result.error ?? 'Request failed');
                }
            } catch (err) {
                toast.error('An error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleVerifyOtp = async () => {
        const otp = otpDigits.join('');
        if (otp.length < 6) return;
        setIsLoading(true);
        try {
            const res = await verifyOtp(emailOrPhone, otp, false);
            if (res.success) {
                const token = res.data?.reset_token;
                toast.success('OTP verified successfully');
                navigate(`/reset-password?token=${token}`);
            } else {
                toast.error(res.error || 'Verification failed');
            }
        } catch (err) {
            toast.error('An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        const res = await sendOtp(emailOrPhone);
        if (res.success) {
            toast.success('OTP resent successfully');
            setResendTimer(30);
        } else {
            toast.error(res.error || 'Failed to resend OTP');
        }
    };

    const label = mobileRequired ? "Phone Number" : "Email";
    const placeholder = mobileRequired ? "Phone Number" : "Email";
    const buttonText = mobileRequired ? "Get OTP" : "Send reset link";

    if (sent) {
        return (
            <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
                <AramCard className="w-full max-w-[480px]">
                    <div className="text-center mb-[32px]">
                        <div className="w-16 h-16 bg-[#F36A4F] rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">✓</span>
                        </div>
                        <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
                            Check your email
                        </h1>
                        <p className="text-[16px] leading-[24px] text-[#6E6E6E] mb-4">
                            If an account exists for that email, we've sent a password reset link.
                        </p>
                        {resetLink && (
                            <p className="text-[14px] text-left bg-[#F9F9F9] p-3 rounded border border-[#DBDBDB] break-all">
                                <strong>Dev reset link:</strong>{' '}
                                <a href={resetLink} className="text-[#F36A4F] hover:underline" target="_blank" rel="noopener noreferrer">
                                    {resetLink}
                                </a>
                            </p>
                        )}
                    </div>
                    <AramButton type="button" className="w-full" variant="secondary" onClick={() => navigate('/signin')}>
                        Back to login
                    </AramButton>
                </AramCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
            <AramCard className="w-full max-w-[480px]">
                <button
                    onClick={() => otpMode ? setOtpMode(false) : navigate('/signin')}
                    className="flex items-center gap-2 text-[#6E6E6E] hover:text-[#0D0D0D] mb-[32px] transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Back</span>
                </button>

                <div className="text-center mb-[32px]">
                    <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
                        {otpMode ? 'Verification' : 'Forgot password'}
                    </h1>
                    <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
                        {otpMode
                            ? 'Enter the 6-digit OTP sent to'
                            : `Enter your ${mobileRequired ? 'phone number' : 'email'} and we'll send ${mobileRequired ? 'an OTP' : 'a reset link'}.`
                        }
                    </p>
                    {otpMode && (
                        <div className="flex items-center justify-center gap-[8px] mt-[4px]">
                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#3D3D3D' }}>{hashedPhone}</span>
                            <button
                                onClick={() => setOtpMode(false)}
                                className="p-[4px] hover:bg-gray-100 rounded-full transition-colors"
                                title="Edit Phone Number"
                            >
                                <Pencil size={14} color="#F36A4F" />
                            </button>
                        </div>
                    )}
                </div>

                {!otpMode ? (
                    <form onSubmit={handleSubmit} className="space-y-[24px]" noValidate>
                        <AramInput
                            label={label}
                            value={emailOrPhone}
                            onChange={handleChange}
                            placeholder={placeholder}
                            required
                            error={error || undefined}
                        />

                        <div className="flex flex-col gap-3">
                            <AramButton type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Sending...' : buttonText}
                            </AramButton>
                            <AramButton type="button" variant="secondary" className="w-full" onClick={() => navigate('/signin')}>
                                Cancel
                            </AramButton>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-[24px]">
                        <div className="flex justify-between gap-[8px]">
                            {otpDigits.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleDigitChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    className="w-full max-w-[50px] h-[60px] text-center text-[24px] font-bold border-2 border-[#E0E0E0] rounded-[8px] focus:border-[#F36A4F] focus:outline-none transition-colors"
                                />
                            ))}
                        </div>
                        <div className="flex flex-col gap-[12px]">
                            <AramButton onClick={handleVerifyOtp} variant="primary" className="w-full" disabled={isLoading || otpDigits.join('').length < 6}>
                                {isLoading ? 'Verifying...' : 'Verify & Continue'}
                            </AramButton>
                            <div className="text-center">
                                <button
                                    onClick={handleResend}
                                    disabled={resendTimer > 0}
                                    style={{
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        color: resendTimer > 0 ? '#9E9E9E' : '#F36A4F',
                                        cursor: resendTimer > 0 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive code? Resend"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AramCard>
        </div>
    );
}
