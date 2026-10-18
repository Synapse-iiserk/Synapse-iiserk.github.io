import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export const Layout: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col bg-[var(--color-ground)]">
            <div className="progress-hair" aria-hidden />
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-[var(--color-accent)] focus:bg-[var(--color-ground)] focus:px-4 focus:py-2 focus:text-sm"
            >
                Skip to content
            </a>
            <Header />
            <main id="main" className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;