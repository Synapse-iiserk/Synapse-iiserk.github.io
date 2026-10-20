import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import LiveCandles from '../charts/LiveCandles';
import { useScramble } from '../../lib/motion';

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

const HEADLINE = [['A', 'quant', 'terminal'], ['you', 'can', 'audit.']];

/** each word rises out of its own mask; the h1 keeps one plain-text label */
function Headline() {
    let w = 0;
    return (
        <h1 className="h-display mt-5" aria-label={HEADLINE.flat().join(' ')}>
            {HEADLINE.map((line, l) => (
                <span key={l} className="block" aria-hidden="true">
                    {line.map((word, i) => (
                        <Fragment key={word}>
                            <span className="hero-word">
                                <span style={{ '--w': w++ } as React.CSSProperties}>{word}</span>
                            </span>
                            {/* outside the inline-block, or the space collapses */}
                            {i < line.length - 1 ? ' ' : ''}
                        </Fragment>
                    ))}
                </span>
            ))}
        </h1>
    );
}

/** a figure that decodes into place like a terminal readout */
function Stat({ value, index }: { value: string; index: number }) {
    const shown = useScramble(value, 'hero', 900, 500 + index * 140);
    return (
        <dd className="num text-xl">
            <span aria-hidden="true">{shown}</span>
            <span className="sr-only">{value}</span>
        </dd>
    );
}

const delay = (ms: number) => ({ '--d': ms }) as React.CSSProperties;

export const Hero: React.FC = () => {
    return (
        <section className="pb-16 pt-20 lg:pb-24 lg:pt-28">
            <div className="shell">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <span className="eyebrow hero-in" style={delay(0)}>
                            Live platform · IISER Kolkata
                        </span>
                        <Headline />
                        <p className="lead hero-in mt-7" style={delay(520)}>
                            528 algorithms across 13 families, each documented and gated by a
                            conformance harness. The tradeable ones are backtested on BTC, AAPL, SPY
                            and gold, then ranked in public against buy and hold.
                        </p>
                        <div className="hero-in mt-9 flex flex-wrap gap-3" style={delay(680)}>
                            <Link to="/contact" className="btn btn-primary">
                                Join the waitlist
                            </Link>
                            <a href="#tour" className="btn">
                                Take the product tour
                            </a>
                        </div>
                        <p style={delay(820)} className="hero-in mono mt-6 max-w-[46ch] text-[12px] leading-relaxed text-[var(--color-muted)]">
                            Backtesting and paper trading share one engine. The research agent answers
                            with tool calls, not guesses. The core is MIT licensed and self hosts.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="hero-rule h-px bg-[var(--color-ink)]" style={delay(300)} aria-hidden="true" />
                        <h2 className="hero-in mono pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]" style={delay(380)}>
                            What is running today
                        </h2>
                        <dl data-no-reveal>
                            {stats.map((stat, i) => (
                                <div key={stat.label} className="relative py-3">
                                    <div className="hero-in flex items-baseline justify-between gap-6" style={delay(460 + i * 140)}>
                                        <dt className="mono text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                            {stat.label}
                                        </dt>
                                        <Stat value={stat.value} index={i} />
                                    </div>
                                    <div
                                        className="hero-rule absolute inset-x-0 bottom-0 h-px bg-[var(--color-line)]"
                                        style={delay(520 + i * 140)}
                                        aria-hidden="true"
                                    />
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <div className="hero-in mt-16 lg:mt-24" style={delay(900)} data-no-reveal>
                    <LiveCandles />
                </div>
            </div>
        </section>
    );
};

export default Hero;