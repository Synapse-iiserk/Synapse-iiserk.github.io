import { Link } from 'react-router-dom';

const footerLinks = {
    product: [
        { name: 'Market Tracking', path: '/products#market-tracking' },
        { name: 'AI Strategy Builder', path: '/products#strategy-builder' },
        { name: 'Options Analyzer', path: '/products#options-analyzer' },
        { name: 'Crypto Intelligence', path: '/products#crypto-intelligence' },
    ],
    company: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Team', path: '/team' },
        { name: 'Contact', path: '/contact' },
    ],
    legal: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Disclaimer', path: '/disclaimer' },
    ],
};

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-primary)] border-t border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-gold)] flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-xl font-bold text-[var(--color-text)]">Synapse</span>
                        </Link>
                        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
                            AI-driven financial intelligence platform providing unified analytics for stocks, derivatives, and crypto assets.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="mailto:contact@synapse.finance"
                                className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                                aria-label="Email"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-[var(--color-text)] font-semibold mb-4">Products</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-[var(--color-text)] font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-[var(--color-text)] font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
                            <li>
                                <span className="block text-[var(--color-text-muted)]">Investor Inquiries</span>
                                <a href="mailto:investors@synapse.finance" className="hover:text-[var(--color-accent)] transition-colors">
                                    investors@synapse.finance
                                </a>
                            </li>
                            <li>
                                <span className="block text-[var(--color-text-muted)]">General Support</span>
                                <a href="mailto:support@synapse.finance" className="hover:text-[var(--color-accent)] transition-colors">
                                    support@synapse.finance
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                    <div className="bg-[var(--color-primary-light)] rounded-lg p-4 mb-6">
                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                            <strong className="text-[var(--color-gold)]">Financial Disclaimer:</strong> Synapse provides analytical tools and insights for informational purposes only.
                            Nothing on this platform constitutes financial, investment, legal, or tax advice. Past performance does not guarantee future results.
                            Trading in financial markets involves substantial risk of loss. Users should conduct their own research and consult with qualified
                            financial advisors before making investment decisions. Synapse does not guarantee the accuracy, completeness, or timeliness of any
                            information provided. All products and features marked as "Coming Soon" are under development and subject to change.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-[var(--color-text-muted)]">
                            © {currentYear} Synapse. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
