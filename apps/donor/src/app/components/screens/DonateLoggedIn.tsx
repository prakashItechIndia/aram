import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { AramTextarea } from '@/app/components/aram/AramTextarea';
import { AramSelect } from '@/app/components/aram/AramSelect';
import { useDonationFormStatus } from '@/app/hooks/useDonationFormStatus';
import { useCountries } from '@/app/hooks/useCountries';
import { useApi } from '@/app/context/ApiContext';

interface DonorProfile {
  name?: string;
  email?: string;
  mobile?: string;
  address?: string;
  pan?: string;
  country?: string;
  donorType?: string;
  donationAmount?: string;
}

const donationTypes = [
  { value: 'aram-sei', label: 'Aram Sei Fund' },
  { value: 'building', label: 'Building Fund' },
  { value: 'education', label: 'Education Fund' },
  { value: 'general', label: 'General Fund' },
  { value: 'medical', label: 'Medical Fund' },
  { value: 'sairam-sap', label: 'Sairam SAP' },
];

// Helper functions for localStorage
const DONATION_PREFS_KEY = 'aram_last_donation_prefs';
const getLastDonationPrefs = () => {
  try {
    const stored = localStorage.getItem(DONATION_PREFS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};
const saveLastDonationPrefs = (amount: number, donationType: string) => {
  try {
    localStorage.setItem(DONATION_PREFS_KEY, JSON.stringify({ amount, donationType }));
  } catch {
    // Ignore localStorage errors
  }
};

export function DonateLoggedIn() {
  const navigate = useNavigate();
  const { api, user: authUser, processDonation, refreshNotifications } = useApi();

  const userName = authUser?.name || '';
  const userEmail = authUser?.email || '';
  const userPhone = authUser?.mobileNumber || ''; // Assuming mobileNumber is the field name from Dashboard check

  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [address, setAddress] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panFromProfile, setPanFromProfile] = useState(false); // Track if PAN came from profile
  const [donationType, setDonationType] = useState('');
  const [country, setCountry] = useState('india');
  const [errors, setErrors] = useState<any>({});
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [displayName, setDisplayName] = useState(userName);
  const [displayEmail, setDisplayEmail] = useState(userEmail);
  const [displayPhone, setDisplayPhone] = useState(userPhone);
  const { checkAndNotify, panRequired, panThreshold, addressRequired, presetAmounts, minAmount, maxAmount, allowCustomAmount } = useDonationFormStatus();
  const { countries, loading: countriesLoading } = useCountries();

  // Calculate if PAN field should be shown
  const shouldShowPAN = React.useMemo(() => {
    // panRequired 'never' option has been removed
    if (panRequired === 'always') return true;
    if (panRequired === 'threshold') {
      const currentAmount = selectedPreset || Number(customAmount) || 0;
      return currentAmount >= panThreshold;
    }
    if (panRequired === 'optional') {
      return country === 'india';
    }
    return false;
  }, [panRequired, panThreshold, selectedPreset, customAmount, country]);

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
          if (donor.pan) {
            setPanNumber(donor.pan);
            setPanFromProfile(true); // Mark that PAN came from profile
          }
          if (donor.country) setCountry(donor.country.toLowerCase());
          if (donor.name) setDisplayName(donor.name);
          if (donor.email) setDisplayEmail(donor.email);
          if (donor.mobileNumber) setDisplayPhone(donor.mobileNumber);

          // Map donation amount from profile - DISABLED: amount should start empty
          // if (donor.donationAmount) {
          //   const amount = Number(donor.donationAmount);
          //   // Check if it matches a preset
          //   const matchingPreset = presetAmounts.find(p => p === amount);
          //   if (matchingPreset) {
          //     setSelectedPreset(matchingPreset);
          //     setCustomAmount('');
          //   } else {
          //     setCustomAmount(amount.toString());
          //     setSelectedPreset(null);
          //   }
          // }

          // Map donation type from profile (backend returns categoryCode, map it to frontend value)
          if (donor.donationType) {
            setDonationType(donor.donationType);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
      })
      .finally(() => {
        // Delay slightly for smoother transition if it's too fast
        setTimeout(() => setProfileLoaded(true), 500);
      });
  }, [api?.donorsApi, presetAmounts]);

  // Restore last donation preferences on mount - DISABLED: amount should start empty
  // useEffect(() => {
  //   const lastPrefs = getLastDonationPrefs();
  //   if (lastPrefs) {
  //     const { amount, donationType: lastType } = lastPrefs;
  //     // Check if the amount matches a preset
  //     const matchingPreset = presetAmounts.find(p => p === amount);
  //     if (matchingPreset) {
  //       setSelectedPreset(matchingPreset);
  //     } else {
  //       setCustomAmount(amount.toString());
  //     }
  //     if (lastType) {
  //       setDonationType(lastType);
  //     }
  //   }
  // }, [presetAmounts]);

  const amount = selectedPreset || Number(customAmount) || 0;

  const validateForm = () => {
    const newErrors: any = {};

    if (amount < minAmount) newErrors.amount = `Minimum donation amount is ₹${minAmount}`;
    if (amount > maxAmount) newErrors.amount = `Maximum donation amount is ₹${maxAmount}`;

    if (addressRequired && !address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Only validate PAN if it should be shown
    if (shouldShowPAN) {
      if (!panNumber.trim()) newErrors.panNumber = 'PAN number is required';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
        newErrors.panNumber = 'Invalid PAN format (e.g., AAAAA0000A)';
      }
    }

    if (!donationType) newErrors.donationType = 'Please select a donation type';
    if (!country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [submitting, setSubmitting] = useState(false);

  const handlePay = async () => {
    if (!checkAndNotify()) return;
    
    if (validateForm()) {
      // Save donation preferences for next time
      saveLastDonationPrefs(amount, donationType);

      setSubmitting(true);
      try {
        const donationResponse = await processDonation({
          amount,
          address: addressRequired ? address : '',
          pan: shouldShowPAN ? panNumber.toUpperCase() : '',
          donationType,
          country,
          name: displayName,
        });

        if (donationResponse.success) {
          // Navigate to payment processing -> success with confirmed data
          navigate('/payment-processing', {
            state: {
              status: 'success',
              donationData: {
                amount: donationResponse.amount,
                type: donationResponse.type, // Display name from API
                receiptNo: donationResponse.receiptNo,
                donationType: donationResponse.donationType || donationType,
                name: displayName,
                email: displayEmail,
                phone: displayPhone,
                address: addressRequired ? address : '',
                panNumber: shouldShowPAN ? panNumber.toUpperCase() : '',
                country,
              }
            }
          });
          refreshNotifications();
        } else {
          // Add toast for error
          console.error('Donation failed:', donationResponse.error);
        }
      } catch (error) {
        console.error('Donation error:', error);
      } finally {
        setSubmitting(false);
      }
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
          <div className="flex flex-col gap-[24px]">
            {/* Profile Info Card */}
            <div className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-[16px] p-[24px] grid grid-cols-1 md:grid-cols-3 gap-[24px]">
              <div className="flex flex-col gap-[8px]">
                <span className="text-[14px] leading-[20px] text-[#6E6E6E]">Name</span>
                <span className="text-[16px] leading-[24px] font-semibold text-[#0D0D0D]">{displayName}</span>
              </div>
              <div className="flex flex-col gap-[8px]">
                <span className="text-[14px] leading-[20px] text-[#6E6E6E]">Email</span>
                <span className="text-[16px] leading-[24px] font-semibold text-[#0D0D0D]">{displayEmail}</span>
              </div>
              <div className="flex flex-col gap-[8px]">
                <span className="text-[14px] leading-[20px] text-[#6E6E6E]">Phone</span>
                <span className="text-[16px] leading-[24px] font-semibold text-[#0D0D0D]">{displayPhone}</span>
              </div>
            </div>

            {shouldShowPAN && (
              <AramInput
                label="PAN Number"
                placeholder="AAAAA0000A"
                value={panNumber}
                onChange={(val) => setPanNumber(val.toUpperCase())}
                required
                disabled={panFromProfile} // Only disable if PAN came from profile
                error={errors.panNumber}
                helperText={panFromProfile ? "PAN from your profile" : "Format: AAAAA0000A"}
              />
            )}
          </div>

          <hr className="border-[#DBDBDB]" />

          {/* Amount Selection */}
          <div className="flex flex-col gap-[12px]">
            <label style={{ fontSize: '13px', lineHeight: '18px', fontWeight: 500, color: '#6E6E6E' }}>
              Donation Amount <span className="text-[#F36A4F]">*</span>
            </label>
            <div className="flex flex-wrap gap-[12px]">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setCustomAmount('');
                    // Clear PAN only if it was manually entered (not from profile)
                    if (!panFromProfile) {
                      setPanNumber('');
                    }
                  }}
                  className={`h-[44px] px-[24px] rounded-[16px] border transition-all ${selectedPreset === preset
                    ? 'border-[#F36A4F] bg-[#FEF1EE] text-[#F36A4F] scale-105 shadow-sm'
                    : 'border-[#DBDBDB] bg-white text-[#3D3D3D] hover:border-[#F36A4F]'
                    }`}
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  ₹{preset.toLocaleString()}
                </button>
              ))}
            </div>
            {allowCustomAmount && (
              <AramInput
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(val) => {
                  setCustomAmount(val);
                  setSelectedPreset(null);
                  // Clear PAN only if it was manually entered (not from profile)
                  if (!panFromProfile) {
                    setPanNumber('');
                  }
                }}
                type="number"
                error={errors.amount}
                helperText={`Min: ₹${minAmount}, Max: ₹${maxAmount}`}
              />
            )}
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
              disabled
              error={errors.country}
            />
          </div>

          {/* Address */}
          {addressRequired && (
            <AramTextarea
              label="Address"
              placeholder="Enter your complete address for receipt generation"
              value={address}
              onChange={(val) => setAddress(val.slice(0, 250))}
              required
              error={errors.address}
              rows={3}
              maxLength={250}
              helperText={`${address.length}/250 characters`}
            />
          )}

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
            <AramButton onClick={handlePay} variant="primary" className="flex-1 h-[56px] text-[16px]" disabled={amount < minAmount || submitting}>
              {submitting ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
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
