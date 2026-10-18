import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';

/**
 * Shown for any URL that matches no route. Without this, an unknown path
 * renders an empty document: the visitor sees a blank page and a crawler
 * sees a page with no content. Every guess should be an explicit one.
 */
export default function NotFound() {
    return (
        <>
            <SEO
                title="Page not found"
                description="That URL does not exist on ifinn.org. The workspace, algorithm library, backtesting, analytics playground, pricing and team pages are all one click away."
                noindex
            />
            <section className="section">
                <div className="shell">
                    <span className="eyebrow">404</span>
                    <h1 className="display mt-4">No such route.</h1>
                    <p className="prose mt-5 max-w-xl">
                        The address you asked for is not part of this site. Nothing is broken on your
                        side, and the terminal itself is still running. Pick a desk below.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/products', label: 'Platform' },
                            { to: '/analytics', label: 'Analytics playground' },
                            { to: '/pricing', label: 'Pricing' },
                            { to: '/team', label: 'Team' },
                            { to: '/contact', label: 'Contact' },
                        ].map((link) => (
                            <Link key={link.to} to={link.to} className="link mono text-sm">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
