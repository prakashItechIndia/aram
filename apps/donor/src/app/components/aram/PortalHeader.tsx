import React, { useState } from 'react';
import { Bell, User, Search, LogOut, Settings, FileText } from 'lucide-react';

interface PortalHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userName: string;
  onLogout: () => void;
  notificationCount?: number;
}

export function PortalHeader({ currentPage, onNavigate, userName, onLogout, notificationCount = 0 }: PortalHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header 
      className="h-[72px] bg-white border-b border-[#DBDBDB] px-[24px] flex items-center justify-between sticky top-0 z-50"
    >
      {/* Logo and Nav */}
      <div className="flex items-center gap-[48px]">
        <div className="flex items-center gap-[12px]">
          <div 
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F36A4F 0%, #FF8870 100%)' }}
          >
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>A</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#0D0D0D' }}>Aram Foundation</span>
        </div>

        <nav className="flex gap-[32px]">
          {['Dashboard', 'Donate', 'Reports', 'Profile'].map((page) => (
            <button
              key={page}
              onClick={() => onNavigate(page.toLowerCase())}
              className={`transition-colors ${
                currentPage === page.toLowerCase()
                  ? 'text-[#F36A4F]'
                  : 'text-[#6E6E6E] hover:text-[#3D3D3D]'
              }`}
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-[12px]">
        {/* Global Search */}
        <div className="relative w-[420px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search donations, receipts..."
            className="w-full h-[44px] pl-[40px] pr-[14px] rounded-[999px] border border-[#DBDBDB] bg-white focus:outline-none focus:border-[#F36A4F]"
            style={{ fontSize: '14px', lineHeight: '20px', color: '#3D3D3D' }}
          />
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2" size={18} color="#6E6E6E" />
        </div>

        {/* Notifications */}
        <button 
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-[#F3F3F3] transition-colors relative"
        >
          <Bell size={18} color="#6E6E6E" />
          {notificationCount > 0 && (
            <span 
              className="absolute top-[4px] right-[4px] min-w-[18px] h-[18px] px-[4px] bg-[#F36A4F] rounded-full flex items-center justify-center text-white"
              style={{ fontSize: '10px', fontWeight: 700, border: '2px solid white' }}
            >
              {notificationCount}
            </span>
          )}
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-[40px] px-[12px] rounded-[999px] border border-[#DBDBDB] flex items-center gap-[8px] hover:bg-[#F3F3F3] transition-colors"
          >
            <div className="w-[24px] h-[24px] rounded-full bg-[#F36A4F] flex items-center justify-center">
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#3D3D3D' }}>{userName}</span>
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 top-[48px] w-[220px] bg-white rounded-[16px] border border-[#DBDBDB] shadow-lg z-20 overflow-hidden">
                <div className="p-[16px] border-b border-[#DBDBDB]">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>{userName}</p>
                  <p style={{ fontSize: '13px', color: '#6E6E6E', marginTop: '2px' }}>Donor</p>
                </div>
                <div className="py-[8px]">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[#F3F3F3] transition-colors"
                  >
                    <User size={16} color="#6E6E6E" />
                    <span style={{ fontSize: '14px', color: '#3D3D3D' }}>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('reports');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[#F3F3F3] transition-colors"
                  >
                    <FileText size={16} color="#6E6E6E" />
                    <span style={{ fontSize: '14px', color: '#3D3D3D' }}>My Reports</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[#F3F3F3] transition-colors"
                  >
                    <Settings size={16} color="#6E6E6E" />
                    <span style={{ fontSize: '14px', color: '#3D3D3D' }}>Settings</span>
                  </button>
                </div>
                <div className="border-t border-[#DBDBDB]">
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[#FEF1EE] transition-colors"
                  >
                    <LogOut size={16} color="#F36A4F" />
                    <span style={{ fontSize: '14px', color: '#F36A4F', fontWeight: 600 }}>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
