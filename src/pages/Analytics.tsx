import SEO from '../seo/SEO';
import {
    RSICalculator,
    MovingAverageDemo,
    BollingerBandsDemo,
    TrendAnalysisDemo,
    PortfolioRiskDemo,
    CoinGeckoWidget,
    SentimentWidget,
} from '../components/analytics';

const indicatorGroups = [
    { category: 'Momentum', items: ['RSI', 'MACD', 'Stochastic', 'ROC', 'Momentum'] },
    { category: 'Trend', items: ['SMA', 'EMA', 'WMA', 'Awesome Oscillator', 'Accelerator'] },
    { category: 'Volume', items: ['OBV', 'ADL', 'MFI', 'CMF', 'PVT', 'VWAP'] },
    { category: 'Volatility', items: ['Bollinger Bands', 'ATR', 'Keltner', 'Std Dev', 'Historical Vol'] },
];

const groups = [
    {
        id: 'momentum',
        title: 'Momentum',
        blurb: 'How fast price is moving, measured in the browser with the same code the platform runs.',
        children: [<RSICalculator key="rsi" />, <MovingAverageDemo key="ma" />],
    },
    {
        id: 'volatility',
        title: 'Volatility',
        blurb: 'Bands, drawdown and risk. No smoothing until the result is prettier than the data.',
        children: [<BollingerBandsDemo key="bb" />, <PortfolioRiskDemo key="risk" />],
    },
    {
        id: 'trend',
        title: 'Trend and regression',
        blurb: 'Least squares fits against real prices, reported with the residual left visible.',
        children: [<TrendAnalysisDemo key="trend" />],
    },
];

export const Analytics: React.FC = () => {
    return (
        <>
            <SEO
                title="Analytics playground"
                description="Run RSI, moving averages, Bollinger Bands and regression in your browser: the same TypeScript analytics the iFINN platform runs, with no account and no data leaving the page."
                canonicalUrl="/analytics"
            />

            <section className="pb-14 pt-20 lg:pb-16 lg:pt-28">
                <div className="shell">
                    <span className="eyebrow reveal">Analytics playground</span>
                    <h1 className="h-display reveal mt-5">Try the maths.</h1>
                    <p className="lead mt-6">
                        The indicator code that runs on the platform, running in your browser. Only the
                        market price is fetched, from a public endpoint. Nothing is sent anywhere and no
                        account is required.
                    </p>
                    <dl className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-3">
                        {[
                            { k: 'Runs', v: 'in your browser' },
                            { k: 'Data out', v: 'none' },
                            { k: 'Account', v: 'not required' },
                        ].map((fact) => (
                            <div key={fact.k} className="border-t border-[var(--color-line)] pt-3">
                                <dt className="mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                    {fact.k}
                                </dt>
                                <dd className="mt-1 font-display text-[19px] tracking-tight">{fact.v}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <div className="grid gap-8 lg:grid-cols-2">
                        <CoinGeckoWidget />
                        <SentimentWidget />
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    {groups.map((group) => (
                        <div key={group.id} className="mb-20 last:mb-0">
                            <div className="grid gap-6 border-t border-[var(--color-ink)] pt-4 lg:grid-cols-12">
                                <div className="lg:col-span-4">
                                    <h2 className="h2">{group.title}</h2>
                                    <p className="prose mt-3 text-[15px]">{group.blurb}</p>
                                </div>
                                <div
                                    className={`grid gap-6 lg:col-span-8 ${
                                        group.children.length > 1 ? 'sm:grid-cols-2' : ''
                                    }`}
                                >
                                    {group.children}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <h2 className="mono border-t border-[var(--color-ink)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Indicator library, a slice of it
                    </h2>
                    <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {indicatorGroups.map((group) => (
                            <div key={group.category}>
                                <h3 className="mono text-[12px] uppercase tracking-[0.1em] text-[var(--color-accent)]">
                                    {group.category}
                                </h3>
                                <ul className="mt-3">
                                    {group.items.map((item) => (
                                        <li
                                            key={item}
                                            className="mono border-b border-[var(--color-line)] py-1.5 text-[13px] text-[var(--color-muted)]"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-[var(--color-line)] pt-8">
                        <a href="/products" className="btn btn-primary">
                            See the platform
                        </a>
                        <a href="/contact" className="btn">
                            Ask a question
                        </a>
                        <p className="mono text-[12px] text-[var(--color-muted)]">
                            528 algorithms run on this library. These four are the free sample.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Analytics;