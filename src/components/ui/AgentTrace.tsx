import { useEffect, useState } from 'react';
import { fetchQuote, formatPrice, type Quote } from '../../lib/market';
import { ThinkingIndicator } from '../charts/ThinkingIndicator';

/**
 * The product claim behind "grounded, not guessed", demonstrated rather than
 * asserted: this calls the same public endpoint our agent's get_quote tool
 * wraps, and reports the round trip the browser actually measured.
 */
export const AgentTrace: React.FC<{ symbol?: string; className?: string }> = ({
    symbol = 'BTCUSDT',
    className = '',
}) => {
    const [state, setState] = useState<{ quote: Quote; ms: number } | 'error' | 'loading'>('loading');
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const started = performance.now();

        fetchQuote(symbol, controller.signal)
            .then((quote) => {
                setState({ quote, ms: Math.round(performance.now() - started) });
            })
            .catch((err: unknown) => {
                if ((err as Error)?.name === 'AbortError') return;
                setState('error');
            });

        return () => controller.abort();
    }, [symbol, attempt]);

    return (
        <div className={`panel px-4 py-4 ${className}`}>
            <div className="flex items-center justify-between gap-4">
                <p className="mono text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                    Research agent · live trace
                </p>
                {state === 'loading' && <ThinkingIndicator size={26} label="Calling a live tool" />}
            </div>

            <div className="mt-3 flex flex-col gap-2 font-mono text-[13px] leading-relaxed">
                <p className="text-[var(--color-muted)]">
                    <span className="text-[var(--color-accent)]">&rsaquo;</span> what is {symbol} trading at?
                </p>

                {state === 'loading' && (
                    <p className="text-[var(--color-muted)]">calling tool…</p>
                )}

                {state === 'error' && (
                    <p className="text-[var(--color-muted)]">
                        tool call failed, so no answer is shown.{' '}
                        <button
                            type="button"
                            className="link"
                            onClick={() => {
                                setState('loading');
                                setAttempt((n) => n + 1);
                            }}
                        >
                            call again
                        </button>
                    </p>
                )}

                {state !== 'loading' && state !== 'error' && (
                    <>
                        <p className="flex flex-wrap items-baseline justify-between gap-4 border-t border-[var(--color-line)] pt-2">
                            <span className="text-[var(--color-ink)]">
                                get_quote({symbol})
                            </span>
                            <span className="text-[var(--color-muted)]">{state.ms} ms round trip</span>
                        </p>
                        <p className="text-[var(--color-ink)]">
                            {formatPrice(state.quote.price)} USD
                            <span
                                className={
                                    state.quote.changePct >= 0 ? 'text-[var(--color-accent)]' : 'text-[#c4544a]'
                                }
                            >
                                {' '}
                                {state.quote.changePct >= 0 ? '+' : ''}
                                {state.quote.changePct.toFixed(2)}% 24h
                            </span>
                        </p>
                        <p className="text-[var(--color-muted)]">
                            served by the exchange API, quoted by the tool, never by the model
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AgentTrace;