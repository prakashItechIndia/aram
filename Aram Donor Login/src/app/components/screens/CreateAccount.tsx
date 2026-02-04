import React, { useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface CreateAccountProps {
  onCreateAccount: (data: any) => void;
  onSignIn: () => void;
  onBack: () => void;
}

export function CreateAccount({ onCreateAccount, onSignIn, onBack }: CreateAccountProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email format is invalid';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(password)) newErrors.password = 'Password must contain uppercase letter';
    else if (!/[0-9]/.test(password)) newErrors.password = 'Password must contain a number';
    else if (!/[!@#$%^&*]/.test(password)) newErrors.password = 'Password must contain special character';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateAccount({ name, email, phone, password });
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
            <h1>Create Account</h1>
            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
              Join us to make a difference
            </p>
          </div>

          <div className="flex flex-col gap-[16px]">
            <AramInput
              label="Name"
              placeholder="Enter your full name"
              value={name}
              onChange={setName}
              required
              error={errors.name}
            />

            <AramInput
              label="Email ID"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              required
              error={errors.email}
            />

            <AramInput
              label="Phone Number"
              type="tel"
              placeholder="10-digit phone number"
              value={phone}
              onChange={setPhone}
              required
              error={errors.phone}
            />

            <div className="relative">
              <AramInput
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 characters"
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
                {showPassword ? <EyeOff size={18} color="#6E6E6E" /> : <Eye size={18} color="#6E6E6E" />}
              </button>
              <div style={{ fontSize: '12px', lineHeight: '16px', color: '#6E6E6E', marginTop: '4px' }}>
                Must contain: 8+ characters, uppercase, number, special character
              </div>
            </div>

            <div className="relative">
              <AramInput
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                error={errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-[14px] top-[38px]"
              >
                {showConfirmPassword ? <EyeOff size={18} color="#6E6E6E" /> : <Eye size={18} color="#6E6E6E" />}
              </button>
            </div>

            <div className="flex items-start gap-[8px]">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-[2px]"
              />
              <label style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E' }}>
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <AramButton onClick={handleSubmit} variant="primary" className="w-full">
              Create account & continue
            </AramButton>
            <div className="text-center">
              <button
                onClick={onSignIn}
                style={{ fontSize: '14px', lineHeight: '20px', color: '#F36A4F' }}
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </AramCard>
    </div>
  );
}