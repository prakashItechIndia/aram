import { useNavigate, useLocation } from 'react-router-dom';
import { useApi } from '@/app/context/ApiContext';
import { Search, Bell } from 'lucide-react';

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useApi();

    const navLinks = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Donate', path: '/donate' },
        { label: 'Reports', path: '/reports' },
        { label: 'Profile', path: '/profile' },
    ];

    return (
        <header className="h-[72px] bg-white border-b border-[#DBDBDB] sticky top-0 z-50">
            <div className="max-w-[1440px] mx-auto px-[24px] h-full flex items-center justify-between">
                {/* Logo & Nav */}
                <div className="flex items-center gap-[48px]">
                    <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div
                            className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #F36A4F 0%, #FF8870 100%)' }}
                        >
                            <span style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>A</span>
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#0D0D0D' }}>Aram Foundation</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-[32px]">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`transition-colors ${location.pathname === link.path ? 'text-[#F36A4F]' : 'text-[#6E6E6E] hover:text-[#3D3D3D]'
                                    }`}
                                style={{ fontSize: '14px', fontWeight: 600 }}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-[12px]">
                    {/* Global Search */}
                    <div className="hidden lg:block relative w-[420px]">
                        <input
                            type="text"
                            placeholder="Search donations, receipts..."
                            className="w-full h-[44px] pl-[40px] pr-[14px] rounded-[999px] border border-[#DBDBDB] bg-white focus:outline-none focus:border-[#F36A4F]"
                            style={{ fontSize: '14px', lineHeight: '20px', color: '#3D3D3D' }}
                        />
                        <Search className="absolute left-[14px] top-1/2 -translate-y-1/2" size={18} color="#6E6E6E" />
                    </div>

                    {/* Notifications */}
                    <button className="w-[40px] h-[40px] rounded-full flex items-center justify-center hover:bg-[#F3F3F3] transition-colors relative">
                        <Bell size={18} color="#6E6E6E" />
                        <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] bg-[#F36A4F] rounded-full" />
                    </button>

                    {/* Profile */}
                    <button
                        onClick={() => navigate('/profile')}
                        className="h-[40px] px-[12px] rounded-[999px] border border-[#DBDBDB] flex items-center gap-[8px] hover:bg-[#F3F3F3] transition-colors"
                    >
                        <div className="w-[24px] h-[24px] rounded-full bg-[#F36A4F] flex items-center justify-center">
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#3D3D3D' }} className="hidden sm:block">
                            {user?.name || 'User'}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
