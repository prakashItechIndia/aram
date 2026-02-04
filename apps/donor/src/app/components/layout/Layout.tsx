import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PortalHeader } from '../aram/PortalHeader';
import { useApi } from '@/app/context/ApiContext';
import { toast } from 'sonner';

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useApi();

    // Derive current page from path
    const currentPage = location.pathname.substring(1) || 'dashboard';

    const handleNavigate = (page: string) => {
        navigate(`/${page}`);
    };

    const handleLogout = () => {
        logout();
        toast.success('Logout successfully');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-white">
            <PortalHeader
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />
            <main className="max-w-[1440px] mx-auto px-[24px] py-[32px]">
                <Outlet />
            </main>
        </div>
    );
}
