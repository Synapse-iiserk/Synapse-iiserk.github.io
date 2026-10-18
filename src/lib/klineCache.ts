import type { Candle } from './market';

export interface CacheEntry {
    data: Candle[];
    savedAt: number;
}

const key = (scope: string, symbol: string, interval: string) => `ifinn.${scope}.${symbol}.${interval}`;

/**
 * Last good series for a scope, kept in sessionStorage so a feed outage shows
 * the previous bars with a timestamp instead of an empty chart.
 */
export function readKlines(scope: string, symbol: string, interval: string): CacheEntry | null {
    try {
        const raw = sessionStorage.getItem(key(scope, symbol, interval));
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CacheEntry;
        return Array.isArray(parsed?.data) && parsed.data.length ? parsed : null;
    } catch {
        return null;
    }
}

export function writeKlines(scope: string, symbol: string, interval: string, data: Candle[]): void {
    try {
        sessionStorage.setItem(key(scope, symbol, interval), JSON.stringify({ data, savedAt: Date.now() }));
    } catch {
        /* private mode or quota exceeded: the chart refetches next time */
    }
}