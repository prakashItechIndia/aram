import React, { useState, useEffect, useRef } from 'react';
import { History, Eye, RotateCcw, Save } from 'lucide-react';
import { useApi, getApiBaseUrl } from '../../context/ApiContext';
import { toast } from '../ui/toast';

interface DonationFormConfig {
  formEnabled?: boolean;
  maintenanceMessage?: string;
  multiCountry?: boolean;
  panRequired?: 'always' | 'threshold' | 'optional' | 'never';
  panThreshold?: number;
  addressRequired?: boolean;
  mobileRequired?: boolean;
  otpVerification?: boolean;
  presetAmounts?: number[];
  minAmount?: number;
  maxAmount?: number;
  allowCustomAmount?: boolean;
  enableRecurring?: boolean;
  suggestRecurring?: boolean;
  recurringFrequencies?: string[];
  enabledPaymentModes?: string[];
  defaultPaymentMode?: string;
  showDonorHistory?: boolean;
  autoFillLastDonor?: boolean;
  requireTermsAcceptance?: boolean;
  termsAndConditionsUrl?: string;
  enable80GCertificate?: boolean;
  showProgressBar?: boolean;
}

interface VersionHistoryItem {
  id: number;
  version: string;
  changesDescription: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

/** Toggle switch matching design: orange (#F36A4F) when on, gray when off, white knob */
function Switch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={disabled ? undefined : onChange}
      style={{
        position: 'relative',
        width: 52,
        height: 32,
        borderRadius: 9999,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: checked ? '#F36A4F' : '#DBDBDB',
        padding: 0,
        flexShrink: 0,
        opacity: disabled ? 0.6 : 1,
        transition: 'background-color 0.2s ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: 2,
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transform: checked ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.2s ease',
        }}
      />
    </button>
  );
}

