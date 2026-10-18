import { useState } from 'react';

const channels = [
    { label: 'Investors', value: 'investors@ifinn.finance', href: 'mailto:investors@ifinn.finance' },
    { label: 'Support', value: 'support@ifinn.finance', href: 'mailto:support@ifinn.finance' },
    { label: 'Code', value: 'github.com/Synapse-iiserk', href: 'https://github.com/Synapse-iiserk' },
    { label: 'Live chart', value: 'ifinn.org/chart', href: '/chart.html' },
];

export const CallToAction: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!email) return;
        // Wire this to the waitlist endpoint when the backend route ships.
        setSubmitted(true);
        setEmail('');
    };

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

                        {submitted ? (
                            <p className="panel mt-8 px-4 py-4 text-[15px] text-[var(--color-ink)]">
                                You are on the list. We will write once, when a seat opens.
                            </p>
                        ) : (
                            <form onSubmit={onSubmit} className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
                                <label htmlFor="waitlist-email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="waitlist-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="you@fund.com"
                                    className="field"
                                />
                                <button type="submit" className="btn btn-primary justify-center">
                                    Request a seat
                                </button>
                            </form>
                        )}

                        <p className="mono mt-4 text-[12px] text-[var(--color-muted)]">
                            One email when a seat opens. No newsletter, no drip sequence.
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