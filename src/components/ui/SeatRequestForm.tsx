import { useState } from 'react';
import { mailtoHref, openDraft } from '../../lib/mailto';

const TO = 'contact@ifinn.org';
const SUBJECT = 'Seat request';
const body = (email: string) => `Please add ${email} to the iFINN waitlist.`;

interface SeatRequestFormProps {
    id: string;
    label?: string;
    primary?: boolean;
    className?: string;
}

/**
 * One-field seat request. There is no waitlist endpoint behind this static
 * site, so the request goes out as an email the visitor sends themselves,
 * and the confirmation says exactly that.
 */
export const SeatRequestForm: React.FC<SeatRequestFormProps> = ({
    id,
    label = 'Request a seat',
    primary = true,
    className = '',
}) => {
    const [email, setEmail] = useState('');
    const [sentFor, setSentFor] = useState<string | null>(null);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!email) return;
        openDraft(TO, SUBJECT, body(email));
        setSentFor(email);
    };

    if (sentFor) {
        return (
            <div className={`panel max-w-lg px-4 py-4 ${className}`} role="status">
                <p className="text-[15px] text-[var(--color-ink)]">
                    Send the draft your mail app just opened and you are in the queue.
                </p>
                <p className="mono mt-2 text-[12px] text-[var(--color-muted)]">
                    Nothing opened? Write to{' '}
                    <a className="link" href={mailtoHref(TO, SUBJECT, body(sentFor))}>
                        {TO}
                    </a>{' '}
                    or{' '}
                    <button type="button" className="link" onClick={() => setSentFor(null)}>
                        change the address
                    </button>
                    .
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className={`flex max-w-lg flex-col gap-3 sm:flex-row ${className}`}>
            <label htmlFor={id} className="sr-only">
                Email address
            </label>
            <input
                id={id}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@firm.com"
                className="field"
            />
            <button type="submit" className={`btn ${primary ? 'btn-primary' : ''} shrink-0 justify-center`}>
                {label}
            </button>
        </form>
    );
};

export default SeatRequestForm;
