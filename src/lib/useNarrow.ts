import { useSyncExternalStore } from 'react';

/**
 * Charts draw on a smaller viewBox on phones so 11-12 unit labels still
 * render near their nominal size instead of being scaled down to ~4px.
 */
const NARROW_QUERY = '(max-width: 639px)';

const subscribe = (onChange: () => void) => {
    const query = window.matchMedia(NARROW_QUERY);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
};
const isNarrow = () => window.matchMedia(NARROW_QUERY).matches;

export const useNarrow = () => useSyncExternalStore(subscribe, isNarrow, () => false);
