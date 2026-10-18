import { dataSources } from '../../data/screens';

const stack: { layer: string; runs: string; proof: string }[] = [
    {
        layer: 'Backend and engines',
        runs: 'Python 3.13, FastAPI, walk-forward backtester, paper-trading engine',
        proof: '7,033 tests',
    },
    {
        layer: 'Data layer',
        runs: 'PostgreSQL write-through store, Redis and Valkey cache, 22+ provider adapters',
        proof: '758k+ bars',
    },
    {
        layer: 'Frontend',
        runs: 'React 19, TypeScript, ECharts visualisations, Zustand, Vite',
        proof: '1,289 tests',
    },
    {
        layer: 'AI and agents',
        runs: '145-tool MCP server, tool-calling research agent, bring your own model',
        proof: 'traced',
    },
    {
        layer: 'Delivery',
        runs: 'Multi-stage Docker image, one compose file, MIT licensed core',
        proof: 'Docker',
    },
];

export const TechStack: React.FC = () => {
    return (
        <section className="section">
            <div className="shell">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="min-w-0 lg:col-span-4">
                        <span className="eyebrow reveal">Engineering</span>
                        <h2 className="h2 reveal mt-4">Boring in the good way.</h2>
                        <p className="prose mt-4 text-[15px]">
                            A conventional stack, chosen so the numbers can be reproduced: typed,
                            tested, boring and self hostable. Nothing here is exotic, and nothing here
                            is a black box.
                        </p>
                    </div>

                    <div className="min-w-0 lg:col-span-8">
                        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                        <table className="data-table min-w-[30rem]">
                            <thead>
                                <tr>
                                    <th scope="col">Layer</th>
                                    <th scope="col">What runs there</th>
                                    <th scope="col" className="text-right">
                                        Proof
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stack.map((row) => (
                                    <tr key={row.layer}>
                                        <td>{row.layer}</td>
                                        <td>{row.runs}</td>
                                        <td className="num accent whitespace-nowrap text-right">{row.proof}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-[var(--color-line)] pt-6">
                    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
                        <h3 className="mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                            Providers feeding the store
                        </h3>
                        <span className="mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                            22+ adapters, cache first
                        </span>
                    </div>
                    <div className="ticker-mask">
                        <div className="ticker-track">
                            {[...dataSources, ...dataSources].map((source, index) => (
                                <span key={`${source.name}-${index}`} className="ticker-item">
                                    {source.name}
                                    <span>{source.category}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechStack;