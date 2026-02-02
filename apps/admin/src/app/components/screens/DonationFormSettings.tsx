import React, { useState, useEffect } from 'react';
import { useApi, getApiBaseUrl } from '../../context/ApiContext';
import { toast } from '../ui/toast';

interface DonationFormConfig {
  formEnabled?: boolean;
  maintenanceMessage?: string;
  testMode?: boolean;
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

export const DonationFormSettings: React.FC = () => {
  const { apiFetch } = useApi();
  const baseUrl = getApiBaseUrl();

  // Form Status
  const [formEnabled, setFormEnabled] = useState(true);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [testMode, setTestMode] = useState(false);

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

  useEffect(() => {
    fetchSettings();
    fetchVersionHistory();
  }, []);

  useEffect(() => {
    // Mark as unsaved changes whenever any field changes
    setHasUnsavedChanges(true);
  }, [
    formEnabled,
    maintenanceMessage,
    testMode,
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
      setTestMode(data.testMode ?? false);
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
        testMode,
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
    toast.info('Changes discarded');
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
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Donation Form Settings</h1>
          <p style={{ color: '#666', margin: '8px 0 0' }}>Configure donation form fields and behavior</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowVersionHistory(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🕒 Version History
          </button>
          <button
            onClick={() => setShowPreview(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            👁️ Preview Form
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '14px' }}>You have unsaved changes</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleDiscard}
              disabled={saving}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Form Status Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Form Status</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Enable or disable the donation form</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formEnabled}
              onChange={(e) => setFormEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>Enable Donation Form</div>
              <div style={{ fontSize: '13px', color: '#666' }}>When disabled, visitors will see a maintenance message</div>
            </div>
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Maintenance Message</label>
          <textarea
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="Enter message to display when form is disabled..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              minHeight: '100px',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>This message will be shown to visitors</div>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>Test Mode</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Enable test mode for testing without processing real transactions</div>
            </div>
          </label>
        </div>
      </div>

      {/* Field Configuration Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Field Configuration</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Configure required fields and validation rules</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={multiCountry}
              onChange={(e) => setMultiCountry(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>Multi-Country Support</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Allow donors to select country other than India</div>
            </div>
          </label>
          {multiCountry && (
            <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '6px', fontSize: '13px' }}>
              ℹ️ Country will default to India. State field will auto-populate Indian states.
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '12px' }}>PAN Card Requirement</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="always"
                checked={panRequired === 'always'}
                onChange={(e) => setPanRequired(e.target.value as any)}
              />
              <span>Always Required</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="threshold"
                checked={panRequired === 'threshold'}
                onChange={(e) => setPanRequired(e.target.value as any)}
              />
              <span>Required Above Threshold</span>
            </label>
            {panRequired === 'threshold' && (
              <div style={{ marginLeft: '28px', marginTop: '8px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                  Threshold Amount (₹)
                </label>
                <input
                  type="number"
                  value={panThreshold}
                  onChange={(e) => setPanThreshold(Number(e.target.value))}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '200px',
                  }}
                />
              </div>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="optional"
                checked={panRequired === 'optional'}
                onChange={(e) => setPanRequired(e.target.value as any)}
              />
              <span>Optional</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                value="never"
                checked={panRequired === 'never'}
                onChange={(e) => setPanRequired(e.target.value as any)}
              />
              <span>Never Ask</span>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={addressRequired}
              onChange={(e) => setAddressRequired(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Address Required</span>
          </label>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={mobileRequired}
              onChange={(e) => setMobileRequired(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Mobile Number Required</span>
          </label>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={otpVerification}
              onChange={(e) => setOtpVerification(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>OTP Verification</span>
          </label>
        </div>
      </div>

      {/* Amount Configuration Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Amount Configuration</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>
            Preset Amounts (₹) - Comma separated
          </label>
          <input
            type="text"
            value={presetAmounts.join(', ')}
            onChange={(e) => {
              const amounts = e.target.value
                .split(',')
                .map((a) => parseInt(a.trim()))
                .filter((a) => !isNaN(a));
              setPresetAmounts(amounts);
            }}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Minimum Amount (₹)</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(Number(e.target.value))}
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                width: '100%',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Maximum Amount (₹)</label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(Number(e.target.value))}
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                width: '100%',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={allowCustomAmount}
              onChange={(e) => setAllowCustomAmount(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Allow Custom Amount</span>
          </label>
        </div>
      </div>

      {/* Recurring Donations Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Recurring Donations</h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={enableRecurring}
              onChange={(e) => setEnableRecurring(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Enable Recurring Donations</span>
          </label>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={suggestRecurring}
              onChange={(e) => setSuggestRecurring(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontWeight: 500 }}>Suggest Recurring Option</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Show recurring suggestion to donors</div>
            </div>
          </label>
        </div>
      </div>

      {/* Other Settings Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Other Settings</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showDonorHistory}
              onChange={(e) => setShowDonorHistory(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Show Donor History</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoFillLastDonor}
              onChange={(e) => setAutoFillLastDonor(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Auto-fill Last Donor Details</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={requireTermsAcceptance}
              onChange={(e) => setRequireTermsAcceptance(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Require Terms & Conditions Acceptance</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={enable80GCertificate}
              onChange={(e) => setEnable80GCertificate(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 500 }}>Enable 80G Certificate</span>
          </label>
        </div>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Version History</h2>
            <button
              onClick={() => setShowVersionHistory(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                color: '#666',
              }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {versionHistory.map((version) => (
              <div
                key={version.id}
                style={{
                  padding: '16px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  backgroundColor: version.isActive ? '#e8f5e9' : 'white',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{version.version}</div>
                    {version.isActive && (
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#4caf50',
                          backgroundColor: '#c8e6c9',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          marginTop: '4px',
                          display: 'inline-block',
                        }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  {!version.isActive && (
                    <button
                      onClick={() => handleRollback(version.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ff6b35',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Rollback
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  {new Date(version.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>{version.changesDescription}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  by {version.createdBy || 'System'}
                </div>
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
                {testMode && <span style={{ marginLeft: '10px', color: '#ff9800' }}>⚠️ Test Mode</span>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>Preset Amounts:</strong> {presetAmounts.map((amt) => `₹${amt}`).join(', ')}
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
