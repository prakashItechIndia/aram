import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';

interface SearchResult {
  type: 'donor' | 'receipt' | 'transaction' | 'enquiry';
  id: string;
  title: string;
  subtitle: string;
}

interface HeaderProps {
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

export function Header({ onSearch, onLogout }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Mock search results
  const mockResults: SearchResult[] = searchQuery
    ? [
        { type: 'donor', id: '1', title: 'Rajesh Kumar', subtitle: 'rajesh@example.com' },
        { type: 'receipt', id: '2', title: 'ARAM/2025-26/00123', subtitle: '₹5,000 • 15 Jan 2026' },
        { type: 'transaction', id: '3', title: 'TXN789456', subtitle: '₹10,000 • Success' },
      ].filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="h-[72px] bg-white border-b border-[#DBDBDB] flex items-center px-[24px] gap-4 fixed top-0 left-[280px] right-0 z-40">
      {/* Global Search */}
      <div className="relative flex-1 max-w-[420px]" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search donors, receipts, transactions..."
            className="w-full h-[44px] pl-[44px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[999px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
          />
        </div>
        
        {/* Search Results Dropdown */}
        {showResults && mockResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white border border-[#DBDBDB] rounded-[16px] shadow-lg max-h-[400px] overflow-y-auto">
            <div className="p-[8px]">
              {mockResults.map((result) => (
                <button
                  key={result.id}
                  className="w-full flex items-center gap-3 p-[12px] rounded-[8px] hover:bg-[#FEF7F6] text-left"
                  onClick={() => {
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="w-8 h-8 bg-[#FEF1EE] rounded-full flex items-center justify-center">
                    <span className="text-[#F36A4F] text-xs font-semibold uppercase">
                      {result.type[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] leading-[20px] font-medium text-[#0D0D0D]">
                      {result.title}
                    </p>
                    <p className="text-[12px] leading-[16px] text-[#6E6E6E]">
                      {result.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Right Side - Profile and Notifications - Pushed to far right */}
      <div className="flex items-center gap-[12px] ml-auto">
        {/* Notifications */}
        <button className="w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors relative">
          <Bell className="w-[18px] h-[18px] text-[#6E6E6E]" />
          <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-[#F36A4F] rounded-full" />
        </button>
        
        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-[40px] px-[12px] flex items-center gap-2 rounded-[999px] hover:bg-[#F3F3F3] transition-colors"
          >
            <div className="w-6 h-6 bg-[#F36A4F] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">SA</span>
            </div>
            <span className="text-[14px] leading-[20px] font-medium text-[#0D0D0D]">
              Super Admin
            </span>
          </button>
          
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-[200px] bg-white border border-[#DBDBDB] rounded-[16px] shadow-lg overflow-hidden">
              <button className="w-full flex items-center gap-3 px-[16px] py-[12px] hover:bg-[#FEF7F6] text-left">
                <User className="w-4 h-4 text-[#6E6E6E]" />
                <span className="text-[14px] leading-[20px] text-[#3D3D3D]">Profile</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-[16px] py-[12px] hover:bg-[#FEF7F6] text-left border-t border-[#DBDBDB]"
              >
                <LogOut className="w-4 h-4 text-[#6E6E6E]" />
                <span className="text-[14px] leading-[20px] text-[#3D3D3D]">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}