import React, { useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { Upload, Sun, Moon, Download, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { validateField, validationRules, validationMessages, sanitizeInput } from '../../utils/validations';

export interface ProfileProps {
  userName: string;
  userEmail: string;
  userPhone: string;
  profileImage?: string;
  onSaveProfile: (data: any) => void;
  onUpdatePassword: (data: any) => Promise<{ success: boolean; error?: string }>;
  onUploadImage: (file: File) => Promise<void>;
}

export function Profile({ userName, userEmail, userPhone, profileImage, onSaveProfile, onUpdatePassword, onUploadImage }: ProfileProps) {
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    const newErrors: any = {};
    const nameError = validateField(name, validationRules.name, validationMessages.name);
    if (nameError) newErrors.name = nameError;

    // For phone, we use a custom check or the shared rules if we had country context here. 
    // For now simple required check if not using shared mobile rules (which expect 10 digits/country pattern)
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveProfile({ name, phone });
    setErrors({});
  };

  const handleUpdatePassword = async () => {
    const newErrors: any = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (newPassword) {
      const pwdError = validateField(newPassword, validationRules.password, validationMessages.password);
      if (pwdError) {
        newErrors.newPassword = pwdError;
      } else if (currentPassword === newPassword) {
        newErrors.newPassword = "New password cannot be the same as current password";
      }
    } else {
      newErrors.newPassword = "New password is required";
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm password is required";
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const res = await onUpdatePassword({ currentPassword, newPassword });
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrors({});
    } else {
      // If the error is about current password, show it inline
      if (res.error?.toLowerCase().includes('current password')) {
        setErrors({ currentPassword: res.error });
      } else {
        // Other errors can go to general error handler or handle here if needed
        // App.tsx still handles toast for non-success if we don't catch it here.
        // But since we are returning {success, error}, we can decide.
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <AramCard>
        <h2>Profile Settings</h2>
        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
          Manage your account information and preferences
        </p>
      </AramCard>

      {/* Profile Information */}
      <AramCard>
        <div className="flex flex-col gap-[24px]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3>Profile Information</h3>
              <p style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>
                Update your personal details
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[24px]">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="w-[80px] h-[80px] rounded-full bg-[#F3F3F3] flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span style={{ fontSize: '32px', fontWeight: 700, color: '#F36A4F' }}>
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <AramButton variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={18} className="inline mr-2" />
              Upload Photo
            </AramButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <AramInput
              label="Name"
              value={name}
              onChange={(val) => {
                setName(sanitizeInput.name(val));
                setErrors((prev: any) => ({ ...prev, name: undefined }));
              }}
              placeholder="Enter your name"
              error={errors.name}
              required
            />
            <AramInput
              label="Email"
              value={userEmail}
              onChange={() => { }}
              disabled
              helperText="Email cannot be changed"
            />
            <AramInput
              label="Phone"
              value={phone}
              onChange={() => { }}
              placeholder="Enter phone number"
              helperText="Phone number cannot be changed"
              disabled
            />
          </div>

          <div className="flex gap-[12px]">
            <AramButton onClick={handleSaveProfile} variant="primary">
              Save Changes
            </AramButton>
            <AramButton onClick={() => {
              setName(userName);
              setPhone(userPhone);
            }} variant="secondary">
              Cancel
            </AramButton>
          </div>
        </div>
      </AramCard>

      {/* Password Section */}
      <AramCard>
        <div className="flex flex-col gap-[24px]">
          <div>
            <h3>Change Password</h3>
            <p style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>
              Update your password to keep your account secure
            </p>
          </div>

          <div className="flex flex-col gap-[16px]">
            <div className="relative">
              <AramInput
                label="Current Password"
                required={true}
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(val) => {
                  setCurrentPassword(val);
                  setErrors((prev: any) => ({ ...prev, currentPassword: undefined }));
                }}
                placeholder="Enter current password"
                error={errors.currentPassword}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-[14px] top-[38px]"
              >
                {/* @ts-ignore */}
                {showCurrentPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
              </button>
            </div>

            <div className="relative">
              <AramInput
                label="New Password"
                required={true}
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(val) => {
                  setNewPassword(val);
                  setErrors((prev: any) => ({ ...prev, newPassword: undefined }));
                }}
                placeholder="Enter new password"
                helperText="Min 8 characters, uppercase, number, special character"
                error={errors.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-[14px] top-[38px]"
              >
                {/* @ts-ignore */}
                {showNewPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
              </button>
            </div>

            <div className="relative">
              <AramInput
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(val) => {
                  setConfirmNewPassword(val);
                  setErrors((prev: any) => ({ ...prev, confirmNewPassword: undefined }));
                }}
                placeholder="Re-enter new password"
                error={errors.confirmNewPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-[14px] top-[38px]"
              >
                {/* @ts-ignore */}
                {showConfirmPassword ? <Eye size={18} color="#6E6E6E" /> : <EyeOff size={18} color="#6E6E6E" />}
              </button>
            </div>
          </div>

          <AramButton onClick={handleUpdatePassword} variant="primary" className="w-fit">
            Update Password
          </AramButton>
        </div>
      </AramCard>

      {/* Theme Section */}
      <AramCard>
        <div className="flex flex-col gap-[24px]">
          <div>
            <h3>Appearance</h3>
            <p style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>
              Choose your preferred theme
            </p>
          </div>

          <div className="flex gap-[16px]">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-[16px] rounded-[16px] border-2 transition-all ${theme === 'light'
                ? 'border-[#F36A4F] bg-[#FEF1EE]'
                : 'border-[#DBDBDB] bg-white hover:border-[#F36A4F]'
                }`}
            >
              {/* @ts-ignore */}
              <Sun size={24} color={theme === 'light' ? '#F36A4F' : '#6E6E6E'} className="mx-auto mb-[8px]" />
              <div style={{ fontSize: '14px', fontWeight: 600, color: theme === 'light' ? '#F36A4F' : '#3D3D3D' }}>
                Light
              </div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-[16px] rounded-[16px] border-2 transition-all ${theme === 'dark'
                ? 'border-[#F36A4F] bg-[#FEF1EE]'
                : 'border-[#DBDBDB] bg-white hover:border-[#F36A4F]'
                }`}
            >
              {/* @ts-ignore */}
              <Moon size={24} color={theme === 'dark' ? '#F36A4F' : '#6E6E6E'} className="mx-auto mb-[8px]" />
              <div style={{ fontSize: '14px', fontWeight: 600, color: theme === 'dark' ? '#F36A4F' : '#3D3D3D' }}>
                Dark
              </div>
            </button>
          </div>
        </div>
      </AramCard>

      {/* Privacy Section */}
      <AramCard>
        <div className="flex flex-col gap-[24px]">
          <div>
            <h3>Privacy & Data</h3>
            <p style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>
              Manage your data and account
            </p>
          </div>

          <div className="flex flex-col gap-[16px]">
            <AramButton variant="secondary" className="w-fit">
              {/* @ts-ignore */}
              <Download size={18} className="inline mr-2" />
              Download My Donation History
            </AramButton>

            <div className="pt-[16px] border-t border-[#DBDBDB]">
              <button
                onClick={() => setShowDeleteWarning(!showDeleteWarning)}
                style={{ fontSize: '14px', color: '#F36A4F', fontWeight: 600 }}
              >
                Delete Account
              </button>
              {showDeleteWarning && (
                <div className="mt-[12px] p-[16px] bg-[#FEF1EE] rounded-[16px] border border-[#FCD9D3] flex gap-[12px]">
                  {/* @ts-ignore */}
                  <AlertTriangle size={20} color="#F36A4F" className="flex-shrink-0 mt-[2px]" />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>
                      Are you sure you want to delete your account?
                    </p>
                    <p style={{ fontSize: '13px', color: '#6E6E6E', marginTop: '4px' }}>
                      This action cannot be undone. All your data, including donation history, will be permanently deleted.
                    </p>
                    <div className="flex gap-[12px] mt-[12px]">
                      <AramButton variant="danger">
                        Yes, Delete Account
                      </AramButton>
                      <AramButton variant="secondary" onClick={() => setShowDeleteWarning(false)}>
                        Cancel
                      </AramButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AramCard>
    </div>
  );
}
