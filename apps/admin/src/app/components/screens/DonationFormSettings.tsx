import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/app/context/ApiContext';
import { Card, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Drawer } from '../ui/drawer';
import { Save, RotateCcw, Eye, History } from 'lucide-react';
import { toast } from '../ui/toast';

export function DonationFormSettings() {
  const { api } = useApi();
  const [formEnabled, setFormEnabled] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const [multiCountry, setMultiCountry] = useState(false);
  const [panRequired, setPanRequired] = useState('threshold');
  const [addressRequired, setAddressRequired] = useState(true);
  const [mobileRequired, setMobileRequired] = useState(true);
  const [otpVerification, setOtpVerification] = useState(false);
  const [suggestRecurring, setSuggestRecurring] = useState(true);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [presetAmounts, setPresetAmounts] = useState(['500', '1000', '2500', '5000']);
  const [minAmount, setMinAmount] = useState('100');
  const [maxAmount, setMaxAmount] = useState('50000');
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  const { data: config } = useQuery({
    queryKey: ['donation-form-config'],
    queryFn: async () => {
      const res = await api.configApi.configControllerGetDonationFormConfig();
      return (res as { data?: Record<string, unknown> })?.data;
    },
  });

  useEffect(() => {
    if (!config) return;
    const donationForm = config.donationForm as Record<string, unknown> | undefined;
    if (donationForm) {
      if (typeof donationForm.donationFormEnabled === 'boolean') setFormEnabled(donationForm.donationFormEnabled);
      if (typeof donationForm.testMode === 'boolean') setTestMode(donationForm.testMode);
      if (typeof donationForm.multiCountrySupport === 'boolean') setMultiCountry(donationForm.multiCountrySupport);
      if (typeof donationForm.panRequirement === 'string') setPanRequired(donationForm.panRequirement);
      if (typeof donationForm.requireAddress === 'boolean') setAddressRequired(donationForm.requireAddress);
      if (typeof donationForm.requireMobile === 'boolean') setMobileRequired(donationForm.requireMobile);
      if (typeof donationForm.mobileOtpVerification === 'boolean') setOtpVerification(donationForm.mobileOtpVerification);
      if (typeof donationForm.suggestRecurring === 'boolean') setSuggestRecurring(donationForm.suggestRecurring);
      if (typeof donationForm.maintenanceMessage === 'string') setMaintenanceMessage(donationForm.maintenanceMessage);
      if (Array.isArray(donationForm.presetAmounts)) setPresetAmounts((donationForm.presetAmounts as number[]).map(String));
      if (typeof donationForm.minAmount === 'number') setMinAmount(String(donationForm.minAmount));
      if (typeof donationForm.maxAmount === 'number') setMaxAmount(String(donationForm.maxAmount));
    }
  }, [config]);
  
  const versionHistory = [
    { version: 'v1.5', date: '20 Jan 2026, 10:30 AM', user: 'Super Admin', changes: 'Updated preset amounts' },
    { version: 'v1.4', date: '15 Jan 2026, 03:20 PM', user: 'Super Admin', changes: 'Enabled multi-country support' },
    { version: 'v1.3', date: '10 Jan 2026, 11:45 AM', user: 'Admin', changes: 'Modified PAN rules' },
    { version: 'v1.2', date: '05 Jan 2026, 09:15 AM', user: 'Super Admin', changes: 'Initial configuration' },
  ];
  
  const handleSave = () => {
    toast.success('Settings saved successfully');
    setHasChanges(false);
  };
  
  const handleChange = () => {
    setHasChanges(true);
  };
  
  return (
    <div className="space-y-[24px]">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D]">Donation Form Settings</h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E] mt-1">
            Configure donation form fields and behavior
          </p>
        </div>
        <div className="flex gap-[12px]">
          <Button variant="outline" onClick={() => setShowVersionHistory(true)}>
            <History className="w-4 h-4" />
            Version History
          </Button>
          <Button variant="outline">
            <Eye className="w-4 h-4" />
            Preview Form
          </Button>
        </div>
      </div>
      
      {/* Test Mode Banner */}
      {testMode && (
        <div className="bg-[#FEF7F6] border border-[#FCD9D3] rounded-[16px] p-[16px] flex items-center gap-3">
          <Badge variant="processing">Test Mode</Badge>
          <p className="text-[14px] leading-[20px] text-[#3D3D3D] flex-1">
            Form is running in test mode. No actual transactions will be processed.
          </p>
          <Button variant="outline" onClick={() => {
            setTestMode(false);
            handleChange();
          }}>
            Disable Test Mode
          </Button>
        </div>
      )}
      
      {/* Form Status */}
      <Card>
        <CardHeader
          title="Form Status"
          subtitle="Enable or disable the donation form"
        />
        <div className="space-y-[20px]">
          <Switch
            label="Enable Donation Form"
            helperText="When disabled, visitors will see a maintenance message"
            checked={formEnabled}
            onChange={(e) => {
              setFormEnabled(e.target.checked);
              handleChange();
            }}
          />
          
          {!formEnabled && (
            <Textarea
              label="Maintenance Message"
              value={maintenanceMessage}
              onChange={(e) => {
                setMaintenanceMessage(e.target.value);
                handleChange();
              }}
              placeholder="Enter message to display when form is disabled..."
              helperText="This message will be shown to visitors"
            />
          )}
          
          <div className="border-t border-[#DBDBDB] pt-[20px]">
            <Switch
              label="Test Mode"
              helperText="Enable test mode for testing without processing real transactions"
              checked={testMode}
              onChange={(e) => {
                setTestMode(e.target.checked);
                handleChange();
              }}
            />
          </div>
        </div>
      </Card>
      
      {/* Field Configuration */}
      <Card>
        <CardHeader
          title="Field Configuration"
          subtitle="Configure required fields and validation rules"
        />
        <div className="space-y-[20px]">
          <Switch
            label="Multi-Country Support"
            helperText="Allow donors to select country other than India"
            checked={multiCountry}
            onChange={(e) => {
              setMultiCountry(e.target.checked);
              handleChange();
            }}
          />
          
          {!multiCountry && (
            <div className="pl-8 text-[13px] leading-[18px] text-[#6E6E6E]">
              ℹ️ Country will default to India. State field will auto-populate Indian states.
            </div>
          )}
          
          <div className="border-t border-[#DBDBDB] pt-[20px]">
            <label className="block text-[14px] leading-[20px] font-medium text-[#0D0D0D] mb-3">
              PAN Card Requirement
            </label>
            <div className="space-y-[12px]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pan"
                  value="always"
                  checked={panRequired === 'always'}
                  onChange={(e) => {
                    setPanRequired(e.target.value);
                    handleChange();
                  }}
                  className="w-5 h-5 text-[#F36A4F] focus:ring-[#F36A4F]"
                />
                <div>
                  <span className="text-[14px] leading-[20px] text-[#0D0D0D]">Always Required</span>
                  <p className="text-[12px] leading-[16px] text-[#6E6E6E]">PAN mandatory for all donations</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pan"
                  value="threshold"
                  checked={panRequired === 'threshold'}
                  onChange={(e) => {
                    setPanRequired(e.target.value);
                    handleChange();
                  }}
                  className="w-5 h-5 text-[#F36A4F] focus:ring-[#F36A4F]"
                />
                <div>
                  <span className="text-[14px] leading-[20px] text-[#0D0D0D]">Threshold Based (₹2,000+)</span>
                  <p className="text-[12px] leading-[16px] text-[#6E6E6E]">Required for donations above ₹2,000</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pan"
                  value="international-optional"
                  checked={panRequired === 'international-optional'}
                  onChange={(e) => {
                    setPanRequired(e.target.value);
                    handleChange();
                  }}
                  className="w-5 h-5 text-[#F36A4F] focus:ring-[#F36A4F]"
                />
                <div>
                  <span className="text-[14px] leading-[20px] text-[#0D0D0D]">Optional for International</span>
                  <p className="text-[12px] leading-[16px] text-[#6E6E6E]">Not required for non-Indian donors</p>
                </div>
              </label>
            </div>
          </div>
          
          <div className="border-t border-[#DBDBDB] pt-[20px] space-y-[16px]">
            <Switch
              label="Require Address"
              helperText="Make address field mandatory"
              checked={addressRequired}
              onChange={(e) => {
                setAddressRequired(e.target.checked);
                handleChange();
              }}
            />
            
            <Switch
              label="Require Mobile Number"
              helperText="Make mobile number mandatory"
              checked={mobileRequired}
              onChange={(e) => {
                setMobileRequired(e.target.checked);
                handleChange();
              }}
            />
            
            <Switch
              label="Mobile OTP Verification"
              helperText="Verify mobile number with OTP (currently disabled)"
              checked={otpVerification}
              disabled
              onChange={(e) => {
                setOtpVerification(e.target.checked);
                handleChange();
              }}
            />
          </div>
        </div>
      </Card>
      
      {/* Amount Configuration */}
      <Card>
        <CardHeader
          title="Amount Configuration"
          subtitle="Configure donation amount options and limits"
        />
        <div className="space-y-[20px]">
          <div>
            <label className="block text-[14px] leading-[20px] font-medium text-[#0D0D0D] mb-2">
              Preset Amounts
            </label>
            <div className="flex flex-wrap gap-[12px] mb-3">
              {presetAmounts.map((amount, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const newAmounts = [...presetAmounts];
                      newAmounts[index] = e.target.value;
                      setPresetAmounts(newAmounts);
                      handleChange();
                    }}
                    className="w-[100px]"
                  />
                  <button
                    onClick={() => {
                      setPresetAmounts(presetAmounts.filter((_, i) => i !== index));
                      handleChange();
                    }}
                    className="text-[#F36A4F] hover:text-[#D7563D] text-[13px]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setPresetAmounts([...presetAmounts, '']);
                handleChange();
              }}
            >
              Add Preset Amount
            </Button>
            <p className="text-[12px] leading-[16px] text-[#6E6E6E] mt-2">
              Donors can also enter custom amounts
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-[16px]">
            <Input
              label="Minimum Amount"
              type="number"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                handleChange();
              }}
            />
            
            <Input
              label="Maximum Amount"
              type="number"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(e.target.value);
                handleChange();
              }}
            />
          </div>
          
          <Switch
            label="Suggest Recurring Donations"
            helperText="Show option to make donation recurring"
            checked={suggestRecurring}
            onChange={(e) => {
              setSuggestRecurring(e.target.checked);
              handleChange();
            }}
          />
        </div>
      </Card>
      
      {/* Sticky Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-[280px] right-0 h-[72px] bg-white border-t border-[#DBDBDB] flex items-center justify-end gap-[12px] px-[24px] z-50">
          <p className="text-[14px] leading-[20px] text-[#6E6E6E] mr-auto">
            You have unsaved changes
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setHasChanges(false);
              toast.info('Changes discarded');
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Discard
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      )}
      
      {/* Version History Drawer */}
      <Drawer
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        title="Version History"
      >
        <div className="space-y-[12px]">
          {versionHistory.map((version, index) => (
            <Card key={index} className="!p-[16px]">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">{version.version}</Badge>
                    {index === 0 && (
                      <span className="text-[11px] leading-[14px] text-[#6E6E6E]">Current</span>
                    )}
                  </div>
                  <p className="text-[12px] leading-[16px] text-[#6E6E6E] mt-1">{version.date}</p>
                </div>
                {index > 0 && (
                  <Button variant="ghost" className="!h-[32px] !px-[12px] text-[13px]">
                    Rollback
                  </Button>
                )}
              </div>
              <p className="text-[14px] leading-[20px] text-[#0D0D0D]">{version.changes}</p>
              <p className="text-[12px] leading-[16px] text-[#6E6E6E] mt-1">by {version.user}</p>
            </Card>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
