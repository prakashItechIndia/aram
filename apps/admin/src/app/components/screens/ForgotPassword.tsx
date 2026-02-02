import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ForgotPasswordProps {
  onSubmit: (email: string) => Promise<{ success: boolean; error?: string; resetLink?: string }>;
  onBack: () => void;
}

export function ForgotPassword({ onSubmit, onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await onSubmit(email);
      if (result.success) {
        setSent(true);
        if (result.resetLink) setResetLink(result.resetLink);
      } else {
        setError(result.error ?? 'Request failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4">
        <Card className="w-full max-w-[480px]">
          <div className="text-center mb-[32px]">
            <div className="w-16 h-16 bg-[#F36A4F] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">✓</span>
            </div>
            <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-2">
              Check your email
            </h1>
            <p className="text-[16px] leading-[24px] text-[#6E6E6E] mb-4">
              If an admin account exists for that email, we&apos;ve sent a password reset link.
            </p>
            {resetLink && (
              <p className="text-[14px] text-left bg-[#F9F9F9] p-3 rounded border border-[#DBDBDB] break-all">
                <strong>Dev reset link:</strong>{' '}
                <a href={resetLink} className="text-[#F36A4F] hover:underline">
                  {resetLink}
                </a>
              </p>
            )}
          </div>
          <Button type="button" fullWidth variant="outline" onClick={onBack}>
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
            Forgot password
          </h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Enter your admin email and we&apos;ll send a reset link.
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
              Send reset link
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
