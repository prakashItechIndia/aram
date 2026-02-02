import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, X, Check, Eye, Info } from 'lucide-react';
import { useApi, getApiBaseUrl } from '../context/ApiContext';

type TabType =
  | 'numbering'
  | 'generation'
  | 'templates'
  | 'fields'
  | 'delivery'
  | 'storage'
  | 'bulk'
  | 'status'
  | 'reissue'
  | 'audit'
  | 'search';

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

  // Template rules
  const [defaultTemplateOnline, setDefaultTemplateOnline] = useState('template_1');
  const [defaultTemplateOffline, setDefaultTemplateOffline] = useState('template_2');
  const [template80G, setTemplate80G] = useState('template_80g');
  const [templateNon80G, setTemplateNon80G] = useState('template_non_80g');
  const [forceRegenerateOnUpdate, setForceRegenerateOnUpdate] = useState(false);
  const [lockContentAfterGeneration, setLockContentAfterGeneration] = useState(true);

  // Mandatory fields
  const [mobileRequired, setMobileRequired] = useState(true);
  const [emailRequired, setEmailRequired] = useState(true);
  const [addressRequired, setAddressRequired] = useState(false);
  const [panRule, setPanRule] = useState<'always' | 'threshold' | 'optional'>('threshold');
  const [panThreshold, setPanThreshold] = useState('2000');
  const [categoryRequired, setCategoryRequired] = useState(true);
  const [typeRequired, setTypeRequired] = useState(true);
  const [panAutoUppercase, setPanAutoUppercase] = useState(true);
  const [pincodeValidation, setPincodeValidation] = useState(true);
  const [duplicateWarning, setDuplicateWarning] = useState(true);

  // Delivery settings
  const [autoSendEmail, setAutoSendEmail] = useState(true);
  const [emailSubject, setEmailSubject] = useState('Your donation receipt {receipt_no} - Aram Foundation');
  const [senderName, setSenderName] = useState('Aram Foundation');
  const [replyToEmail, setReplyToEmail] = useState('donations@aramfoundation.org');
  const [emailRetryAttempts, setEmailRetryAttempts] = useState('3');
  const [emailFailureAlert, setEmailFailureAlert] = useState(true);
  const [autoSendSMS, setAutoSendSMS] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState('Thank you for your donation! Receipt: {receipt_no}. Download: {short_link}');
  const [smsShortLink, setSmsShortLink] = useState(true);

  // Storage settings
  const [storageMode, setStorageMode] = useState<'local' | 's3'>('s3');
  const [linkSecurity, setLinkSecurity] = useState<'token' | 'public'>('token');
  const [linkExpiry, setLinkExpiry] = useState('30');
  const [allowRegenerationTemplate, setAllowRegenerationTemplate] = useState(true);
  const [allowRegenerationAnytime, setAllowRegenerationAnytime] = useState(false);

  // Bulk operations
  const [bulkGenerationAllowed, setBulkGenerationAllowed] = useState(true);
  const [maxBatchSize, setMaxBatchSize] = useState('500');
  const [zipFilenameFormat, setZipFilenameFormat] = useState('Receipts_YYYYMMDD_Batch001.zip');
  const [includeIndexCSV, setIncludeIndexCSV] = useState(true);
  const [runInBackground, setRunInBackground] = useState(true);

  // Status workflow
  const [allowMarkReissued, setAllowMarkReissued] = useState(true);
  const [autoMarkDelivered, setAutoMarkDelivered] = useState(true);

  // Reprint/Reissue
  const [allowReprint, setAllowReprint] = useState(true);
  const [allowResendEmail, setAllowResendEmail] = useState(true);
  const [allowCorrection, setAllowCorrection] = useState(true);
  const [requireReasonReprint, setRequireReasonReprint] = useState(false);
  const [requireReasonCorrection, setRequireReasonCorrection] = useState(true);

  // Audit settings
  const [requireReasonManualGen, setRequireReasonManualGen] = useState(true);
  const [requireReasonRegenerate, setRequireReasonRegenerate] = useState(true);
  const [requireReasonCancel, setRequireReasonCancel] = useState(true);
  const [retentionYears] = useState('7');

  // Search defaults
  const [defaultDateFilter, setDefaultDateFilter] = useState<'today' | 'this_month'>('this_month');
  const [defaultPageSize, setDefaultPageSize] = useState('50');
  const [exportFormats, setExportFormats] = useState({
    csv: true,
    excel: true,
    pdf: true,
  });
  const [maskPII, setMaskPII] = useState(true);

  // Modals
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [saveReason, setSaveReason] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'numbering', label: 'Numbering & Series' },
    { id: 'generation', label: 'Generation Rules' },
    { id: 'templates', label: 'Template Rules' },
    { id: 'fields', label: 'Mandatory Fields' },
    { id: 'delivery', label: 'Delivery Settings' },
    { id: 'storage', label: 'Storage & Access' },
    { id: 'bulk', label: 'Bulk Operations' },
    { id: 'status', label: 'Status Workflow' },
    { id: 'reissue', label: 'Reprint & Reissue' },
    { id: 'audit', label: 'Audit & Compliance' },
    { id: 'search', label: 'Search Defaults' },
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

      // Template Rules
      if (data.defaultTemplateOnline) setDefaultTemplateOnline(data.defaultTemplateOnline);
      if (data.defaultTemplateOffline) setDefaultTemplateOffline(data.defaultTemplateOffline);
      if (data.template80g) setTemplate80G(data.template80g);
      if (data.templateNon80g) setTemplateNon80G(data.templateNon80g);
      if (data.forceRegenerateOnUpdate !== undefined) setForceRegenerateOnUpdate(data.forceRegenerateOnUpdate);
      if (data.lockContentAfterGeneration !== undefined) setLockContentAfterGeneration(data.lockContentAfterGeneration);

      // Mandatory Fields
      if (data.mobileRequired !== undefined) setMobileRequired(data.mobileRequired);
      if (data.emailRequired !== undefined) setEmailRequired(data.emailRequired);
      if (data.addressRequired !== undefined) setAddressRequired(data.addressRequired);
      if (data.panRule) setPanRule(data.panRule);
      if (data.panThreshold !== undefined) setPanThreshold(String(data.panThreshold));
      if (data.donationCategoryRequired !== undefined) setCategoryRequired(data.donationCategoryRequired);
      if (data.donationTypeRequired !== undefined) setTypeRequired(data.donationTypeRequired);
      if (data.panAutoUppercase !== undefined) setPanAutoUppercase(data.panAutoUppercase);
      if (data.pincodeValidation !== undefined) setPincodeValidation(data.pincodeValidation);
      if (data.duplicateWarning !== undefined) setDuplicateWarning(data.duplicateWarning);

      // Delivery Settings
      if (data.autoSendEmailOnReceiptGeneration !== undefined) setAutoSendEmail(data.autoSendEmailOnReceiptGeneration);
      if (data.emailSubjectFormat) setEmailSubject(data.emailSubjectFormat);
      if (data.emailSenderName) setSenderName(data.emailSenderName);
      if (data.emailReplyTo) setReplyToEmail(data.emailReplyTo);
      if (data.emailRetryAttempts !== undefined) setEmailRetryAttempts(String(data.emailRetryAttempts));
      if (data.emailFailureAlertsNotifyAdmin !== undefined) setEmailFailureAlert(data.emailFailureAlertsNotifyAdmin);
      if (data.autoSendSmsOnReceiptGeneration !== undefined) setAutoSendSMS(data.autoSendSmsOnReceiptGeneration);
      if (data.smsTemplate) setSmsTemplate(data.smsTemplate);
      if (data.smsShortLink !== undefined) setSmsShortLink(data.smsShortLink);

      // Storage & Access
      if (data.storageMode) setStorageMode(data.storageMode);
      if (data.linkSecurity) setLinkSecurity(data.linkSecurity);
      if (data.linkExpiryDays !== undefined) setLinkExpiry(String(data.linkExpiryDays));
      if (data.allowRegenerationTemplate !== undefined) setAllowRegenerationTemplate(data.allowRegenerationTemplate);
      if (data.allowRegenerationAnytime !== undefined) setAllowRegenerationAnytime(data.allowRegenerationAnytime);

      // Bulk Operations
      if (data.bulkGenerationAllowed !== undefined) setBulkGenerationAllowed(data.bulkGenerationAllowed);
      if (data.maxBatchSize !== undefined) setMaxBatchSize(String(data.maxBatchSize));
      if (data.zipFilenameFormat) setZipFilenameFormat(data.zipFilenameFormat);
      if (data.includeIndexCsv !== undefined) setIncludeIndexCSV(data.includeIndexCsv);
      if (data.runInBackground !== undefined) setRunInBackground(data.runInBackground);

      // Status Workflow & Reprint/Reissue
      if (data.allowMarkReissued !== undefined) setAllowMarkReissued(data.allowMarkReissued);
      if (data.autoMarkDelivered !== undefined) setAutoMarkDelivered(data.autoMarkDelivered);
      if (data.allowReprint !== undefined) setAllowReprint(data.allowReprint);
      if (data.allowResendEmail !== undefined) setAllowResendEmail(data.allowResendEmail);
      if (data.allowCorrection !== undefined) setAllowCorrection(data.allowCorrection);
      if (data.requireReasonReprint !== undefined) setRequireReasonReprint(data.requireReasonReprint);
      if (data.requireReasonCorrection !== undefined) setRequireReasonCorrection(data.requireReasonCorrection);

      // Audit & Compliance
      if (data.requireReasonManualGen !== undefined) setRequireReasonManualGen(data.requireReasonManualGen);
      if (data.requireReasonRegenerate !== undefined) setRequireReasonRegenerate(data.requireReasonRegenerate);
      if (data.requireReasonCancel !== undefined) setRequireReasonCancel(data.requireReasonCancel);

      // Search Defaults
      if (data.defaultDateFilter) setDefaultDateFilter(data.defaultDateFilter);
      if (data.defaultPageSize !== undefined) setDefaultPageSize(String(data.defaultPageSize));
      if (data.exportFormatsCsv !== undefined || data.exportFormatsExcel !== undefined || data.exportFormatsPdf !== undefined) {
        setExportFormats({
          csv: data.exportFormatsCsv ?? true,
          excel: data.exportFormatsExcel ?? true,
          pdf: data.exportFormatsPdf ?? true,
        });
      }
      if (data.maskPii !== undefined) setMaskPII(data.maskPii);
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
        // Template Rules
        defaultTemplateOnline,
        defaultTemplateOffline,
        template80g: template80G,
        templateNon80g: templateNon80G,
        forceRegenerateOnUpdate,
        lockContentAfterGeneration,
        // Mandatory Fields
        mobileRequired,
        emailRequired,
        addressRequired,
        donationCategoryRequired: categoryRequired,
        donationTypeRequired: typeRequired,
        panRule,
        panThreshold: parseInt(panThreshold),
        panAutoUppercase,
        pincodeValidation,
        duplicateWarning,
        // Delivery Settings
        autoSendEmailOnReceiptGeneration: autoSendEmail,
        emailSubjectFormat: emailSubject,
        emailSenderName: senderName,
        emailReplyTo: replyToEmail,
        emailRetryAttempts: parseInt(emailRetryAttempts),
        emailFailureAlertsNotifyAdmin: emailFailureAlert,
        autoSendSmsOnReceiptGeneration: autoSendSMS,
        smsTemplate,
        smsShortLink,
        // Storage & Access
        storageMode,
        linkSecurity,
        linkExpiryDays: parseInt(linkExpiry),
        allowRegenerationTemplate,
        allowRegenerationAnytime,
        // Bulk Operations
        bulkGenerationAllowed,
        maxBatchSize: parseInt(maxBatchSize),
        zipFilenameFormat,
        includeIndexCsv: includeIndexCSV,
        runInBackground,
        // Status Workflow & Reprint/Reissue
        allowMarkReissued,
        autoMarkDelivered,
        allowReprint,
        allowResendEmail,
        allowCorrection,
        requireReasonReprint,
        requireReasonCorrection,
        requireReasonManualGen,
        requireReasonRegenerate,
        requireReasonCancel,
        // Audit & Compliance
        retentionYears: parseInt(retentionYears),
        // Search Defaults
        defaultDateFilter,
        defaultPageSize: parseInt(defaultPageSize),
        exportFormatsCsv: exportFormats.csv,
        exportFormatsExcel: exportFormats.excel,
        exportFormatsPdf: exportFormats.pdf,
        maskPii: maskPII,
        // Metadata
        updatedBy: (user?.accessToken && 'Admin') || 'System',
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        noGapEnforcement ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          noGapEnforcement ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoCreateNewSeries ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoCreateNewSeries ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        manualApprovalRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          manualApprovalRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                                className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                                  type.enabled ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                                }`}
                              >
                                <div
                                  className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                                    type.enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                                  }`}
                                />
                              </button>
                            </div>
                          </td>
                          <td className="px-[16px] py-[12px]">
                            <div className="flex justify-center">
                              <button
                                onClick={() => toggleReceiptType(type.id, 'isDefault')}
                                className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${
                                  type.isDefault
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoGenerateOnSuccess ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoGenerateOnSuccess ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoGenerateImports ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoGenerateImports ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        requireReasonManual ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          requireReasonManual ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                        className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                          showBackdateStamp ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                            showBackdateStamp ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Template Rules Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Default Template Selection
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Default Template for Online Donations
                    </label>
                    <select
                      value={defaultTemplateOnline}
                      onChange={(e) => {
                        setDefaultTemplateOnline(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="template_1">Standard Template (Online)</option>
                      <option value="template_2">Detailed Template</option>
                      <option value="template_3">Compact Template</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Default Template for Offline Donations
                    </label>
                    <select
                      value={defaultTemplateOffline}
                      onChange={(e) => {
                        setDefaultTemplateOffline(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="template_1">Standard Template (Online)</option>
                      <option value="template_2">Detailed Template</option>
                      <option value="template_3">Compact Template</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  80G Eligibility-Based Templates
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Template for 80G Donations
                    </label>
                    <select
                      value={template80G}
                      onChange={(e) => {
                        setTemplate80G(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="template_80g">80G Compliant Template</option>
                      <option value="template_1">Standard Template (Online)</option>
                      <option value="template_2">Detailed Template</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Template for Non-80G Donations
                    </label>
                    <select
                      value={templateNon80G}
                      onChange={(e) => {
                        setTemplateNon80G(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="template_non_80g">Non-80G Template</option>
                      <option value="template_1">Standard Template (Online)</option>
                      <option value="template_2">Detailed Template</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Template Update Behavior
                </h3>
                <div className="space-y-[16px]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                        Force regenerate PDF when template updates
                      </label>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                        Automatically regenerate all existing receipts using this template
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setForceRegenerateOnUpdate(!forceRegenerateOnUpdate);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        forceRegenerateOnUpdate ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          forceRegenerateOnUpdate ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                        Lock receipt content after generation
                      </label>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                        Allow PDF regeneration but disallow changing donor values
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setLockContentAfterGeneration(!lockContentAfterGeneration);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        lockContentAfterGeneration ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          lockContentAfterGeneration ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        mobileRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          mobileRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        emailRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          emailRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        addressRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          addressRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        categoryRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          categoryRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        typeRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          typeRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                            setPanThreshold(e.target.value);
                            setHasChanges(true);
                          }}
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        panAutoUppercase ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          panAutoUppercase ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                        Pincode Validation (India)
                      </label>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                        Validate 6-digit Indian postal codes
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPincodeValidation(!pincodeValidation);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        pincodeValidation ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          pincodeValidation ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                        Duplicate Donor Warning
                      </label>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                        Alert if same email/mobile/PAN already exists
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setDuplicateWarning(!duplicateWarning);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        duplicateWarning ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          duplicateWarning ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoSendEmail ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoSendEmail ? 'translate-x-[22px]' : 'translate-x-[2px]'
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

                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Retry Failed Emails
                        </label>
                        <input
                          type="number"
                          value={emailRetryAttempts}
                          onChange={(e) => {
                            setEmailRetryAttempts(e.target.value);
                            setHasChanges(true);
                          }}
                          min="0"
                          max="5"
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                        <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                          Number of retry attempts (exponential backoff)
                        </p>
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
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                            emailFailureAlert ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                          }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                              emailFailureAlert ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoSendSMS ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoSendSMS ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  {autoSendSMS && (
                    <>
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          SMS Template (160 chars max)
                        </label>
                        <textarea
                          value={smsTemplate}
                          onChange={(e) => {
                            if (e.target.value.length <= 160) {
                              setSmsTemplate(e.target.value);
                              setHasChanges(true);
                            }
                          }}
                          rows={3}
                          className="w-full px-[14px] py-[12px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none"
                        />
                        <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                          {smsTemplate.length}/160 characters
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Use short link for PDF URL
                        </label>
                        <button
                          onClick={() => {
                            setSmsShortLink(!smsShortLink);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                            smsShortLink ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                          }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                              smsShortLink ? 'translate-x-[22px]' : 'translate-x-[2px]'
                            }`}
                          />
                        </button>
                      </div>
                    </>
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

          {/* Storage & Access Tab */}
          {activeTab === 'storage' && (
            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  PDF Storage Mode
                </h3>
                <div className="space-y-[12px]">
                  <label className="flex items-center gap-[12px] cursor-pointer p-[16px] border border-[#DBDBDB] rounded-[16px] hover:bg-[#FAFAFA]">
                    <input
                      type="radio"
                      name="storageMode"
                      checked={storageMode === 'local'}
                      onChange={() => {
                        setStorageMode('local');
                        setHasChanges(true);
                      }}
                      className="w-[20px] h-[20px]"
                    />
                    <div>
                      <span className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                        Local Storage
                      </span>
                      <span className="text-[13px] leading-[18px] text-[#6E6E6E]">
                        Store PDFs on local server
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-[12px] cursor-pointer p-[16px] border-2 border-[#F36A4F] bg-[#FEF1EE] rounded-[16px]">
                    <input
                      type="radio"
                      name="storageMode"
                      checked={storageMode === 's3'}
                      onChange={() => {
                        setStorageMode('s3');
                        setHasChanges(true);
                      }}
                      className="w-[20px] h-[20px]"
                    />
                    <div>
                      <span className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                        S3 / Cloud + CDN (Recommended)
                      </span>
                      <span className="text-[13px] leading-[18px] text-[#734F48]">
                        Fast delivery and scalable storage
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Public Download Link Behavior
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[12px]">
                      Link Security
                    </label>
                    <div className="space-y-[8px]">
                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="radio"
                          name="linkSecurity"
                          checked={linkSecurity === 'token'}
                          onChange={() => {
                            setLinkSecurity('token');
                            setHasChanges(true);
                          }}
                          className="w-[20px] h-[20px]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                          Secure link with token
                        </span>
                      </label>

                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="radio"
                          name="linkSecurity"
                          checked={linkSecurity === 'public'}
                          onChange={() => {
                            setLinkSecurity('public');
                            setHasChanges(true);
                          }}
                          className="w-[20px] h-[20px]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                          Public link (not recommended)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Link Expiry
                    </label>
                    <select
                      value={linkExpiry}
                      onChange={(e) => {
                        setLinkExpiry(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="never">Never expire</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  PDF Regeneration Policy
                </h3>
                <div className="space-y-[16px]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                        Allow regeneration when template changes
                      </label>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                        Users can regenerate PDF if template is updated
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAllowRegenerationTemplate(!allowRegenerationTemplate);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        allowRegenerationTemplate ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          allowRegenerationTemplate ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                        Allow regeneration anytime
                      </label>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                        Requires audit reason for compliance
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAllowRegenerationAnytime(!allowRegenerationAnytime);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        allowRegenerationAnytime ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          allowRegenerationAnytime ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Operations Tab */}
          {activeTab === 'bulk' && (
            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Bulk Generation Settings
                </h3>
                <div className="space-y-[16px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Allow bulk generation
                    </label>
                    <button
                      onClick={() => {
                        setBulkGenerationAllowed(!bulkGenerationAllowed);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        bulkGenerationAllowed ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          bulkGenerationAllowed ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  {bulkGenerationAllowed && (
                    <>
                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Maximum Records Per Batch
                        </label>
                        <select
                          value={maxBatchSize}
                          onChange={(e) => {
                            setMaxBatchSize(e.target.value);
                            setHasChanges(true);
                          }}
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        >
                          <option value="100">100 records</option>
                          <option value="500">500 records</option>
                          <option value="1000">1000 records</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                          Run in background queue
                        </label>
                        <button
                          onClick={() => {
                            setRunInBackground(!runInBackground);
                            setHasChanges(true);
                          }}
                          className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                            runInBackground ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                          }`}
                        >
                          <div
                            className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                              runInBackground ? 'translate-x-[22px]' : 'translate-x-[2px]'
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {bulkGenerationAllowed && (
                <div>
                  <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                    ZIP Download Settings
                  </h3>
                  <div className="space-y-[16px]">
                    <div>
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                        Filename Format
                      </label>
                      <input
                        type="text"
                        value={zipFilenameFormat}
                        onChange={(e) => {
                          setZipFilenameFormat(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                        Variables: YYYYMMDD, Batch001
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                        Include index CSV inside ZIP
                      </label>
                      <button
                        onClick={() => {
                          setIncludeIndexCSV(!includeIndexCSV);
                          setHasChanges(true);
                        }}
                        className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                          includeIndexCSV ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                            includeIndexCSV ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Workflow Tab */}
          {activeTab === 'status' && (
            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Receipt Statuses
                </h3>
                <div className="border border-[#DBDBDB] rounded-[16px] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Status
                        </th>
                        <th className="text-left px-[16px] py-[12px] text-[13px] leading-[18px] font-medium text-[#6E6E6E]">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { status: 'Pending Generation', desc: 'Receipt queued for generation' },
                        { status: 'Generated', desc: 'PDF created successfully' },
                        { status: 'Email Sent', desc: 'Email delivered to donor' },
                        { status: 'Email Failed', desc: 'Email delivery failed' },
                        { status: 'SMS Sent', desc: 'SMS delivered to donor' },
                        { status: 'SMS Failed', desc: 'SMS delivery failed' },
                        { status: 'Cancelled', desc: 'Receipt cancelled (restricted)' },
                      ].map((item, idx) => (
                        <tr key={idx} className="border-b border-[#F0F0F0]">
                          <td className="px-[16px] py-[12px]">
                            <span className="px-[8px] py-[2px] bg-[#F3F3F3] text-[#3D3D3D] rounded-[4px] text-[13px] leading-[18px] font-medium">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#6E6E6E]">
                            {item.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Status Workflow Settings
                </h3>
                <div className="space-y-[16px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Allow "mark as reissued"
                    </label>
                    <button
                      onClick={() => {
                        setAllowMarkReissued(!allowMarkReissued);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        allowMarkReissued ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          allowMarkReissued ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[16px] leading-[24px] font-medium text-[#0D0D0D]">
                      Auto-mark delivered if email success
                    </label>
                    <button
                      onClick={() => {
                        setAutoMarkDelivered(!autoMarkDelivered);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        autoMarkDelivered ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          autoMarkDelivered ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        allowReprint ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          allowReprint ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        allowResendEmail ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          allowResendEmail ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        requireReasonReprint ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          requireReasonReprint ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        allowCorrection ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          allowCorrection ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                        className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                          requireReasonCorrection ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                            requireReasonCorrection ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Audit & Compliance Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Audit Log Events
                </h3>
                <div className="border border-[#DBDBDB] rounded-[16px] p-[16px]">
                  <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-[12px]">
                    The following events are automatically logged:
                  </p>
                  <ul className="space-y-[8px]">
                    {[
                      'Receipt generated (auto/manual)',
                      'Receipt regenerated PDF',
                      'Receipt reprinted',
                      'Receipt emailed / SMS sent',
                      'Template applied / changed',
                      'Bulk generation started/completed',
                      'Failed delivery retries',
                      'Exported receipt register',
                      'Status changes (cancelled, reissued)',
                    ].map((event, idx) => (
                      <li key={idx} className="flex items-center gap-[8px]">
                        <Check className="w-4 h-4 text-[#F36A4F] flex-shrink-0" />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">{event}</span>
                      </li>
                    ))}
                  </ul>
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        requireReasonManualGen ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          requireReasonManualGen ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        requireReasonRegenerate ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          requireReasonRegenerate ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        requireReasonCancel ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          requireReasonCancel ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-[16px] bg-[#FEF1EE] border border-[#F36A4F] rounded-[16px]">
                <div className="flex items-start gap-[12px]">
                  <AlertCircle className="w-5 h-5 text-[#F36A4F] flex-shrink-0 mt-[2px]" />
                  <div>
                    <p className="text-[16px] leading-[24px] font-medium text-[#734F48] mb-[4px]">
                      Retention Policy
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#734F48]">
                      All receipt audit logs are retained for minimum {retentionYears} years as per compliance requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Defaults Tab */}
          {activeTab === 'search' && (
            <div className="space-y-[24px]">
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Default Filters
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Default Date Filter
                    </label>
                    <select
                      value={defaultDateFilter}
                      onChange={(e) => {
                        setDefaultDateFilter(e.target.value as 'today' | 'this_month');
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="today">Today</option>
                      <option value="this_month">This Month</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Default Page Size
                    </label>
                    <select
                      value={defaultPageSize}
                      onChange={(e) => {
                        setDefaultPageSize(e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="25">25 per page</option>
                      <option value="50">50 per page</option>
                      <option value="100">100 per page</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D] mb-[16px]">
                  Export Settings
                </h3>
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[12px]">
                      Allowed Export Formats
                    </label>
                    <div className="space-y-[8px]">
                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportFormats.csv}
                          onChange={() => {
                            setExportFormats((prev) => ({ ...prev, csv: !prev.csv }));
                            setHasChanges(true);
                          }}
                          className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">CSV</span>
                      </label>

                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportFormats.excel}
                          onChange={() => {
                            setExportFormats((prev) => ({ ...prev, excel: !prev.excel }));
                            setHasChanges(true);
                          }}
                          className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">Excel</span>
                      </label>

                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportFormats.pdf}
                          onChange={() => {
                            setExportFormats((prev) => ({ ...prev, pdf: !prev.pdf }));
                            setHasChanges(true);
                          }}
                          className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">PDF</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                        Mask donor PII in exports
                      </label>
                      <p className="text-[13px] leading-[18px] text-[#6E6E6E]">
                        For non-privileged roles (mask email, mobile, PAN)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setMaskPII(!maskPII);
                        setHasChanges(true);
                      }}
                      className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                        maskPII ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                          maskPII ? 'translate-x-[22px]' : 'translate-x-[2px]'
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
