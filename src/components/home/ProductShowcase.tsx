import { useState } from 'react';
import BrowserFrame from '../ui/BrowserFrame';
import { showcaseTabs } from '../../data/screens';

/**
 * Product tour: eight screens of the running platform behind a terminal-style
 * tab bar. Keyboard navigable. Switching desks wipes the new frame in while its
 * copy rises underneath.
 */
export const ProductShowcase: React.FC = () => {
    const [activeId, setActiveId] = useState(showcaseTabs[0].id);
    const activeIndex = showcaseTabs.findIndex((t) => t.id === activeId);
    const active = showcaseTabs[activeIndex];

    const select = (index: number) => {
        const next = (index + showcaseTabs.length) % showcaseTabs.length;
        setActiveId(showcaseTabs[next].id);
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            event.preventDefault();
            select(activeIndex + 1);
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            event.preventDefault();
            select(activeIndex - 1);
        }
    };

    return (
        <section id="tour" className="section">
            <div className="shell">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                        <span className="eyebrow reveal">Product tour</span>
                        <h2 className="h2 reveal mt-4">Eight screens of the running product.</h2>
                        <p className="prose mt-4 text-[15px]">
                            Every frame below was captured from the live deployment: no mockups, no
                            filler. Pick a desk to read what it does.
                        </p>

                        <div
                            role="tablist"
                            aria-label="Product areas"
                            aria-orientation="vertical"
                            onKeyDown={onKeyDown}
                            className="mt-8 flex flex-col"
                        >
                            {showcaseTabs.map((tab) => {
                                const selected = tab.id === activeId;
                                return (
                                    <button
                                        key={tab.id}
                                        role="tab"
                                        id={`tour-tab-${tab.id}`}
                                        aria-selected={selected}
                                        aria-controls="tour-panel"
                                        tabIndex={selected ? 0 : -1}
                                        onClick={() => setActiveId(tab.id)}
                                        className="flex items-baseline justify-between gap-4 border-t border-[var(--color-line)] py-3 text-left transition-colors last:border-b hover:text-[var(--color-ink)]"
                                    >
                                        <span
                                            className={`mono text-[13px] ${
                                                selected
                                                    ? 'text-[var(--color-accent)]'
                                                    : 'text-[var(--color-muted)]'
                                            }`}
                                        >
                                            {tab.label}
                                        </span>
                                        <span
                                            className={`mono hidden text-[11px] uppercase tracking-[0.1em] sm:inline ${
                                                selected ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]'
                                            }`}
                                        >
                                            {tab.kicker}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div role="tabpanel" id="tour-panel" aria-labelledby={`tour-tab-${active.id}`}>
                            <div key={active.id} className="panel-wipe" data-no-reveal>
                                    <BrowserFrame src={active.image} alt={active.title} url={active.url} />

                                    <div className="panel-copy mt-6 grid gap-8 sm:grid-cols-2">
                                        <div>
                                            <h3 className="h3">{active.title}</h3>
                                            <p className="prose mt-3 text-[15px]">{active.description}</p>
                                        </div>
                                        <ul className="border-t border-[var(--color-line)]" style={{ '--d': 120 } as React.CSSProperties}>
                                            {active.bullets.map((bullet) => (
                                                <li
                                                    key={bullet}
                                                    className="border-b border-[var(--color-line)] py-2.5 text-[14px] leading-relaxed text-[var(--color-muted)]"
                                                >
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;