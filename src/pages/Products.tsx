import SEO from '../seo/SEO';
import BrowserFrame from '../components/ui/BrowserFrame';
import { productModules } from '../data/screens';

export const Products: React.FC = () => {
    return (
        <>
            <SEO
                title="Platform"
                description="The iFINN platform: a 528-algorithm library, chart-first workspace, walk-forward backtesting, paper trading, cross-asset markets, alternative-data signals, an AI research agent and an open leaderboard."
                canonicalUrl="/products"
            />

            <section className="pb-14 pt-20 lg:pb-16 lg:pt-28">
                <div className="shell">
                    <span className="eyebrow reveal">The platform</span>
                    <h1 className="h-display reveal mt-5 max-w-[16ch]">
                        One terminal, eight desks.
                    </h1>
                    <p className="lead mt-6">
                        528 vetted algorithms, 22+ data providers, an options and funding desk,
                        alternative-data signals and a research agent that calls real tools. All of it
                        runs today on one engine.
                    </p>

                    <nav aria-label="Platform sections" className="mt-10 border-t border-[var(--color-line)] pt-4">
                        <ul className="flex flex-wrap gap-x-6 gap-y-2">
                            {productModules.map((module) => (
                                <li key={module.id}>
                                    <a
                                        href={`#${module.id}`}
                                        className="mono text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                                    >
                                        {module.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </section>

            <section>
                <div className="shell">
                    <div className="flex flex-col gap-20 lg:gap-28">
                        {productModules.map((module, index) => {
                            const reversed = index % 2 === 1;
                            return (
                                <article
                                    key={module.id}
                                    id={module.id}
                                    className="grid scroll-mt-24 gap-10 border-t border-[var(--color-line)] pt-12 lg:grid-cols-2 lg:items-center lg:gap-16"
                                >
                                    <div className={reversed ? 'lg:order-2' : ''}>
                                        <BrowserFrame
                                            src={module.image}
                                            alt={module.imageAlt}
                                            url={module.url}
                                        />
                                    </div>

                                    <div className={reversed ? 'lg:order-1' : ''}>
                                        <span className="eyebrow">{module.tagline}</span>
                                        <h2 className="h2 mt-3">{module.title}</h2>
                                        <p className="prose mt-4 text-[15px]">{module.description}</p>

                                        <dl className="mt-8">
                                            <div className="grid gap-1 border-t border-[var(--color-line)] py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                                                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                                    The problem
                                                </dt>
                                                <dd className="text-[14.5px] leading-relaxed text-[var(--color-muted)]">
                                                    {module.problem}
                                                </dd>
                                            </div>
                                            <div className="grid gap-1 border-t border-[var(--color-line)] py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                                                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-accent)]">
                                                    How we solve it
                                                </dt>
                                                <dd className="text-[14.5px] leading-relaxed text-[var(--color-muted)]">
                                                    {module.solution}
                                                </dd>
                                            </div>
                                        </dl>

                                        <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                                            {module.features.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="border-b border-[var(--color-line)] py-2 text-[14px] leading-relaxed text-[var(--color-muted)]"
                                                >
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Products;