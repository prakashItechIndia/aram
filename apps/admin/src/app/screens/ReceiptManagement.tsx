import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, X, Check, Eye, Info } from 'lucide-react';
import { useApi, getApiBaseUrl } from '../context/ApiContext';

type TabType =
  | 'numbering'
  | 'generation'
  | 'fields'
  | 'delivery'
  | 'reissue';

type ReceiptType = 'online' | 'echallan_cash' | 'echallan_cheque' | 'echallan_dd' | 'echallan_bank';

interface ReceiptTypeConfig {
  id: ReceiptType;
  label: string;
  enabled: boolean;
  isDefault: boolean;
}

export function ReceiptManagement() {
  const { user, apiFetch } = useApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('numbering');

  // Numbering settings
  const [receiptPrefix, setReceiptPrefix] = useState('ARAM/2025-26/');
  const [startingNumber, setStartingNumber] = useState('00001');
  const [paddingLength, setPaddingLength] = useState('5');
  const [noGapEnforcement, setNoGapEnforcement] = useState(true);
  const [autoCreateNewSeries, setAutoCreateNewSeries] = useState(true);
  const [manualApprovalRequired, setManualApprovalRequired] = useState(false);

  // Receipt types
  const [receiptTypes, setReceiptTypes] = useState<ReceiptTypeConfig[]>([
    { id: 'online', label: 'Online Donation', enabled: true, isDefault: true },
    { id: 'echallan_cash', label: 'E-Challan (Cash)', enabled: true, isDefault: false },
    { id: 'echallan_cheque', label: 'E-Challan (Cheque)', enabled: true, isDefault: false },
    { id: 'echallan_dd', label: 'E-Challan (DD)', enabled: true, isDefault: false },
    { id: 'echallan_bank', label: 'E-Challan (Bank Transfer)', enabled: true, isDefault: false },
  ]);

  // Generation rules
  const [autoGenerateOnSuccess, setAutoGenerateOnSuccess] = useState(true);
  const [generationDelay, setGenerationDelay] = useState('0');
  const [autoGenerateImports, setAutoGenerateImports] = useState(false);
  const [allowManualOffline, setAllowManualOffline] = useState(true);
  const [allowManualBulk, setAllowManualBulk] = useState(true);
  const [allowBackdated, setAllowBackdated] = useState(true);
  const [backdateWindow, setBackdateWindow] = useState('30');
  const [showBackdateStamp, setShowBackdateStamp] = useState(true);
  const [requireReasonManual, setRequireReasonManual] = useState(true);



  // Mandatory fields
  const [mobileRequired, setMobileRequired] = useState(true);
  const [emailRequired, setEmailRequired] = useState(true);
  const [addressRequired, setAddressRequired] = useState(false);
  const [panRule, setPanRule] = useState<'always' | 'threshold' | 'optional'>('threshold');
  const [panThreshold, setPanThreshold] = useState('2000');
  const [categoryRequired, setCategoryRequired] = useState(true);
  const [typeRequired, setTypeRequired] = useState(true);
  const [panAutoUppercase, setPanAutoUppercase] = useState(true);


  // Delivery settings
  const [autoSendEmail, setAutoSendEmail] = useState(true);
  const [emailSubject, setEmailSubject] = useState('Your donation receipt {receipt_no} - Aram Foundation');
  const [senderName, setSenderName] = useState('Aram Foundation');
  const [replyToEmail, setReplyToEmail] = useState('donations@aramfoundation.org');

  const [emailFailureAlert, setEmailFailureAlert] = useState(true);
  const [autoSendSMS, setAutoSendSMS] = useState(false);
  const [smsShortLink, setSmsShortLink] = useState(true);


  // Reprint/Reissue
  const [allowReprint, setAllowReprint] = useState(true);
  const [allowResendEmail, setAllowResendEmail] = useState(true);
  const [allowCorrection, setAllowCorrection] = useState(true);
  const [requireReasonReprint, setRequireReasonReprint] = useState(false);
  const [requireReasonCorrection, setRequireReasonCorrection] = useState(true);
  const [requireReasonManualGen, setRequireReasonManualGen] = useState(true);
  const [requireReasonRegenerate, setRequireReasonRegenerate] = useState(true);
  const [requireReasonCancel, setRequireReasonCancel] = useState(true);

  // Modals
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [saveReason, setSaveReason] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'numbering', label: 'Numbering & Series' },
    { id: 'generation', label: 'Generation Rules' },
    { id: 'fields', label: 'Mandatory Fields' },
    { id: 'delivery', label: 'Delivery Settings' },
    { id: 'reissue', label: 'Reprint & Re issue' },
  ];

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/receipt-settings`);

      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();

      // Update all state variables from API response
      if (data.receiptPrefix) setReceiptPrefix(data.receiptPrefix);
      if (data.startingNumber) setStartingNumber(data.startingNumber);
      if (data.paddingLength) setPaddingLength(String(data.paddingLength));
      if (data.noGapEnforcement !== undefined) setNoGapEnforcement(data.noGapEnforcement);
      if (data.autoCreateNewSeries !== undefined) setAutoCreateNewSeries(data.autoCreateNewSeries);
      if (data.manualApprovalRequired !== undefined) setManualApprovalRequired(data.manualApprovalRequired);
      if (data.receiptTypes) setReceiptTypes(data.receiptTypes);

      // Generation Rules
      if (data.autoGenerateOnSuccess !== undefined) setAutoGenerateOnSuccess(data.autoGenerateOnSuccess);
      if (data.generationDelay !== undefined) setGenerationDelay(String(data.generationDelay));
      if (data.autoGenerateImports !== undefined) setAutoGenerateImports(data.autoGenerateImports);
      if (data.allowManualOffline !== undefined) setAllowManualOffline(data.allowManualOffline);
      if (data.allowManualBulk !== undefined) setAllowManualBulk(data.allowManualBulk);
      if (data.allowBackdated !== undefined) setAllowBackdated(data.allowBackdated);
      if (data.backdateWindow !== undefined) setBackdateWindow(String(data.backdateWindow));
      if (data.showBackdateStamp !== undefined) setShowBackdateStamp(data.showBackdateStamp);
      if (data.requireReasonManual !== undefined) setRequireReasonManual(data.requireReasonManual);



      // Mandatory Fields
      if (data.mobileRequired !== undefined) setMobileRequired(data.mobileRequired);
      if (data.emailRequired !== undefined) setEmailRequired(data.emailRequired);
      if (data.addressRequired !== undefined) setAddressRequired(data.addressRequired);
      if (data.panRule) setPanRule(data.panRule);
      if (data.panThreshold !== undefined) setPanThreshold(String(data.panThreshold));
      if (data.donationCategoryRequired !== undefined) setCategoryRequired(data.donationCategoryRequired);
      if (data.donationTypeRequired !== undefined) setTypeRequired(data.donationTypeRequired);
      if (data.panAutoUppercase !== undefined) setPanAutoUppercase(data.panAutoUppercase);


      // Delivery Settings
      if (data.autoSendEmailOnReceiptGeneration !== undefined) setAutoSendEmail(data.autoSendEmailOnReceiptGeneration);
      if (data.emailSubjectFormat) setEmailSubject(data.emailSubjectFormat);
      if (data.emailSenderName) setSenderName(data.emailSenderName);
      if (data.emailReplyTo) setReplyToEmail(data.emailReplyTo);

      if (data.emailFailureAlertsNotifyAdmin !== undefined) setEmailFailureAlert(data.emailFailureAlertsNotifyAdmin);
      if (data.autoSendSmsOnReceiptGeneration !== undefined) setAutoSendSMS(data.autoSendSmsOnReceiptGeneration);
      if (data.smsShortLink !== undefined) setSmsShortLink(data.smsShortLink);


      // Reprint/Reissue
      if (data.allowReprint !== undefined) setAllowReprint(data.allowReprint);
      if (data.allowResendEmail !== undefined) setAllowResendEmail(data.allowResendEmail);
      if (data.allowCorrection !== undefined) setAllowCorrection(data.allowCorrection);
      if (data.requireReasonReprint !== undefined) setRequireReasonReprint(data.requireReasonReprint);
      if (data.requireReasonCorrection !== undefined) setRequireReasonCorrection(data.requireReasonCorrection);
      if (data.requireReasonManualGen !== undefined) setRequireReasonManualGen(data.requireReasonManualGen);
      if (data.requireReasonRegenerate !== undefined) setRequireReasonRegenerate(data.requireReasonRegenerate);
      if (data.requireReasonCancel !== undefined) setRequireReasonCancel(data.requireReasonCancel);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = () => {
    setShowReasonModal(true);
  };

  const confirmSave = async () => {
    if (!saveReason.trim()) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        // Numbering & Series
        receiptPrefix,
        startingNumber,
        paddingLength: parseInt(paddingLength),
        noGapEnforcement,
        autoCreateNewSeries,
        manualApprovalRequired,
        receiptTypes,
        // Generation Rules
        autoGenerateOnSuccess,
        generationDelay: parseInt(generationDelay),
        autoGenerateImports,
        allowManualOffline,
        allowManualBulk,
        allowBackdated,
        backdateWindow: parseInt(backdateWindow),
        showBackdateStamp,
        requireReasonManual,

        // Mandatory Fields
        mobileRequired,
        emailRequired,
        addressRequired,
        donationCategoryRequired: categoryRequired,
        donationTypeRequired: typeRequired,
        panRule,
        panThreshold: parseInt(panThreshold),
        panAutoUppercase,

        // Delivery Settings
        autoSendEmailOnReceiptGeneration: autoSendEmail,
        emailSubjectFormat: emailSubject,
        emailSenderName: senderName,
        emailReplyTo: replyToEmail,

        emailFailureAlertsNotifyAdmin: emailFailureAlert,
        autoSendSmsOnReceiptGeneration: autoSendSMS,
        smsShortLink,

        // Reprint & Reissue
        allowReprint,
        allowResendEmail,
        allowCorrection,
        requireReasonReprint,
        requireReasonCorrection,
        requireReasonManualGen,
        requireReasonRegenerate,
        requireReasonCancel,
        // Metadata
        updatedBy: (user?.accessToken && 'Admin') || 'System',
        reasonForChange: saveReason,
      };

      const response = await apiFetch('/receipt-settings', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setShowReasonModal(false);
      setSaveReason('');
      setHasChanges(false);
      await fetchSettings();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleReceiptType = (id: ReceiptType, field: 'enabled' | 'isDefault') => {
    setReceiptTypes((prev) =>
      prev.map((type) => {
        if (field === 'isDefault') {
          return { ...type, isDefault: type.id === id };
        }
        return type.id === id ? { ...type, [field]: !type[field] } : type;
      })
    );
    setHasChanges(true);
  };

  const getReceiptPreview = () => {
    const paddedNumber = startingNumber.padStart(parseInt(paddingLength), '0');
    return `${receiptPrefix}${paddedNumber}`;
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-[4px]">
            Receipt Management Settings
          </h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Configure receipt numbering, generation, delivery, and compliance rules
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#D7563D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[#FEE] border border-[#FCC] rounded-[16px] p-[16px] flex items-start gap-[12px]">
          <AlertCircle className="w-5 h-5 text-[#F36A4F] flex-shrink-0 mt-[2px]" />
          <div className="flex-1">
            <h4 className="text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">Error</h4>
            <p className="text-[14px] leading-[20px] text-[#6E6E6E]">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-[#6E6E6E] hover:text-[#0D0D0D] flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-[#DBDBDB] rounded-[16px] p-[48px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F36A4F] mx-auto mb-[16px]"></div>
            <p className="text-[16px] leading-[24px] text-[#6E6E6E]">Loading settings...</p>
          </div>
        </div>
      )}

      {/* Content - Only show when not loading */}
      {!loading && (
        <div className="flex flex-col gap-[24px]">

          {/* Tabs */}
          <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
            {/* Tab Headers */}
            <div className="flex items-center gap-[4px] px-[16px] py-[12px] border-b border-[#DBDBDB] overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-[16px] h-[44px] rounded-[8px] text-[14px] leading-[20px] font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
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
              {/* Numbering & Series Tab */}
              {activeTab === 'numbering' && (
                <div className="space-y-[24px]">
                  {/* Series Settings */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Series Settings
                    </h3>
                    <div className="space-y-[16px]">
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Receipt Prefix (Financial Year Based)
                        </label>
                        <input
                          type="text"
                          value={receiptPrefix}
                          onChange={(e) => {
                            setReceiptPrefix(e.target.value);
                            setHasChanges(true);
                          }}
                          placeholder="ARAM/2025-26/"
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-[16px]">
                        <div>
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                            Starting Number for FY
                          </label>
                          <input
                            type="text"
                            value={startingNumber}
                            onChange={(e) => {
                              setStartingNumber(e.target.value);
                              setHasChanges(true);
                            }}
                            placeholder="00001"
                            className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                          />
                        </div>

                        <div>
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                            Number Padding Length
                          </label>
                          <select
                            value={paddingLength}
                            onChange={(e) => {
                              setPaddingLength(e.target.value);
                              setHasChanges(true);
                            }}
                            className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                          >
                            <option value="4">4 digits (0001)</option>
                            <option value="5">5 digits (00001)</option>
                            <option value="6">6 digits (000001)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-[16px] bg-[#FAFAFA] rounded-[16px]">
                        <div>
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                            No-gap Enforcement
                          </label>
                          <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                            Atomic counter with locking to prevent gaps in receipt numbers
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setNoGapEnforcement(!noGapEnforcement);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${noGapEnforcement ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${noGapEnforcement ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      {/* Preview */}
                      <div className="p-[16px] bg-[#FEF1EE] border border-[#F36A4F] rounded-[16px]">
                        <div className="flex items-start gap-[12px]">
                          <Eye className="w-5 h-5 text-[#F36A4F] flex-shrink-0 mt-[2px]" />
                          <div className="flex-1">
                            <p className="text-[14px] leading-[20px] font-medium text-[#734F48] mb-[8px]">
                              Receipt Number Preview
                            </p>
                            <div className="bg-white border border-[#F36A4F] rounded-[8px] px-[16px] py-[12px]">
                              <p className="text-[18px] leading-[26px] font-bold text-[#F36A4F] font-mono">
                                {getReceiptPreview()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Year Rollover */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Financial Year Rollover Behavior
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Auto-create new series on FY start
                        </label>
                        <button
                          onClick={() => {
                            setAutoCreateNewSeries(!autoCreateNewSeries);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${autoCreateNewSeries ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${autoCreateNewSeries ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Manual approval required to activate new FY series
                        </label>
                        <button
                          onClick={() => {
                            setManualApprovalRequired(!manualApprovalRequired);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${manualApprovalRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${manualApprovalRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Receipt Type Mapping */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Receipt Type Mapping
                    </h3>
                    <div className="border border-[#DBDBDB] rounded-[16px] overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                            <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                              Receipt Type
                            </th>
                            <th className="text-center px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                              Enabled
                            </th>
                            <th className="text-center px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                              Default for Offline
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {receiptTypes.map((type) => (
                            <tr key={type.id} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA]">
                              <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#3D3D3D]">
                                {type.label}
                              </td>
                              <td className="px-[16px] py-[12px]">
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => toggleReceiptType(type.id, 'enabled')}
                                    className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${type.enabled ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                                      }`}
                                  >
                                    <div
                                      className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${type.enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                                        }`}
                                    />
                                  </button>
                                </div>
                              </td>
                              <td className="px-[16px] py-[12px]">
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => toggleReceiptType(type.id, 'isDefault')}
                                    className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${type.isDefault
                                      ? 'border-[#F36A4F] bg-[#F36A4F]'
                                      : 'border-[#DBDBDB] bg-white'
                                      }`}
                                  >
                                    {type.isDefault && <Check className="w-[12px] h-[12px] text-white" />}
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

              {/* Generation Rules Tab */}
              {activeTab === 'generation' && (
                <div className="space-y-[24px]">
                  {/* Auto-generation */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Auto-generation Settings
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                            Auto-generate receipt on payment success
                          </label>
                          <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                            Automatically create receipt when payment is confirmed
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAutoGenerateOnSuccess(!autoGenerateOnSuccess);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${autoGenerateOnSuccess ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${autoGenerateOnSuccess ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Delay Generation
                        </label>
                        <select
                          value={generationDelay}
                          onChange={(e) => {
                            setGenerationDelay(e.target.value);
                            setHasChanges(true);
                          }}
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        >
                          <option value="0">Immediate (0 min)</option>
                          <option value="2">2 minutes</option>
                          <option value="5">5 minutes</option>
                        </select>
                        <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                          Delay helps avoid webhook race conditions
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Auto-generate for imported donations
                        </label>
                        <button
                          onClick={() => {
                            setAutoGenerateImports(!autoGenerateImports);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${autoGenerateImports ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${autoGenerateImports ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Manual Generation Permissions */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Manual Generation Permissions
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="space-y-[12px]">
                        <label className="flex items-center gap-[12px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowManualOffline}
                            onChange={() => {
                              setAllowManualOffline(!allowManualOffline);
                              setHasChanges(true);
                            }}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                            Allow manual generation for offline donations
                          </span>
                        </label>

                        <label className="flex items-center gap-[12px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowManualBulk}
                            onChange={() => {
                              setAllowManualBulk(!allowManualBulk);
                              setHasChanges(true);
                            }}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                            Allow manual generation for bulk imports
                          </span>
                        </label>

                        <label className="flex items-center gap-[12px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowBackdated}
                            onChange={() => {
                              setAllowBackdated(!allowBackdated);
                              setHasChanges(true);
                            }}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                            Allow backdated receipts (restricted to Super Admin/Finance)
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Require reason for manual generation override
                        </label>
                        <button
                          onClick={() => {
                            setRequireReasonManual(!requireReasonManual);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${requireReasonManual ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${requireReasonManual ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Backdated Receipt Rules */}
                  {allowBackdated && (
                    <div>
                      <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                        Backdated Receipt Rules
                      </h3>
                      <div className="space-y-[16px]">
                        <div>
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                            Maximum Backdate Window
                          </label>
                          <select
                            value={backdateWindow}
                            onChange={(e) => {
                              setBackdateWindow(e.target.value);
                              setHasChanges(true);
                            }}
                            className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                          >
                            <option value="7">7 days</option>
                            <option value="30">30 days</option>
                            <option value="90">90 days</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                              Show backdate stamp on receipt
                            </label>
                            <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                              "Generated on [date] for donation date [date]"
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setShowBackdateStamp(!showBackdateStamp);
                              setHasChanges(true);
                            }}
                            className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${showBackdateStamp ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                              }`}
                          >
                            <div
                              className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${showBackdateStamp ? 'translate-x-[22px]' : 'translate-x-[2px]'
                                }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}



              {/* Mandatory Fields Tab */}
              {activeTab === 'fields' && (
                <div className="space-y-[24px]">
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Field Requirements
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between p-[16px] bg-[#FAFAFA] rounded-[16px]">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Donor Name
                        </label>
                        <span className="px-[12px] py-[6px] bg-[#F36A4F] text-white rounded-[999px] text-[13px] leading-[18px] font-medium">
                          Always Required
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Mobile Number
                        </label>
                        <button
                          onClick={() => {
                            setMobileRequired(!mobileRequired);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${mobileRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${mobileRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Email Address
                        </label>
                        <button
                          onClick={() => {
                            setEmailRequired(!emailRequired);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${emailRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${emailRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Address
                        </label>
                        <button
                          onClick={() => {
                            setAddressRequired(!addressRequired);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${addressRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${addressRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Donation Category
                        </label>
                        <button
                          onClick={() => {
                            setCategoryRequired(!categoryRequired);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${categoryRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${categoryRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Donation Type (Online/Offline)
                        </label>
                        <button
                          onClick={() => {
                            setTypeRequired(!typeRequired);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${typeRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${typeRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PAN Requirements */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      PAN Card Requirements
                    </h3>
                    <div className="space-y-[16px]">
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[12px]">
                          PAN Requirement Rule
                        </label>
                        <div className="space-y-[8px]">
                          <label className="flex items-center gap-[12px] cursor-pointer">
                            <input
                              type="radio"
                              name="panRule"
                              checked={panRule === 'always'}
                              onChange={() => {
                                setPanRule('always');
                                setHasChanges(true);
                              }}
                              className="w-[20px] h-[20px]"
                            />
                            <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                              Always mandatory
                            </span>
                          </label>

                          <label className="flex items-center gap-[12px] cursor-pointer">
                            <input
                              type="radio"
                              name="panRule"
                              checked={panRule === 'threshold'}
                              onChange={() => {
                                setPanRule('threshold');
                                setHasChanges(true);
                              }}
                              className="w-[20px] h-[20px]"
                            />
                            <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                              Mandatory above threshold
                            </span>
                          </label>

                          <label className="flex items-center gap-[12px] cursor-pointer">
                            <input
                              type="radio"
                              name="panRule"
                              checked={panRule === 'optional'}
                              onChange={() => {
                                setPanRule('optional');
                                setHasChanges(true);
                              }}
                              className="w-[20px] h-[20px]"
                            />
                            <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                              Optional for international donors
                            </span>
                          </label>
                        </div>
                      </div>

                      {panRule === 'threshold' && (
                        <div>
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                            PAN Mandatory Threshold
                          </label>
                          <div className="relative">
                            <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] leading-[24px] text-[#6E6E6E]">
                              ₹
                            </span>
                            <input
                              type="number"
                              value={panThreshold}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPanThreshold(val === '' ? '' : Math.max(0, parseInt(val)));
                                setHasChanges(true);
                              }}
                              min="0"
                              className="w-full h-[44px] pl-[32px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Validation Settings */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Validation Settings
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                            PAN Auto-uppercase
                          </label>
                          <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                            Format: AAAAA0000A
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setPanAutoUppercase(!panAutoUppercase);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${panAutoUppercase ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${panAutoUppercase ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>


                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Settings Tab */}
              {activeTab === 'delivery' && (
                <div className="space-y-[24px]">
                  {/* Email Delivery */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Email Delivery
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Auto-send email on receipt generation
                        </label>
                        <button
                          onClick={() => {
                            setAutoSendEmail(!autoSendEmail);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${autoSendEmail ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${autoSendEmail ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      {autoSendEmail && (
                        <>
                          <div>
                            <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                              Email Subject Format
                            </label>
                            <input
                              type="text"
                              value={emailSubject}
                              onChange={(e) => {
                                setEmailSubject(e.target.value);
                                setHasChanges(true);
                              }}
                              className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                            />
                            <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                              Variables: {'{receipt_no}'}, {'{donor_name}'}, {'{amount}'}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-[16px]">
                            <div>
                              <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                                Sender Name
                              </label>
                              <input
                                type="text"
                                value={senderName}
                                onChange={(e) => {
                                  setSenderName(e.target.value);
                                  setHasChanges(true);
                                }}
                                className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                              />
                            </div>

                            <div>
                              <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                                Reply-to Email
                              </label>
                              <input
                                type="email"
                                value={replyToEmail}
                                onChange={(e) => {
                                  setReplyToEmail(e.target.value);
                                  setHasChanges(true);
                                }}
                                className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                              />
                            </div>
                          </div>



                          <div className="flex items-center justify-between">
                            <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                              Email failure alerts (notify admin)
                            </label>
                            <button
                              onClick={() => {
                                setEmailFailureAlert(!emailFailureAlert);
                                setHasChanges(true);
                              }}
                              className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${emailFailureAlert ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                                }`}
                            >
                              <div
                                className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${emailFailureAlert ? 'translate-x-[22px]' : 'translate-x-[2px]'
                                  }`}
                              />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* SMS Delivery */}
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      SMS Delivery
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Auto-send SMS on receipt generation
                        </label>
                        <button
                          onClick={() => {
                            setAutoSendSMS(!autoSendSMS);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${autoSendSMS ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${autoSendSMS ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      {autoSendSMS && (
                        <div className="flex items-center justify-between">
                          <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                            Use short link for PDF URL
                          </label>
                          <button
                            onClick={() => {
                              setSmsShortLink(!smsShortLink);
                              setHasChanges(true);
                            }}
                            className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${smsShortLink ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                              }`}
                          >
                            <div
                              className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${smsShortLink ? 'translate-x-[22px]' : 'translate-x-[2px]'
                                }`}
                            />
                          </button>
                        </div>
                      )}


                    </div>
                  </div>

                  {/* WhatsApp (Future) */}
                  <div className="p-[16px] bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px]">
                    <div className="flex items-start gap-[12px]">
                      <Info className="w-5 h-5 text-[#6E6E6E] flex-shrink-0 mt-[2px]" />
                      <div>
                        <h4 className="text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                          WhatsApp Delivery (Coming Soon)
                        </h4>
                        <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
                          WhatsApp integration for receipt delivery will be available in a future update.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reprint & Reissue Tab */}
              {activeTab === 'reissue' && (
                <div className="space-y-[24px]">
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Reprint & Resend Permissions
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                            Allow reprint
                          </label>
                          <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                            Reprint does not change receipt number
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAllowReprint(!allowReprint);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${allowReprint ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${allowReprint ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Allow resend email
                        </label>
                        <button
                          onClick={() => {
                            setAllowResendEmail(!allowResendEmail);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${allowResendEmail ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${allowResendEmail ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Require reason for reprint
                        </label>
                        <button
                          onClick={() => {
                            setRequireReasonReprint(!requireReasonReprint);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${requireReasonReprint ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${requireReasonReprint ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Correction/Reissue Workflow
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                            Allow correction/reissue
                          </label>
                          <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                            Keeps old receipt archived, generates "Reissued" stamp + version history
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAllowCorrection(!allowCorrection);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${allowCorrection ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${allowCorrection ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      {allowCorrection && (
                        <div className="flex items-center justify-between">
                          <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                            Require reason for correction
                          </label>
                          <button
                            onClick={() => {
                              setRequireReasonCorrection(!requireReasonCorrection);
                              setHasChanges(true);
                            }}
                            className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${requireReasonCorrection ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                              }`}
                          >
                            <div
                              className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${requireReasonCorrection ? 'translate-x-[22px]' : 'translate-x-[2px]'
                                }`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                      Reason Requirements
                    </h3>
                    <div className="space-y-[16px]">
                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Manual generation
                        </label>
                        <button
                          onClick={() => {
                            setRequireReasonManualGen(!requireReasonManualGen);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${requireReasonManualGen ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${requireReasonManualGen ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Regeneration
                        </label>
                        <button
                          onClick={() => {
                            setRequireReasonRegenerate(!requireReasonRegenerate);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${requireReasonRegenerate ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${requireReasonRegenerate ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Cancellation
                        </label>
                        <button
                          onClick={() => {
                            setRequireReasonCancel(!requireReasonCancel);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${requireReasonCancel ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                            }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${requireReasonCancel ? 'translate-x-[22px]' : 'translate-x-[2px]'
                              }`}
                          />
                        </button>
                      </div>
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
                    Confirm Changes
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
                  <p className="text-[16px] leading-[24px] text-[#3D3D3D] mb-[16px]">
                    Please provide a reason for updating receipt management settings. This will be logged in the audit trail.
                  </p>
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Reason for change <span className="text-[#F36A4F]">*</span>
                    </label>
                    <textarea
                      value={saveReason}
                      onChange={(e) => setSaveReason(e.target.value)}
                      placeholder="Enter reason for updating settings..."
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
                    disabled={!saveReason.trim() || saving}
                    className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#D7563D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Confirm & Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
