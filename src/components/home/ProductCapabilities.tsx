import EquityCurve from '../charts/EquityCurve';

const capabilities = [
    {
        title: 'Chart-first workspace',
        metric: '29 overlays',
        text: 'Candles, volume, RSI and MACD panes around the chart, with live WebSocket prices, news, options and funding one tab away.',
    },
    {
        title: '528 vetted algorithms',
        metric: '13 families',
        text: 'Technical, machine learning, portfolio, factor, options, microstructure, DeFi and quantum families. Each module ships only after it passes the conformance harness.',
    },
    {
        title: 'Honest backtesting',
        metric: 'walk-forward',
        text: 'Train and test splits, real costs, up to four algorithms on one bar window. Crashing algorithms are reported rather than quietly scored as flat.',
    },
    {
        title: 'Paper trading desk',
        metric: 'live fills',
        text: 'Sessions trade the live tape with a margin model and server-priced fills, on the same engine that runs the backtests.',
    },
    {
        title: 'Persistent data store',
        metric: 'write-through store',
        text: 'Every bar, quote and headline is written through to PostgreSQL and re-served when a provider fails or rate-limits.',
    },
    {
        title: 'AI agent over live tools',
        metric: '145 tools',
        text: 'Chat answers with quotes, backtests and risk numbers that trace back to a tool call. The trace is visible, not implied.',
    },
];

export const ProductCapabilities: React.FC = () => {
    return (
        <section className="section">
            <div className="shell">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <span className="eyebrow reveal">What is running</span>
                        <h2 className="h2 reveal mt-4">
                            A running platform,
                            <br />
                            not a roadmap.
                        </h2>
                        <p className="prose mt-4 text-[15px]">
                            Each line below ships today and connects to the next. The chart that
                            follows is computed in your browser from public market data, using the same
                            kind of rule the backtester applies.
                        </p>
                        <p className="mono mt-8 max-w-[46ch] text-[12px] leading-relaxed text-[var(--color-muted)]">
                            Most rules lose money on some windows. That is the point: we rank the ones
                            that survive the walk-forward test and publish the ones that fail.
                        </p>
                    </div>

                    <div className="lg:col-span-7">
                        <ul>
                            {capabilities.map((capability) => (
                                <li
                                    key={capability.title}
                                    className="grid gap-1 border-t border-[var(--color-line)] py-4 last:border-b md:grid-cols-[13rem_minmax(0,1fr)_7rem] md:items-baseline md:gap-8"
                                >
                                    <h3 className="font-display text-[17px] font-medium tracking-tight">
                                        {capability.title}
                                    </h3>
                                    <p className="text-[14.5px] leading-relaxed text-[var(--color-muted)]">
                                        {capability.text}
                                    </p>
                                    <p className="mono text-[12px] text-[var(--color-accent)] md:text-right">
                                        {capability.metric}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16">
                    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--color-ink)] pt-3">
                        <h3 className="mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                            Measured against buy and hold
                        </h3>
                        <span className="mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                            same bars, same costs
                        </span>
                    </div>
                    <EquityCurve />
                </div>
            </div>
        </section>
    );
};

export default ProductCapabilities;