import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AramButton } from '../aram/AramButton';
import { AramCard } from '../aram/AramCard';
import { AramInput } from '../aram/AramInput';
import { AramTextarea } from '../aram/AramTextarea';
import { AramSelect } from '../aram/AramSelect';
import { ArrowLeft } from 'lucide-react';
import { validateForm as globalValidateForm, validationRules, validationMessages, sanitizeInput, countryPhoneConfigs, getMobileValidation } from '../../utils/validations';
import { useDonationFormStatus } from '../../hooks/useDonationFormStatus';
import { useCountries } from '../../hooks/useCountries';

interface DonateGuestProps {
  onPay: (data: any) => void;
  onBack: () => void;
  api?: { donorsApi: { donorsControllerGuestDonate: (body: any) => Promise<{ data?: { donorId?: number }; response?: { status?: number; data?: { message?: string } } }> } };
}
import { useApi } from '@/app/context/ApiContext';

const donationTypes = [
  { value: 'aram-sei', label: 'Aram Sei Fund' },
  { value: 'building', label: 'Building Fund' },
  { value: 'education', label: 'Education Fund' },
  { value: 'general', label: 'General Fund' },
  { value: 'medical', label: 'Medical Fund' },
  { value: 'sairam-sap', label: 'Sairam SAP' },
];

const countries = [
  { value: 'india', label: 'India' }
];

const amountPresets = [500, 1000, 2500, 5000];

