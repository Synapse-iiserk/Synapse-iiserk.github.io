import { useEffect, useRef } from 'react';
import { createTimeline, cubicBezier } from 'animejs';

const EASE = cubicBezier(0.22, 1, 0.36, 1);

interface ThinkingIndicatorProps {
    size?: number;
    label?: string;
}

/**
 * "Thinking" state for the AI research agent, drawn as line art rather than a
 * glowing orb: three hairline arcs on different rhythms around a square core.
 * Inspired by the thinking-orb pattern libraries publish for agent UIs.
 */
export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ size = 34, label = 'Working' }) => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const loop = createTimeline({ defaults: { ease: 'linear', loop: true } })
            .add(root.querySelector('[data-arc-1]')!, { rotate: '1turn', duration: 2400 })
            .add(root.querySelector('[data-arc-2]')!, { rotate: '-1turn', duration: 3600 }, 0)
            .add(root.querySelector('[data-arc-3]')!, { rotate: '1turn', duration: 5200 }, 0)
            .add(
                root.querySelector('[data-core]')!,
                { opacity: [0.35, 1], duration: 1100, alternate: true, loop: true, ease: EASE },
                0,
            );

        return () => {
            // an orphaned rAF loop would keep running after unmount
            loop.revert();
        };
    }, []);

    return (
        <svg
            ref={ref}
            width={size}
            height={size}
            viewBox="0 0 40 40"
            role="img"
            aria-label={label}
            className="shrink-0"
        >
            <circle cx="20" cy="20" r="17" fill="none" stroke="var(--color-line)" strokeWidth={1} />
            <path
                data-arc-1
                d="M20 3 A17 17 0 0 1 37 20"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={1.5}
            />
            <path
                data-arc-2
                d="M37 20 A17 17 0 0 1 20 37"
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1}
                opacity={0.7}
            />
            <path
                data-arc-3
                d="M20 37 A17 17 0 0 1 3 20"
                fill="none"
                stroke="var(--color-line-strong)"
                strokeWidth={1}
            />
            <rect data-core x="17" y="17" width="6" height="6" fill="var(--color-accent)" />
        </svg>
    );
};

export default ThinkingIndicator;
