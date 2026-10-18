import SEO from '../seo/SEO';

const roadmap = [
    { phase: 'Foundation', status: 'Shipped', items: 'Platform and auth, 528 algorithms, persistent data store, hosted deployment' },
    { phase: 'Intelligence', status: 'Live', items: 'AI research agent over 145 tools, Master Eye influence graph, alternative-data signals' },
    { phase: 'Expansion', status: 'In progress', items: 'Derivatives and world markets, prediction markets, Algo Hub community' },
    { phase: 'Enterprise', status: 'Planned', items: 'Regulatory registrations, institutional accounts, white label and API' },
];

const promises = [
    'Every output traces to an algorithm or a tool call you can inspect.',
    'Backtests carry real costs and train and test splits, so the number survives contact with the live market.',
    'Algorithms that crash, stall or have too few trades stay on the leaderboard with their status shown.',
    'A human decides what to trade. The platform refuses to hide the arithmetic.',
];

export const About: React.FC = () => {
    return (
        <>
            <SEO
                title="About"
                description="iFINN is Team Synapse at IISER Kolkata: a quantitative research terminal built so that every number on the screen can be traced back to an algorithm or a tool call."
                canonicalUrl="/about"
            />

            <section className="pb-14 pt-20 lg:pb-16 lg:pt-28">
                <div className="shell">
                    <span className="eyebrow reveal">About</span>
                    <h1 className="h-display reveal mt-5 max-w-[18ch]">Built to be audited.</h1>
                    <p className="lead mt-6">
                        iFINN is a student team at IISER Kolkata building the research tooling we wanted
                        and could not rent: documented algorithms, honest backtests, and an assistant
                        that shows which tool produced each number.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="min-w-0 lg:col-span-7">
                            <h2 className="h2 reveal">Mission and method</h2>
                            <div className="mt-6 flex flex-col gap-5 text-[16px] leading-relaxed text-[var(--color-muted)]">
                                <p>
                                    Most retail tools hand you a prediction and take the reasoning
                                    away. We built the opposite: a terminal where the maths is the
                                    product and the interface is a thin layer over it.
                                </p>
                                <p>
                                    The work is unglamorous by design. Conformance harnesses, walk
                                    forward validation, provider fallbacks, an audit trail on every
                                    agent answer. The result is a platform a sceptic can check.
                                </p>
                            </div>

                            <h3 className="mono mt-12 border-t border-[var(--color-ink)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                What we promise
                            </h3>
                            <ul>
                                {promises.map((promise) => (
                                    <li
                                        key={promise}
                                        className="border-b border-[var(--color-line)] py-3 text-[15px] leading-relaxed text-[var(--color-muted)]"
                                    >
                                        {promise}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="min-w-0 lg:col-span-5">
                            <h2 className="h3">Where we are</h2>
                            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                            <table className="data-table mt-4 min-w-[26rem]">
                                <thead>
                                    <tr>
                                        <th scope="col">Phase</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roadmap.map((row) => (
                                        <tr key={row.phase}>
                                            <td>
                                                {row.phase}
                                                <span className="mt-1 block text-[13px] leading-relaxed text-[var(--color-muted)]">
                                                    {row.items}
                                                </span>
                                            </td>
                                            <td
                                                className={`num whitespace-nowrap text-right ${
                                                    row.status === 'Planned'
                                                        ? 'text-[var(--color-muted)]'
                                                        : 'text-[var(--color-accent)]'
                                                }`}
                                            >
                                                {row.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>

                            <p className="mono mt-8 border-t border-[var(--color-line)] pt-4 text-[12px] leading-relaxed text-[var(--color-muted)]">
                                <span className="text-[var(--color-warn)]">Disclosure.</span> iFINN
                                provides analytical tools for research and education. Nothing on this
                                site is financial advice, and trading carries a real risk of loss.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;