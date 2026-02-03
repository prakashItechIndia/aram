import React, { useState } from 'react';
import { AramButton } from '../aram/AramButton';
import { AramCard } from '../aram/AramCard';
import { AramInput } from '../aram/AramInput';
import { AramSelect } from '../aram/AramSelect';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { validateForm as globalValidateForm, validationRules, validationMessages, sanitizeInput, countryPhoneConfigs, getMobileValidation } from '../../utils/validations';
import { useDonationFormStatus } from '../../hooks/useDonationFormStatus';

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
  const { checkAndNotify } = useDonationFormStatus();

  // Terms & Privacy states
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [privacyRead, setPrivacyRead] = useState(false);

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
    if (!agreeTerms) {
      toast.error('You should accept the Terms of Service and Privacy Policy');
      return;
    }
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
                onChange={(e) => {
                  if (!termsRead || !privacyRead) {
                    toast.error('Please read both Terms of Service and Privacy Policy before agreeing');
                    return;
                  }
                  setAgreeTerms(e.target.checked);
                }}
                className="mt-[2px]"
              />
              <label style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E' }}>
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowTerms(true);
                    setTermsRead(true);
                  }}
                  className="text-[#F36A4F] hover:underline font-medium"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowPrivacy(true);
                    setPrivacyRead(true);
                  }}
                  className="text-[#F36A4F] hover:underline font-medium"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
          </div>

          {/* Terms Modal */}
          <Dialog open={showTerms} onOpenChange={setShowTerms}>
            <DialogContent className="max-w-[700px] bg-white p-0 overflow-hidden rounded-none">
              <div className="flex flex-col h-full">
                <div className="p-[40px] text-center relative">
                  <DialogHeader>
                    <p className="text-[#F36A4F] font-bold text-[16px] mb-[8px]">Aram Foundation</p>
                    <h1 className="text-[32px] font-bold text-[#1A1A1A]">Terms of Service</h1>
                    <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
                      Please read our terms and conditions carefully
                    </p>
                  </DialogHeader>
                </div>
                <div className="px-[40px] pb-[40px]">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="text-[14px] leading-[22px] text-[#3D3D3D] space-y-4">
                      <p>Welcome to Aram Foundation. By using our services, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.</p>
                      <p><strong>1. Acceptance of Terms:</strong> By accessing this site, you are agreeing to be bound by these web site Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                      <p><strong>2. Use License:</strong> Permission is granted to temporarily download one copy of the materials (information or software) on Aram Foundation's web site for personal, non-commercial transitory viewing only.</p>
                      <p><strong>3. Disclaimer:</strong> The materials on Aram Foundation's web site are provided 'as is'. Aram Foundation makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                      <p><strong>4. Limitations:</strong> In no event shall Aram Foundation or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Aram Foundation's Internet site, even if Aram Foundation or a Aram Foundation authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                      <p><strong>5. Revisions and Errata:</strong> The materials appearing on Aram Foundation's web site could include technical, typographical, or photographic errors. Aram Foundation does not warrant that any of the materials on its web site are accurate, complete, or current.</p>
                      <p><strong>6. Links:</strong> Aram Foundation has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Aram Foundation of the site. Use of any such linked web site is at the user's own risk.</p>
                      <p><strong>7. Site Terms of Use Modifications:</strong> Aram Foundation may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.</p>
                      <p><strong>8. Governing Law:</strong> Any claim relating to Aram Foundation's web site shall be governed by the laws of the State of India without regard to its conflict of law provisions.</p>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Privacy Policy Modal */}
          <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
            <DialogContent className="max-w-[700px] bg-white p-0 overflow-hidden rounded-none">
              <div className="flex flex-col h-full">
                <div className="p-[40px] text-center relative">
                  <DialogHeader>
                    <p className="text-[#F36A4F] font-bold text-[16px] mb-[8px]">Aram Foundation</p>
                    <h1 className="text-[32px] font-bold text-[#1A1A1A]">Privacy Policy</h1>
                    <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
                      We value your privacy and security
                    </p>
                  </DialogHeader>
                </div>
                <div className="px-[40px] pb-[40px]">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="text-[14px] leading-[22px] text-[#3D3D3D] space-y-4">
                      <p>Your privacy is important to us. It is Aram Foundation's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>
                      <p><strong>1. Information we collect:</strong> We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                      <p><strong>2. Use of Information:</strong> We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
                      <p><strong>3. Data Protection:</strong> We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
                      <p><strong>4. External Links:</strong> Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
                      <p><strong>5. User Consent:</strong> You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</p>
                      <p><strong>6. Policy Changes:</strong> Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.</p>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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