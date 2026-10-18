import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLink {
    name: string;
    path: string;
    external?: boolean;
}

const navLinks: NavLink[] = [
    { name: 'Products', path: '/products' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Live chart', path: '/chart.html', external: true },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' },
];

export const Header: React.FC = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const close = () => setOpen(false);

    const isActive = (link: NavLink) => !link.external && location.pathname === link.path;

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-ground)]">
            <div className="shell flex h-16 items-center justify-between gap-8">
                <Link to="/" className="flex items-center gap-2.5" aria-label="iFINN home">
                    <img src="/ifinn_logo.svg" alt="" className="h-7 w-7" />
                    <span className="font-display text-lg font-semibold tracking-tight">iFINN</span>
                    <span className="mono ml-1 hidden border-l border-[var(--color-line)] pl-2.5 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)] sm:inline">
                        quant terminal
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
                    {navLinks.map((link) =>
                        link.external ? (
                            <a
                                key={link.path}
                                href={link.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative py-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                            >
                                {link.name}
                                <span className="mono ml-1 text-[10px] text-[var(--color-muted)]">↗</span>
                            </a>
                        ) : (
                            <Link
                                key={link.path}
                                to={link.path}
                                aria-current={isActive(link) ? 'page' : undefined}
                                className={`relative py-1 text-sm transition-colors ${
                                    isActive(link)
                                        ? 'text-[var(--color-ink)]'
                                        : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                                }`}
                            >
                                {link.name}
                                {isActive(link) && (
                                    <span className="absolute inset-x-0 -bottom-0.5 h-px bg-[var(--color-accent)]" />
                                )}
                            </Link>
                        ),
                    )}
                </nav>

                <div className="flex shrink-0 items-center gap-3">
                    <Link to="/contact" className="btn btn-primary hidden text-sm sm:inline-flex">
                        Join the waitlist
                    </Link>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        className="shrink-0 border border-[var(--color-line-strong)] p-2 text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] lg:hidden"
                    >
                        <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden fill="none">
                            {open ? (
                                <path d="M1 1l16 12M17 1L1 13" stroke="currentColor" strokeWidth="1.5" />
                            ) : (
                                <path d="M0 1h18M0 7h18M0 13h18" stroke="currentColor" strokeWidth="1.5" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <div id="mobile-nav" hidden={!open} className="border-t border-[var(--color-line)] lg:hidden">
                    <nav className="shell flex flex-col py-4" aria-label="Primary mobile">
                        {navLinks.map((link) =>
                            link.external ? (
                                <a
                                    key={link.path}
                                    href={link.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={close}
                                    className="border-b border-[var(--color-line)] py-3 text-[15px] text-[var(--color-muted)]"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={close}
                                    className="border-b border-[var(--color-line)] py-3 text-[15px] text-[var(--color-ink)]"
                                >
                                    {link.name}
                                </Link>
                            ),
                        )}
                        <Link to="/contact" onClick={close} className="btn btn-primary mt-4 justify-center">
                            Join the waitlist
                        </Link>
                    </nav>
            </div>
        </header>
    );
};

export default Header;