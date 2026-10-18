import BrowserFrame from '../ui/BrowserFrame';
import AgentTrace from '../ui/AgentTrace';

const principles = [
    {
        title: 'Conformance gated',
        metric: '528 / 528',
        text: 'Every module is checked for crashes, determinism, edge inputs, parameter specs and documentation before a user can see it.',
    },
    {
        title: 'Measured, not claimed',
        metric: '281 ranked',
        text: 'Tradable algorithms are backtested on BTC, AAPL, SPY and gold, then ranked by median annualised Sharpe against buy and hold.',
    },
    {
        title: 'Failures reported',
        metric: '4 statuses',
        text: 'Insufficient trades, no trades and errors stay on the leaderboard instead of being filtered out of it.',
    },
    {
        title: 'Data that compounds',
        metric: '758k+ bars',
        text: 'A write-through store keeps every bar ever fetched and serves it back when providers fail, so history stays honest.',
    },
    {
        title: 'Grounded AI',
        metric: '145 tools',
        text: 'The agent answers questions with platform tools. A price in chat is a tool result with a latency stamp, never a guess.',
    },
    {
        title: 'Open and self-hostable',
        metric: 'MIT',
        text: 'MIT licensed core, multi-stage Docker image, keyless providers working out of the box. The whole stack runs from one compose file.',
    },
];

export const WhyiFINN: React.FC = () => {
    return (
        <section className="section">
            <div className="shell">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <span className="eyebrow reveal">Why iFINN</span>
                        <h2 className="h2 reveal mt-4">We would rather show the maths.</h2>
                        <p className="prose mt-4 text-[15px]">
                            Retail traders get signals they cannot inspect. We built the opposite: a
                            platform where you can read the algorithm, run the backtest, see the failure
                            list and check the price the agent quoted.
                        </p>

                        <ul className="mt-10">
                            {principles.map((principle) => (
                                <li
                                    key={principle.title}
                                    className="grid gap-1 border-t border-[var(--color-line)] py-4 last:border-b md:grid-cols-[13rem_minmax(0,1fr)_7rem] md:items-baseline md:gap-8"
                                >
                                    <h3 className="font-display text-[17px] font-medium tracking-tight">
                                        {principle.title}
                                    </h3>
                                    <p className="text-[14.5px] leading-relaxed text-[var(--color-muted)]">
                                        {principle.text}
                                    </p>
                                    <p className="mono text-[12px] text-[var(--color-accent)] md:text-right">
                                        {principle.metric}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6 lg:col-span-5">
                        <BrowserFrame
                            src="/screens/leaderboard.webp"
                            alt="iFINN leaderboard: 281 algorithms ranked by median annualised Sharpe against buy and hold"
                            url="ifinn.org/leaderboard"
                            meta="281 strategies · 4 symbols"
                        />
                        <p className="mono text-[12px] leading-relaxed text-[var(--color-muted)]">
                            Ranked by median annualised Sharpe on 300 daily bars per symbol, rebuilt
                            whenever the library changes. Insufficient trades, no trades and errors stay
                            on the table.
                        </p>
                        <AgentTrace />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyiFINN;