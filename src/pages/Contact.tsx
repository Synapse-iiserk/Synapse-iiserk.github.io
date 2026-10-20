import { useState } from 'react';
import SEO from '../seo/SEO';
import { mailtoHref, openDraft } from '../lib/mailto';

const directLines = [
    { label: 'Investors', value: 'investors@ifinn.org', href: 'mailto:investors@ifinn.org' },
    { label: 'Support', value: 'support@ifinn.org', href: 'mailto:support@ifinn.org' },
    { label: 'Press', value: 'press@ifinn.org', href: 'mailto:press@ifinn.org' },
];

// each subject goes straight to the inbox that answers it
const subjects = [
    { value: 'general', label: 'General question', to: 'contact@ifinn.org' },
    { value: 'investment', label: 'Investor inquiry', to: 'investors@ifinn.org' },
    { value: 'support', label: 'Technical support', to: 'support@ifinn.org' },
    { value: 'partnership', label: 'Partnership', to: 'contact@ifinn.org' },
    { value: 'press', label: 'Press', to: 'press@ifinn.org' },
];

function draftFor(form: { name: string; email: string; subject: string; message: string }) {
    const subject = subjects.find((s) => s.value === form.subject) ?? subjects[0];
    return {
        to: subject.to,
        title: `${subject.label}: ${form.name}`,
        body: `${form.message}\n\n${form.name}\n${form.email}`,
    };
}

export const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
    const [submitted, setSubmitted] = useState(false);

    const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

    const draft = draftFor(form);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (form.honeypot) return;
        openDraft(draft.to, draft.title, draft.body);
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
                                <div className="panel px-5 py-6" role="status">
                                    <h2 className="h3">Your draft is ready to send</h2>
                                    <p className="prose mt-2 text-[15px]">
                                        Your mail app should have opened with the message addressed to{' '}
                                        <span className="mono text-[var(--color-ink)]">{draft.to}</span>.
                                        Press send there and it reaches the team; we reply within two
                                        working days.
                                    </p>
                                    <p className="mono mt-4 text-[12px] text-[var(--color-muted)]">
                                        Nothing opened?{' '}
                                        <a
                                            className="link"
                                            href={mailtoHref(draft.to, draft.title, draft.body)}
                                        >
                                            open the draft again
                                        </a>{' '}
                                        or{' '}
                                        <button type="button" className="link" onClick={() => setSubmitted(false)}>
                                            edit the message
                                        </button>
                                        .
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
                                            Write the email
                                        </button>
                                        <p className="mono mt-3 text-[12px] text-[var(--color-muted)]">
                                            Opens a pre-filled email in your own mail app. Nothing is
                                            stored on this site.
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