import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ResetPasswordProps {
  token: string;
  onSubmit: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  onBack: () => void;
}

export function ResetPassword({ token, onSubmit, onBack }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await onSubmit(token, password);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? 'Reset failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
        <Card className="w-full max-w-[480px]">
          <div className="text-center mb-[32px]">
            <div className="w-16 h-16 bg-[#22c55e] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">✓</span>
            </div>
            <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
              Password reset
            </h1>
            <p className="text-[16px] leading-[24px] text-[#6E6E6E] mb-4">
              Your password has been updated. You can sign in with your new password.
            </p>
          </div>
          <Button type="button" fullWidth onClick={onBack}>
            Back to login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
      <Card className="w-full max-w-[480px]">
        <div className="text-center mb-[32px]">
          <div className="w-16 h-16 bg-[#F36A4F] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
            Set new password
          </h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Enter your new password (at least 6 characters).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[20px]">
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
          {error && (
            <p className="text-[14px] text-red-600 bg-red-50 p-2 rounded" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="outline" fullWidth onClick={onBack}>
              Back
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              Reset password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
