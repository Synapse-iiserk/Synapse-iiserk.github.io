import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Live Chart', path: '/chart.html' },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
];

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const renderLink = (link: { name: string; path: string }, isMobile = false) => {
        const isExternal = link.path.endsWith('.html');
        const active = location.pathname === link.path;

        const desktopClasses = `text-sm font-medium transition-colors relative ${active
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`;
        const mobileClasses = `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active
            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]'
            }`;

        if (isExternal) {
            return (
                <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={isMobile ? closeMobileMenu : undefined}
                    className={isMobile ? mobileClasses : desktopClasses}
                >
                    {link.name}
                </a>
            );
        }

        return (
            <Link
                key={link.path}
                to={link.path}
                onClick={isMobile ? closeMobileMenu : undefined}
                className={isMobile ? mobileClasses : desktopClasses}
            >
                {link.name}
                {active && !isMobile && (
                    <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--color-accent)]"
                        initial={false}
                    />
                )}
            </Link>
        );
    };


    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[var(--color-primary)]/95 backdrop-blur-md shadow-lg border-b border-[var(--color-border)]'
                : 'bg-transparent'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[var(--color-accent)]/30 transition-shadow rounded-lg">
                            <img src="/ifinn_logo.svg" alt="iFINN Logo" className="w-8 h-8" />
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text)]">iFINN</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => renderLink(link))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link
                            to="/contact"
                            className="px-5 py-2.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[var(--color-accent)]/30 transition-all"
                        >
                            Get Early Access
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[var(--color-primary-light)] border-b border-[var(--color-border)]"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => renderLink(link, true))}
                            <div className="pt-4">
                                <Link
                                    to="/contact"
                                    onClick={closeMobileMenu}
                                    className="block w-full text-center px-5 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg"
                                >
                                    Get Early Access
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
