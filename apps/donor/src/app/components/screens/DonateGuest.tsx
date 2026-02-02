import React, { useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { AramTextarea } from '@/app/components/aram/AramTextarea';
import { AramSelect } from '@/app/components/aram/AramSelect';
import { ArrowLeft } from 'lucide-react';

interface DonateGuestProps {
  onPay: (data: any) => void;
  onBack: () => void;
  api?: { donorsApi: { donorsControllerGuestDonate: (body: any) => Promise<{ data?: { donorId?: number }; response?: { status?: number; data?: { message?: string } } }> } };
}

const donationTypes = [
  { value: 'aram-sei', label: 'Aram Sei Fund' },
  { value: 'building', label: 'Building Fund' },
  { value: 'education', label: 'Education Fund' },
  { value: 'general', label: 'General Fund' },
  { value: 'medical', label: 'Medical Fund' },
  { value: 'sairam-sap', label: 'Sairam SAP' },
];

const countries = [
  { value: 'india', label: 'India' },
  { value: 'usa', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'canada', label: 'Canada' },
];

const amountPresets = [500, 1000, 2500, 5000];

export function DonateGuest({ onPay, onBack, api }: DonateGuestProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [donationType, setDonationType] = useState('');
  const [country, setCountry] = useState('india');
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [repeatGuestError, setRepeatGuestError] = useState<string | null>(null);

  const amount = selectedPreset || Number(customAmount) || 0;
  const MIN_AMOUNT = 100;
  const MAX_AMOUNT = 50000;

  const validateForm = () => {
    const newErrors: any = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (amount < MIN_AMOUNT) newErrors.amount = `Minimum donation amount is ₹${MIN_AMOUNT}`;
    if (amount > MAX_AMOUNT) newErrors.amount = `Maximum donation amount is ₹${MAX_AMOUNT}`;
    if (!panNumber.trim()) newErrors.panNumber = 'PAN number is required';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      newErrors.panNumber = 'Invalid PAN format (e.g., AAAAA0000A)';
    }
    if (!donationType) newErrors.donationType = 'Please select a donation type';
    if (!country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    setRepeatGuestError(null);
    if (!validateForm()) return;
    if (api?.donorsApi) {
      setSubmitting(true);
      try {
        await api.donorsApi.donorsControllerGuestDonate({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          address: address.trim(),
          pan: panNumber.trim().toUpperCase(),
          country: country || 'India',
          amount,
          donationType,
        });
        onPay({
          name,
          email,
          mobile,
          address,
          amount,
          panNumber: panNumber.toUpperCase(),
          donationType,
          country,
        });
      } catch (err: unknown) {
        const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
        if (res?.status === 409) {
          setRepeatGuestError('You have donated before. Please use Login to Donate.');
          return;
        }
        setRepeatGuestError((res?.data?.message as string) || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      onPay({
        name,
        email,
        mobile,
        address,
        amount,
        panNumber: panNumber.toUpperCase(),
        donationType,
        country,
      });
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMobile('');
    setAddress('');
    setSelectedPreset(null);
    setCustomAmount('');
    setPanNumber('');
    setDonationType('');
    setCountry('india');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-[24px]">
      <AramCard className="w-full max-w-[720px]">
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

          <div>
            <h2>Donate Without Signup</h2>
            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
              Enter accurate details for receipt and 80G document delivery.
            </p>
          </div>

          {/* Personal Information */}
          <div className="flex flex-col gap-[16px]">
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0D0D0D' }}>Personal Information</h3>
            
            <AramInput
              label="Name"
              placeholder="Enter your full name"
              value={name}
              onChange={setName}
              required
              error={errors.name}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
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
                label="Mobile Number"
                type="tel"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={setMobile}
                required
                error={errors.mobile}
              />
            </div>

            <AramTextarea
              label="Address"
              placeholder="Enter your complete address"
              value={address}
              onChange={setAddress}
              required
              error={errors.address}
              rows={3}
            />
          </div>

          {/* Donation Details */}
          <div className="flex flex-col gap-[16px]">
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0D0D0D' }}>Donation Details</h3>

            {/* Amount Selection */}
            <div className="flex flex-col gap-[12px]">
              <label style={{ fontSize: '13px', lineHeight: '18px', fontWeight: 500, color: '#6E6E6E' }}>
                Donation Amount <span className="text-[#F36A4F]">*</span>
              </label>
              <div className="flex flex-wrap gap-[12px]">
                {amountPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setCustomAmount('');
                    }}
                    className={`h-[44px] px-[24px] rounded-[999px] border transition-colors ${
                      selectedPreset === preset
                        ? 'border-[#F36A4F] bg-[#FEF1EE] text-[#F36A4F]'
                        : 'border-[#DBDBDB] bg-white text-[#3D3D3D] hover:border-[#F36A4F]'
                    }`}
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
              <AramInput
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(val) => {
                  setCustomAmount(val);
                  setSelectedPreset(null);
                }}
                type="number"
                error={errors.amount}
                helperText={`Min: ₹${MIN_AMOUNT}, Max: ₹${MAX_AMOUNT}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <AramInput
                label="PAN Number"
                placeholder="AAAAA0000A"
                value={panNumber}
                onChange={(val) => setPanNumber(val.toUpperCase())}
                required
                error={errors.panNumber}
                helperText="Format: AAAAA0000A"
              />

              <AramSelect
                label="Country"
                value={country}
                onChange={setCountry}
                options={countries}
                required
                error={errors.country}
              />
            </div>

            <AramSelect
              label="Donation Type"
              placeholder="Select donation type"
              value={donationType}
              onChange={setDonationType}
              options={donationTypes}
              required
              error={errors.donationType}
            />
          </div>

          {/* Repeat guest error */}
          {repeatGuestError && (
            <div className="p-[16px] bg-red-50 border border-red-200 rounded-[16px] text-red-700 text-sm" role="alert">
              {repeatGuestError}
            </div>
          )}

          {/* Info Message */}
          <div className="flex flex-col gap-[8px] p-[16px] bg-[#FEF1EE] rounded-[16px] border border-[#FCD9D3]">
            <p style={{ fontSize: '13px', lineHeight: '18px', color: '#3D3D3D' }}>
              ✓ Receipt will be generated after successful payment
            </p>
            <p style={{ fontSize: '13px', lineHeight: '18px', color: '#3D3D3D' }}>
              ✓ 80G documents will be sent to your email
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[12px]">
            <AramButton onClick={handlePay} variant="primary" className="flex-1" disabled={amount < MIN_AMOUNT || submitting}>
              {submitting ? 'Please wait...' : `Pay ₹${amount.toLocaleString()}`}
            </AramButton>
            <AramButton onClick={handleReset} variant="secondary">
              Reset
            </AramButton>
          </div>
        </div>
      </AramCard>
    </div>
  );
}