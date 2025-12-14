import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-primary)]">
            <Header />
            <main className="flex-1 pt-16 lg:pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