export const DonationFormSettings: React.FC = () => {
  const { apiFetch } = useApi();
  const baseUrl = getApiBaseUrl();

  // Form Status
  const [formEnabled, setFormEnabled] = useState(true);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  // Field Configuration
  const [multiCountry, setMultiCountry] = useState(false);
  const [panRequired, setPanRequired] = useState<'always' | 'threshold' | 'optional' | 'never'>('threshold');
  const [panThreshold, setPanThreshold] = useState(2000);
  const [addressRequired, setAddressRequired] = useState(true);
  const [mobileRequired, setMobileRequired] = useState(true);
  const [otpVerification, setOtpVerification] = useState(false);

  // Amount Configuration
  const [presetAmounts, setPresetAmounts] = useState<number[]>([500, 1000, 2500, 5000, 10000]);
  const [minAmount, setMinAmount] = useState(100);
  const [maxAmount, setMaxAmount] = useState(1000000);
  const [allowCustomAmount, setAllowCustomAmount] = useState(true);

  // Recurring Donations
  const [enableRecurring, setEnableRecurring] = useState(true);
  const [suggestRecurring, setSuggestRecurring] = useState(true);

  // Other settings
  const [showDonorHistory, setShowDonorHistory] = useState(true);
  const [autoFillLastDonor, setAutoFillLastDonor] = useState(true);
  const [requireTermsAcceptance, setRequireTermsAcceptance] = useState(true);
  const [enable80GCertificate, setEnable80GCertificate] = useState(true);

  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [versionHistory, setVersionHistory] = useState<VersionHistoryItem[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [rollbackVersionId, setRollbackVersionId] = useState<number | null>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    fetchSettings();
    fetchVersionHistory();
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    setHasUnsavedChanges(true);
  }, [
    formEnabled,
    maintenanceMessage,
    multiCountry,
    panRequired,
    panThreshold,
    addressRequired,
    mobileRequired,
    otpVerification,
    presetAmounts,
    minAmount,
    maxAmount,
    allowCustomAmount,
    enableRecurring,
    suggestRecurring,
    showDonorHistory,
    autoFillLastDonor,
    requireTermsAcceptance,
    enable80GCertificate,
  ]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${baseUrl}/donation-form-settings/current`);
      const data = await response.json();

      setFormEnabled(data.formEnabled ?? true);
      setMaintenanceMessage(data.maintenanceMessage ?? '');
      setMultiCountry(data.multiCountry ?? false);
      setPanRequired(data.panRequired ?? 'threshold');
      setPanThreshold(data.config?.panThreshold ?? 2000);
      setAddressRequired(data.addressRequired ?? true);
      setMobileRequired(data.mobileRequired ?? true);
      setOtpVerification(data.otpVerification ?? false);
      setPresetAmounts(data.config?.presetAmounts ?? [500, 1000, 2500, 5000, 10000]);
      setMinAmount(data.config?.minAmount ?? 100);
      setMaxAmount(data.config?.maxAmount ?? 1000000);
      setAllowCustomAmount(data.config?.allowCustomAmount ?? true);
      setEnableRecurring(data.config?.enableRecurring ?? true);
      setSuggestRecurring(data.suggestRecurring ?? true);
      setShowDonorHistory(data.config?.showDonorHistory ?? true);
      setAutoFillLastDonor(data.config?.autoFillLastDonor ?? true);
      setRequireTermsAcceptance(data.config?.requireTermsAcceptance ?? true);
      setEnable80GCertificate(data.config?.enable80GCertificate ?? true);
      setCurrentVersion(data.version ?? 'v1.0');
      setHasUnsavedChanges(false);
      initialLoadDone.current = true;
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionHistory = async () => {
    try {
      const response = await apiFetch(`${baseUrl}/donation-form-settings/versions`);
      const data = await response.json();
      setVersionHistory(data);
    } catch (error) {
      console.error('Error fetching version history:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        formEnabled,
        maintenanceMessage,
        multiCountry,
        panRequired,
        panThreshold,
        addressRequired,
        mobileRequired,
        otpVerification,
        presetAmounts,
        minAmount,
        maxAmount,
        allowCustomAmount,
        enableRecurring,
        suggestRecurring,
        showDonorHistory,
        autoFillLastDonor,
        requireTermsAcceptance,
        enable80GCertificate,
        changesDescription: 'Updated donation form settings',
      };

      const response = await apiFetch(`${baseUrl}/donation-form-settings/current`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
        setHasUnsavedChanges(false);
        fetchSettings();
        fetchVersionHistory();
      } else {
        const error = await response.json();
        toast.error(`Failed to save: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setShowDiscardConfirm(true);
  };

  const confirmDiscard = () => {
    fetchSettings();
    setShowDiscardConfirm(false);
    toast.success('Changes discarded');
  };

  const handleRollback = (versionId: number) => {
    setRollbackVersionId(versionId);
  };

  const confirmRollback = async () => {
    if (!rollbackVersionId) return;

    try {
      const response = await apiFetch(`${baseUrl}/donation-form-settings/rollback/${rollbackVersionId}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Successfully rolled back to previous version!');
        fetchSettings();
        fetchVersionHistory();
        setShowVersionHistory(false);
        setRollbackVersionId(null);
      } else {
        toast.error('Failed to rollback');
      }
    } catch (error) {
      console.error('Error rolling back:', error);
      toast.error('Failed to rollback');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading donation form settings...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', paddingBottom: hasUnsavedChanges ? '96px' : '24px' }}>
      {/* Header (spec 7.1) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0, color: '#0D0D0D' }}>Donation Form Settings</h1>
          <p style={{ color: '#6E6E6E', margin: '8px 0 0', fontSize: '16px' }}>Configure donation form fields and behavior</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setShowVersionHistory(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: '1px solid #DBDBDB',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#3D3D3D',
            }}
          >
            <History size={18} />
            Version History
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: '1px solid #DBDBDB',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#3D3D3D',
            }}
          >
            <Eye size={18} />
            Preview Form
          </button>
        </div>
      </div>

      {/* Form Status Card (spec 7.3) */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #DBDBDB' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#0D0D0D' }}>Form Status</h2>
        <p style={{ color: '#6E6E6E', fontSize: '14px', marginBottom: '20px' }}>Enable or disable the donation form</p>

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 500, color: '#0D0D0D' }}>Enable Donation Form</div>
            <div style={{ fontSize: '13px', color: '#6E6E6E' }}>When disabled, visitors will see a maintenance message</div>
          </div>
          <Switch checked={formEnabled} onChange={() => setFormEnabled(!formEnabled)} />
        </div>

        {!formEnabled && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#0D0D0D' }}>Maintenance Message</label>
            <textarea
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              placeholder="Enter message to display when form is disabled..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #DBDBDB',
                borderRadius: '16px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ fontSize: '13px', color: '#6E6E6E', marginTop: '6px' }}>This message will be shown to visitors</div>
          </div>
        )}
      </div>

      {/* Field Configuration Card (spec 7.4) */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #DBDBDB' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#0D0D0D' }}>Field Configuration</h2>
        <p style={{ color: '#6E6E6E', fontSize: '14px', marginBottom: '20px' }}>Configure required fields and validation rules</p>

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 500, color: '#0D0D0D' }}>Multi-Country Support</div>
            <div style={{ fontSize: '13px', color: '#6E6E6E' }}>Allow donors to select country other than India</div>
          </div>
          <Switch checked={multiCountry} onChange={() => setMultiCountry(!multiCountry)} />
          {!multiCountry && (
            <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#F3F3F3', borderRadius: '12px', fontSize: '13px', color: '#6E6E6E' }}>
              ℹ️ Country will default to India. State field will auto-populate Indian states.
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '12px', color: '#0D0D0D' }}>PAN Card Requirement</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="radio" value="always" checked={panRequired === 'always'} onChange={(e) => setPanRequired(e.target.value as any)} style={{ marginTop: '4px' }} />
              <div>
                <span style={{ fontWeight: 500, color: '#0D0D0D' }}>Always Required</span>
                <div style={{ fontSize: '13px', color: '#6E6E6E' }}>PAN mandatory for all donations</div>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="radio" value="threshold" checked={panRequired === 'threshold'} onChange={(e) => setPanRequired(e.target.value as any)} style={{ marginTop: '4px' }} />
              <div>
                <span style={{ fontWeight: 500, color: '#0D0D0D' }}>Threshold Based (₹2,000+)</span>
                <div style={{ fontSize: '13px', color: '#6E6E6E' }}>Required for donations above ₹2,000</div>
                {panRequired === 'threshold' && (
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontSize: '13px', color: '#6E6E6E', marginRight: '8px' }}>Threshold (₹)</label>
                    <input
                      type="number"
                      value={panThreshold}
                      onChange={(e) => setPanThreshold(Number(e.target.value))}
                      style={{ padding: '8px 12px', border: '1px solid #DBDBDB', borderRadius: '12px', fontSize: '14px', width: '120px' }}
                    />
                  </div>
                )}
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="radio" value="optional" checked={panRequired === 'optional'} onChange={(e) => setPanRequired(e.target.value as any)} style={{ marginTop: '4px' }} />
              <div>
                <span style={{ fontWeight: 500, color: '#0D0D0D' }}>Optional for International</span>
                <div style={{ fontSize: '13px', color: '#6E6E6E' }}>Not required for non-Indian donors</div>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="radio" value="never" checked={panRequired === 'never'} onChange={(e) => setPanRequired(e.target.value as any)} style={{ marginTop: '4px' }} />
              <div>
                <span style={{ fontWeight: 500, color: '#0D0D0D' }}>Never Ask</span>
                <div style={{ fontSize: '13px', color: '#6E6E6E' }}>PAN field not shown</div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 500, color: '#0D0D0D' }}>Require Address</div>
            <div style={{ fontSize: '13px', color: '#6E6E6E' }}>Make address field mandatory</div>
          </div>
          <Switch checked={addressRequired} onChange={() => setAddressRequired(!addressRequired)} />
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 500, color: '#0D0D0D' }}>Require Mobile Number</div>
            <div style={{ fontSize: '13px', color: '#6E6E6E' }}>Make mobile number mandatory</div>
          </div>
          <Switch checked={mobileRequired} onChange={() => setMobileRequired(!mobileRequired)} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 500, color: '#0D0D0D' }}>Mobile OTP Verification</div>
            <div style={{ fontSize: '13px', color: '#6E6E6E' }}>Verify mobile number with OTP (currently disabled)</div>
          </div>
          <Switch checked={otpVerification} onChange={() => {}} disabled />
        </div>
      </div>

      {/* Amount Configuration Card (spec 7.5) */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #DBDBDB' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#0D0D0D' }}>Amount Configuration</h2>
        <p style={{ color: '#6E6E6E', fontSize: '14px', marginBottom: '20px' }}>Configure donation amount options and limits</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '12px', color: '#0D0D0D' }}>Preset Amounts</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
            {presetAmounts.map((amt: number, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={amt}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v > 0) {
                      const next = [...presetAmounts];
                      next[idx] = v;
                      setPresetAmounts(next);
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #DBDBDB',
                    borderRadius: '12px',
                    fontSize: '14px',
                    width: '100px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setPresetAmounts((prev: number[]) => prev.filter((_: number, i: number) => i !== idx))}
                  style={{
                    padding: '6px 10px',
                    background: 'none',
                    border: 'none',
                    color: '#F36A4F',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPresetAmounts((prev: number[]) => [...prev, 1000])}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #DBDBDB',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Add Preset Amount
            </button>
          </div>
          <div style={{ fontSize: '13px', color: '#6E6E6E' }}>Donors can also enter custom amounts</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#0D0D0D' }}>Minimum Amount</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(Number(e.target.value))}
              style={{
                padding: '12px 14px',
                border: '1px solid #DBDBDB',
                borderRadius: '16px',
                fontSize: '14px',
                width: '100%',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#0D0D0D' }}>Maximum Amount</label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(Number(e.target.value))}
              style={{
                padding: '12px 14px',
                border: '1px solid #DBDBDB',
                borderRadius: '16px',
                fontSize: '14px',
                width: '100%',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 500, color: '#0D0D0D' }}>Suggest Recurring Donations</div>
            <div style={{ fontSize: '13px', color: '#6E6E6E' }}>Show option to make donation recurring</div>
          </div>
          <Switch checked={suggestRecurring} onChange={() => setSuggestRecurring(!suggestRecurring)} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ fontWeight: 500, color: '#0D0D0D' }}>Allow Custom Amount</span>
          <Switch checked={allowCustomAmount} onChange={() => setAllowCustomAmount(!allowCustomAmount)} />
        </div>
      </div>

      {/* Version History Drawer (spec 7.7) - 480px width */}
      {showVersionHistory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '480px',
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '-2px 0 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #DBDBDB',
          }}
        >
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #DBDBDB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#0D0D0D' }}>Version History</h2>
            <button
              type="button"
              onClick={() => setShowVersionHistory(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                color: '#6E6E6E',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {[...versionHistory]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((version) => (
                <div
                  key={version.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    backgroundColor: '#FAFAFA',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#4A4A4A',
                          backgroundColor: '#E5E5E5',
                          padding: '4px 10px',
                          borderRadius: '999px',
                        }}
                      >
                        {version.version}
                      </span>
                      {version.isActive && (
                        <span style={{ fontSize: '13px', color: '#4A4A4A', fontWeight: 400 }}>
                          Current
                        </span>
                      )}
                    </div>
                    {!version.isActive && (
                      <button
                        type="button"
                        onClick={() => handleRollback(version.id)}
                        style={{
                          padding: 0,
                          background: 'none',
                          border: 'none',
                          color: '#2563EB',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500,
                          textDecoration: 'underline',
                        }}
                      >
                        Rollback
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6E6E6E', marginBottom: '4px' }}>
                    {new Date(version.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div style={{ fontSize: '14px', color: '#0D0D0D', marginBottom: '4px' }}>{version.changesDescription}</div>
                  <div style={{ fontSize: '12px', color: '#6E6E6E' }}>by {version.createdBy || 'System'}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1001,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
          }}
          onClick={() => setShowPreview(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>Donation Form Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '0',
                  color: '#666',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '14px' }}>
              <div style={{ marginBottom: '16px' }}>
                <strong>Form Status:</strong> {formEnabled ? '✅ Enabled' : '❌ Disabled'}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>Preset Amounts:</strong> {presetAmounts.map((amt: number) => `₹${amt}`).join(', ')}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>Amount Range:</strong> ₹{minAmount} - ₹{maxAmount}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>Required Fields:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {mobileRequired && <li>Mobile Number</li>}
                  {addressRequired && <li>Address</li>}
                  {panRequired !== 'never' && <li>PAN Card ({panRequired})</li>}
                </ul>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>Features:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {multiCountry && <li>Multi-Country Support</li>}
                  {otpVerification && <li>OTP Verification</li>}
                  {enableRecurring && <li>Recurring Donations</li>}
                  {enable80GCertificate && <li>80G Certificate</li>}
                </ul>
              </div>

              {!formEnabled && maintenanceMessage && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                  <strong>Maintenance Message:</strong>
                  <div style={{ marginTop: '8px' }}>{maintenanceMessage}</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
              This is a preview of your donation form configuration
            </div>
          </div>
        </div>
      )}

      {/* Sticky Save Bar (spec 7.6) - only when unsaved changes */}
      {hasUnsavedChanges && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: '280px',
            right: 0,
            height: 72,
            backgroundColor: 'white',
            borderTop: '1px solid #DBDBDB',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '24px',
            paddingRight: '24px',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <span style={{ fontSize: '14px', color: '#6E6E6E', fontWeight: 500 }}>You have unsaved changes</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleDiscard}
              disabled={saving}
              style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                border: '1px solid #DBDBDB',
                borderRadius: '999px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#3D3D3D',
              }}
            >
              <RotateCcw size={18} />
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 20px',
                backgroundColor: '#F36A4F',
                color: 'white',
                border: 'none',
                borderRadius: '999px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Backdrop for version history */}
      {showVersionHistory && (
        <div
          onClick={() => setShowVersionHistory(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
          aria-hidden="true"
        />
      )}

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1002,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setShowDiscardConfirm(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Discard Changes?</h3>
            <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
              Are you sure you want to discard all unsaved changes? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDiscard}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rollback Confirmation Modal */}
      {rollbackVersionId !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1002,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setRollbackVersionId(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Rollback Version?</h3>
            <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
              Are you sure you want to rollback to this version? This will create a new version based on the selected settings.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setRollbackVersionId(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRollback}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Confirm Rollback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationFormSettings;
