import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AramButton } from '../aram/AramButton';
import { AramCard } from '../aram/AramCard';
import { AramInput } from '../aram/AramInput';
import { ArrowLeft } from 'lucide-react';
import { validateField, sanitizeInput, validationRules, validationMessages } from '../../utils/validations';
import { useApi } from '@/app/context/ApiContext';

export function ForgotPassword() {
    const navigate = useNavigate();
    const { forgotPassword } = useApi();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [resetLink, setResetLink] = useState<string | undefined>();

    const handleEmailChange = (value: string) => {
        const sanitized = sanitizeInput.email(value);
        setEmail(sanitized);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        const emailError = validateField(email, validationRules.email, validationMessages.email);
        if (emailError) {
            setError(emailError);
            return;
        }

        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setSent(true);
                toast.success('Reset link sent to your email!');
                // Note: resetLink is usually not returned in prod for security, removing dev link logic or checking if api returns it
                if ((result as any).resetLink) setResetLink((result as any).resetLink);
            } else {
                toast.error(result.error ?? 'Request failed');
            }
        } catch (err) {
            toast.error('An error occurred. Please try again.');
        } finally {
            // No loading state to reset
        }
    };

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
                    onClick={() => navigate('/signin')}
                    className="flex items-center gap-2 text-[#6E6E6E] hover:text-[#0D0D0D] mb-[32px] transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Back</span>
                </button>

                <div className="text-center mb-[32px]">
                    <div className="w-16 h-16 bg-[#F36A4F] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">A</span>
                    </div>
                    <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
                        Forgot password
                    </h1>
                    <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
                        Enter your email and we'll send a reset link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-[24px]" noValidate>
                    <AramInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        required
                    />

                    <div className="flex flex-col gap-3">
                        <AramButton type="submit" className="w-full">
                            Send reset link
                        </AramButton>
                        <AramButton type="button" variant="secondary" className="w-full" onClick={onBack}>
                            Cancel
                        </AramButton>
                    </div>
                </form>
            </AramCard>
        </div>
    );
}
