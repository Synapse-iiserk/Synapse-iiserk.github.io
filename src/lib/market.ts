/**
 * Market data + indicator maths for the live charts.
 *
 * Source: Binance public REST klines endpoint (CORS enabled, no key required).
 * Everything here runs in the browser; nothing is faked, and when the feed
 * fails the charts say so instead of drawing invented numbers.
 */

export interface Candle {
    t: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}

const KLINES_ENDPOINT = 'https://api.binance.com/api/v3/klines';
const TICKER_ENDPOINT = 'https://api.binance.com/api/v3/ticker/24hr';

export interface Quote {
    symbol: string;
    price: number;
    changePct: number;
}

/** Live quote for the agent trace demo. Returns whatever the venue reports. */
export async function fetchQuote(symbol = 'BTCUSDT', signal?: AbortSignal): Promise<Quote> {
    const res = await fetch(`${TICKER_ENDPOINT}?symbol=${encodeURIComponent(symbol)}`, {
        signal,
        headers: { accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`ticker responded ${res.status}`);
    const body = (await res.json()) as { symbol?: string; lastPrice?: string; priceChangePercent?: string };
    if (!body.lastPrice) throw new Error('ticker returned an unexpected payload');
    return {
        symbol: body.symbol ?? symbol,
        price: +body.lastPrice,
        changePct: +(body.priceChangePercent ?? 0),
    };
}

export async function fetchKlines(
    symbol = 'BTCUSDT',
    interval = '1h',
    limit = 168,
    signal?: AbortSignal,
): Promise<Candle[]> {
    const url = `${KLINES_ENDPOINT}?symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=${limit}`;
    const res = await fetch(url, { signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`klines responded ${res.status}`);
    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) throw new Error('klines returned an unexpected payload');
    return rows.map((row) => {
        const k = row as [number, string, string, string, string, string, ...unknown[]];
        return { t: k[0], o: +k[1], h: +k[2], l: +k[3], c: +k[4], v: +k[5] };
    });
}

/** Exponential moving average, seeded with the SMA of the first `period` values. */
export function ema(values: number[], period: number): (number | null)[] {
    const out: (number | null)[] = [];
    const k = 2 / (period + 1);
    let prev: number | null = null;
    let seed = 0;

    values.forEach((v, i) => {
        if (i < period - 1) {
            seed += v;
            out.push(null);
            return;
        }
        if (prev === null) {
            prev = (seed + v) / period;
        } else {
            prev = v * k + prev * (1 - k);
        }
        out.push(prev);
    });

    return out;
}

export interface MacdResult {
    line: (number | null)[];
    signal: (number | null)[];
}

export function macd(closes: number[], fast = 12, slow = 26, signalPeriod = 9): MacdResult {
    const fastLine = ema(closes, fast);
    const slowLine = ema(closes, slow);
    const line = closes.map((_, i) =>
        fastLine[i] !== null && slowLine[i] !== null ? fastLine[i]! - slowLine[i]! : null,
    );

    const offset = line.findIndex((v) => v !== null);
    const compact = line.slice(offset < 0 ? 0 : offset).filter((v): v is number => v !== null);
    const signalCompact = ema(compact, signalPeriod);
    const signal: (number | null)[] = line.map((_, i) => {
        const idx = i - offset;
        return idx >= 0 ? signalCompact[idx] ?? null : null;
    });

    return { line, signal };
}

export interface EquityPoint {
    t: number;
    strategy: number;
    hold: number;
    position: 0 | 1;
}

/**
 * MACD(12, 26, 9) crossover, long-only, applied from the bar after the signal
 * (no look-ahead), charged `feeBps` on every position change. Buy and hold on
 * the same bars is the benchmark.
 */
export function macdEquity(candles: Candle[], feeBps = 10): EquityPoint[] {
    const closes = candles.map((c) => c.c);
    const { line, signal } = macd(closes);
    const fee = feeBps / 10_000;

    let strategy = 1;
    let hold = 1;
    let position: 0 | 1 = 0;
    const points: EquityPoint[] = [{ t: candles[0]?.t ?? 0, strategy: 1, hold: 1, position: 0 }];

    for (let i = 1; i < candles.length; i++) {
        const bar = candles[i];
        const barReturn = bar.c / bar.o;
        const next = line[i] !== null && signal[i] !== null && line[i]! > signal[i]! ? 1 : 0;

        if (position === 1) strategy *= barReturn;
        hold *= barReturn;
        if (next !== position) {
            strategy *= 1 - fee;
            position = next as 0 | 1;
        }
        points.push({ t: bar.t, strategy, hold, position });
    }

    return points;
}

const priceFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export const formatPrice = (v: number): string => priceFormat.format(v);
export const formatCompact = (v: number): string => compactFormat.format(v);

export function formatClock(t: number): string {
    return new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatDay(t: number): string {
    return new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export function pctChange(from: number, to: number): number {
    if (!from) return 0;
    return ((to - from) / from) * 100;
}