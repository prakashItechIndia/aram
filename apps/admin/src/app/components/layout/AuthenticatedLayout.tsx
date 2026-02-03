import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApi } from '../../context/ApiContext';

export function AuthenticatedLayout() {
  const { logout } = useApi();
  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <Sidebar />
      <Header onLogout={logout} />
      <div className="ml-[280px] mt-[72px] p-[24px]">
        <Outlet />
      </div>
    </div>
  );
}
