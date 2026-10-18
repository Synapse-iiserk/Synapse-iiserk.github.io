import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { area as shapeArea, line as shapeLine } from 'd3-shape';
import { createTimeline, cubicBezier, stagger, svg } from 'animejs';
import { fetchKlines, macdEquity, type Candle, type EquityPoint } from '../../lib/market';
import { useVisibleInterval } from '../../lib/useVisibleInterval';
import { readKlines, writeKlines } from '../../lib/klineCache';

const EASE = cubicBezier(0.22, 1, 0.36, 1);
const W = 1000;
const H = 320;
const PAD_T = 18;
const PAD_B = 34;
const PAD_X = 12;
// right gutter reserved for the price scale, so the end labels never sit on it
const PLOT_RIGHT = W - 132;

type Status = 'loading' | 'ready' | 'stale' | 'error';

interface EquityCurveProps {
    symbol?: string;
    interval?: string;
    limit?: number;
    className?: string;
}

const pct = (v: number) => (v >= 0 ? '+' : '') + (v * 100).toFixed(1) + '%';

/**
 * Signal versus buy and hold, computed in the browser from public klines:
 * MACD(12, 26, 9) crossover, long only, applied from the following bar so
 * there is no look-ahead, charged 10 bps on every position change.
 */
export const EquityCurve: React.FC<EquityCurveProps> = ({
    symbol = 'BTCUSDT',
    interval = '4h',
    limit = 180,
    className = '',
}) => {
    const [candles, setCandles] = useState<Candle[] | null>(null);
    const [status, setStatus] = useState<Status>('loading');
    const [staleAt, setStaleAt] = useState<number | null>(null);
    const [failed, setFailed] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const animatedKey = useRef<string | null>(null);

    const load = useCallback(async () => {
        try {
            const rows = await fetchKlines(symbol, interval, limit);
            if (rows.length < 30) throw new Error('series too short');
            setCandles(rows);
            setStatus('ready');
            setStaleAt(null);
            setFailed(false);
            writeKlines('equity', symbol, interval, rows);
        } catch {
            setFailed(true);
            const cached = readKlines('equity', symbol, interval);
            if (cached) {
                setCandles(cached.data);
                setStatus('stale');
                setStaleAt(cached.savedAt);
            } else {
                setStatus('error');
            }
        }
    }, [symbol, interval, limit]);

    useVisibleInterval(load, {
        delay: 5 * 60_000,
        failed,
        resetKey: `${symbol}:${interval}`,
    });

    const points = useMemo<EquityPoint[]>(() => (candles ? macdEquity(candles, 10) : []), [candles]);

    const geometry = useMemo(() => {
        if (points.length < 2) return null;

        const x = scaleLinear().domain([0, points.length - 1]).range([PAD_X, PLOT_RIGHT]);
        const values = points.flatMap((p) => [p.strategy, p.hold]);
        const min = Math.min(...values, 1);
        const max = Math.max(...values, 1);
        const pad = (max - min) * 0.12 || 0.02;
        // axis is percentage return from the starting equity
        const y = scaleLinear().domain([min - pad, max + pad]).range([H - PAD_B, PAD_T]);

        const strategyLine = shapeLine<EquityPoint>().x((_, i) => x(i)).y((p) => y(p.strategy))(points);
        const holdLine = shapeLine<EquityPoint>().x((_, i) => x(i)).y((p) => y(p.hold))(points);
        const strategyArea = shapeArea<EquityPoint>().x((_, i) => x(i)).y0(y(1)).y1((p) => y(p.strategy))(
            points,
        );

        const entries = points
            .map((p, i) => (i > 0 && p.position === 1 && points[i - 1].position === 0 ? i : -1))
            .filter((i) => i > 0);
        const exits = points
            .map((p, i) => (i > 0 && p.position === 0 && points[i - 1].position === 1 ? i : -1))
            .filter((i) => i > 0);

        const last = points[points.length - 1];
        const exposed = points.filter((p) => p.position === 1).length / points.length;

        return { x, y, strategyLine, holdLine, strategyArea, entries, exits, last, exposed };
    }, [points]);

    useEffect(() => {
        if (!geometry || !svgRef.current) return;
        const key = `${symbol}:${interval}`;
        if (animatedKey.current === key) return;
        animatedKey.current = key;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const root = svgRef.current;
        createTimeline({ defaults: { duration: 900, ease: EASE } })
            .add(svg.createDrawable(root.querySelector('[data-hold]')!), { draw: ['0 0', '0 1'] }, 0)
            .add(svg.createDrawable(root.querySelector('[data-signal]')!), { draw: ['0 0', '0 1'] }, 220)
            .add(root.querySelectorAll('[data-marker]'), { opacity: [0, 1], delay: stagger(24) }, 800);
    }, [geometry, symbol, interval]);

    const last = geometry?.last;

    const summary = last
        ? `MACD crossover strategy returned ${pct(last.strategy - 1)} against buy and hold ${pct(
              last.hold - 1,
          )} over ${points.length} ${interval} bars, in the market ${Math.round(
              (geometry?.exposed ?? 0) * 100,
          )} percent of the time. Computed in the browser from Binance public klines.`
        : 'Strategy equity chart, loading.';

    return (
        <figure className={`flex flex-col gap-3 ${className}`}>
            <div className="shot">
                <div className="shot-bar">
                    <span className="shot-url">
                        {symbol} {interval} · MACD(12, 26, 9) crossover vs buy and hold
                    </span>
                    {status === 'stale' && <span>cached</span>}
                    <span className="hidden items-center gap-3 sm:flex">
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-0.5 w-4 bg-[var(--color-accent)]" />
                            signal
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-px w-4 bg-[var(--color-muted)]" />
                            buy and hold
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="inline-block h-2 w-2 bg-[var(--color-accent)]" />
                            enter
                        </span>
                    </span>
                </div>

                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    role="img"
                    aria-label={summary}
                    className="w-full"
                >
                    <title>{summary}</title>

                    {/* zero-return baseline */}
                    <line
                        x1={PAD_X}
                        x2={PLOT_RIGHT}
                        y1={geometry?.y(1)}
                        y2={geometry?.y(1)}
                        stroke="var(--color-line-strong)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        shapeRendering="crispEdges"
                    />

                    {geometry?.y.ticks(4).map((tick) => (
                        <g key={tick}>
                            <line
                                x1={PAD_X}
                                x2={PLOT_RIGHT}
                                y1={geometry.y(tick)}
                                y2={geometry.y(tick)}
                                stroke="var(--color-line)"
                                strokeWidth={1}
                                shapeRendering="crispEdges"
                            />
                            <text
                                x={W - 4}
                                y={geometry.y(tick) + 4}
                                className="mono"
                                fontSize={11}
                                fill="var(--color-muted)"
                                textAnchor="end"
                            >
                                {pct(tick - 1)}
                            </text>
                        </g>
                    ))}

                    {status === 'error' && (
                        <g>
                            <text
                                x={W / 2}
                                y={H / 2}
                                className="mono"
                                fontSize={13}
                                fill="var(--color-muted)"
                                textAnchor="middle"
                            >
                                live feed unavailable, nothing to compare
                            </text>
                            <text
                                x={W / 2}
                                y={H / 2 + 22}
                                className="mono"
                                fontSize={12}
                                fill="var(--color-line-strong)"
                                textAnchor="middle"
                            >
                                retry below, or come back when the exchange answers
                            </text>
                        </g>
                    )}

                    {geometry?.strategyArea && (
                        <path d={geometry.strategyArea} fill="var(--color-accent)" opacity={0.07} />
                    )}

                    {geometry?.holdLine && (
                        <path
                            data-hold
                            d={geometry.holdLine}
                            fill="none"
                            stroke="var(--color-muted)"
                            strokeWidth={1.5}
                        />
                    )}

                    {geometry?.strategyLine && (
                        <path
                            data-signal
                            d={geometry.strategyLine}
                            fill="none"
                            stroke="var(--color-accent)"
                            strokeWidth={2}
                            strokeLinejoin="round"
                        />
                    )}

                    {/* value labels pinned to the end of each curve */}
                    {geometry && last && (
                        <g>
                            <text
                                x={geometry.x(points.length - 1) + 8}
                                y={geometry.y(last.strategy) + 4}
                                className="mono"
                                fontSize={12}
                                fontWeight={600}
                                fill="var(--color-accent)"
                            >
                                {pct(last.strategy - 1)}
                            </text>
                            <text
                                x={geometry.x(points.length - 1) + 8}
                                y={geometry.y(last.hold) + 14}
                                className="mono"
                                fontSize={12}
                                fill="var(--color-muted)"
                            >
                                {pct(last.hold - 1)}
                            </text>
                        </g>
                    )}

                    {geometry?.entries.map((i) => (
                        <rect
                            key={`in-${i}`}
                            data-marker={1}
                            x={geometry.x(i) - 2.5}
                            y={PAD_T + 6}
                            width={5}
                            height={5}
                            fill="var(--color-accent)"
                        />
                    ))}
                    {geometry?.exits.map((i) => (
                        <rect
                            key={`out-${i}`}
                            data-marker={1}
                            x={geometry.x(i) - 2.5}
                            y={PAD_T + 6}
                            width={5}
                            height={5}
                            fill="var(--color-muted)"
                        />
                    ))}
                </svg>
            </div>

            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="mono text-sm">
                    {status === 'loading' && 'loading klines…'}
                    {status === 'error' && (
                        <button type="button" onClick={() => void load()} className="link">
                            live feed unavailable, retry
                        </button>
                    )}
                    {(status === 'ready' || status === 'stale') && geometry && last && (
                        <span>
                            <span className="text-[var(--color-accent)]">signal {pct(last.strategy - 1)}</span>
                            <span className="text-[var(--color-muted)]">
                                {' '}
                                · buy and hold {pct(last.hold - 1)} · in market{' '}
                                {(geometry.exposed * 100).toFixed(0)}% of bars
                            </span>
                        </span>
                    )}
                </span>
                <span className="mono text-xs text-[var(--color-muted)]">
                    {status === 'stale' && staleAt
                        ? `cached ${new Date(staleAt).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                          })} · `
                        : ''}
                    {interval} bars · long only · applied from the next bar · 10 bps per side · not a forecast
                </span>
            </figcaption>
        </figure>
    );
};

export default EquityCurve;