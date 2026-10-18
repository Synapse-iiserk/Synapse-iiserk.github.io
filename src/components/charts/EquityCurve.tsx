import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { area as shapeArea, line as shapeLine } from 'd3-shape';
import { createTimeline, cubicBezier, stagger, svg } from 'animejs';
import { fetchKlines, macdEquity, type Candle, type EquityPoint } from '../../lib/market';

const EASE = cubicBezier(0.22, 1, 0.36, 1);
const W = 1000;
const H = 320;
const PAD_T = 18;
const PAD_B = 34;
const PAD_X = 12;

interface EquityCurveProps {
    symbol?: string;
    interval?: string;
    limit?: number;
    className?: string;
}

const signed = (v: number) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(1)}%`;

/**
 * Signal versus buy-and-hold, computed in the browser from public klines:
 * MACD(12, 26, 9) crossover, long-only, applied from the following bar so
 * there is no look-ahead, charged 10 bps on every position change.
 */
export const EquityCurve: React.FC<EquityCurveProps> = ({
    symbol = 'BTCUSDT',
    interval = '4h',
    limit = 180,
    className = '',
}) => {
    const [candles, setCandles] = useState<Candle[] | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const svgRef = useRef<SVGSVGElement>(null);
    const drawn = useRef(false);

    const load = useCallback(
        (signal?: AbortSignal) => {
            fetchKlines(symbol, interval, limit, signal)
                .then((rows) => {
                    if (rows.length < 30) throw new Error('series too short');
                    setCandles(rows);
                    setStatus('ready');
                })
                .catch((err: unknown) => {
                    if ((err as Error)?.name === 'AbortError') return;
                    setStatus('error');
                });
        },
        [symbol, interval, limit],
    );

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal);
        const timer = window.setInterval(() => load(controller.signal), 5 * 60_000);
        return () => {
            controller.abort();
            window.clearInterval(timer);
        };
    }, [load]);

    const points = useMemo<EquityPoint[]>(() => (candles ? macdEquity(candles, 10) : []), [candles]);

    const geometry = useMemo(() => {
        if (points.length < 2) return null;
        const innerW = W - PAD_X * 2;
        const innerH = H - PAD_T - PAD_B;
        const x = scaleLinear().domain([0, points.length - 1]).range([PAD_X, W - PAD_X]);

        const values = points.flatMap((p) => [p.strategy, p.hold]);
        const min = Math.min(...values, 1);
        const max = Math.max(...values, 1);
        const pad = (max - min) * 0.12 || 0.02;
        const y = scaleLinear().domain([min - pad, max + pad]).range([H - PAD_B, PAD_T]);

        const strategyLine = shapeLine<EquityPoint>()
            .x((_, i) => x(i))
            .y((p) => y(p.strategy))(points);
        const holdLine = shapeLine<EquityPoint>().x((_, i) => x(i)).y((p) => y(p.hold))(points);
        const strategyArea = shapeArea<EquityPoint>()
            .x((_, i) => x(i))
            .y0(y(1))
            .y1((p) => y(p.strategy))(points);

        const entries = points
            .map((p, i) => (i > 0 && p.position === 1 && points[i - 1].position === 0 ? i : -1))
            .filter((i) => i > 0);
        const exits = points
            .map((p, i) => (i > 0 && p.position === 0 && points[i - 1].position === 1 ? i : -1))
            .filter((i) => i > 0);

        const last = points[points.length - 1];
        const exposed = points.filter((p) => p.position === 1).length / points.length;

        return { x, y, strategyLine, holdLine, strategyArea, entries, exits, last, exposed, innerW, innerH };
    }, [points]);

    useEffect(() => {
        if (!geometry || drawn.current || !svgRef.current) return;
        drawn.current = true;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const root = svgRef.current;
        createTimeline({ defaults: { duration: 900, ease: EASE } })
            .add(svg.createDrawable(root.querySelector('[data-hold]')!), { draw: ['0 0', '0 1'] }, 0)
            .add(svg.createDrawable(root.querySelector('[data-signal]')!), { draw: ['0 0', '0 1'] }, 220)
            .add(root.querySelectorAll('[data-marker]'), { opacity: [0, 1], delay: stagger(24) }, 800);
    }, [geometry]);

    return (
        <figure className={`flex flex-col gap-3 ${className}`}>
            <div className="shot">
                <div className="shot-bar">
                    <span className="shot-url">
                        {symbol} {interval} · MACD(12, 26, 9) crossover vs buy and hold
                    </span>
                    <span>computed in your browser</span>
                </div>

                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    role="img"
                    aria-label={
                        geometry
                            ? `MACD crossover strategy returned ${signed(geometry.last.strategy - 1)} against buy and hold ${signed(geometry.last.hold - 1)} over ${points.length} bars`
                            : 'Strategy equity chart loading'
                    }
                    className="w-full"
                >
                    <title>MACD crossover strategy versus buy and hold</title>

                    {/* baseline 1.0 */}
                    <line
                        x1={PAD_X}
                        x2={W - PAD_X}
                        y1={geometry?.y(1)}
                        y2={geometry?.y(1)}
                        stroke="var(--color-line-strong)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                    />

                    {/* value grid */}
                    {geometry &&
                        geometry.y.ticks(4).map((tick) => (
                            <g key={tick}>
                                <line
                                    x1={PAD_X}
                                    x2={W - PAD_X}
                                    y1={geometry.y(tick)}
                                    y2={geometry.y(tick)}
                                    stroke="var(--color-line)"
                                    strokeWidth={1}
                                />
                                <text
                                    x={W - PAD_X + 4}
                                    y={geometry.y(tick) + 4}
                                    className="mono"
                                    fontSize={11}
                                    fill="var(--color-muted)"
                                    textAnchor="end"
                                >
                                    {tick.toFixed(2)}x
                                </text>
                            </g>
                        ))}

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
                    {status === 'error' && 'live feed unavailable'}
                    {status === 'ready' && geometry && (
                        <span>
                            <span className="text-[var(--color-accent)]">signal {signed(geometry.last.strategy - 1)}</span>
                            <span className="text-[var(--color-muted)]"> · buy and hold {signed(geometry.last.hold - 1)} · in market {(geometry.exposed * 100).toFixed(0)}% of bars</span>
                        </span>
                    )}
                </span>
                <span className="mono text-xs text-[var(--color-muted)]">
                    {interval} bars · long only · applied from the next bar · 10 bps per side · not a forecast
                </span>
            </figcaption>
        </figure>
    );
};

export default EquityCurve;