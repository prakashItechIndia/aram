import React, { useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { Upload, Sun, Moon, Download, AlertTriangle } from 'lucide-react';

interface ProfileProps {
  userName: string;
  userEmail: string;
  userPhone: string;
  onSaveProfile: (data: any) => void;
  onUpdatePassword: (data: any) => void;
}

export function Profile({ userName, userEmail, userPhone, onSaveProfile, onUpdatePassword }: ProfileProps) {
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleSaveProfile = () => {
    onSaveProfile({ name, phone });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match');
      return;
    }
    onUpdatePassword({ currentPassword, newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
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
            <div className="w-[80px] h-[80px] rounded-full bg-[#F3F3F3] flex items-center justify-center overflow-hidden">
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#F36A4F' }}>
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <AramButton variant="secondary">
              <Upload size={18} className="inline mr-2" />
              Upload Photo
            </AramButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <AramInput
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Enter your name"
            />
            <AramInput
              label="Email"
              value={userEmail}
              onChange={() => {}}
              disabled
              helperText="Email cannot be changed"
            />
            <AramInput
              label="Phone"
              value={phone}
              onChange={setPhone}
              placeholder="Enter phone number"
              helperText="Verification required for changes"
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
            <AramInput
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Enter current password"
            />
            <AramInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Enter new password"
              helperText="Min 8 characters, uppercase, number, special character"
            />
            <AramInput
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={setConfirmNewPassword}
              placeholder="Re-enter new password"
            />
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
              className={`flex-1 p-[16px] rounded-[16px] border-2 transition-all ${
                theme === 'light' 
                  ? 'border-[#F36A4F] bg-[#FEF1EE]' 
                  : 'border-[#DBDBDB] bg-white hover:border-[#F36A4F]'
              }`}
            >
              <Sun size={24} color={theme === 'light' ? '#F36A4F' : '#6E6E6E'} className="mx-auto mb-[8px]" />
              <div style={{ fontSize: '14px', fontWeight: 600, color: theme === 'light' ? '#F36A4F' : '#3D3D3D' }}>
                Light
              </div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-[16px] rounded-[16px] border-2 transition-all ${
                theme === 'dark' 
                  ? 'border-[#F36A4F] bg-[#FEF1EE]' 
                  : 'border-[#DBDBDB] bg-white hover:border-[#F36A4F]'
              }`}
            >
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
