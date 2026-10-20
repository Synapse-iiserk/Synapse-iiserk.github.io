import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { area as shapeArea, line as shapeLine } from 'd3-shape';
import { createTimeline, stagger, svg } from 'animejs';
import {
    bollinger,
    ema,
    fetchKlines,
    formatClock,
    formatDay,
    formatPrice,
    pctChange,
    subscribeKlines,
    type Band,
    type Candle,
    type StreamState,
} from '../../lib/market';
import { useVisibleInterval } from '../../lib/useVisibleInterval';
import { useNarrow } from '../../lib/useNarrow';
import { readKlines, writeKlines } from '../../lib/klineCache';
import { EASE, EASE_BACK, reducedMotion, useInViewOnce, usePageVisible, useScramble, useTween } from '../../lib/motion';

const UP = '#10B981';
const DOWN = '#C4544A';

/* drawing width: narrower on phones so the 11-12 unit labels render at a
   legible size instead of being scaled down to a ~4px strip */
const W_WIDE = 1000;
const W_NARROW = 600;
const H = 420;
const PAD_L = 10;
const PAD_R = 76;
const PRICE_TOP = 30;
const PRICE_H = 282;
const PRICE_BOTTOM = PRICE_TOP + PRICE_H;
const VOL_TOP = PRICE_BOTTOM + 26;
const VOL_H = 64;
const VOL_BOTTOM = VOL_TOP + VOL_H;
/** half the rendered width of a "13 Oct 14:30" axis label at 11px mono */
const AXIS_LABEL_HALF = 42;
/** live frames arrive several times a second; the chart redraws at most this often */
const FLUSH_MS = 250;
/** how long the entrance scan line takes to cross the plot */
const SWEEP_MS = 1100;

const SYMBOLS = [
    { id: 'BTCUSDT', label: 'BTC' },
    { id: 'ETHUSDT', label: 'ETH' },
    { id: 'SOLUSDT', label: 'SOL' },
] as const;

const INTERVALS = [
    { id: '1h', label: '1h' },
    { id: '4h', label: '4h' },
    { id: '1d', label: '1d' },
] as const;

type SymbolId = (typeof SYMBOLS)[number]['id'];
type IntervalId = (typeof INTERVALS)[number]['id'];
type Status = 'loading' | 'ready' | 'stale' | 'error';
/** bars tagged with the series they belong to, so a switch never draws the old market */
type Series = { key: string; rows: Candle[] };

interface LiveCandlesProps {
    symbol?: SymbolId;
    limit?: number;
    className?: string;
}