export function DonateGuest() {
  const navigate = useNavigate();
  const { api } = useApi();
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

  // Erase mobile number when country changes
  React.useEffect(() => {
    setMobile('');
    setErrors((prev: any) => ({ ...prev, mobile: undefined }));
  }, [country]);

  const handleMobileChange = (value: string) => {
    const sanitized = sanitizeInput.mobile(value, country);
    setMobile(sanitized);

    if (!sanitized) {
      setErrors((prev: any) => ({ ...prev, mobile: undefined }));
      return;
    }

    const config = countryPhoneConfigs[country] || countryPhoneConfigs.india;

    // Check first digit for India
    if (country === 'india' && sanitized.length > 0) {
      const firstDigit = parseInt(sanitized[0]);
      if (firstDigit < 6 || firstDigit > 9) {
        setErrors((prev: any) => ({ ...prev, mobile: 'Mobile number should start from 6, 7, 8, 9' }));
        return;
      }
    }

    // Check length
    if (sanitized.length < config.maxLength) {
      setErrors((prev: any) => ({ ...prev, mobile: `Please enter ${config.maxLength} digits` }));
    } else {
      setErrors((prev: any) => ({ ...prev, mobile: undefined }));
    }
  };

  const amount = selectedPreset || Number(customAmount) || 0;

  const validateForm = (): boolean => {
    const formData = {
      name,
      email,
      mobile,
      address,
      panNumber,
      amount: amount.toString(),
      donationType,
      country,
    };

    const fieldRules: any = {
      name: validationRules.name,
      email: validationRules.email,
      mobile: getMobileValidation(country),
      amount: { required: true, min: minAmount, max: maxAmount },
      donationType: { required: true },
      country: { required: true },
    };

    if (addressRequired) {
      fieldRules.address = validationRules.address;
    }

    // Only require PAN if it should be shown
    if (shouldShowPAN) {
      fieldRules.panNumber = validationRules.panNumber;
    }

    const fieldMessages: any = {
      name: validationMessages.name,
      email: validationMessages.email,
      mobile: validationMessages.mobile,
      amount: {
        required: 'Amount is required',
        min: `Minimum donation amount is ₹${minAmount}`,
        max: `Maximum donation amount is ₹${maxAmount}`
      },
      donationType: { required: 'Please select a donation type' },
      country: { required: 'Country is required' },
    };

    if (addressRequired) {
      fieldMessages.address = validationMessages.address;
    }

    // Only add PAN messages if it should be shown
    if (shouldShowPAN) {
      fieldMessages.panNumber = validationMessages.panNumber;
    }

    const newErrors = globalValidateForm(formData, fieldRules, fieldMessages);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validateForm()) return;

    if (api?.donorsApi) {
      setSubmitting(true);
      try {
        const response = await api.donorsApi.donorsControllerGuestDonate({
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          address: address.trim(),
          pan: shouldShowPAN ? panNumber.trim().toUpperCase() : undefined,
          country: country || 'India',
          amount,
          donationType,
        });

        // The API now returns the confirmed donation details
        // We can navigate directly to success state or let PaymentProcessing show it
        // Since we already called the API and it succeeded, valid flow is to go to success.
        
        const data = (response as any).data;

        // Navigate to payment processing -> success
        navigate('/payment-processing', {
          state: {
            status: 'success',
            donationData: {
              amount: data.amount,
              type: data.type, // Display name from API
              receiptNo: data.receiptNo,
              donationType: data.donationType, // Original code
              name: name.trim(),
              email: email.trim(),
              phone: mobile.trim(),
              address: address.trim(),
              panNumber: shouldShowPAN ? panNumber.trim().toUpperCase() : undefined,
              country: country || 'India',
            }
          }
        });
      } catch (err: unknown) {
        const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
        if (res?.status === 409) {
          toast.error(res.data?.message || 'User already exists. Please Login.');
          return;
        }
        toast.error((res?.data?.message as string) || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
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
            onClick={() => navigate('/')}
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
              onChange={(value: string) => setName(sanitizeInput.name(value))}
              required
              error={errors.name}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {shouldShowPAN && (
                <AramInput
                  label="PAN Number"
                  placeholder="AAAAA0000A"
                  value={panNumber}
                  onChange={(value: string) => setPanNumber(sanitizeInput.panNumber(value))}
                  required
                  error={errors.panNumber}
                  helperText="Format: AAAAA0000A"
                />
              )}

              <AramSelect
                label="Country"
                value={country}
                onChange={setCountry}
                options={countries}
                required
                error={errors.country}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <AramInput
                label="Email ID"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(value) => setEmail(sanitizeInput.email(value))}
                required
                error={errors.email}
              />

              <AramInput
                label="Mobile Number"
                type="tel"
                placeholder={countryPhoneConfigs[country]?.maxLength === 10 ? '10-digit mobile number' : '11-digit mobile number'}
                value={mobile}
                onChange={handleMobileChange}
                required
                error={errors.mobile}
                prefix={countries.find(c => c.value === country)?.code || '+91'}
              />
            </div>

            {addressRequired && (
              <AramTextarea
                label="Address"
                placeholder="Enter your complete address"
                value={address}
                onChange={(val) => setAddress(val.slice(0, 250))}
                required
                error={errors.address}
                rows={3}
                maxLength={250}
                helperText={`${address.length}/250 characters`}
              />
            )}
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
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setCustomAmount('');
                      setPanNumber(''); // Clear PAN on amount change
                    }}
                    className={`h-[44px] px-[24px] rounded-[999px] border transition-colors ${selectedPreset === preset
                      ? 'border-[#F36A4F] bg-[#FEF1EE] text-[#F36A4F]'
                      : 'border-[#DBDBDB] bg-white text-[#3D3D3D] hover:border-[#F36A4F]'
                      }`}
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
              {allowCustomAmount && (
                <AramInput
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(val) => {
                    if (/^\d*$/.test(val)) {
                      setCustomAmount(val);
                      setSelectedPreset(null);
                      setPanNumber(''); // Clear PAN on amount change
                    }
                  }}
                  type="number"
                  error={errors.amount}
                  helperText={`Min: ₹${minAmount}, Max: ₹${maxAmount}`}
                />
              )}
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
            <AramButton onClick={handlePay} variant="primary" className="flex-1 cursor-pointer" disabled={amount < minAmount || submitting}>
              {submitting ? 'Please wait...' : `Pay ₹${amount.toLocaleString()}`}
            </AramButton>
            <AramButton onClick={handleReset} variant="secondary" className="cursor-pointer">
              Reset
            </AramButton>
          </div>
        </div>
      </AramCard>
    </div>
  );
}