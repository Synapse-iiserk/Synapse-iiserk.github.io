import { Link } from 'react-router-dom';

const columns = [
    {
        label: 'Platform',
        links: [
            { name: 'Workspace', path: '/products#workspace' },
            { name: 'Algorithm library', path: '/products#algorithms' },
            { name: 'Backtesting', path: '/products#backtest' },
            { name: 'AI research agent', path: '/products#ai-agent' },
            { name: 'Open leaderboard', path: '/products#leaderboard' },
        ],
    },
    {
        label: 'Company',
        links: [
            { name: 'About', path: '/about' },
            { name: 'Team', path: '/team' },
            { name: 'Contact', path: '/contact' },
            { name: 'Analytics playground', path: '/analytics' },
        ],
    },
    {
        label: 'Legal',
        links: [
            { name: 'Privacy', path: '/privacy' },
            { name: 'Terms', path: '/terms' },
            { name: 'Disclaimer', path: '/disclaimer' },
        ],
    },
];

export const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--color-line)]">
            <div className="shell py-14 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img src="/ifinn_logo.svg" alt="" className="h-7 w-7" />
                            <span className="font-display text-lg font-semibold tracking-tight">iFINN</span>
                        </Link>
                        <p className="prose mt-4 text-[15px]">
                            A quantitative research terminal built by Team Synapse at IISER Kolkata:
                            528 vetted algorithms, backtesting and paper trading on one engine, and a
                            research agent that answers with live tool calls.
                        </p>
                        <div className="mono mt-6 flex flex-col gap-1 text-[13px]">
                            <a href="mailto:investors@ifinn.org" className="link w-fit">
                                investors@ifinn.org
                            </a>
                            <a href="mailto:support@ifinn.org" className="link w-fit">
                                support@ifinn.org
                            </a>
                        </div>
                    </div>

                    <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
                        {columns.map((column) => (
                            <nav key={column.label} aria-label={column.label}>
                                <h2 className="mono border-t border-[var(--color-line)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                    {column.label}
                                </h2>
                                <ul className="mt-4 flex flex-col gap-2.5">
                                    {column.links.map((link) => (
                                        <li key={link.path}>
                                            <Link
                                                to={link.path}
                                                className="text-[15px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                </div>

                <div className="mt-14 border-t border-[var(--color-line)] pt-6">
                    <p className="mono max-w-[80ch] text-[12px] leading-relaxed text-[var(--color-muted)]">
                        <span className="text-[var(--color-warn)]">Disclosure.</span> iFINN provides
                        analytical tools for research and education. Nothing here is financial,
                        investment, legal or tax advice. Past performance does not predict future
                        results, and trading carries a real risk of loss. Figures shown are measured
                        on public market data at the time of publication.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="mono text-[12px] text-[var(--color-muted)]">
                            © {year} iFINN · Team Synapse, IISER Kolkata
                        </p>
                        <p className="mono text-[12px] text-[var(--color-muted)]">
                            MIT-licensed core · self-hostable with Docker
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;