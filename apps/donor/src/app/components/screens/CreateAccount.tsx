import React, { useState } from 'react';
import { AramButton } from '../aram/AramButton';
import { AramCard } from '../aram/AramCard';
import { AramInput } from '../aram/AramInput';
import { AramSelect } from '../aram/AramSelect';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { validateForm as globalValidateForm, validationRules, validationMessages, sanitizeInput, countryPhoneConfigs, getMobileValidation } from '../../utils/validations';

const countries = [
  { value: 'india', label: '+91' },
  { value: 'usa', label: '+1' },
  { value: 'uk', label: '+44' },
  { value: 'canada', label: '+1' },
];

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
  const [country, setCountry] = useState('india');
  const [errors, setErrors] = useState<any>({});

  // Erase phone number when country changes
  React.useEffect(() => {
    setPhone('');
    setErrors((prev: any) => ({ ...prev, phone: undefined }));
  }, [country]);

  const handleMobileChange = (value: string) => {
    const sanitized = sanitizeInput.mobile(value, country);
    setPhone(sanitized);

    if (!sanitized) {
      setErrors((prev: any) => ({ ...prev, phone: undefined }));
      return;
    }

    const config = countryPhoneConfigs[country] || countryPhoneConfigs.india;

    // Check first digit for India
    if (country === 'india' && sanitized.length > 0) {
      const firstDigit = parseInt(sanitized[0]);
      if (firstDigit < 6 || firstDigit > 9) {
        setErrors((prev: any) => ({ ...prev, phone: 'Mobile number should start from 6, 7, 8, 9' }));
        return;
      }
    }

    // Check length
    if (sanitized.length < config.maxLength) {
      setErrors((prev: any) => ({ ...prev, phone: `Please enter ${config.maxLength} digits` }));
    } else {
      setErrors((prev: any) => ({ ...prev, phone: undefined }));
    }
  };

  const validateForm = () => {
    const formData = {
      name,
      email,
      phone,
      password,
    };

    const fieldRules = {
      name: validationRules.name,
      email: validationRules.email,
      phone: getMobileValidation(country),
      password: validationRules.password,
    };

    const fieldMessages = {
      name: validationMessages.name,
      email: validationMessages.email,
      phone: validationMessages.mobile,
      password: validationMessages.password,
    };

    const newErrors = globalValidateForm(formData, fieldRules, fieldMessages);

    // Custom check for confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

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
              onChange={(value: string) => setName(sanitizeInput.name(value))}
              required
              error={errors.name}
            />

            <AramInput
              label="Email ID"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(value: string) => setEmail(sanitizeInput.email(value))}
              required
              error={errors.email}
            />

            <div className="flex flex-col gap-[6px]">
              <label style={{ fontSize: '13px', lineHeight: '18px', fontWeight: 500, color: '#6E6E6E' }}>
                Phone Number <span className="text-[#F36A4F]">*</span>
              </label>
              <div className="flex gap-[8px]">
                <AramSelect
                  value={country}
                  onChange={setCountry}
                  options={countries}
                  className="w-[80px]"
                />
                <AramInput
                  type="tel"
                  placeholder={countryPhoneConfigs[country]?.maxLength === 10 ? 'Enter 10-digits Phone Number' : 'Enter 11-digits Phone Number'}
                  value={phone}
                  onChange={handleMobileChange}
                  error={errors.phone}
                  className="flex-1"
                />
              </div>
            </div>

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
                {showPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
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
                {showConfirmPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
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