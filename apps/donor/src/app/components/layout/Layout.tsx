import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="max-w-[1440px] mx-auto px-[24px] py-[32px]">
                <Outlet />
            </main>
        </div>
    );
}
