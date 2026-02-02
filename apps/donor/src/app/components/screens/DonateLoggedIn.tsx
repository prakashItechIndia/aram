import React, { useEffect, useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { AramTextarea } from '@/app/components/aram/AramTextarea';
import { AramSelect } from '@/app/components/aram/AramSelect';

interface DonorProfile {
  name?: string;
  email?: string;
  mobile?: string;
  address?: string;
  pan?: string;
  country?: string;
}

interface DonateLoggedInProps {
  onPay: (data: any) => void;
  userName: string;
  userEmail: string;
  userPhone: string;
  api?: { donorsApi: { donorsControllerGetMyProfile: (options?: any) => Promise<{ data?: DonorProfile | null }> } };
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

export function DonateLoggedIn({ onPay, userName, userEmail, userPhone, api }: DonateLoggedInProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [address, setAddress] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [donationType, setDonationType] = useState('');
  const [country, setCountry] = useState('india');
  const [errors, setErrors] = useState<any>({});
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [displayName, setDisplayName] = useState(userName);
  const [displayEmail, setDisplayEmail] = useState(userEmail);
  const [displayPhone, setDisplayPhone] = useState(userPhone);

  useEffect(() => {
    setDisplayName(userName);
    setDisplayEmail(userEmail);
    setDisplayPhone(userPhone);
  }, [userName, userEmail, userPhone]);

  useEffect(() => {
    if (!api?.donorsApi) {
      setProfileLoaded(true);
      return;
    }
    api.donorsApi
      .donorsControllerGetMyProfile()
      .then((res) => {
        const donor = (res as { data?: any })?.data;
        if (donor) {
          if (donor.location) setAddress(donor.location);
          if (donor.pan) setPanNumber(donor.pan);
          if (donor.country) setCountry(donor.country.toLowerCase());
          if (donor.name) setDisplayName(donor.name);
          if (donor.email) setDisplayEmail(donor.email);
          if (donor.mobileNumber) setDisplayPhone(donor.mobileNumber);
        }
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
      })
      .finally(() => {
        // Delay slightly for smoother transition if it's too fast
        setTimeout(() => setProfileLoaded(true), 500);
      });
  }, [api?.donorsApi]);

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
        name: displayName,
        email: displayEmail,
        phone: displayPhone,
      });
    }
  };

  const handleReset = () => {
    setSelectedPreset(null);
    setCustomAmount('');
    setDonationType('');
    setErrors({});
  };

  if (!profileLoaded) {
    return (
      <div className="flex flex-col gap-[24px]">
        <AramCard>
          <div className="flex flex-col items-center justify-center py-20 text-[#6E6E6E] gap-4">
            <div className="w-10 h-10 border-4 border-[#F36A4F] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium animate-pulse">Loading your profile details...</p>
          </div>
        </AramCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <AramCard>
        <div className="flex flex-col gap-[24px]">
          <div>
            <h2 className="text-[24px] font-bold text-[#0D0D0D]">Make a Donation</h2>
            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
              Your support helps us continue our mission
            </p>
          </div>

          {/* User Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            <AramInput
              label="Full Name"
              value={displayName}
              onChange={setDisplayName}
              required
              error={errors.displayName}
            />
            <AramInput
              label="Email Address"
              value={displayEmail}
              disabled
              helperText="Verified registered email"
            />
            <AramInput
              label="Mobile Number"
              value={displayPhone}
              disabled
              helperText="Verified registered mobile"
            />
            <AramInput
              label="PAN Number"
              placeholder="AAAAA0000A"
              value={panNumber}
              onChange={(val) => setPanNumber(val.toUpperCase())}
              required
              disabled={!!panNumber}
              error={errors.panNumber}
              helperText={panNumber ? "PAN from your profile" : "Format: AAAAA0000A"}
            />
          </div>

          <hr className="border-[#DBDBDB]" />

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
                  className={`h-[44px] px-[24px] rounded-[16px] border transition-all ${
                    selectedPreset === preset
                      ? 'border-[#F36A4F] bg-[#FEF1EE] text-[#F36A4F] scale-105 shadow-sm'
                      : 'border-[#DBDBDB] bg-white text-[#3D3D3D] hover:border-[#F36A4F]'
                  }`}
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  ₹{preset.toLocaleString()}
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

          {/* Address */}
          <AramTextarea
            label="Address"
            placeholder="Enter your complete address for receipt generation"
            value={address}
            onChange={setAddress}
            required
            error={errors.address}
            rows={3}
          />

          {/* Info Messages */}
          <div className="flex flex-col gap-[8px] p-[16px] bg-[#FEF1EE] rounded-[16px] border border-[#FCD9D3]">
            <p style={{ fontSize: '13px', lineHeight: '18px', color: '#3D3D3D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="w-4 h-4 rounded-full bg-[#F36A4F] text-white flex items-center justify-center text-[10px]">✓</span> 
              Receipt will be generated after successful payment
            </p>
            <p style={{ fontSize: '13px', lineHeight: '18px', color: '#3D3D3D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="w-4 h-4 rounded-full bg-[#F36A4F] text-white flex items-center justify-center text-[10px]">✓</span>
              80G documents available in Reports section
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[16px]">
            <AramButton onClick={handlePay} variant="primary" className="flex-1 h-[56px] text-[16px]" disabled={amount < MIN_AMOUNT}>
              Pay ₹{amount.toLocaleString()}
            </AramButton>
            <AramButton onClick={handleReset} variant="secondary" className="px-[32px]">
              Clear
            </AramButton>
          </div>
        </div>
      </AramCard>
    </div>
  );
}
