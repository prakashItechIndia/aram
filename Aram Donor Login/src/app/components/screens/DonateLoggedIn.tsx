import React, { useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { AramTextarea } from '@/app/components/aram/AramTextarea';
import { AramSelect } from '@/app/components/aram/AramSelect';

interface DonateLoggedInProps {
  onPay: (data: any) => void;
  userName: string;
  userEmail: string;
  userPhone: string;
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

export function DonateLoggedIn({ onPay, userName, userEmail, userPhone }: DonateLoggedInProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [address, setAddress] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [donationType, setDonationType] = useState('');
  const [country, setCountry] = useState('india');
  const [errors, setErrors] = useState<any>({});

  const amount = selectedPreset || Number(customAmount) || 0;
  const MIN_AMOUNT = 100;
  const MAX_AMOUNT = 50000;

  const validateForm = () => {
    const newErrors: any = {};

    if (amount < MIN_AMOUNT) newErrors.amount = `Minimum donation amount is ₹${MIN_AMOUNT}`;
    if (amount > MAX_AMOUNT) newErrors.amount = `Maximum donation amount is ₹${MAX_AMOUNT}`;
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!panNumber.trim()) newErrors.panNumber = 'PAN number is required';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      newErrors.panNumber = 'Invalid PAN format (e.g., AAAAA0000A)';
    }
    if (!donationType) newErrors.donationType = 'Please select a donation type';
    if (!country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (validateForm()) {
      onPay({
        amount,
        address,
        panNumber: panNumber.toUpperCase(),
        donationType,
        country,
        name: userName,
        email: userEmail,
        phone: userPhone,
      });
    }
  };

  const handleReset = () => {
    setSelectedPreset(null);
    setCustomAmount('');
    setAddress('');
    setPanNumber('');
    setDonationType('');
    setCountry('india');
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <AramCard>
        <div className="flex flex-col gap-[24px]">
          <div>
            <h2>Make a Donation</h2>
            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
              Your support helps us continue our mission
            </p>
          </div>

          {/* Prefilled User Info (Read-only) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] p-[16px] bg-[#F3F3F3] rounded-[16px]">
            <div>
              <label style={{ fontSize: '13px', color: '#6E6E6E' }}>Name</label>
              <p style={{ fontSize: '14px', color: '#0D0D0D', fontWeight: 600, marginTop: '4px' }}>{userName}</p>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#6E6E6E' }}>Email</label>
              <p style={{ fontSize: '14px', color: '#0D0D0D', fontWeight: 600, marginTop: '4px' }}>{userEmail}</p>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#6E6E6E' }}>Phone</label>
              <p style={{ fontSize: '14px', color: '#0D0D0D', fontWeight: 600, marginTop: '4px' }}>{userPhone}</p>
            </div>
          </div>

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

          {/* Address */}
          <AramTextarea
            label="Address"
            placeholder="Enter your complete address"
            value={address}
            onChange={setAddress}
            required
            error={errors.address}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {/* PAN Number */}
            <AramInput
              label="PAN Number"
              placeholder="AAAAA0000A"
              value={panNumber}
              onChange={(val) => setPanNumber(val.toUpperCase())}
              required
              error={errors.panNumber}
              helperText="Format: AAAAA0000A"
            />

            {/* Country */}
            <AramSelect
              label="Country"
              value={country}
              onChange={setCountry}
              options={countries}
              required
              error={errors.country}
            />
          </div>

          {/* Donation Type */}
          <AramSelect
            label="Donation Type"
            placeholder="Select donation type"
            value={donationType}
            onChange={setDonationType}
            options={donationTypes}
            required
            error={errors.donationType}
          />

          {/* Info Messages */}
          <div className="flex flex-col gap-[8px] p-[16px] bg-[#FEF1EE] rounded-[16px] border border-[#FCD9D3]">
            <p style={{ fontSize: '13px', lineHeight: '18px', color: '#3D3D3D' }}>
              ✓ Receipt will be generated after successful payment
            </p>
            <p style={{ fontSize: '13px', lineHeight: '18px', color: '#3D3D3D' }}>
              ✓ 80G documents available in Reports section
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[12px]">
            <AramButton onClick={handlePay} variant="primary" className="flex-1" disabled={amount < MIN_AMOUNT}>
              Pay ₹{amount.toLocaleString()}
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
