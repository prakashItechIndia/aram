import { useState } from 'react';
import {
  FileText,
  Search,
  User,
  IndianRupee,
  CreditCard,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  mobile: string;
  email: string;
  pan: string;
}

const mockDonors: Donor[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    mobile: '9876543210',
    email: 'rajesh.k@email.com',
    pan: 'ABCDE1234F',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    mobile: '9876543211',
    email: 'priya.s@email.com',
    pan: 'FGHIJ5678K',
  },
];

const DONATION_CATEGORIES = [
  'Aram Sei Fund',
  'Building Fund',
  'Education Fund',
  'General Fund',
  'Medical Fund',
  'Sairam SAP',
];

const PAYMENT_MODES = ['Cash', 'Cheque', 'DD', 'Bank Transfer'];

export function EChallanEntryScreen() {
  const [step, setStep] = useState<'donor' | 'donation' | 'payment' | 'review'>('donor');
  const [showDonorSearch, setShowDonorSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAmountWarning, setShowAmountWarning] = useState(false);
  const [generatedChallanNo, setGeneratedChallanNo] = useState('');

  // Donor Details
  const [donorName, setDonorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pan, setPan] = useState('');
  const [donorType, setDonorType] = useState('Individual');
  const [notes, setNotes] = useState('');

  // Donation Details
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [is80GApplicable, setIs80GApplicable] = useState(true);
  const [purpose, setPurpose] = useState('');

  // Payment Details
  const [paymentMode, setPaymentMode] = useState('');
  const [cashReceivedBy, setCashReceivedBy] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [ddNumber, setDdNumber] = useState('');
  const [ddDate, setDdDate] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [transferDate, setTransferDate] = useState('');

  // Config (mock - would come from settings)
  const maxAmount = 50000;
  const panMandatoryThreshold = 2000;

  const handleDonorSearch = (query: string) => {
    if (query.length >= 3) {
      const results = mockDonors.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.mobile.includes(query) ||
          d.email.toLowerCase().includes(query.toLowerCase()) ||
          d.pan.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowDonorSearch(true);
    } else {
      setSearchResults([]);
      setShowDonorSearch(false);
    }
  };

  const selectDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setDonorName(donor.name);
    setMobile(donor.mobile);
    setEmail(donor.email);
    setPan(donor.pan);
    setShowDonorSearch(false);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const numValue = parseFloat(value);
    if (numValue > maxAmount) {
      setShowAmountWarning(true);
    } else {
      setShowAmountWarning(false);
    }
  };

  const handleSubmit = () => {
    const challanNo = `ECH/2025-26/${String(Math.floor(Math.random() * 1000)).padStart(6, '0')}`;
    setGeneratedChallanNo(challanNo);
    setShowSuccessModal(true);
  };

  const canProceedFromDonor = () => {
    return donorName && mobile && (parseFloat(amount) <= panMandatoryThreshold || pan);
  };

  const canProceedFromDonation = () => {
    return category && amount && !showAmountWarning;
  };

  const canProceedFromPayment = () => {
    if (!paymentMode) return false;
    if (paymentMode === 'Cash') return cashReceivedBy;
    if (paymentMode === 'Cheque') return chequeNumber && bankName && chequeDate;
    if (paymentMode === 'DD') return ddNumber && bankName && ddDate;
    if (paymentMode === 'Bank Transfer') return utrNumber && transferDate;
    return false;
  };

  return (
    <div className="flex flex-col bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] leading-[28px] font-semibold text-[#0D0D0D]">
              Create E-Challan
            </h1>
            <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-1">
              Record offline donations (Walk-in, Cash, Cheque, DD, Bank Transfer)
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between">
          {[
            { id: 'donor', label: '1. Donor Details', icon: User },
            { id: 'donation', label: '2. Donation Details', icon: IndianRupee },
            { id: 'payment', label: '3. Payment Mode', icon: CreditCard },
            { id: 'review', label: '4. Review & Submit', icon: CheckCircle },
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${step === s.id
                      ? 'bg-[#F36A4F] text-white'
                      : 'bg-[#F3F3F3] text-[#6E6E6E]'
                    }`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <p
                  className={`text-[13px] mt-2 ${step === s.id ? 'text-[#F36A4F] font-semibold' : 'text-[#6E6E6E]'
                    }`}
                >
                  {s.label}
                </p>
              </div>
              {idx < 3 && (
                <div className="w-24 h-0.5 bg-[#DBDBDB] mx-4 mt-[-32px]"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px]">
        {/* Step 1: Donor Details */}
        {step === 'donor' && (
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[18px] font-semibold text-[#0D0D0D] mb-4">Donor Details</h2>

            {/* Search Existing Donor */}
            <div className="mb-6 p-[16px] bg-[#E3F2FD] rounded-[12px] border border-[#1976D2]">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-[#1976D2]" />
                <p className="text-[13px] font-semibold text-[#1976D2]">
                  Search Existing Donor
                </p>
              </div>
              <input
                type="text"
                placeholder="Search by name, mobile, email, or PAN..."
                onChange={(e) => handleDonorSearch(e.target.value)}
                className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
              />
              {showDonorSearch && searchResults.length > 0 && (
                <div className="mt-2 bg-white rounded-[12px] border border-[#DBDBDB] max-h-[200px] overflow-y-auto">
                  {searchResults.map((donor) => (
                    <button
                      key={donor.id}
                      onClick={() => selectDonor(donor)}
                      className="w-full p-[12px] text-left hover:bg-[#F8F8F8] border-b border-[#DBDBDB] last:border-0"
                    >
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">{donor.name}</p>
                      <p className="text-[12px] text-[#6E6E6E]">
                        {donor.mobile} • {donor.email}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedDonor && (
              <div className="mb-4 p-[12px] bg-[#E8F5E9] rounded-[12px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
                  <p className="text-[13px] text-[#2E7D32]">
                    Linked to existing donor: <strong>{selectedDonor.name}</strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDonor(null);
                    setDonorName('');
                    setMobile('');
                    setEmail('');
                    setPan('');
                  }}
                  className="text-[12px] text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    PAN Number {parseFloat(amount) > panMandatoryThreshold && '*'}
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                  {parseFloat(amount) > panMandatoryThreshold && (
                    <p className="text-[11px] text-[#E65100] mt-1">
                      PAN is mandatory for donations above ₹{panMandatoryThreshold}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  Address (Optional)
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-[80px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Donor Type
                  </label>
                  <select
                    value={donorType}
                    onChange={(e) => setDonorType(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option>Individual</option>
                    <option>Corporate</option>
                    <option>Anonymous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="Any special notes"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Donation Details */}
        {step === 'donation' && (
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[18px] font-semibold text-[#0D0D0D] mb-4">Donation Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Donation Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option value="">Select category...</option>
                    {DONATION_CATEGORIES.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E]" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        handleAmountChange(isNaN(val) ? '' : Math.max(0, val).toString());
                      }}
                      min="0"
                      className={`w-full h-[44px] pl-[36px] pr-[12px] rounded-[12px] border ${showAmountWarning ? 'border-[#C62828]' : 'border-[#DBDBDB]'
                        } text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]`}
                      placeholder="0.00"
                    />
                  </div>
                  {showAmountWarning && (
                    <div className="mt-2 p-[12px] bg-[#FFEBEE] rounded-[8px] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#C62828] mt-0.5" />
                      <div>
                        <p className="text-[12px] font-semibold text-[#C62828]">
                          Amount exceeds maximum limit
                        </p>
                        <p className="text-[11px] text-[#C62828]">
                          Maximum allowed: ₹{maxAmount.toLocaleString('en-IN')}. Contact Super
                          Admin for override.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Donation Date *
                  </label>
                  <input
                    type="date"
                    value={donationDate}
                    onChange={(e) => setDonationDate(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    80G Applicable
                  </label>
                  <div className="flex items-center gap-3 h-[44px]">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={is80GApplicable}
                        onChange={(e) => setIs80GApplicable(e.target.checked)}
                        className="w-4 h-4 accent-[#F36A4F]"
                      />
                      <span className="text-[14px] text-[#3D3D3D]">
                        Eligible for 80G tax benefit
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  Donation Purpose / Remark (Optional)
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full h-[80px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                  placeholder="Any specific purpose or remark about the donation"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment Mode */}
        {step === 'payment' && (
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[18px] font-semibold text-[#0D0D0D] mb-4">Payment Mode</h2>

            {/* Payment Mode Selection */}
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-3">
                Select Payment Mode *
              </label>
              <div className="grid grid-cols-4 gap-[12px]">
                {PAYMENT_MODES.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPaymentMode(mode)}
                    className={`h-[80px] rounded-[12px] border-2 ${paymentMode === mode
                        ? 'border-[#F36A4F] bg-[#FEF1EE]'
                        : 'border-[#DBDBDB] bg-white'
                      } hover:border-[#F36A4F] transition-colors flex flex-col items-center justify-center gap-2`}
                  >
                    <CreditCard
                      className={`w-5 h-5 ${paymentMode === mode ? 'text-[#F36A4F]' : 'text-[#6E6E6E]'
                        }`}
                    />
                    <span
                      className={`text-[13px] font-medium ${paymentMode === mode ? 'text-[#F36A4F]' : 'text-[#3D3D3D]'
                        }`}
                    >
                      {mode}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Details */}
            {paymentMode === 'Cash' && (
              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <h3 className="text-[14px] font-semibold text-[#0D0D0D] mb-3">Cash Details</h3>
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Cash Received By *
                  </label>
                  <select
                    value={cashReceivedBy}
                    onChange={(e) => setCashReceivedBy(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option value="">Select staff member...</option>
                    <option>Admin User</option>
                    <option>Finance Manager</option>
                    <option>Reception Desk</option>
                  </select>
                </div>
              </div>
            )}

            {/* Cheque Details */}
            {paymentMode === 'Cheque' && (
              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <h3 className="text-[14px] font-semibold text-[#0D0D0D] mb-3">Cheque Details</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-[12px]">
                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Cheque Number *
                      </label>
                      <input
                        type="text"
                        value={chequeNumber}
                        onChange={(e) => setChequeNumber(e.target.value)}
                        className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                        placeholder="6-digit cheque number"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                        placeholder="e.g., HDFC Bank"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Cheque Date *
                    </label>
                    <input
                      type="date"
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Upload Cheque Image (Optional)
                    </label>
                    <button className="w-full h-[44px] px-[12px] rounded-[12px] border-2 border-dashed border-[#DBDBDB] hover:border-[#F36A4F] text-[14px] text-[#6E6E6E] flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose file
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DD Details */}
            {paymentMode === 'DD' && (
              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <h3 className="text-[14px] font-semibold text-[#0D0D0D] mb-3">
                  Demand Draft Details
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-[12px]">
                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        DD Number *
                      </label>
                      <input
                        type="text"
                        value={ddNumber}
                        onChange={(e) => setDdNumber(e.target.value)}
                        className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                        placeholder="DD number"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                        placeholder="e.g., ICICI Bank"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      DD Date *
                    </label>
                    <input
                      type="date"
                      value={ddDate}
                      onChange={(e) => setDdDate(e.target.value)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Details */}
            {paymentMode === 'Bank Transfer' && (
              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <h3 className="text-[14px] font-semibold text-[#0D0D0D] mb-3">
                  Bank Transfer Details
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-[12px]">
                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        UTR / Reference Number *
                      </label>
                      <input
                        type="text"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                        placeholder="12-digit UTR number"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Bank Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                        placeholder="e.g., SBI"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Transfer Date *
                    </label>
                    <input
                      type="date"
                      value={transferDate}
                      onChange={(e) => setTransferDate(e.target.value)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Upload Screenshot (Optional)
                    </label>
                    <button className="w-full h-[44px] px-[12px] rounded-[12px] border-2 border-dashed border-[#DBDBDB] hover:border-[#F36A4F] text-[14px] text-[#6E6E6E] flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose file
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 'review' && (
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[18px] font-semibold text-[#0D0D0D] mb-4">
              Review & Submit E-Challan
            </h2>

            <div className="space-y-4">
              {/* Donor Summary */}
              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Donor Details</h3>
                  <button
                    onClick={() => setStep('donor')}
                    className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-[12px] text-[13px]">
                  <div>
                    <p className="text-[#6E6E6E]">Name:</p>
                    <p className="text-[#0D0D0D] font-medium">{donorName}</p>
                  </div>
                  <div>
                    <p className="text-[#6E6E6E]">Mobile:</p>
                    <p className="text-[#0D0D0D] font-medium">{mobile}</p>
                  </div>
                  {email && (
                    <div>
                      <p className="text-[#6E6E6E]">Email:</p>
                      <p className="text-[#0D0D0D] font-medium">{email}</p>
                    </div>
                  )}
                  {pan && (
                    <div>
                      <p className="text-[#6E6E6E]">PAN:</p>
                      <p className="text-[#0D0D0D] font-medium">{pan}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Donation Summary */}
              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Donation Details</h3>
                  <button
                    onClick={() => setStep('donation')}
                    className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-[12px] text-[13px]">
                  <div>
                    <p className="text-[#6E6E6E]">Category:</p>
                    <p className="text-[#0D0D0D] font-medium">{category}</p>
                  </div>
                  <div>
                    <p className="text-[#6E6E6E]">Amount:</p>
                    <p className="text-[#0D0D0D] font-semibold text-[18px]">
                      ₹{parseFloat(amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6E6E6E]">Date:</p>
                    <p className="text-[#0D0D0D] font-medium">{donationDate}</p>
                  </div>
                  <div>
                    <p className="text-[#6E6E6E]">80G:</p>
                    <p className="text-[#0D0D0D] font-medium">
                      {is80GApplicable ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Payment Details</h3>
                  <button
                    onClick={() => setStep('payment')}
                    className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-[13px]">
                  <p className="text-[#6E6E6E] mb-1">Mode:</p>
                  <p className="text-[#0D0D0D] font-medium mb-2">{paymentMode}</p>

                  {paymentMode === 'Cash' && (
                    <p className="text-[#3D3D3D]">Received by: {cashReceivedBy}</p>
                  )}
                  {paymentMode === 'Cheque' && (
                    <div className="space-y-1">
                      <p className="text-[#3D3D3D]">Cheque No: {chequeNumber}</p>
                      <p className="text-[#3D3D3D]">Bank: {bankName}</p>
                      <p className="text-[#3D3D3D]">Date: {chequeDate}</p>
                    </div>
                  )}
                  {paymentMode === 'DD' && (
                    <div className="space-y-1">
                      <p className="text-[#3D3D3D]">DD No: {ddNumber}</p>
                      <p className="text-[#3D3D3D]">Bank: {bankName}</p>
                      <p className="text-[#3D3D3D]">Date: {ddDate}</p>
                    </div>
                  )}
                  {paymentMode === 'Bank Transfer' && (
                    <div className="space-y-1">
                      <p className="text-[#3D3D3D]">UTR: {utrNumber}</p>
                      <p className="text-[#3D3D3D]">Date: {transferDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[#DBDBDB] flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'donation') setStep('donor');
              else if (step === 'payment') setStep('donation');
              else if (step === 'review') setStep('payment');
            }}
            disabled={step === 'donor'}
            className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-3">
            <button className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Draft
            </button>

            {step !== 'review' ? (
              <button
                onClick={() => {
                  if (step === 'donor' && canProceedFromDonor()) setStep('donation');
                  else if (step === 'donation' && canProceedFromDonation()) setStep('payment');
                  else if (step === 'payment' && canProceedFromPayment()) setStep('review');
                }}
                disabled={
                  (step === 'donor' && !canProceedFromDonor()) ||
                  (step === 'donation' && !canProceedFromDonation()) ||
                  (step === 'payment' && !canProceedFromPayment())
                }
                className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Submit E-Challan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-[480px]">
            <div className="p-[24px] text-center">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#2E7D32]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#0D0D0D] mb-2">
                E-Challan Created Successfully!
              </h3>
              <p className="text-[14px] text-[#6E6E6E] mb-4">
                E-Challan Number: <strong className="text-[#0D0D0D]">{generatedChallanNo}</strong>
              </p>
              <p className="text-[13px] text-[#6E6E6E] mb-6">
                Status: Pending Verification
                {paymentMode === 'Cash' && ' (Will auto-verify)'}
              </p>

              <div className="flex items-center gap-3">
                <button className="flex-1 h-[44px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print Challan
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 h-[44px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
