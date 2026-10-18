import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { line as shapeLine } from 'd3-shape';
import { createTimeline, cubicBezier, stagger, svg } from 'animejs';
import {
    ema,
    fetchKlines,
    formatClock,
    formatDay,
    formatPrice,
    pctChange,
    type Candle,
} from '../../lib/market';

const UP = '#10B981';
const DOWN = '#C4544A';
const EASE = cubicBezier(0.22, 1, 0.36, 1);

const W = 1000;
const H = 420;
const PAD_L = 10;
const PAD_R = 72;
const PRICE_TOP = 16;
const PRICE_H = 296;
const PRICE_BOTTOM = PRICE_TOP + PRICE_H;
const VOL_TOP = PRICE_BOTTOM + 26;
const VOL_H = 64;
const VOL_BOTTOM = VOL_TOP + VOL_H;

interface LiveCandlesProps {
    symbol?: string;
    interval?: string;
    limit?: number;
    className?: string;
}

/**
 * Live candlestick chart: Binance public klines, EMA(20) overlay, volume
 * histogram, crosshair readout. Plain SVG, drawn with anime.js once on first
 * paint, then updated in place. Nothing is drawn if the feed fails.
 */
export const LiveCandles: React.FC<LiveCandlesProps> = ({
    symbol = 'BTCUSDT',
    interval = '1h',
    limit = 168,
    className = '',
}) => {
    const [candles, setCandles] = useState<Candle[] | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [hover, setHover] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const drawn = useRef(false);

    const load = useCallback(
        (signal?: AbortSignal) => {
            fetchKlines(symbol, interval, limit, signal)
                .then((rows) => {
                    if (rows.length === 0) throw new Error('empty series');
                    setCandles(rows);
                    setStatus('ready');
                    setUpdatedAt(new Date());
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
        const timer = window.setInterval(() => load(controller.signal), 60_000);
        return () => {
            controller.abort();
            window.clearInterval(timer);
        };
    }, [load]);

    const geometry = useMemo(() => {
        if (!candles || candles.length < 2) return null;

        const innerW = W - PAD_L - PAD_R;
        const step = innerW / candles.length;
        const bodyW = Math.max(1, step * 0.62);

        const lows = candles.map((c) => c.l);
        const highs = candles.map((c) => c.h);
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        const pad = (max - min) * 0.08 || max * 0.01;

        const y = scaleLinear()
            .domain([min - pad, max + pad])
            .range([PRICE_BOTTOM, PRICE_TOP]);

        const maxVolume = Math.max(...candles.map((c) => c.v)) || 1;
        const volY = scaleLinear().domain([0, maxVolume]).range([VOL_BOTTOM, VOL_BOTTOM - VOL_H]);

        const emaValues = ema(candles.map((c) => c.c), 20);
        const emaLine = shapeLine<(number | null)>()
            .defined((d) => d !== null)
            .x((_, i) => PAD_L + i * step + step / 2)
            .y((d) => y(d as number))(emaValues);

        const last = candles[candles.length - 1];
        const first = candles[0];
        const priceTicks = y.ticks(4);

        return { step, bodyW, y, volY, emaLine, last, first, priceTicks, innerW };
    }, [candles]);

    // one-time entrance: candles fade in, EMA draws itself
    useEffect(() => {
        if (!geometry || drawn.current || !svgRef.current) return;
        drawn.current = true;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const root = svgRef.current;
        createTimeline({ defaults: { duration: 760, ease: EASE } })
            .add(root.querySelectorAll('[data-candle]'), { opacity: [0, 1], delay: stagger(4) }, 0)
            .add(root.querySelectorAll('[data-volume]'), { opacity: [0, 1], delay: stagger(4) }, 120)
            .add(
                svg.createDrawable(root.querySelector('[data-ema]')!),
                { draw: ['0 0', '0 1'], duration: 1400 },
                200,
            )
            .add(root.querySelectorAll('[data-last]'), { opacity: [0, 1], translateX: [-12, 0] }, 900);
    }, [geometry]);

    const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
        if (!geometry || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * W;
        const idx = Math.round((x - PAD_L - geometry.step / 2) / geometry.step);
        setHover(idx >= 0 && idx < candles!.length ? idx : null);
    };

    const readout = candles && geometry
        ? hover !== null
            ? candles[hover]
            : geometry.last
        : null;

    const change = candles && geometry ? pctChange(candles[0].c, candles[candles.length - 1].c) : 0;

    return (
        <figure className={`flex flex-col gap-3 ${className}`}>
            <div className="shot">
                <div className="shot-bar">
                    <span className="shot-url">{symbol}</span>
                    <span>1h candles · EMA 20 · Binance public klines</span>
                </div>

                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    role="img"
                    aria-label={
                        candles
                            ? `${symbol} ${interval} candlestick chart, ${candles.length} bars, last price ${formatPrice(geometry!.last.c)} dollars`
                            : `${symbol} price chart loading`
                    }
                    className="w-full"
                    onPointerMove={onPointerMove}
                    onPointerLeave={() => setHover(null)}
                >
                    <title>{`${symbol} ${interval} candles from Binance`}</title>

                    {/* price grid */}
                    {geometry?.priceTicks.map((tick) => (
                        <g key={tick}>
                            <line
                                x1={PAD_L}
                                x2={W - PAD_R + 8}
                                y1={geometry.y(tick)}
                                y2={geometry.y(tick)}
                                stroke="var(--color-line)"
                                strokeWidth={1}
                            />
                            <text
                                x={W - PAD_R + 14}
                                y={geometry.y(tick) + 4}
                                className="mono"
                                fontSize={12}
                                fill="var(--color-muted)"
                            >
                                {formatPrice(tick)}
                            </text>
                        </g>
                    ))}

                    {/* volume panel */}
                    <line
                        x1={PAD_L}
                        x2={W - PAD_R + 8}
                        y1={VOL_TOP - 8}
                        y2={VOL_TOP - 8}
                        stroke="var(--color-line)"
                        strokeWidth={1}
                    />
                    <text x={PAD_L} y={VOL_TOP - 14} className="mono" fontSize={11} fill="var(--color-muted)">
                        VOLUME
                    </text>

                    {/* candles + volume */}
                    {candles?.map((c, i) => {
                        const x = PAD_L + i * geometry!.step + geometry!.step / 2;
                        const up = c.c >= c.o;
                        const color = up ? UP : DOWN;
                        const top = geometry!.y(Math.max(c.o, c.c));
                        const bottom = geometry!.y(Math.min(c.o, c.c));
                        const volHeight = VOL_BOTTOM - geometry!.volY(c.v);
                        return (
                            <g key={c.t} data-candle={up ? 'up' : 'down'}>
                                <line
                                    x1={x}
                                    x2={x}
                                    y1={geometry!.y(c.h)}
                                    y2={geometry!.y(c.l)}
                                    stroke={color}
                                    strokeWidth={1}
                                />
                                <rect
                                    x={x - geometry!.bodyW / 2}
                                    y={top}
                                    width={geometry!.bodyW}
                                    height={Math.max(1, bottom - top)}
                                    fill={color}
                                />
                                <rect
                                    data-volume={1}
                                    x={x - geometry!.bodyW / 2}
                                    y={VOL_BOTTOM - volHeight}
                                    width={geometry!.bodyW}
                                    height={Math.max(1, volHeight)}
                                    fill={color}
                                    opacity={0.28}
                                />
                            </g>
                        );
                    })}

                    {/* EMA overlay */}
                    {geometry?.emaLine && (
                        <path
                            data-ema
                            d={geometry.emaLine}
                            fill="none"
                            stroke="var(--color-ink)"
                            strokeWidth={1.5}
                            strokeLinejoin="round"
                            opacity={0.85}
                        />
                    )}

                    {/* last price */}
                    {geometry && (
                        <g data-last>
                            <line
                                x1={PAD_L}
                                x2={W - PAD_R + 8}
                                y1={geometry.y(geometry.last.c)}
                                y2={geometry.y(geometry.last.c)}
                                stroke="var(--color-accent)"
                                strokeWidth={1}
                                strokeDasharray="3 4"
                            />
                            <rect
                                x={W - PAD_R + 8}
                                y={geometry.y(geometry.last.c) - 11}
                                width={PAD_R - 16}
                                height={22}
                                fill="var(--color-accent)"
                            />
                            <text
                                x={W - PAD_R + 14}
                                y={geometry.y(geometry.last.c) + 4}
                                className="mono"
                                fontSize={12}
                                fontWeight={600}
                                fill="#04120c"
                            >
                                {formatPrice(geometry.last.c)}
                            </text>
                        </g>
                    )}

                    {/* time axis */}
                    {candles?.map((c, i) =>
                        geometry && i % 24 === 0 ? (
                            <text
                                key={`t-${c.t}`}
                                x={PAD_L + i * geometry.step + geometry.step / 2}
                                y={VOL_BOTTOM + 18}
                                className="mono"
                                fontSize={11}
                                fill="var(--color-muted)"
                                textAnchor="middle"
                            >
                                {formatDay(c.t)} {formatClock(c.t)}
                            </text>
                        ) : null,
                    )}

                    {/* crosshair */}
                    {hover !== null && geometry && candles && (
                        <g>
                            <line
                                x1={PAD_L + hover * geometry.step + geometry.step / 2}
                                x2={PAD_L + hover * geometry.step + geometry.step / 2}
                                y1={PRICE_TOP}
                                y2={VOL_BOTTOM}
                                stroke="var(--color-line-strong)"
                                strokeWidth={1}
                            />
                            <circle
                                cx={PAD_L + hover * geometry.step + geometry.step / 2}
                                cy={geometry.y(candles[hover].c)}
                                r={3}
                                fill="var(--color-ink)"
                            />
                        </g>
                    )}

                    {/* hover readout, top-left */}
                    {readout && (
                        <text x={PAD_L + 4} y={PRICE_TOP + 4} className="mono" fontSize={12} fill="var(--color-ink)">
                            {`O ${formatPrice(readout.o)}  H ${formatPrice(readout.h)}  L ${formatPrice(readout.l)}  C ${formatPrice(readout.c)}  V ${readout.v.toFixed(1)}`}
                        </text>
                    )}
                </svg>
            </div>

            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="mono text-sm text-[var(--color-muted)]">
                    {status === 'loading' && 'loading live klines…'}
                    {status === 'error' && 'live feed unavailable, showing nothing rather than inventing data'}
                    {status === 'ready' && geometry && (
                        <span className="text-[var(--color-ink)]">
                            {formatPrice(geometry.last.c)}{' '}
                            <span className={change >= 0 ? 'text-[var(--color-accent)]' : 'text-[#c4544a]'}>
                                {change >= 0 ? '+' : ''}
                                {change.toFixed(2)}%
                            </span>{' '}
                            <span>over {candles!.length} bars</span>
                        </span>
                    )}
                </span>
                <span className="mono text-xs text-[var(--color-muted)]">
                    {updatedAt ? `updated ${updatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
                    {' · '}public data, not investment advice
                </span>
            </figcaption>
        </figure>
    );
};

export default LiveCandles;