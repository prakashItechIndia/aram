import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useApi } from '@/app/context/ApiContext';
import { toast } from 'sonner';

export function OtpScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sendOtp, verifyOtp, enableAccount } = useApi();

    // Get phone number from navigation state
    const phoneNumber = location.state?.phone || '';

    // Redirect if no phone number
    useEffect(() => {
        if (!phoneNumber) {
            navigate('/signin');
        }
    }, [phoneNumber, navigate]);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const hashedPhone = phoneNumber.length >= 10
        ? `+91 ******${phoneNumber.slice(-4)}`
        : phoneNumber;

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

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

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(data)) return;

        const newDigits = [...otpDigits];
        data.split('').forEach((char, i) => {
            if (i < 6) newDigits[i] = char;
        });
        setOtpDigits(newDigits);
        inputRefs.current[Math.min(data.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const fullOtp = otpDigits.join('');
        if (fullOtp.length < 6) return;
        setIsLoading(true);
        try {
            const res = await verifyOtp(phoneNumber, fullOtp);
            if (res.success) {
                toast.success('Logged in successfully');
                navigate('/dashboard');
            } else {
                if (res.error?.toLowerCase().includes('disabled')) {
                    toast('Your account is disabled', {
                        description: 'Click Okay to enable your account and continue',
                        action: {
                            label: 'Okay',
                            onClick: () => handleReenableAccount(),
                        },
                        cancel: {
                            label: 'Cancel',
                            onClick: () => { },
                        },
                    });
                } else {
                    toast.error(res.error || 'Verification failed');
                }
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Verification failed';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReenableAccount = async () => {
        try {
            const res = await enableAccount(phoneNumber);
            if (res.success) {
                toast.success('Account enabled successfully! Verifying again...');
                // Try verifying again
                handleVerify();
            } else {
                toast.error(res.error || 'Failed to enable account');
            }
        } catch (err: any) {
            toast.error(err.message || 'An unexpected error occurred');
        } finally {
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        const res = await sendOtp(phoneNumber);
        if (res.success) {
            toast.success('OTP resent successfully');
            setResendTimer(30);
        } else {
            toast.error(res.error || 'Failed to resend OTP');
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-[24px]">
            <AramCard className="w-full max-w-[520px]">
                <div className="flex flex-col gap-[24px]">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-[8px] text-[#6E6E6E] hover:text-[#3D3D3D] transition-colors w-fit"
                        style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="text-center">
                        <h1 className="text-[24px] font-bold">Verification</h1>
                        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
                            Enter the 6-digit OTP sent to
                        </p>
                        <div className="flex items-center justify-center gap-[8px] mt-[4px]">
                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#3D3D3D' }}>{hashedPhone}</span>
                            <button
                                onClick={() => navigate('/signin')}
                                className="p-[4px] hover:bg-gray-100 rounded-full transition-colors"
                                title="Edit Phone Number"
                            >
                                <Pencil size={14} color="#F36A4F" />
                            </button>
                        </div>
                    </div>

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
                                onPaste={i === 0 ? handlePaste : undefined}
                                className="w-[50px] h-[60px] text-center text-[24px] font-bold border-2 border-[#E0E0E0] rounded-[8px] focus:border-[#F36A4F] focus:outline-none transition-colors"
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-[12px]">
                        <AramButton onClick={handleVerify} variant="primary" className="w-full" disabled={isLoading || otpDigits.join('').length < 6}>
                            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
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
            </AramCard>
        </div>
    );
}
