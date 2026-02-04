import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { Eye, EyeOff } from 'lucide-react';
import { useApi } from '@/app/context/ApiContext';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useApi();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validatePassword = (pwd: string) => {
    // 8+ chars, uppercase, number, special char
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      setError('Password must be 8+ chars, contain uppercase, number, and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await resetPassword(token, password);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
        <AramCard className="w-full max-w-[480px]">
          <div className="text-center mb-[32px]">
            <div className="w-16 h-16 bg-[#F36A4F] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">✓</span>
            </div>
            <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
              Password Reset
            </h1>
            <p className="text-[16px] leading-[24px] text-[#6E6E6E] mb-4">
              Your password has been successfully reset.
            </p>
          </div>
          <AramButton type="button" className="w-full" variant="primary" onClick={() => navigate('/signin')}>
            Go to Login
          </AramButton>
        </AramCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
      <AramCard className="w-full max-w-[480px]">
        <div className="text-center mb-[32px]">
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
            Set New Password
          </h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Please enter your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[24px]">
          <div className="relative">
            <AramInput
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={password}
              onChange={setPassword}
              required
              error={undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[14px] top-[38px]"
            >
              {showPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
            </button>
          </div>

          <div className="relative">
            <AramInput
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              error={undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-[14px] top-[38px]"
            >
              {showConfirmPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
            </button>
          </div>

          {error && (
            <div className="p-[16px] bg-red-50 border border-red-200 rounded-[16px] text-red-700 text-sm">
              {error}
            </div>
          )}

          <AramButton type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Resetting...' : 'Reset Password'}
          </AramButton>
        </form>
      </AramCard>
    </div>
  );
}
