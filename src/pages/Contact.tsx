import { useState } from 'react';
import SEO from '../seo/SEO';

const directLines = [
    { label: 'Investors', value: 'investors@ifinn.finance', href: 'mailto:investors@ifinn.finance' },
    { label: 'Support', value: 'support@ifinn.finance', href: 'mailto:support@ifinn.finance' },
    { label: 'Press', value: 'press@ifinn.finance', href: 'mailto:press@ifinn.finance' },
];

const subjects = [
    { value: 'general', label: 'General question' },
    { value: 'investment', label: 'Investor inquiry' },
    { value: 'support', label: 'Technical support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'press', label: 'Press' },
];

export const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
    const [submitted, setSubmitted] = useState(false);

    const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (form.honeypot) return;
        // Wire this to the contact endpoint when the backend route ships.
        setSubmitted(true);
    };

    const field = 'field mt-2';

    return (
        <>
            <SEO
                title="Contact"
                description="Contact the iFINN team: investor relations, technical support, press, or a general question about the platform."
                canonicalUrl="/contact"
            />

            <section className="pb-14 pt-20 lg:pb-16 lg:pt-28">
                <div className="shell">
                    <span className="eyebrow reveal">Contact</span>
                    <h1 className="h-display reveal mt-5">Write to a person.</h1>
                    <p className="lead mt-6">
                        Every message is read by the team that builds the platform. Tell us what you are
                        trying to do and we will answer with specifics, not a brochure.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="mono border-t border-[var(--color-ink)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                Direct lines
                            </h2>
                            <dl>
                                {directLines.map((line) => (
                                    <div
                                        key={line.label}
                                        className="flex items-baseline justify-between gap-6 border-b border-[var(--color-line)] py-3"
                                    >
                                        <dt className="mono text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                            {line.label}
                                        </dt>
                                        <dd>
                                            <a href={line.href} className="link mono text-[13px]">
                                                {line.value}
                                            </a>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="mono mt-6 text-[12px] leading-relaxed text-[var(--color-muted)]">
                                Kolkata, India. We answer within two working days.
                            </p>
                        </div>

                        <div className="lg:col-span-8">
                            {submitted ? (
                                <div className="panel px-5 py-6">
                                    <h2 className="h3">Message received</h2>
                                    <p className="prose mt-2 text-[15px]">
                                        Thanks. We will reply from a real address, usually within two
                                        working days.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
                                    <input
                                        type="text"
                                        name="honeypot"
                                        value={form.honeypot}
                                        onChange={update}
                                        className="hidden"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                    />

                                    <div>
                                        <label htmlFor="name" className="mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                            Name
                                        </label>
                                        <input id="name" name="name" type="text" required value={form.name} onChange={update} className={field} />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                            Email
                                        </label>
                                        <input id="email" name="email" type="email" required value={form.email} onChange={update} className={field} />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="subject" className="mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                            Subject
                                        </label>
                                        <select id="subject" name="subject" required value={form.subject} onChange={update} className={field}>
                                            <option value="">Choose one</option>
                                            {subjects.map((subject) => (
                                                <option key={subject.value} value={subject.value}>
                                                    {subject.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="message" className="mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            required
                                            value={form.message}
                                            onChange={update}
                                            className={`${field} resize-y`}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <button type="submit" className="btn btn-primary">
                                            Send message
                                        </button>
                                        <p className="mono mt-3 text-[12px] text-[var(--color-muted)]">
                                            This form does not transmit anything in the current build.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;