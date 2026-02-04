import { useState } from 'react';
import { Bell, User, Search, LogOut, Settings, FileText, CheckCircle, Info } from 'lucide-react';
import { useApi, type Notification } from '@/app/context/ApiContext';
import { formatDistanceToNow } from 'date-fns';

interface PortalHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function PortalHeader({ currentPage, onNavigate, onLogout }: PortalHeaderProps) {
  const { user, notificationCount, notifications, markNotificationAsRead } = useApi();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use values from ApiContext user object
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

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
              className={`transition-colors ${currentPage === page.toLowerCase()
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
        {/* <div className="relative w-[420px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search donations, receipts..."
            className="w-full h-[44px] pl-[40px] pr-[14px] rounded-[999px] border border-[#DBDBDB] bg-white focus:outline-none focus:border-[#F36A4F]"
            style={{ fontSize: '14px', lineHeight: '20px', color: '#3D3D3D' }}
          />
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2" size={18} color="#6E6E6E" />
        </div> */}

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-[#F3F3F3] transition-colors relative"
          >
            <Bell size={18} color={showNotifications ? "#F36A4F" : "#6E6E6E"} />
            {notificationCount > 0 && (
              <span
                className="absolute top-[4px] right-[4px] min-w-[18px] h-[18px] px-[4px] bg-[#F36A4F] rounded-full flex items-center justify-center text-white"
                style={{ fontSize: '10px', fontWeight: 700, border: '2px solid white' }}
              >
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-[48px] w-[360px] bg-white rounded-[20px] border border-[#DBDBDB] shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="p-[20px] border-b border-[#F3F3F3] flex items-center justify-between bg-[#FAFAFA]">
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0D0D0D' }}>Notifications</h3>
                  {notificationCount > 0 && (
                    <span className="text-[#F36A4F]" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {notificationCount} New
                    </span>
                  )}
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.map((notif: Notification) => (
                        <div
                          key={notif.id}
                          className={`p-[16px] border-b border-[#F3F3F3] last:border-0 hover:bg-[#F9F9F9] transition-colors relative group ${!notif.readAt ? 'bg-[#FFF9F8]' : ''}`}
                        >
                          <div className="flex gap-[12px]">
                            <div className={`w-[32px] h-[32px] rounded-full flex-shrink-0 flex items-center justify-center ${notif.type === 'success' ? 'bg-[#E7F7EF] text-[#0FAF62]' :
                              notif.type === 'error' ? 'bg-[#FEECEC] text-[#D72C0D]' :
                                'bg-[#EEF2FF] text-[#4F46E5]'
                              }`}>
                              {notif.type === 'success' ? <CheckCircle size={16} /> : <Info size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-[4px]">
                                <h4 className="truncate" style={{ fontSize: '14px', fontWeight: 700, color: '#0D0D0D' }}>
                                  {notif.title}
                                </h4>
                                <span style={{ fontSize: '11px', color: '#9E9E9E' }}>
                                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="line-clamp-2" style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E' }}>
                                {notif.message}
                              </p>
                              {!notif.readAt && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markNotificationAsRead(notif.id);
                                  }}
                                  className="mt-[8px] flex items-center gap-[4px] text-[#F36A4F] opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ fontSize: '12px', fontWeight: 600 }}
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-[48px] px-[20px] flex flex-col items-center justify-center text-center">
                      <div className="w-[48px] h-[48px] rounded-full bg-[#F3F3F3] flex items-center justify-center mb-[12px]">
                        <Bell size={24} color="#9E9E9E" />
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>All caught up!</p>
                      <p className="mt-[4px]" style={{ fontSize: '13px', color: '#9E9E9E' }}>
                        No new notifications for you right now.
                      </p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-[12px] bg-[#FAFAFA] border-t border-[#F3F3F3] text-center">
                    <button
                      className="text-[#6E6E6E] hover:text-[#3D3D3D]"
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
            }}
            className="h-[40px] px-[12px] rounded-[999px] border border-[#DBDBDB] flex items-center gap-[8px] hover:bg-[#F3F3F3] transition-colors"
          >
            <div className="w-[24px] h-[24px] rounded-full bg-[#F36A4F] flex items-center justify-center overflow-hidden">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
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
                  <p style={{ fontSize: '13px', color: '#6E6E6E', marginTop: '2px' }}>{userEmail || 'Donor'}</p>
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
