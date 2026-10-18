interface BrowserFrameProps {
    src: string;
    alt: string;
    /** short path shown in the frame's title bar, e.g. ifinn.org/workspace */
    url?: string;
    /** optional right-hand label in the title bar */
    meta?: string;
    /** load eagerly (above the fold) instead of lazily */
    eager?: boolean;
    className?: string;
}

/**
 * A screenshot inside a hairline frame with a mono title bar. The chrome is
 * quiet on purpose: the frame exists to prove the product is real, not to
 * decorate it.
 */
export const BrowserFrame: React.FC<BrowserFrameProps> = ({
    src,
    alt,
    url,
    meta,
    eager = false,
    className = '',
}) => {
    return (
        <div className={`shot ${className}`}>
            {(url || meta) && (
                <div className="shot-bar">
                    <span className="shot-url">{url}</span>
                    {meta && <span>{meta}</span>}
                </div>
            )}
            <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        </div>
    );
};

export default BrowserFrame;