/** A roving-focus tab strip: one tab stop, arrow keys move and select. */
function Segments<T extends string>({
    label,
    idPrefix,
    options,
    value,
    onChange,
}: {
    label: string;
    idPrefix: string;
    options: readonly { id: T; label: string }[];
    value: T;
    onChange: (next: T) => void;
}) {
    const onKeyDown = (event: React.KeyboardEvent) => {
        const index = options.findIndex((o) => o.id === value);
        const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
        const back = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
        if (!forward && !back) return;
        event.preventDefault();
        const next = options[(index + (forward ? 1 : -1) + options.length) % options.length];
        onChange(next.id);
        document.getElementById(`${idPrefix}-${next.id}`)?.focus();
    };

    return (
        <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex">
            {options.map((option) => {
                const selected = option.id === value;
                return (
                    <button
                        key={option.id}
                        id={`${idPrefix}-${option.id}`}
                        role="tab"
                        type="button"
                        aria-selected={selected}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => onChange(option.id)}
                        className={`seg px-2 py-0.5 text-[11px] ${
                            selected ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

/**
 * Live candlestick chart. Binance public klines for history, then the public
 * kline WebSocket for the open bar, so the last candle moves as trades print.
 * EMA(20) and Bollinger(20, 2) overlays, volume, crosshair readout. Plain SVG;
 * anime.js sweeps each new series in. On a feed failure it shows the last
 * good bars, labelled, rather than inventing data or blanking out.
 */
export const LiveCandles: React.FC<LiveCandlesProps> = ({ symbol: initialSymbol = 'BTCUSDT', limit = 168, className = '' }) => {
    const [symbol, setSymbol] = useState<SymbolId>(initialSymbol);
    const [interval, setInterval] = useState<IntervalId>('1h');
    const [series, setSeries] = useState<Series | null>(null);
    const [status, setStatus] = useState<Status>('loading');
    const [staleAt, setStaleAt] = useState<number | null>(null);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [hover, setHover] = useState<number | null>(null);
    const [stream, setStream] = useState<StreamState>('connecting');
    const [overlays, setOverlays] = useState({ ema: true, bb: true });
    const [tick, setTick] = useState<{ dir: 'up' | 'down'; n: number } | null>(null);
    const [failed, setFailed] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const inView = useInViewOnce(svgRef);
    const narrow = useNarrow();
    const visible = usePageVisible();
    const W = narrow ? W_NARROW : W_WIDE;
    const tickEvery = narrow ? 48 : 24;
    const seriesKey = `${symbol}:${interval}`;
    const candles = series?.key === seriesKey ? series.rows : null;

    const load = useCallback(async () => {
        const key = `${symbol}:${interval}`;
        try {
            const rows = await fetchKlines(symbol, interval, limit);
            if (rows.length < 2) throw new Error('series too short');
            setSeries({ key, rows });
            setStatus('ready');
            setStaleAt(null);
            setUpdatedAt(new Date());
            writeKlines('candles', symbol, interval, rows);
            setFailed(false);
        } catch {
            setFailed(true);
            const cached = readKlines('candles', symbol, interval);
            if (cached?.data?.length) {
                setSeries({ key, rows: cached.data });
                setStatus('stale');
                setStaleAt(cached.savedAt);
            } else {
                setStatus('error');
            }
        }
    }, [symbol, interval, limit]);

    // on a switch, draw the cached bars for the new market straight away if there are any
    useEffect(() => {
        setStatus('loading');
        setHover(null);
        setTick(null);
        const cached = readKlines('candles', symbol, interval);
        if (cached?.data?.length) {
            setSeries({ key: `${symbol}:${interval}`, rows: cached.data });
            setStatus('stale');
            setStaleAt(cached.savedAt);
        }
    }, [symbol, interval]);

    // REST keeps history honest; while the stream is up it only needs to heal gaps
    useVisibleInterval(load, {
        delay: stream === 'live' ? 5 * 60_000 : interval === '1h' ? 60_000 : 120_000,
        failed,
        resetKey: seriesKey,
    });

    // the open bar, live: frames are buffered and merged at most every FLUSH_MS
    useEffect(() => {
        if (!visible) return;
        const key = `${symbol}:${interval}`;
        let pending: Candle | null = null;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const flush = () => {
            timer = undefined;
            const bar = pending;
            pending = null;
            if (!bar) return;
            setSeries((prev) => {
                if (!prev || prev.key !== key || !prev.rows.length) return prev;
                const last = prev.rows[prev.rows.length - 1];
                if (bar.t < last.t) return prev;
                if (bar.c !== last.c) setTick((t) => ({ dir: bar.c > last.c ? 'up' : 'down', n: (t?.n ?? 0) + 1 }));
                const rows = bar.t === last.t ? [...prev.rows.slice(0, -1), bar] : [...prev.rows.slice(1), bar];
                return { key, rows };
            });
            setUpdatedAt(new Date());
        };

        const close = subscribeKlines(
            symbol,
            interval,
            (bar) => {
                pending = bar;
                if (!timer) timer = setTimeout(flush, FLUSH_MS);
            },
            setStream,
        );
        return () => {
            close();
            clearTimeout(timer);
        };
    }, [symbol, interval, visible]);

    const geometry = useMemo(() => {
        if (!candles || candles.length < 2) return null;

        const innerW = W - PAD_L - PAD_R;
        const step = innerW / candles.length;
        const bodyW = Math.max(1, step * 0.62);
        const cx = (i: number) => PAD_L + i * step + step / 2;

        const closes = candles.map((c) => c.c);
        const bands = bollinger(closes, 20, 2);
        const lows = candles.map((c) => c.l);
        const highs = candles.map((c) => c.h);
        if (overlays.bb) {
            for (const b of bands) {
                if (b) {
                    lows.push(b.lower);
                    highs.push(b.upper);
                }
            }
        }
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        const pad = (max - min) * 0.06 || max * 0.01;

        const y = scaleLinear().domain([min - pad, max + pad]).range([PRICE_BOTTOM, PRICE_TOP]);
        const maxVolume = Math.max(...candles.map((c) => c.v)) || 1;
        const volY = scaleLinear().domain([0, maxVolume]).range([VOL_BOTTOM, VOL_BOTTOM - VOL_H]);

        const emaLine = shapeLine<number | null>()
            .defined((d) => d !== null)
            .x((_, i) => cx(i))
            .y((d) => y(d as number))(ema(closes, 20));

        const bandDefined = (b: Band | null) => b !== null;
        const bbArea = shapeArea<Band | null>()
            .defined(bandDefined)
            .x((_, i) => cx(i))
            .y0((b) => y(b!.lower))
            .y1((b) => y(b!.upper))(bands);
        const bbUpper = shapeLine<Band | null>().defined(bandDefined).x((_, i) => cx(i)).y((b) => y(b!.upper))(bands);
        const bbLower = shapeLine<Band | null>().defined(bandDefined).x((_, i) => cx(i)).y((b) => y(b!.lower))(bands);

        return {
            step,
            bodyW,
            cx,
            y,
            volY,
            emaLine,
            bbArea,
            bbUpper,
            bbLower,
            last: candles[candles.length - 1],
            priceTicks: y.ticks(4),
            maxVolume,
        };
    }, [candles, W, overlays.bb]);

    // the entrance waits until the chart is on screen, then plays once per series
    const drawnKey = geometry && inView ? series?.key : undefined;

    /*
     * Entrance, once per series: gridlines extend, a scan line sweeps left to
     * right and each candle springs out of its own centre as the line passes,
     * volume rises from the floor, the overlays draw in behind it and the
     * price tag lands last.
     */
    useLayoutEffect(() => {
        const root = svgRef.current;
        if (!drawnKey || !root || reducedMotion()) return;
        const candleEls = root.querySelectorAll('[data-candle]');
        const each = SWEEP_MS / Math.max(1, candleEls.length);

        const bbArea = root.querySelector('[data-bb-area]');
        const bbLines = Array.from(root.querySelectorAll<SVGGeometryElement>('[data-bb-line]')).map((l) => svg.createDrawable(l));
        const emaPath = root.querySelector<SVGGeometryElement>('[data-ema]');
        const ema = emaPath ? svg.createDrawable(emaPath) : null;
        const lastTag = root.querySelector('[data-last]');

        const tl = createTimeline({ defaults: { ease: EASE } });
        // every layer starts hidden at once, not only when its own turn comes
        tl.set(candleEls, { scaleY: 0, opacity: 0 }, 0)
            .set(root.querySelectorAll('[data-volume]'), { scaleY: 0 }, 0)
            .set(root.querySelectorAll('[data-grid]'), { scaleX: 0 }, 0);
        if (bbArea) tl.set(bbArea, { opacity: 0 }, 0);
        if (bbLines.length) tl.set(bbLines, { draw: '0 0' }, 0);
        if (ema) tl.set(ema, { draw: '0 0' }, 0);
        if (lastTag) tl.set(lastTag, { opacity: 0 }, 0);

        tl.add(root.querySelectorAll('[data-grid]'), { scaleX: [0, 1], duration: 900, delay: stagger(70) }, 0)
            .add(
                root.querySelector('[data-scan]')!,
                { opacity: [0, 0.9, 0.9, 0], translateX: [0, W - PAD_L - PAD_R], duration: SWEEP_MS + 200, ease: 'linear' },
                0,
            )
            .add(candleEls, { scaleY: [0, 1], opacity: [0, 1], duration: 520, ease: EASE_BACK, delay: stagger(each) }, 60)
            .add(root.querySelectorAll('[data-volume]'), { scaleY: [0, 1], duration: 600, delay: stagger(each) }, 160);

        if (bbArea) tl.add(bbArea, { opacity: [0, 0.06], duration: 900 }, 700);
        if (bbLines.length) tl.add(bbLines, { draw: ['0 0', '0 1'], duration: 1300 }, 400);
        if (ema) tl.add(ema, { draw: ['0 0', '0 1'], duration: 1500 }, 250);
        if (lastTag) tl.add(lastTag, { opacity: [0, 1], translateX: [48, 0], duration: 700, ease: EASE_BACK }, SWEEP_MS);

        // a finished entrance leaves nothing behind, so live updates draw on clean nodes
        // paint the first frame now, before the browser shows the finished chart
        tl.seek(0);

        return () => {
            tl.revert();
        };
    }, [drawnKey, W]);

    const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
        if (!geometry || !candles) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * W;
        const idx = Math.round((x - PAD_L - geometry.step / 2) / geometry.step);
        setHover(idx >= 0 && idx < candles.length ? idx : null);
    };

    /**
     * Keyboard access to the series. The crosshair is otherwise pointer-only,
     * which leaves the data unreadable without a mouse: arrows step one bar,
     * PageUp/PageDown jump 24 bars, Home/End go to the ends, Escape releases.
     */
    const onDataKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
        if (!geometry || !candles || candles.length === 0) return;
        if (event.key === 'Escape') {
            setHover(null);
            return;
        }
        const last = candles.length - 1;
        const current = hover ?? last;
        const moves: Record<string, number> = {
            ArrowRight: Math.min(current + 1, last),
            ArrowLeft: Math.max(current - 1, 0),
            PageUp: Math.min(current + 24, last),
            PageDown: Math.max(current - 24, 0),
            Home: 0,
            End: last,
        };
        if (!(event.key in moves)) return;
        event.preventDefault();
        setHover(moves[event.key]);
    };

    const lastClose = geometry?.last.c ?? 0;
    const shownPrice = useTween(lastClose, 380);
    const tagY = geometry ? geometry.y(lastClose) : 0;
    const captionPrice = useScramble(geometry ? formatPrice(lastClose) : '', drawnKey ?? '', 800, 300);

    const readout = candles && geometry ? (hover !== null ? candles[hover] : geometry.last) : null;
    const change = candles && geometry ? pctChange(candles[0].c, candles[candles.length - 1].c) : 0;
    const live = stream === 'live' && status !== 'error';
    const symbolLabel = SYMBOLS.find((s) => s.id === symbol)?.label;

    const focused = hover !== null && candles ? candles[hover] : null;
    const announcement = focused
        ? `${formatDay(focused.t)} ${formatClock(focused.t)}, open ${formatPrice(focused.o)}, high ${formatPrice(focused.h)}, low ${formatPrice(focused.l)}, close ${formatPrice(focused.c)}, bar ${hover! + 1} of ${candles!.length}`
        : '';

    const summary =
        candles && geometry
            ? `${symbol} ${interval} candlestick chart, ${candles.length} bars, last price ${formatPrice(geometry.last.c)} dollars, ${change >= 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(2)} percent over the window. Source: Binance public klines${live ? ', streaming live' : ''}.`
            : `${symbol} price chart, ${status === 'error' ? 'feed unavailable' : 'loading'}.`;

    const toggle = (key: keyof typeof overlays) => setOverlays((o) => ({ ...o, [key]: !o[key] }));

    return (
        <figure className={`flex flex-col gap-3 ${className}`}>
            <div className="shot">
                <div className="shot-bar flex-wrap gap-y-1">
                    <div className="flex items-center gap-3">
                        <Segments label="Market" idPrefix="chart-sym" options={SYMBOLS} value={symbol} onChange={setSymbol} />
                        <span className="h-3 w-px bg-[var(--color-line-strong)]" aria-hidden="true" />
                        <Segments label="Chart interval" idPrefix="chart-tab" options={INTERVALS} value={interval} onChange={setInterval} />
                    </div>
                    <div className="flex items-center gap-3">
                        {(['ema', 'bb'] as const).map((key) => (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={overlays[key]}
                                onClick={() => toggle(key)}
                                className={`seg text-[11px] ${
                                    overlays[key] ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)] line-through'
                                }`}
                            >
                                {key === 'ema' ? 'EMA 20' : 'BB 20,2'}
                            </button>
                        ))}
                        <span className="flex items-center gap-1.5">
                            <span className={`live-dot ${live ? 'is-live' : ''}`} aria-hidden="true" />
                            {status === 'stale' && !live ? 'cached' : live ? 'live' : stream === 'connecting' ? 'connecting' : 'polling'}
                        </span>
                    </div>
                </div>

                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    role="img"
                    aria-label={summary}
                    aria-describedby={geometry ? 'candles-keys' : undefined}
                    tabIndex={geometry ? 0 : -1}
                    className={`chart-svg w-full ${geometry && !drawnKey && !reducedMotion() ? 'awaiting' : ''}`}
                    onPointerMove={onPointerMove}
                    onPointerLeave={() => setHover(null)}
                    onKeyDown={onDataKeyDown}
                    onBlur={() => setHover(null)}
                >
                    <title>{summary}</title>

                    {geometry?.priceTicks
                        .filter((t) => Math.abs(geometry.y(t) - tagY) > 13)
                        .map((t) => (
                            <g key={t}>
                                <line
                                    data-grid
                                    x1={PAD_L}
                                    x2={W - PAD_R + 8}
                                    y1={geometry.y(t)}
                                    y2={geometry.y(t)}
                                    stroke="var(--color-line)"
                                    strokeWidth={1}
                                    shapeRendering="crispEdges"
                                />
                                <text x={W - PAD_R + 14} y={geometry.y(t) + 4} className="mono" fontSize={12} fill="var(--color-muted)">
                                    {formatPrice(t)}
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
                        <text x={W - PAD_R} y={VOL_TOP - 14} className="mono" fontSize={11} fill="var(--color-muted)" textAnchor="end">
                            max{' '}
                            {geometry.maxVolume >= 1000 ? `${(geometry.maxVolume / 1000).toFixed(1)}k` : geometry.maxVolume.toFixed(0)}
                        </text>
                    )}

                    {status === 'error' && (
                        <g>
                            <text x={W / 2} y={PRICE_TOP + PRICE_H / 2} className="mono" fontSize={13} fill="var(--color-muted)" textAnchor="middle">
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

                    {overlays.bb && geometry?.bbArea && (
                        <g>
                            <path data-bb-area d={geometry.bbArea} fill="var(--color-accent)" opacity={0.06} />
                            <path data-bb-line d={geometry.bbUpper ?? ''} fill="none" stroke="var(--color-accent-dim)" strokeWidth={1} />
                            <path data-bb-line d={geometry.bbLower ?? ''} fill="none" stroke="var(--color-accent-dim)" strokeWidth={1} />
                        </g>
                    )}

                    {geometry &&
                        candles?.map((c, i) => {
                            const x = geometry.cx(i);
                            const up = c.c >= c.o;
                            const color = up ? UP : DOWN;
                            const top = geometry.y(Math.max(c.o, c.c));
                            const bottom = geometry.y(Math.min(c.o, c.c));
                            const volHeight = VOL_BOTTOM - geometry.volY(c.v);
                            const isLast = i === candles.length - 1;
                            return (
                                <g key={c.t}>
                                    <g data-candle className="candle">
                                        <line x1={x} x2={x} y1={geometry.y(c.h)} y2={geometry.y(c.l)} stroke={color} strokeWidth={1} />
                                        <rect
                                            className={isLast ? 'live-body' : undefined}
                                            x={x - geometry.bodyW / 2}
                                            y={top}
                                            width={geometry.bodyW}
                                            height={Math.max(1, bottom - top)}
                                            fill={color}
                                        />
                                    </g>
                                    <rect
                                        data-volume
                                        className={isLast ? 'vol live-body' : 'vol'}
                                        x={x - geometry.bodyW / 2}
                                        y={VOL_BOTTOM - volHeight}
                                        width={geometry.bodyW}
                                        height={Math.max(1, volHeight)}
                                        fill={color}
                                        opacity={0.28}
                                    />
                                </g>
                            );
                        })}

                    {overlays.ema && geometry?.emaLine && (
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

                    {/* leads the entrance sweep; invisible at rest */}
                    <line
                        data-scan
                        x1={PAD_L}
                        x2={PAD_L}
                        y1={PRICE_TOP - 6}
                        y2={VOL_BOTTOM}
                        stroke="var(--color-accent)"
                        strokeWidth={1.5}
                        opacity={0}
                    />

                    {geometry && candles && (
                        <g data-last>
                            {/* everything on the last price glides together when it moves */}
                            <g className="glide" style={{ transform: `translateY(${tagY}px)` }}>
                                <line
                                    x1={PAD_L}
                                    x2={W - PAD_R + 8}
                                    y1={0}
                                    y2={0}
                                    stroke="var(--color-accent)"
                                    strokeWidth={1}
                                    strokeDasharray="3 4"
                                />
                                {live && (
                                    <g transform={`translate(${geometry.cx(candles.length - 1)} 0)`}>
                                        <circle className="live-ring" r={4} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />
                                        <circle r={2.5} fill="var(--color-accent)" />
                                    </g>
                                )}
                                <rect x={W - PAD_R + 8} y={-11} width={PAD_R - 12} height={22} fill="var(--color-accent)" />
                                {tick && (
                                    <rect
                                        key={tick.n}
                                        className="tick-flash"
                                        x={W - PAD_R + 8}
                                        y={-11}
                                        width={PAD_R - 12}
                                        height={22}
                                        fill={tick.dir === 'up' ? 'var(--color-ink)' : 'var(--color-danger)'}
                                    />
                                )}
                                <text x={W - PAD_R + 13} y={4} className="mono" fontSize={12} fontWeight={600} fill="var(--color-on-accent)">
                                    {formatPrice(shownPrice)}
                                </text>
                            </g>
                        </g>
                    )}

                    {candles?.map((c, i) => {
                        // a tick every 24 bars (48 on phones), offset by half a period so neither
                        // end label sits on the plot edge; centred and clamped, so none can overlap
                        if (!geometry || i % tickEvery !== tickEvery / 2) return null;
                        return (
                            <text
                                key={`t-${c.t}`}
                                x={Math.min(Math.max(geometry.cx(i), PAD_L + AXIS_LABEL_HALF), W - PAD_R - AXIS_LABEL_HALF)}
                                y={VOL_BOTTOM + 18}
                                className="mono"
                                fontSize={11}
                                fill="var(--color-muted)"
                                textAnchor="middle"
                                opacity={hover !== null ? 0.25 : 1}
                            >
                                {formatDay(c.t)} {formatClock(c.t)}
                            </text>
                        );
                    })}

                    {/* crosshair: price label on the axis, time label on the floor */}
                    {hover !== null && geometry && candles && (
                        <g pointerEvents="none">
                            <line
                                x1={geometry.cx(hover)}
                                x2={geometry.cx(hover)}
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
                                width={PAD_R - 12}
                                height={22}
                                fill="var(--color-surface)"
                                stroke="var(--color-line-strong)"
                            />
                            <text x={W - PAD_R + 13} y={geometry.y(candles[hover].c) + 4} className="mono" fontSize={12} fill="var(--color-ink)">
                                {formatPrice(candles[hover].c)}
                            </text>
                            <rect
                                x={Math.min(Math.max(geometry.cx(hover), PAD_L + AXIS_LABEL_HALF + 6), W - PAD_R - AXIS_LABEL_HALF - 6) - AXIS_LABEL_HALF - 6}
                                y={VOL_BOTTOM + 5}
                                width={(AXIS_LABEL_HALF + 6) * 2}
                                height={18}
                                fill="var(--color-surface)"
                                stroke="var(--color-line-strong)"
                            />
                            <text
                                x={Math.min(Math.max(geometry.cx(hover), PAD_L + AXIS_LABEL_HALF + 6), W - PAD_R - AXIS_LABEL_HALF - 6)}
                                y={VOL_BOTTOM + 18}
                                className="mono"
                                fontSize={11}
                                fill="var(--color-ink)"
                                textAnchor="middle"
                            >
                                {formatDay(candles[hover].t)} {formatClock(candles[hover].t)}
                            </text>
                            <circle cx={geometry.cx(hover)} cy={geometry.y(candles[hover].c)} r={3} fill="var(--color-ink)" />
                        </g>
                    )}

                    {readout && (
                        <text x={PAD_L + 4} y={16} className="mono" fontSize={12} fill="var(--color-muted)">
                            <tspan fill="var(--color-ink)">{symbolLabel}/USDT</tspan>
                            {`   O ${formatPrice(readout.o)}  H ${formatPrice(readout.h)}  L ${formatPrice(readout.l)}  `}
                            <tspan fill={readout.c >= readout.o ? UP : 'var(--color-danger)'}>C {formatPrice(readout.c)}</tspan>
                            {narrow ? '' : `  V ${readout.v.toFixed(1)}`}
                        </text>
                    )}
                </svg>
                <p id="candles-keys" className="sr-only">
                    Use the arrow keys to step through bars, Page Up and Page Down to jump 24 bars, Home and End for the
                    first and last bar.
                </p>
                <p className="sr-only" aria-live="polite">
                    {announcement}
                </p>
            </div>

            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="mono text-sm text-[var(--color-muted)]">
                    {status === 'loading' && !geometry && 'loading live klines…'}
                    {status === 'error' && (
                        <button type="button" onClick={() => void load()} className="link">
                            live feed unavailable, retry
                        </button>
                    )}
                    {status !== 'error' && geometry && (
                        <span className="text-[var(--color-ink)]">
                            <span aria-hidden="true">{captionPrice}</span>
                            <span className="sr-only">{formatPrice(lastClose)}</span>
                            <span className={change >= 0 ? 'text-[var(--color-accent)]' : 'text-[var(--color-danger)]'}>
                                {'  '}
                                {change >= 0 ? '+' : ''}
                                {change.toFixed(2)}%
                            </span>{' '}
                            <span>
                                over {candles!.length} {interval} bars
                            </span>
                        </span>
                    )}
                </span>
                <span className="mono text-xs text-[var(--color-muted)]">
                    {status === 'stale' && staleAt && !live
                        ? `cached ${new Date(staleAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · `
                        : ''}
                    {updatedAt
                        ? `${live ? 'streaming' : 'updated'} ${updatedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                        : 'public data, not investment advice'}
                    {updatedAt && ' · public data, not investment advice'}
                </span>
            </figcaption>
        </figure>
    );
};

export default LiveCandles;
