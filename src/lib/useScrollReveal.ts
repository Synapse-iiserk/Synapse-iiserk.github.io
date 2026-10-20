import { useLayoutEffect } from 'react';
import { reducedMotion } from './motion';

/**
 * What animates on scroll, by role. Headings rise out of a mask, frames wipe
 * open, rows and list items stagger up, tables slide in from the side.
 */
const TARGETS = [
    '.reveal',
    '.shot',
    '.ledger-row',
    '.data-table tbody tr',
    'dl > div',
    'section ul > li',
    '.prose',
    '.lead',
    '.panel',
    '.rule-draw',
].join(',');

/** siblings stagger by 70ms each, capped so a long table does not crawl in */
const MAX_STAGGER = 8;

/**
 * Scroll reveal for everything inside `root`. Content is authored visible;
 * this hides only what is still below the fold, before first paint, and
 * reveals it as it enters. Nodes added later (a lazy route, a switched tab)
 * are picked up by a MutationObserver. Does nothing under reduced motion or
 * without IntersectionObserver.
 */
export function useScrollReveal(root: () => HTMLElement | null, key: string): void {
    useLayoutEffect(() => {
        const container = root();
        if (!container || reducedMotion() || !('IntersectionObserver' in window)) return;
        document.documentElement.classList.add('motion');

        // clipped targets have no visible area to intersect, so for those the
        // observer watches the unclipped parent and reveals what it carries
        const carried = new Map<Element, HTMLElement[]>();
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    carried.get(entry.target)?.forEach((el) => el.classList.add('rv-in'));
                    carried.delete(entry.target);
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0 },
        );

        const seen = new WeakSet<Element>();
        const scan = () => {
            const fold = window.innerHeight;
            container.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
                if (seen.has(el) || el.closest('[data-no-reveal]')) return;
                seen.add(el);
                // nested targets would animate twice; the outer one carries the inner
                if (el.parentElement?.closest('.rv')) return;
                const box = el.getBoundingClientRect();
                if (box.top < fold * 0.92 && box.bottom > 0) return;
                const siblings = el.parentElement ? Array.from(el.parentElement.children) : [el];
                el.style.setProperty('--i', String(Math.min(siblings.indexOf(el), MAX_STAGGER)));
                el.classList.add('rv');
                const watch = el.matches('.shot, .reveal') && el.parentElement ? el.parentElement : el;
                carried.set(watch, [...(carried.get(watch) ?? []), el]);
                io.observe(watch);
            });
        };

        scan();
        let pending = 0;
        const mo = new MutationObserver(() => {
            cancelAnimationFrame(pending);
            pending = requestAnimationFrame(scan);
        });
        mo.observe(container, { childList: true, subtree: true });

        return () => {
            // anything still waiting is shown rather than stranded hidden
            carried.forEach((els) => els.forEach((el) => el.classList.add('rv-in')));
            io.disconnect();
            mo.disconnect();
            cancelAnimationFrame(pending);
        };
    }, [root, key]);
}
