import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { cubicBezier } from 'animejs';

/** the site's entrance curve, and an overshooting one for things that land */
export const EASE = cubicBezier(0.22, 1, 0.36, 1);
export const EASE_BACK = cubicBezier(0.34, 1.56, 0.64, 1);

export const reducedMotion = (): boolean =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A number that rolls toward its target instead of jumping: used for the
 * live price tag and the hero counters. Snaps straight to the value under
 * reduced motion, and on the first render so nothing starts from a wrong
 * figure unless `from` is given.
 */
export function useTween(target: number, duration = 420, from?: number): number {
    const [value, setValue] = useState(from ?? target);
    const current = useRef(from ?? target);

    const still = reducedMotion();

    useEffect(() => {
        if (still || !Number.isFinite(target)) {
            current.current = target;
            return;
        }
        const start = current.current;
        const delta = target - start;
        if (delta === 0) return;
        const began = performance.now();
        let frame = 0;
        const step = (now: number) => {
            const t = Math.min(1, (now - began) / duration);
            const eased = 1 - (1 - t) ** 3;
            current.current = start + delta * eased;
            setValue(current.current);
            if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target, duration, still]);

    return still ? target : value;
}

const subscribeVisibility = (onChange: () => void) => {
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
};

/** true while the tab is in the foreground: streams close when it is not */
export const usePageVisible = (): boolean =>
    useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => true);

const DIGITS = '0123456789';

/**
 * Terminal-style decode: each time `runKey` changes, the digits of `text`
 * cycle through random figures and settle left to right. Punctuation stays
 * put so the shape of the number never jumps. React owns the output, so a
 * value that changes mid-decode is picked up rather than overwritten.
 */
export function useScramble(text: string, runKey: string | number, duration = 700, delay = 0): string {
    const [scrambled, setScrambled] = useState<string | null>(null);
    const latest = useRef(text);

    useEffect(() => {
        latest.current = text;
    });

    useEffect(() => {
        if (reducedMotion()) return;
        let frame = 0;
        let began = 0;
        const step = (now: number) => {
            if (!began) began = now + delay;
            const p = (now - began) / duration;
            const target = latest.current;
            if (p >= 1) {
                setScrambled(null);
                return;
            }
            const settled = Math.max(0, Math.floor(p * target.length));
            setScrambled(
                target
                    .split('')
                    .map((ch, i) => (i < settled || !DIGITS.includes(ch) ? ch : DIGITS[(Math.random() * 10) | 0]))
                    .join(''),
            );
            frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => {
            cancelAnimationFrame(frame);
            setScrambled(null);
        };
    }, [runKey, duration, delay]);

    return scrambled ?? text;
}

/** flips to true the first time the element is meaningfully on screen, and stays true */
export function useInViewOnce<T extends Element>(ref: React.RefObject<T | null>, threshold = 0.25): boolean {
    // without IntersectionObserver there is nothing to wait for
    const [seen, setSeen] = useState(() => !('IntersectionObserver' in window));
    useEffect(() => {
        const el = ref.current;
        if (seen || !el) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setSeen(true);
                    io.disconnect();
                }
            },
            { threshold },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [ref, seen, threshold]);
    return seen;
}
