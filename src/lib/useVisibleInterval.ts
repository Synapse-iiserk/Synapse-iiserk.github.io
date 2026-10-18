import { useEffect, useRef } from 'react';

interface VisibleIntervalOptions {
    /** base period in ms */
    delay: number;
    /** set when the last run failed: the period is doubled, up to maxDelay */
    failed?: boolean;
    /** ceiling for the backed-off period */
    maxDelay?: number;
    /** run once immediately on mount */
    immediate?: boolean;
    /** changing this restarts the loop and fires it right away (symbol, interval, ...) */
    resetKey?: string;
}

/**
 * One polling loop for the whole site:
 *  - pauses while the tab is hidden and refreshes the moment it returns
 *  - backs off when the upstream keeps failing instead of hammering it
 *  - always tears its timer down on unmount
 */
export function useVisibleInterval(run: () => unknown, options: VisibleIntervalOptions): void {
    const { delay, failed = false, maxDelay = 30_000, immediate = true, resetKey } = options;
    const saved = useRef(run);

    // keep the latest callback without restarting the loop (refs are not read during render)
    useEffect(() => {
        saved.current = run;
    });

    useEffect(() => {
        const fire = () => {
            try {
                saved.current();
            } catch {
                /* failures are surfaced by the caller */
            }
        };

        if (immediate) fire();

        const period = Math.min(failed ? delay * 2 : delay, maxDelay);
        const timer = window.setInterval(fire, period);

        const onVisibility = () => {
            if (!document.hidden) fire();
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            window.clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [delay, failed, maxDelay, immediate, resetKey]);
}

export default useVisibleInterval;