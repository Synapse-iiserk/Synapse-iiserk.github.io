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
import { useVisibleInterval } from '../../lib/useVisibleInterval';
import { readKlines, writeKlines } from '../../lib/klineCache';

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

const INTERVALS = [
    { id: '1h', label: '1h' },
    { id: '4h', label: '4h' },
    { id: '1d', label: '1d' },
] as const;

type Status = 'loading' | 'ready' | 'stale' | 'error';

interface LiveCandlesProps {
    symbol?: string;
    limit?: number;
    className?: string;
}

/**
 * Live candlestick chart: Binance public klines, EMA(20) overlay, volume
 * histogram, crosshair readout. Plain SVG, drawn with anime.js on first
 * paint, then updated in place. On a feed failure it shows the last good
 * bars, clearly labelled, rather than inventing data or blanking out.
 */
export const LiveCandles: React.FC<LiveCandlesProps> = ({ symbol = 'BTCUSDT', limit = 168, className = '' }) => {
    const [interval, setInterval] = useState<(typeof INTERVALS)[number]['id']>('1h');
    const [candles, setCandles] = useState<Candle[] | null>(null);
    const [status, setStatus] = useState<Status>('loading');
    const [staleAt, setStaleAt] = useState<number | null>(null);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [hover, setHover] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const animatedKey = useRef<string | null>(null);
    const failedRef = useRef(false);
    const [failed, setFailed] = useState(false);

    const load = useCallback(async () => {
        try {
            const rows = await fetchKlines(symbol, interval, limit);
            if (rows.length < 2) throw new Error('series too short');
            setCandles(rows);
            setStatus('ready');
            setStaleAt(null);
            setUpdatedAt(new Date());
            writeKlines('candles', symbol, interval, rows);
            failedRef.current = false;
            setFailed(false);
        } catch {
            failedRef.current = true;
            setFailed(true);
            const cached = readKlines('candles', symbol, interval);
            if (cached?.data?.length) {
                setCandles(cached.data);
                setStatus('stale');
                setStaleAt(cached.savedAt);
            } else {
                setStatus('error');
            }
        }
    }, [symbol, interval, limit]);

    // reset the series when the interval changes, then let the loop fetch it
    useEffect(() => {
        setCandles(null);
        setStatus('loading');
        setHover(null);
        const cached = readKlines('candles', symbol, interval);
        if (cached?.data?.length) {
            setCandles(cached.data);
            setStatus('stale');
            setStaleAt(cached.savedAt);
        }
    }, [symbol, interval]);

    useVisibleInterval(load, {
        delay: interval === '1h' ? 60_000 : 120_000,
        failed,
        resetKey: `${symbol}:${interval}`,
    });

    const geometry = useMemo(() => {
        if (!candles || candles.length < 2) return null;

        const innerW = W - PAD_L - PAD_R;
        const step = innerW / candles.length;
        const bodyW = Math.max(1, step * 0.62);

        const min = Math.min(...candles.map((c) => c.l));
        const max = Math.max(...candles.map((c) => c.h));
        const pad = (max - min) * 0.08 || max * 0.01;

        const y = scaleLinear().domain([min - pad, max + pad]).range([PRICE_BOTTOM, PRICE_TOP]);
        const maxVolume = Math.max(...candles.map((c) => c.v)) || 1;
        const volY = scaleLinear().domain([0, maxVolume]).range([VOL_BOTTOM, VOL_BOTTOM - VOL_H]);

        const emaLine = shapeLine<(number | null)>()
            .defined((d) => d !== null)
            .x((_, i) => PAD_L + i * step + step / 2)
            .y((d) => y(d as number))(ema(candles.map((c) => c.c), 20));

        return {
            step,
            bodyW,
            y,
            volY,
            emaLine,
            last: candles[candles.length - 1],
            first: candles[0],
            priceTicks: y.ticks(4),
            maxVolume,
        };
    }, [candles]);

    // one entrance per series: candles fade up, the EMA line draws itself
    useEffect(() => {
        if (!geometry || !svgRef.current) return;
        const key = `${symbol}:${interval}`;
        if (animatedKey.current === key) return;
        animatedKey.current = key;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const root = svgRef.current;

        createTimeline({ defaults: { duration: 760, ease: EASE } })
            .add(root.querySelectorAll('[data-candle]'), { opacity: [0, 1], delay: stagger(4) }, 0)
            .add(root.querySelectorAll('[data-volume]'), { opacity: [0, 1], delay: stagger(4) }, 120)
            .add(svg.createDrawable(root.querySelector('[data-ema]')!), { draw: ['0 0', '0 1'], duration: 1400 }, 200)
            .add(root.querySelectorAll('[data-last]'), { opacity: [0, 1], translateX: [-12, 0] }, 900);
    }, [geometry, symbol, interval]);

    const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
        if (!geometry) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * W;
        const idx = Math.round((x - PAD_L - geometry.step / 2) / geometry.step);
        setHover(idx >= 0 && idx < candles!.length ? idx : null);
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        const index = INTERVALS.findIndex((i) => i.id === interval);
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            const next = (index + 1) % INTERVALS.length;
            setInterval(INTERVALS[next].id);
            document.getElementById(`chart-tab-${INTERVALS[next].id}`)?.focus();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            const prev = (index - 1 + INTERVALS.length) % INTERVALS.length;
            setInterval(INTERVALS[prev].id);
            document.getElementById(`chart-tab-${INTERVALS[prev].id}`)?.focus();
        }
    };

    const readout = candles && geometry ? (hover !== null ? candles[hover] : geometry.last) : null;
    const change = candles && geometry ? pctChange(candles[0].c, candles[candles.length - 1].c) : 0;

    const summary = candles && geometry
        ? `${symbol} ${interval} candlestick chart, ${candles.length} bars, last price ${formatPrice(geometry.last.c)} dollars, ${change >= 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(2)} percent over the window. Source: Binance public klines.`
        : `${symbol} price chart, ${status === 'error' ? 'feed unavailable' : 'loading'}.`;

    return (
        <figure className={`flex flex-col gap-3 ${className}`}>
            <div className="shot">
                <div className="shot-bar">
                    <span className="shot-url">{symbol}</span>
                    <div role="tablist" aria-label="Chart interval" onKeyDown={onKeyDown} className="flex">
                        {INTERVALS.map((option) => (
                            <button
                                key={option.id}
                                id={`chart-tab-${option.id}`}
                                role="tab"
                                type="button"
                                aria-selected={interval === option.id}
                                tabIndex={interval === option.id ? 0 : -1}
                                onClick={() => setInterval(option.id)}
                                className={`px-2 py-0.5 text-[11px] transition-colors ${
                                    interval === option.id
                                        ? 'text-[var(--color-accent)]'
                                        : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <span className="hidden sm:inline">
                        {status === 'stale' ? 'cached · ' : ''}EMA 20 · Binance public klines
                    </span>
                </div>

                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    role="img"
                    aria-label={summary}
                    className="w-full"
                    onPointerMove={onPointerMove}
                    onPointerLeave={() => setHover(null)}
                >
                    <title>{summary}</title>

                    {geometry?.priceTicks
                        .filter((tick) => Math.abs(geometry.y(tick) - geometry.y(geometry.last.c)) > 13)
                        .map((tick) => (
                        <g key={tick}>
                            <line
                                x1={PAD_L}
                                x2={W - PAD_R + 8}
                                y1={geometry.y(tick)}
                                y2={geometry.y(tick)}
                                stroke="var(--color-line)"
                                strokeWidth={1}
                                shapeRendering="crispEdges"
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

                    <line
                        x1={PAD_L}
                        x2={W - PAD_R + 8}
                        y1={VOL_TOP - 8}
                        y2={VOL_TOP - 8}
                        stroke="var(--color-line)"
                        strokeWidth={1}
                        shapeRendering="crispEdges"
                    />
                    <text x={PAD_L} y={VOL_TOP - 14} className="mono" fontSize={11} fill="var(--color-muted)">
                        VOLUME
                    </text>
                    {geometry && (
                        <text
                            x={W - PAD_R + 14}
                            y={VOL_TOP - 14}
                            className="mono"
                            fontSize={11}
                            fill="var(--color-muted)"
                        >
                            max {geometry.maxVolume.toFixed(0)}
                        </text>
                    )}

                    {status === 'error' && (
                        <g>
                            <text
                                x={W / 2}
                                y={PRICE_TOP + PRICE_H / 2}
                                className="mono"
                                fontSize={13}
                                fill="var(--color-muted)"
                                textAnchor="middle"
                            >
                                live feed unavailable, no bars to draw
                            </text>
                            <text
                                x={W / 2}
                                y={PRICE_TOP + PRICE_H / 2 + 22}
                                className="mono"
                                fontSize={12}
                                fill="var(--color-line-strong)"
                                textAnchor="middle"
                            >
                                retry below, or come back when the exchange answers
                            </text>
                        </g>
                    )}

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

                    {candles?.map((c, i) => {
                        if (!geometry || i % 24 !== 0) return null;
                        const isFirst = i === 0;
                        const isLast = i + 24 > candles.length - 1;
                        return (
                            <text
                                key={`t-${c.t}`}
                                x={PAD_L + i * geometry.step + geometry.step / 2}
                                y={VOL_BOTTOM + 18}
                                className="mono"
                                fontSize={11}
                                fill="var(--color-muted)"
                                textAnchor={isFirst ? 'start' : isLast ? 'end' : 'middle'}
                            >
                                {formatDay(c.t)} {formatClock(c.t)}
                            </text>
                        );
                    })}

                    {/* crosshair with a price label on the axis */}
                    {hover !== null && geometry && candles && (
                        <g>
                            <line
                                x1={PAD_L + hover * geometry.step + geometry.step / 2}
                                x2={PAD_L + hover * geometry.step + geometry.step / 2}
                                y1={PRICE_TOP}
                                y2={VOL_BOTTOM}
                                stroke="var(--color-line-strong)"
                                strokeWidth={1}
                                shapeRendering="crispEdges"
                            />
                            <line
                                x1={PAD_L}
                                x2={W - PAD_R + 8}
                                y1={geometry.y(candles[hover].c)}
                                y2={geometry.y(candles[hover].c)}
                                stroke="var(--color-line-strong)"
                                strokeWidth={1}
                                strokeDasharray="2 3"
                                shapeRendering="crispEdges"
                            />
                            <rect
                                x={W - PAD_R + 8}
                                y={geometry.y(candles[hover].c) - 11}
                                width={PAD_R - 16}
                                height={22}
                                fill="var(--color-surface)"
                                stroke="var(--color-line-strong)"
                            />
                            <text
                                x={W - PAD_R + 14}
                                y={geometry.y(candles[hover].c) + 4}
                                className="mono"
                                fontSize={12}
                                fill="var(--color-ink)"
                            >
                                {formatPrice(candles[hover].c)}
                            </text>
                            <circle
                                cx={PAD_L + hover * geometry.step + geometry.step / 2}
                                cy={geometry.y(candles[hover].c)}
                                r={3}
                                fill="var(--color-ink)"
                            />
                        </g>
                    )}

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
                    {status === 'error' && (
                        <button type="button" onClick={() => void load()} className="link">
                            live feed unavailable, retry
                        </button>
                    )}
                    {(status === 'ready' || status === 'stale') && geometry && (
                        <span className="text-[var(--color-ink)]">
                            {formatPrice(geometry.last.c)}
                            <span
                                className={change >= 0 ? 'text-[var(--color-accent)]' : 'text-[#c4544a]'}
                            >
                                {'  '}
                                {change >= 0 ? '+' : ''}
                                {change.toFixed(2)}%
                            </span>{' '}
                            <span>over {candles!.length} {interval} bars</span>
                        </span>
                    )}
                </span>
                <span className="mono text-xs text-[var(--color-muted)]">
                    {status === 'stale' && staleAt
                        ? `cached ${new Date(staleAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · `
                        : ''}
                    {updatedAt
                        ? `updated ${updatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                        : 'public data, not investment advice'}
                    {status === 'ready' && ' · public data, not investment advice'}
                </span>
            </figcaption>
        </figure>
    );
};

export default LiveCandles;