import { Link } from 'react-router-dom';
import LiveCandles from '../charts/LiveCandles';

// Every figure here is checked against the platform repository, not a
// marketing deck: 528 comes from the generated algorithm manifest, 145 from
// the tool registry the server tests assert against, and the test count is
// the measured floor rather than an estimate.
const stats: { value: string; label: string }[] = [
    { value: '528', label: 'algorithms, 13 families' },
    { value: '22+', label: 'market data providers' },
    { value: '145', label: 'agent tools over MCP' },
    { value: '2,500+', label: 'automated tests' },
];

export const Hero: React.FC = () => {
    return (
        <section className="pb-16 pt-20 lg:pb-24 lg:pt-28">
            <div className="shell">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <span className="eyebrow">Live platform · IISER Kolkata</span>
                        <h1 className="h-display reveal mt-5">
                            A quant terminal
                            <br />
                            you can audit.
                        </h1>
                        <p className="lead mt-7">
                            528 algorithms across 13 families, each documented and gated by a
                            conformance harness. The tradeable ones are backtested on BTC, AAPL, SPY
                            and gold, then ranked in public against buy and hold.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link to="/contact" className="btn btn-primary">
                                Join the waitlist
                            </Link>
                            <a href="#tour" className="btn">
                                Take the product tour
                            </a>
                        </div>
                        <p className="mono mt-6 max-w-[46ch] text-[12px] leading-relaxed text-[var(--color-muted)]">
                            Backtesting and paper trading share one engine. The research agent answers
                            with tool calls, not guesses. The core is MIT licensed and self hosts.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <h2 className="mono border-t border-[var(--color-ink)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                            What is running today
                        </h2>
                        <dl>
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex items-baseline justify-between gap-6 border-b border-[var(--color-line)] py-3"
                                >
                                    <dt className="mono text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                        {stat.label}
                                    </dt>
                                    <dd className="num text-xl">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <div className="mt-16 lg:mt-24">
                    <LiveCandles />
                </div>
            </div>
        </section>
    );
};

export default Hero;