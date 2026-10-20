import SEO from '../seo/SEO';
import SeatRequestForm from '../components/ui/SeatRequestForm';

type Cell = 'Included' | 'Not included' | 'Limited' | 'Unlimited' | 'Email' | 'Priority' | 'Dedicated';

const tiers = [
    { name: 'Free', price: '$0', forWhom: 'Read the market and learn the interface.' },
    { name: 'Pro', price: '$49', forWhom: 'Run strategies, backtests and the research agent.' },
    { name: 'Institutional', price: 'Custom', forWhom: 'Funds, family offices and research desks.' },
];

const rows: { capability: string; cells: [Cell, Cell, Cell] }[] = [
    { capability: 'Analytics playground', cells: ['Included', 'Included', 'Included'] },
    { capability: 'Market snapshots and daily summaries', cells: ['Included', 'Included', 'Included'] },
    { capability: 'Paper trading sessions', cells: ['Included', 'Included', 'Included'] },
    { capability: 'Algorithm library', cells: ['Limited', 'Included', 'Included'] },
    { capability: 'Real-time streaming', cells: ['Not included', 'Included', 'Included'] },
    { capability: 'Backtesting engine', cells: ['Not included', 'Included', 'Included'] },
    { capability: 'AI research agent (145 tools)', cells: ['Not included', 'Included', 'Included'] },
    { capability: 'Signals and alternative-data boards', cells: ['Not included', 'Included', 'Included'] },
    { capability: 'API access', cells: ['Not included', 'Limited', 'Unlimited'] },
    { capability: 'Dedicated infrastructure', cells: ['Not included', 'Not included', 'Included'] },
    { capability: 'Compliance reporting', cells: ['Not included', 'Not included', 'Included'] },
    { capability: 'Support', cells: ['Email', 'Priority', 'Dedicated'] },
];

// plain ink is the default; colour is kept for the cells that set tiers apart
const cellTone = (value: Cell) =>
    value === 'Not included'
        ? 'text-[var(--color-muted)]'
        : value === 'Limited'
          ? 'text-[var(--color-warn)]'
          : value === 'Included'
            ? 'text-[var(--color-ink)]'
            : 'text-[var(--color-accent)]';

export const Pricing: React.FC = () => {
    return (
        <>
            <SEO
                title="Pricing"
                description="iFINN pricing: a free tier, Pro at $49 a month and an institutional tier priced to fit. Prices are the plan we intend to launch with."
                canonicalUrl="/pricing"
            />

            <section className="pb-14 pt-20 lg:pb-16 lg:pt-28">
                <div className="shell">
                    <span className="eyebrow reveal">Pricing</span>
                    <h1 className="h-display reveal mt-5">Three tiers, no surprises.</h1>
                    <p className="lead mt-6">
                        These are the prices we intend to launch with. Nothing is charged today: the
                        platform is in alpha, and seats open by invitation while we finish the
                        compliance review.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <div className="grid gap-8 sm:grid-cols-3">
                        {tiers.map((tier) => (
                            <div key={tier.name} className="border-t border-[var(--color-ink)] pt-3">
                                <h2 className="font-display text-[19px] font-medium tracking-tight">
                                    {tier.name}
                                </h2>
                                <p className="num mt-2 text-3xl">
                                    {tier.price}
                                    {tier.price !== 'Custom' && (
                                        <span className="mono ml-1 text-[12px] text-[var(--color-muted)]">
                                            /month
                                        </span>
                                    )}
                                </p>
                                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted)]">
                                    {tier.forWhom}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 overflow-x-auto">
                        <table className="data-table min-w-[46rem]">
                            <thead>
                                <tr>
                                    <th scope="col" className="w-[38%]">
                                        Capability
                                    </th>
                                    {tiers.map((tier) => (
                                        <th key={tier.name} scope="col" className="text-right">
                                            {tier.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.capability}>
                                        <td>{row.capability}</td>
                                        {row.cells.map((cell, column) => (
                                            <td key={`${row.capability}-${column}`} className={`num text-right ${cellTone(cell)}`}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-14 grid gap-10 lg:grid-cols-2">
                        <div>
                            <h3 className="mono border-t border-[var(--color-ink)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                Pricing table
                            </h3>
                            <p className="prose mt-3 text-[14.5px]">
                                Send us a note and we will tell you what a seat costs for your use
                                case, including the institutional tier.
                            </p>
                            <div className="mono mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                                <a href="mailto:investors@ifinn.org" className="link">
                                    investors@ifinn.org
                                </a>
                                <a href="mailto:support@ifinn.org" className="link">
                                    support@ifinn.org
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="mono border-t border-[var(--color-ink)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                Launch notice
                            </h3>
                            <SeatRequestForm id="pricing-email" label="Notify me" primary={false} className="mt-3" />
                        </div>
                    </div>

                    <p className="mono mt-12 border-t border-[var(--color-line)] pt-4 text-[12px] leading-relaxed text-[var(--color-muted)]">
                        <span className="text-[var(--color-warn)]">Note.</span> Prices are preliminary
                        and may change as the regulatory review completes and the platform ships.
                        Currency is USD, billed monthly, cancel any time.
                    </p>
                </div>
            </section>
        </>
    );
};

export default Pricing;