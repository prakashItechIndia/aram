import { useState } from 'react';
import {
  Settings,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Play,
  ChevronRight,
  Activity,
} from 'lucide-react';

type TabType =
  | 'general'
  | 'razorpay'
  | 'paytm'
  | 'webhooks'
  | 'fees'
  | 'retry'
  | 'reconciliation'
  | 'refund'
  | 'diagnostics';

type Environment = 'test' | 'live';
type Gateway = 'razorpay' | 'paytm';

interface WebhookEvent {
  id: string;
  time: string;
  gateway: Gateway;
  eventType: string;
  paymentId: string;
  status: 'success' | 'failed';
  signatureValid: boolean;
  notes: string;
}

interface RefundApproval {
  id: string;
  paymentId: string;
  amount: number;
  requestedBy: string;
  reason: string;
  timestamp: string;
}

export function GatewaySettings() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [environment, setEnvironment] = useState<Environment>('test');
  const [showEnvWarning, setShowEnvWarning] = useState(false);

  // General settings
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [paytmEnabled, setPaytmEnabled] = useState(true);
  const [defaultGateway, setDefaultGateway] = useState<Gateway>('razorpay');
  const [fallbackGateway, setFallbackGateway] = useState<Gateway | 'none'>('paytm');
  const [autoFallback, setAutoFallback] = useState(true);

  // Payment methods
  const [allowedMethods, setAllowedMethods] = useState({
    upi: true,
    cards: true,
    netbanking: true,
    wallet: true,
  });

  // Razorpay credentials
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_test_1234567890');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('••••••••••••••••');
  const [razorpayWebhookSecret, setRazorpayWebhookSecret] = useState('••••••••••••••••');
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [showRazorpayWebhook, setShowRazorpayWebhook] = useState(false);

  // Paytm credentials
  const [paytmMerchantId, setPaytmMerchantId] = useState('ARAM12345678901234');
  const [paytmMerchantKey, setPaytmMerchantKey] = useState('••••••••••••••••');
  const [showPaytmKey, setShowPaytmKey] = useState(false);

  // Fees
  const [razorpayFeePercent, setRazorpayFeePercent] = useState('2.0');
  const [razorpayFixedFee, setRazorpayFixedFee] = useState('3');
  const [razorpayTaxPercent, setRazorpayTaxPercent] = useState('18');
  const [razorpayFoundationAbsorbs, setRazorpayFoundationAbsorbs] = useState(true);
  const [paytmFeePercent, setPaytmFeePercent] = useState('1.99');
  const [paytmFixedFee, setPaytmFixedFee] = useState('0');
  const [paytmTaxPercent, setPaytmTaxPercent] = useState('18');
  const [paytmFoundationAbsorbs, setPaytmFoundationAbsorbs] = useState(true);
  const [feePreviewAmount, setFeePreviewAmount] = useState('1000');

  // Retry settings
  const [autoRetry, setAutoRetry] = useState(true);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState(3);
  const [retrySchedule, setRetrySchedule] = useState('5min');
  const [retryOnlyTimeouts, setRetryOnlyTimeouts] = useState(true);
  const [neverRetryUserCancelled, setNeverRetryUserCancelled] = useState(true);
  const [suggestAlternate, setSuggestAlternate] = useState(true);

  // Refund settings
  const [refundThreshold, setRefundThreshold] = useState('10000');
  const [partialRefundsAllowed, setPartialRefundsAllowed] = useState(true);
  const [refundWindow, setRefundWindow] = useState('90');
  const [autoUpdateReceipt, setAutoUpdateReceipt] = useState(true);

  // Modals
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonModalType, setReasonModalType] = useState<
    'save' | 'env' | 'rotate' | 'replay' | 'approve' | 'reject'
  >('save');
  const [saveReason, setSaveReason] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Drawers
  const [showWebhookDrawer, setShowWebhookDrawer] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEvent | null>(null);

  // Mock data
  const webhookEvents: WebhookEvent[] = [
    {
      id: 'wh_001',
      time: '2026-01-20 14:35:22',
      gateway: 'razorpay',
      eventType: 'payment.captured',
      paymentId: 'pay_123456789',
      status: 'success',
      signatureValid: true,
      notes: 'Payment successful',
    },
    {
      id: 'wh_002',
      time: '2026-01-20 14:22:11',
      gateway: 'paytm',
      eventType: 'payment.failed',
      paymentId: 'pay_987654321',
      status: 'failed',
      signatureValid: true,
      notes: 'Insufficient balance',
    },
    {
      id: 'wh_003',
      time: '2026-01-20 13:45:30',
      gateway: 'razorpay',
      eventType: 'refund.created',
      paymentId: 'pay_456789123',
      status: 'success',
      signatureValid: false,
      notes: 'Signature validation failed',
    },
  ];

  const refundApprovals: RefundApproval[] = [
    {
      id: 'ref_001',
      paymentId: 'pay_123456789',
      amount: 15000,
      requestedBy: 'Admin User',
      reason: 'Duplicate payment by donor',
      timestamp: '2026-01-20 12:30:00',
    },
    {
      id: 'ref_002',
      paymentId: 'pay_987654321',
      amount: 25000,
      requestedBy: 'Finance Manager',
      reason: 'Donor requested cancellation',
      timestamp: '2026-01-20 11:15:00',
    },
  ];

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'razorpay', label: 'Razorpay' },
    { id: 'paytm', label: 'Paytm' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'fees', label: 'Fees' },
    { id: 'retry', label: 'Retry & Fallback' },
    { id: 'reconciliation', label: 'Reconciliation' },
    { id: 'refund', label: 'Refund Rules' },
    { id: 'diagnostics', label: 'Diagnostics' },
  ];

  const handleSave = () => {
    setReasonModalType('save');
    setShowReasonModal(true);
  };

  const handleEnvironmentSwitch = (env: Environment) => {
    if (env === 'live' && environment === 'test') {
      setShowEnvWarning(true);
      setReasonModalType('env');
      setShowReasonModal(true);
    } else {
      setEnvironment(env);
    }
  };

  const confirmSave = () => {
    if (!saveReason.trim()) return;
    console.log('Saving with reason:', saveReason);
    setShowReasonModal(false);
    setSaveReason('');
    setHasChanges(false);

    if (reasonModalType === 'env' && showEnvWarning) {
      setEnvironment('live');
      setShowEnvWarning(false);
    }
  };

  const calculateFees = (amount: string, gateway: Gateway) => {
    const amt = parseFloat(amount) || 0;
    const feePercent =
      gateway === 'razorpay'
        ? parseFloat(razorpayFeePercent)
        : parseFloat(paytmFeePercent);
    const fixedFee =
      gateway === 'razorpay'
        ? parseFloat(razorpayFixedFee)
        : parseFloat(paytmFixedFee);
    const taxPercent =
      gateway === 'razorpay'
        ? parseFloat(razorpayTaxPercent)
        : parseFloat(paytmTaxPercent);

    const gatewayFee = (amt * feePercent) / 100 + fixedFee;
    const tax = (gatewayFee * taxPercent) / 100;
    const netAmount = amt - gatewayFee - tax;

    return {
      gross: amt.toFixed(2),
      fee: gatewayFee.toFixed(2),
      tax: tax.toFixed(2),
      net: netAmount.toFixed(2),
    };
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-[4px]">
            Gateway Settings
          </h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Manage payment providers, security, fees, and operational controls
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <button className="h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors">
            Test Configuration
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#D7563D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Gateway Summary Cards */}
      <div className="grid grid-cols-2 gap-[16px]">
        {/* Razorpay Card */}
        <div className="bg-white border border-[#DBDBDB] rounded-[16px] p-[24px]">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[48px] h-[48px] bg-[#4353FF] bg-opacity-10 rounded-[12px] flex items-center justify-center">
                <span className="text-[18px] font-semibold text-[#4353FF]">R</span>
              </div>
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">
                  Razorpay
                </h3>
                <div className="flex items-center gap-[8px] mt-[4px]">
                  <span
                    className={`px-[8px] py-[2px] rounded-[4px] text-[13px] leading-[18px] font-medium ${
                      razorpayEnabled
                        ? 'bg-[#D4F4DD] text-[#0E6027]'
                        : 'bg-[#F3F3F3] text-[#6E6E6E]'
                    }`}
                  >
                    {razorpayEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <span className="px-[8px] py-[2px] bg-[#FEF1EE] text-[#F36A4F] rounded-[4px] text-[13px] leading-[18px] font-medium">
                    {environment === 'test' ? 'Test' : 'Live'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[6px]">
              <Activity className="w-4 h-4 text-[#0E6027]" />
              <span className="text-[13px] leading-[18px] font-medium text-[#0E6027]">
                Healthy
              </span>
            </div>
          </div>
          <div className="space-y-[8px] mb-[16px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                Last webhook
              </span>
              <span className="text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                2 minutes ago
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('razorpay')}
            className="w-full h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors flex items-center justify-center gap-2"
          >
            Configure Razorpay
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Paytm Card */}
        <div className="bg-white border border-[#DBDBDB] rounded-[16px] p-[24px]">
          <div className="flex items-start justify-between mb-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[48px] h-[48px] bg-[#00BAF2] bg-opacity-10 rounded-[12px] flex items-center justify-center">
                <span className="text-[18px] font-semibold text-[#00BAF2]">P</span>
              </div>
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">
                  Paytm
                </h3>
                <div className="flex items-center gap-[8px] mt-[4px]">
                  <span
                    className={`px-[8px] py-[2px] rounded-[4px] text-[13px] leading-[18px] font-medium ${
                      paytmEnabled
                        ? 'bg-[#D4F4DD] text-[#0E6027]'
                        : 'bg-[#F3F3F3] text-[#6E6E6E]'
                    }`}
                  >
                    {paytmEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <span className="px-[8px] py-[2px] bg-[#FEF1EE] text-[#F36A4F] rounded-[4px] text-[13px] leading-[18px] font-medium">
                    {environment === 'test' ? 'Test' : 'Live'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[6px]">
              <Activity className="w-4 h-4 text-[#0E6027]" />
              <span className="text-[13px] leading-[18px] font-medium text-[#0E6027]">
                Healthy
              </span>
            </div>
          </div>
          <div className="space-y-[8px] mb-[16px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                Last webhook
              </span>
              <span className="text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                12 minutes ago
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('paytm')}
            className="w-full h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors flex items-center justify-center gap-2"
          >
            Configure Paytm
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center gap-[4px] px-[16px] py-[12px] border-b border-[#DBDBDB] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-[16px] h-[44px] rounded-[8px] text-[14px] leading-[20px] font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#FEF1EE] text-[#F36A4F]'
                  : 'text-[#6E6E6E] hover:bg-[#F3F3F3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-[24px]">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-[24px]">
              {/* Environment Control */}
              <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[24px]">
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Environment Control
                </h3>
                <div className="flex items-center gap-[12px]">
                  <button
                    onClick={() => handleEnvironmentSwitch('test')}
                    className={`px-[24px] h-[44px] rounded-[999px] text-[16px] leading-[24px] font-medium transition-colors ${
                      environment === 'test'
                        ? 'bg-[#F36A4F] text-white'
                        : 'bg-white border border-[#DBDBDB] text-[#3D3D3D] hover:bg-[#F3F3F3]'
                    }`}
                  >
                    Test
                  </button>
                  <button
                    onClick={() => handleEnvironmentSwitch('live')}
                    className={`px-[24px] h-[44px] rounded-[999px] text-[16px] leading-[24px] font-medium transition-colors ${
                      environment === 'live'
                        ? 'bg-[#F36A4F] text-white'
                        : 'bg-white border border-[#DBDBDB] text-[#3D3D3D] hover:bg-[#F3F3F3]'
                    }`}
                  >
                    Live
                  </button>
                </div>
              </div>

              {/* Provider Controls */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Provider Controls
                </h3>
                <div className="space-y-[16px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Enable Razorpay
                    </label>
                    <button
                      onClick={() => {
                        setRazorpayEnabled(!razorpayEnabled);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        razorpayEnabled ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          razorpayEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Enable Paytm
                    </label>
                    <button
                      onClick={() => {
                        setPaytmEnabled(!paytmEnabled);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        paytmEnabled ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          paytmEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Default Gateway
                    </label>
                    <select
                      value={defaultGateway}
                      onChange={(e) => {
                        setDefaultGateway(e.target.value as Gateway);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="razorpay">Razorpay</option>
                      <option value="paytm">Paytm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Fallback Gateway
                    </label>
                    <select
                      value={fallbackGateway}
                      onChange={(e) => {
                        setFallbackGateway(e.target.value as Gateway | 'none');
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="none">None</option>
                      <option value="razorpay">Razorpay</option>
                      <option value="paytm">Paytm</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Auto fallback when payment fails
                    </label>
                    <button
                      onClick={() => {
                        setAutoFallback(!autoFallback);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoFallback ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoFallback ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkout Rules */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Checkout Rules
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[12px]">
                      Allowed Payment Methods
                    </label>
                    <div className="grid grid-cols-2 gap-[12px]">
                      {Object.entries(allowedMethods).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center gap-[12px] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => {
                              setAllowedMethods((prev) => ({
                                ...prev,
                                [key]: !value,
                              }));
                              setHasChanges(true);
                            }}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F] focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D] capitalize">
                            {key}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Statement Descriptor
                    </label>
                    <input
                      type="text"
                      defaultValue="ARAM FOUNDATION"
                      onChange={() => setHasChanges(true)}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                    <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                      Appears in bank statements
                    </p>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Checkout Theme Color
                    </label>
                    <div className="flex items-center gap-[12px]">
                      <div className="w-[44px] h-[44px] bg-[#F36A4F] rounded-[8px] border border-[#DBDBDB]" />
                      <span className="text-[16px] leading-[24px] text-[#3D3D3D]">
                        #F36A4F
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Razorpay Tab */}
          {activeTab === 'razorpay' && (
            <div className="space-y-[24px]">
              {/* Credentials Card */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Credentials ({environment === 'test' ? 'Test' : 'Live'} Mode)
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Key ID
                    </label>
                    <input
                      type="text"
                      value={razorpayKeyId}
                      onChange={(e) => {
                        setRazorpayKeyId(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Key Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showRazorpaySecret ? 'text' : 'password'}
                        value={razorpayKeySecret}
                        onChange={(e) => {
                          setRazorpayKeySecret(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full h-[44px] px-[14px] pr-[48px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                      <button
                        onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                        className="absolute right-[14px] top-1/2 -translate-y-1/2"
                      >
                        {showRazorpaySecret ? (
                          <EyeOff className="w-5 h-5 text-[#6E6E6E]" />
                        ) : (
                          <Eye className="w-5 h-5 text-[#6E6E6E]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Webhook Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showRazorpayWebhook ? 'text' : 'password'}
                        value={razorpayWebhookSecret}
                        onChange={(e) => {
                          setRazorpayWebhookSecret(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full h-[44px] px-[14px] pr-[48px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                      <button
                        onClick={() => setShowRazorpayWebhook(!showRazorpayWebhook)}
                        className="absolute right-[14px] top-1/2 -translate-y-1/2"
                      >
                        {showRazorpayWebhook ? (
                          <EyeOff className="w-5 h-5 text-[#6E6E6E]" />
                        ) : (
                          <Eye className="w-5 h-5 text-[#6E6E6E]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Merchant Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Aram Razorpay Live"
                      onChange={() => setHasChanges(true)}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                  </div>

                  <div className="flex items-center gap-[12px] pt-[8px]">
                    <button className="h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors">
                      Verify Credentials
                    </button>
                    <button
                      onClick={() => {
                        setReasonModalType('rotate');
                        setShowReasonModal(true);
                      }}
                      className="h-[44px] px-[18px] border border-[#F36A4F] text-[#F36A4F] rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#FEF1EE] transition-colors"
                    >
                      Rotate Secret
                    </button>
                  </div>
                </div>
              </div>

              {/* Webhook Details */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Webhook Details
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Webhook URL
                    </label>
                    <input
                      type="text"
                      value="https://admin.aramfoundation.org/api/webhooks/razorpay"
                      readOnly
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-[#F3F3F3] border border-[#DBDBDB] rounded-[16px] text-[#6E6E6E]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Signature Verification
                    </label>
                    <button
                      className="relative w-[52px] h-[32px] rounded-[999px] bg-[#F36A4F] cursor-not-allowed opacity-75"
                      disabled
                    >
                      <div className="absolute top-[2px] translate-x-[22px] w-[28px] h-[28px] bg-white rounded-full shadow-sm" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-[16px] bg-[#FAFAFA] rounded-[16px]">
                    <div>
                      <p className="text-[14px] leading-[20px] font-medium text-[#0D0D0D]">
                        Last Webhook Received
                      </p>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[4px]">
                        2026-01-20 14:35:22
                      </p>
                    </div>
                    <span className="px-[12px] py-[6px] bg-[#D4F4DD] text-[#0E6027] rounded-[999px] text-[13px] leading-[18px] font-medium">
                      Success
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('webhooks')}
                    className="h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
                  >
                    View Webhook Logs
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Payment Methods
                </h3>
                <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-[12px]">
                  Disabling a method hides it from checkout
                </p>
                <div className="space-y-[12px]">
                  {Object.entries(allowedMethods).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D] capitalize">
                        {key}
                      </label>
                      <button
                        onClick={() => {
                          setAllowedMethods((prev) => ({ ...prev, [key]: !value }));
                          setHasChanges(true);
                        }}
                        className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                          value ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                            value ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Paytm Tab */}
          {activeTab === 'paytm' && (
            <div className="space-y-[24px]">
              {/* Credentials Card */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Credentials ({environment === 'test' ? 'Test' : 'Live'} Mode)
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Merchant ID
                    </label>
                    <input
                      type="text"
                      value={paytmMerchantId}
                      onChange={(e) => {
                        setPaytmMerchantId(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Merchant Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPaytmKey ? 'text' : 'password'}
                        value={paytmMerchantKey}
                        onChange={(e) => {
                          setPaytmMerchantKey(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full h-[44px] px-[14px] pr-[48px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                      <button
                        onClick={() => setShowPaytmKey(!showPaytmKey)}
                        className="absolute right-[14px] top-1/2 -translate-y-1/2"
                      >
                        {showPaytmKey ? (
                          <EyeOff className="w-5 h-5 text-[#6E6E6E]" />
                        ) : (
                          <Eye className="w-5 h-5 text-[#6E6E6E]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Website Name
                    </label>
                    <input
                      type="text"
                      defaultValue="ARAMWEBSTAGING"
                      onChange={() => setHasChanges(true)}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Callback URL
                    </label>
                    <input
                      type="text"
                      value="https://admin.aramfoundation.org/api/callbacks/paytm"
                      readOnly
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-[#F3F3F3] border border-[#DBDBDB] rounded-[16px] text-[#6E6E6E]"
                    />
                  </div>

                  <div className="flex items-center gap-[12px] pt-[8px]">
                    <button className="h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors">
                      Verify Credentials
                    </button>
                    <button
                      onClick={() => {
                        setReasonModalType('rotate');
                        setShowReasonModal(true);
                      }}
                      className="h-[44px] px-[18px] border border-[#F36A4F] text-[#F36A4F] rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#FEF1EE] transition-colors"
                    >
                      Rotate Secret
                    </button>
                  </div>
                </div>
              </div>

              {/* Webhook Card */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Webhook Details
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Webhook URL
                    </label>
                    <input
                      type="text"
                      value="https://admin.aramfoundation.org/api/webhooks/paytm"
                      readOnly
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-[#F3F3F3] border border-[#DBDBDB] rounded-[16px] text-[#6E6E6E]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Verify Signature
                    </label>
                    <button
                      className="relative w-[52px] h-[32px] rounded-[999px] bg-[#F36A4F]"
                      onClick={() => setHasChanges(true)}
                    >
                      <div className="absolute top-[2px] translate-x-[22px] w-[28px] h-[28px] bg-white rounded-full shadow-sm" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-[16px] bg-[#FAFAFA] rounded-[16px]">
                    <div>
                      <p className="text-[14px] leading-[20px] font-medium text-[#0D0D0D]">
                        Last Webhook Received
                      </p>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[4px]">
                        2026-01-20 14:22:11
                      </p>
                    </div>
                    <span className="px-[12px] py-[6px] bg-[#D4F4DD] text-[#0E6027] rounded-[999px] text-[13px] leading-[18px] font-medium">
                      Success
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('webhooks')}
                    className="h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
                  >
                    View Webhook Logs
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Payment Methods
                </h3>
                <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-[12px]">
                  Disabling a method hides it from checkout
                </p>
                <div className="space-y-[12px]">
                  {Object.entries(allowedMethods).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D] capitalize">
                        {key}
                      </label>
                      <button
                        onClick={() => {
                          setAllowedMethods((prev) => ({ ...prev, [key]: !value }));
                          setHasChanges(true);
                        }}
                        className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                          value ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                            value ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <div className="space-y-[24px]">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-[16px]">
                <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[16px]">
                  <p className="text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[8px]">
                    Total Today
                  </p>
                  <p className="text-[28px] leading-[36px] font-bold text-[#0D0D0D]">324</p>
                </div>
                <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[16px]">
                  <p className="text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[8px]">
                    Failed Signatures
                  </p>
                  <p className="text-[28px] leading-[36px] font-bold text-[#F36A4F]">2</p>
                </div>
                <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[16px]">
                  <p className="text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[8px]">
                    Avg Latency
                  </p>
                  <p className="text-[28px] leading-[36px] font-bold text-[#0D0D0D]">
                    1.2<span className="text-[16px] leading-[24px]">s</span>
                  </p>
                </div>
                <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[16px]">
                  <p className="text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[8px]">
                    Missing Callbacks
                  </p>
                  <p className="text-[28px] leading-[36px] font-bold text-[#F36A4F]">1</p>
                </div>
              </div>

              {/* Webhook Events Table */}
              <div className="border border-[#DBDBDB] rounded-[16px] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                      <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                        Time
                      </th>
                      <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                        Gateway
                      </th>
                      <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                        Event Type
                      </th>
                      <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                        Payment ID
                      </th>
                      <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                        Status
                      </th>
                      <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                        Signature
                      </th>
                      <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhookEvents.map((event) => (
                      <tr key={event.id} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA]">
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          {event.time}
                        </td>
                        <td className="px-[16px] py-[12px]">
                          <span className="capitalize text-[14px] leading-[20px] text-[#3D3D3D]">
                            {event.gateway}
                          </span>
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          {event.eventType}
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D] font-mono">
                          {event.paymentId}
                        </td>
                        <td className="px-[16px] py-[12px]">
                          <span
                            className={`px-[8px] py-[2px] rounded-[4px] text-[13px] leading-[18px] font-medium ${
                              event.status === 'success'
                                ? 'bg-[#D4F4DD] text-[#0E6027]'
                                : 'bg-[#FFE5E5] text-[#C41E3A]'
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-[16px] py-[12px]">
                          {event.signatureValid ? (
                            <Check className="w-5 h-5 text-[#0E6027]" />
                          ) : (
                            <X className="w-5 h-5 text-[#C41E3A]" />
                          )}
                        </td>
                        <td className="px-[16px] py-[12px]">
                          <div className="flex items-center gap-[8px]">
                            <button
                              onClick={() => {
                                setSelectedWebhook(event);
                                setShowWebhookDrawer(true);
                              }}
                              className="text-[14px] leading-[20px] text-[#F36A4F] hover:underline"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setReasonModalType('replay');
                                setShowReasonModal(true);
                              }}
                              className="text-[14px] leading-[20px] text-[#F36A4F] hover:underline"
                            >
                              Replay
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === 'fees' && (
            <div className="grid grid-cols-3 gap-[24px]">
              <div className="col-span-2 space-y-[24px]">
                {/* Razorpay Fees */}
                <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[24px]">
                  <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                    Razorpay Fee Rules
                  </h3>
                  <div className="space-y-[16px]">
                    <div className="grid grid-cols-2 gap-[12px]">
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Fee %
                        </label>
                        <input
                          type="number"
                          value={razorpayFeePercent}
                          onChange={(e) => {
                            setRazorpayFeePercent(e.target.value);
                            setHasChanges(true);
                          }}
                          step="0.01"
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Fixed Fee ₹
                        </label>
                        <input
                          type="number"
                          value={razorpayFixedFee}
                          onChange={(e) => {
                            setRazorpayFixedFee(e.target.value);
                            setHasChanges(true);
                          }}
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                        Tax % (GST)
                      </label>
                      <input
                        type="number"
                        value={razorpayTaxPercent}
                        onChange={(e) => {
                          setRazorpayTaxPercent(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                        Foundation absorbs fee
                      </label>
                      <button
                        onClick={() => {
                          setRazorpayFoundationAbsorbs(!razorpayFoundationAbsorbs);
                          setHasChanges(true);
                        }}
                        className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                          razorpayFoundationAbsorbs ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                            razorpayFoundationAbsorbs
                              ? 'translate-x-[22px]'
                              : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Paytm Fees */}
                <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[24px]">
                  <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                    Paytm Fee Rules
                  </h3>
                  <div className="space-y-[16px]">
                    <div className="grid grid-cols-2 gap-[12px]">
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Fee %
                        </label>
                        <input
                          type="number"
                          value={paytmFeePercent}
                          onChange={(e) => {
                            setPaytmFeePercent(e.target.value);
                            setHasChanges(true);
                          }}
                          step="0.01"
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Fixed Fee ₹
                        </label>
                        <input
                          type="number"
                          value={paytmFixedFee}
                          onChange={(e) => {
                            setPaytmFixedFee(e.target.value);
                            setHasChanges(true);
                          }}
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                        Tax % (GST)
                      </label>
                      <input
                        type="number"
                        value={paytmTaxPercent}
                        onChange={(e) => {
                          setPaytmTaxPercent(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                        Foundation absorbs fee
                      </label>
                      <button
                        onClick={() => {
                          setPaytmFoundationAbsorbs(!paytmFoundationAbsorbs);
                          setHasChanges(true);
                        }}
                        className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                          paytmFoundationAbsorbs ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                            paytmFoundationAbsorbs
                              ? 'translate-x-[22px]'
                              : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Preview Card */}
              <div className="bg-white border border-[#DBDBDB] rounded-[16px] p-[24px] h-fit sticky top-[24px]">
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Fee Preview
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Donation Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] leading-[24px] text-[#6E6E6E]">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={feePreviewAmount}
                        onChange={(e) => setFeePreviewAmount(e.target.value)}
                        className="w-full h-[44px] pl-[32px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                    </div>
                  </div>

                  <div className="pt-[16px] border-t border-[#DBDBDB] space-y-[12px]">
                    {(() => {
                      const fees = calculateFees(feePreviewAmount, defaultGateway);
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                              Gross Amount
                            </span>
                            <span className="text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                              ₹{fees.gross}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                              Gateway Fee
                            </span>
                            <span className="text-[14px] leading-[20px] font-medium text-[#F36A4F]">
                              -₹{fees.fee}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                              Tax (GST)
                            </span>
                            <span className="text-[14px] leading-[20px] font-medium text-[#F36A4F]">
                              -₹{fees.tax}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-[12px] border-t border-[#DBDBDB]">
                            <span className="text-[16px] leading-[24px] font-semibold text-[#0D0D0D]">
                              Net Amount
                            </span>
                            <span className="text-[18px] leading-[26px] font-bold text-[#0E6027]">
                              ₹{fees.net}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="pt-[12px] border-t border-[#DBDBDB]">
                    <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                      Using {defaultGateway === 'razorpay' ? 'Razorpay' : 'Paytm'} fee structure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Retry & Fallback Tab */}
          {activeTab === 'retry' && (
            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Retry Policy
                </h3>
                <div className="space-y-[16px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Auto-retry failed payments
                    </label>
                    <button
                      onClick={() => {
                        setAutoRetry(!autoRetry);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoRetry ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoRetry ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  {autoRetry && (
                    <>
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Max Retry Attempts
                        </label>
                        <input
                          type="number"
                          value={maxRetryAttempts}
                          onChange={(e) => {
                            setMaxRetryAttempts(parseInt(e.target.value));
                            setHasChanges(true);
                          }}
                          min="0"
                          max="5"
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>

                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Retry Schedule
                        </label>
                        <select
                          value={retrySchedule}
                          onChange={(e) => {
                            setRetrySchedule(e.target.value);
                            setHasChanges(true);
                          }}
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="5min">5 minutes</option>
                          <option value="30min">30 minutes</option>
                        </select>
                      </div>

                      <div className="space-y-[12px]">
                        <label className="flex items-center gap-[12px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={retryOnlyTimeouts}
                            onChange={() => {
                              setRetryOnlyTimeouts(!retryOnlyTimeouts);
                              setHasChanges(true);
                            }}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                            Retry only network/timeouts
                          </span>
                        </label>

                        <label className="flex items-center gap-[12px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={neverRetryUserCancelled}
                            onChange={() => {
                              setNeverRetryUserCancelled(!neverRetryUserCancelled);
                              setHasChanges(true);
                            }}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                            Never retry user-cancelled
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-[16px] border-t border-[#DBDBDB]">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Suggest alternate gateway after failure
                    </label>
                    <button
                      onClick={() => {
                        setSuggestAlternate(!suggestAlternate);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        suggestAlternate ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          suggestAlternate ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulation Card */}
              <div className="bg-[#FEF1EE] border border-[#F36A4F] rounded-[16px] p-[24px]">
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Failure Simulation
                </h3>
                <div className="space-y-[12px]">
                  <div>
                    <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">
                      Choose failure type
                    </label>
                    <select className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20">
                      <option>Network timeout</option>
                      <option>Payment declined</option>
                      <option>User cancelled</option>
                    </select>
                  </div>
                  <div className="p-[16px] bg-white rounded-[8px]">
                    <p className="text-[14px] leading-[20px] text-[#3D3D3D]">
                      <strong>System will:</strong> Retry up to {maxRetryAttempts} times at{' '}
                      {retrySchedule} intervals, then suggest {fallbackGateway} gateway
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reconciliation Tab */}
          {activeTab === 'reconciliation' && (
            <div className="flex items-center justify-center py-[48px]">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-[#FEF1EE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-[#F36A4F]" />
                </div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-2">
                  Reconciliation Settings
                </h3>
                <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-4">
                  Detailed reconciliation settings are available in Payments → Reconciliation
                </p>
                <button
                  onClick={() => window.location.href = '/payments/reconciliation'}
                  className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#D7563D] transition-colors"
                >
                  Go to Reconciliation
                </button>
              </div>
            </div>
          )}

          {/* Refund Rules Tab */}
          {activeTab === 'refund' && (
            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Refund Configuration
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Refund Approval Threshold
                    </label>
                    <div className="relative">
                      <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] leading-[24px] text-[#6E6E6E]">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={refundThreshold}
                        onChange={(e) => {
                          setRefundThreshold(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full h-[44px] pl-[32px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                    </div>
                    <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                      Refunds above this amount require approval (default: ₹10,000)
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Partial refunds allowed
                    </label>
                    <button
                      onClick={() => {
                        setPartialRefundsAllowed(!partialRefundsAllowed);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        partialRefundsAllowed ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          partialRefundsAllowed ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Refund Window (days)
                    </label>
                    <input
                      type="number"
                      value={refundWindow}
                      onChange={(e) => {
                        setRefundWindow(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                    <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                      Maximum days after payment within which refund is allowed
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Auto-update receipt status on refund
                    </label>
                    <button
                      onClick={() => {
                        setAutoUpdateReceipt(!autoUpdateReceipt);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoUpdateReceipt ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoUpdateReceipt ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Approval Queue */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Pending Approvals
                </h3>
                <div className="border border-[#DBDBDB] rounded-[16px] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Payment ID
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Amount
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Requested By
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Reason
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {refundApprovals.map((approval) => (
                        <tr
                          key={approval.id}
                          className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA]"
                        >
                          <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D] font-mono">
                            {approval.paymentId}
                          </td>
                          <td className="px-[16px] py-[12px] text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                            ₹{approval.amount.toLocaleString()}
                          </td>
                          <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                            {approval.requestedBy}
                          </td>
                          <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                            {approval.reason}
                          </td>
                          <td className="px-[16px] py-[12px]">
                            <div className="flex items-center gap-[8px]">
                              <button
                                onClick={() => {
                                  setReasonModalType('approve');
                                  setShowReasonModal(true);
                                }}
                                className="px-[12px] py-[6px] bg-[#D4F4DD] text-[#0E6027] rounded-[999px] text-[13px] leading-[18px] font-medium hover:bg-[#C0EDCB] transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setReasonModalType('reject');
                                  setShowReasonModal(true);
                                }}
                                className="px-[12px] py-[6px] bg-[#FFE5E5] text-[#C41E3A] rounded-[999px] text-[13px] leading-[18px] font-medium hover:bg-[#FFD0D0] transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostics Tab */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-[24px]">
              {/* Health Cards */}
              <div className="grid grid-cols-2 gap-[16px]">
                <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[24px]">
                  <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                    Razorpay Health
                  </h3>
                  <div className="space-y-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">Status</span>
                      <span className="flex items-center gap-[6px] text-[14px] leading-[20px] font-medium text-[#0E6027]">
                        <Activity className="w-4 h-4" />
                        Healthy
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                        Last Verified
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        5 mins ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                        Webhook Latency
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">1.1s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                        Failed (24h)
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">3</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px] p-[24px]">
                  <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                    Paytm Health
                  </h3>
                  <div className="space-y-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">Status</span>
                      <span className="flex items-center gap-[6px] text-[14px] leading-[20px] font-medium text-[#0E6027]">
                        <Activity className="w-4 h-4" />
                        Healthy
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                        Last Verified
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        8 mins ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                        Webhook Latency
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">1.4s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                        Failed (24h)
                      </span>
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools Section */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Diagnostic Tools
                </h3>
                <div className="space-y-[12px]">
                  <button className="w-full h-[44px] px-[18px] border border-[#DBDBDB] rounded-[16px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors flex items-center justify-between">
                    <span>Sync transactions (last 24h)</span>
                    <RefreshCw className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-[12px]">
                    <input
                      type="text"
                      placeholder="Enter Payment ID"
                      className="flex-1 h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                    <button className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#D7563D] transition-colors">
                      Sync by ID
                    </button>
                  </div>

                  <button className="w-full h-[44px] px-[18px] border border-[#F36A4F] text-[#F36A4F] rounded-[16px] text-[16px] leading-[24px] font-medium hover:bg-[#FEF1EE] transition-colors flex items-center justify-between">
                    <span>Download gateway error log (Super Admin)</span>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Recent Errors */}
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Recent Errors
                </h3>
                <div className="border border-[#DBDBDB] rounded-[16px] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Time
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Gateway
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Error Code
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Message
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA]">
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          14:22
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          Razorpay
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] font-mono text-[#3D3D3D]">
                          BAD_REQUEST_ERROR
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          Invalid payment amount
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          2
                        </td>
                      </tr>
                      <tr className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA]">
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          13:45
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          Paytm
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] font-mono text-[#3D3D3D]">
                          GATEWAY_TIMEOUT
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          Connection timeout
                        </td>
                        <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                          1
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-full max-w-[560px] mx-[24px]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">
                {reasonModalType === 'save' && 'Confirm Changes'}
                {reasonModalType === 'env' && 'Switch to LIVE Mode'}
                {reasonModalType === 'rotate' && 'Rotate Secret Key'}
                {reasonModalType === 'replay' && 'Replay Webhook Event'}
                {reasonModalType === 'approve' && 'Approve Refund'}
                {reasonModalType === 'reject' && 'Reject Refund'}
              </h3>
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setSaveReason('');
                }}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors"
              >
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-[24px] py-[24px]">
              {reasonModalType === 'env' && (
                <div className="flex items-start gap-[12px] p-[16px] bg-[#FEF1EE] border border-[#F36A4F] rounded-[8px] mb-[16px]">
                  <AlertCircle className="w-5 h-5 text-[#F36A4F] flex-shrink-0 mt-[2px]" />
                  <div>
                    <p className="text-[14px] leading-[20px] font-semibold text-[#734F48] mb-[4px]">
                      You are switching to LIVE mode
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#734F48]">
                      All transactions will be real. Ensure all credentials are correctly configured.
                    </p>
                  </div>
                </div>
              )}

              {reasonModalType === 'rotate' && (
                <div className="flex items-start gap-[12px] p-[16px] bg-[#FEF1EE] border border-[#F36A4F] rounded-[8px] mb-[16px]">
                  <AlertCircle className="w-5 h-5 text-[#F36A4F] flex-shrink-0 mt-[2px]" />
                  <div>
                    <p className="text-[14px] leading-[20px] text-[#734F48]">
                      Rotating secret will invalidate the current key. Update your gateway configuration immediately.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-[16px] leading-[24px] text-[#3D3D3D] mb-[16px]">
                {reasonModalType === 'save' && 'This action will be stored in audit logs.'}
                {reasonModalType === 'env' && 'Please provide a reason for switching environment.'}
                {reasonModalType === 'rotate' && 'Please provide a reason for rotating the secret key.'}
                {reasonModalType === 'replay' && 'Please provide a reason for replaying this webhook event.'}
                {reasonModalType === 'approve' && 'Please provide a reason for approving this refund.'}
                {reasonModalType === 'reject' && 'Please provide a reason for rejecting this refund.'}
              </p>

              <div>
                <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                  Reason <span className="text-[#F36A4F]">*</span>
                </label>
                <textarea
                  value={saveReason}
                  onChange={(e) => setSaveReason(e.target.value)}
                  placeholder="Enter reason for this action..."
                  rows={4}
                  className="w-full px-[14px] py-[12px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-[#DBDBDB]">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setSaveReason('');
                }}
                className="h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={!saveReason.trim()}
                className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#D7563D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm & {reasonModalType === 'save' ? 'Save' : reasonModalType === 'approve' ? 'Approve' : reasonModalType === 'reject' ? 'Reject' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Payload Drawer */}
      {showWebhookDrawer && selectedWebhook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50">
          <div className="w-[420px] h-full bg-white shadow-lg flex flex-col">
            {/* Drawer Header */}
            <div className="h-[56px] flex items-center justify-between px-[24px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">
                Webhook Payload
              </h3>
              <button
                onClick={() => setShowWebhookDrawer(false)}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors"
              >
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-[24px]">
              <div className="space-y-[16px]">
                <div>
                  <p className="text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[4px]">
                    Event ID
                  </p>
                  <p className="text-[14px] leading-[20px] text-[#3D3D3D] font-mono">
                    {selectedWebhook.id}
                  </p>
                </div>

                <div>
                  <p className="text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[4px]">
                    Gateway
                  </p>
                  <p className="text-[14px] leading-[20px] text-[#3D3D3D] capitalize">
                    {selectedWebhook.gateway}
                  </p>
                </div>

                <div>
                  <p className="text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[4px]">
                    Event Type
                  </p>
                  <p className="text-[14px] leading-[20px] text-[#3D3D3D]">
                    {selectedWebhook.eventType}
                  </p>
                </div>

                <div>
                  <p className="text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[4px]">
                    Raw Payload
                  </p>
                  <div className="bg-[#0D0D0D] rounded-[8px] p-[12px] overflow-x-auto">
                    <pre className="text-[12px] leading-[18px] text-[#00FF00] font-mono">
                      {JSON.stringify(
                        {
                          event: selectedWebhook.eventType,
                          payment_id: selectedWebhook.paymentId,
                          status: selectedWebhook.status,
                          amount: 100000,
                          currency: 'INR',
                          timestamp: selectedWebhook.time,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
