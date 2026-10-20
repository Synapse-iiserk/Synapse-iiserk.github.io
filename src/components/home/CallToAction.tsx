import SeatRequestForm from '../ui/SeatRequestForm';

const channels = [
    { label: 'Investors', value: 'investors@ifinn.org', href: 'mailto:investors@ifinn.org' },
    { label: 'Support', value: 'support@ifinn.org', href: 'mailto:support@ifinn.org' },
    { label: 'Code', value: 'GitHub', href: 'https://github.com/Synapse-iiserk' },
    { label: 'Live chart', value: 'ifinn.org/chart', href: '/chart.html' },
];

export const CallToAction: React.FC = () => {
    return (
        <section className="section">
            <div className="shell">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <span className="eyebrow reveal">Access</span>
                        <h2 className="h2 reveal mt-4">Seats open in small numbers.</h2>
                        <p className="prose mt-4 text-[15px]">
                            The platform is in alpha with a small group of testers today. We open the
                            next seats as the queue moves, and we tell you exactly what you get when
                            they do.
                        </p>

                        <SeatRequestForm id="waitlist-email" className="mt-8" />

                        <p className="mono mt-4 text-[12px] text-[var(--color-muted)]">
                            Opens a one-line email in your own mail app. We write back once, when a
                            seat opens. No newsletter, no drip sequence.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <h3 className="mono border-t border-[var(--color-ink)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                            Direct lines
                        </h3>
                        <dl>
                            {channels.map((channel) => (
                                <div
                                    key={channel.label}
                                    className="flex items-baseline justify-between gap-6 border-b border-[var(--color-line)] py-3"
                                >
                                    <dt className="mono text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                        {channel.label}
                                    </dt>
                                    <dd>
                                        <a
                                            href={channel.href}
                                            className="link mono text-[13px]"
                                            target={channel.href.startsWith('http') ? '_blank' : undefined}
                                            rel="noopener noreferrer"
                                        >
                                            {channel.value}
                                        </a>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;