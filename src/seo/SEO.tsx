import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    structuredData?: object;
    /** keep this page out of search results (the 404 view) */
    noindex?: boolean;
}

const SITE = {
    name: 'iFINN',
    url: 'https://ifinn.org',
    defaultTitle: 'iFINN | A quantitative terminal you can audit',
    description:
        '528 vetted algorithms, walk-forward backtesting, paper trading, 22+ market data providers and a research agent with 145 live tools. Every number traceable to an algorithm or a tool call. Built by Team iFINN, IISER Kolkata.',
    keywords: [
        'quantitative finance',
        'algorithmic trading platform',
        'backtesting',
        'paper trading',
        'AI trading agent',
        'financial analytics',
        'market data',
        'MCP tools',
        'fintech',
        'NSE',
        'crypto analytics',
        'machine learning finance',
    ],
    ogImage: '/og-image.png',
};

function setMeta(attr: 'name' | 'property', key: string, content: string) {
    let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

/**
 * Client-side head management. react-helmet-async silently no-ops under
 * React 19, so tags are applied directly here.
 */
export const SEO: React.FC<SEOProps> = ({
    title,
    description = SITE.description,
    keywords = SITE.keywords,
    ogImage = SITE.ogImage,
    ogType = 'website',
    canonicalUrl,
    structuredData,
    noindex = false,
}) => {
    const fullTitle = title ? `${title} | ${SITE.name}` : SITE.defaultTitle;
    const canonical = canonicalUrl ? `${SITE.url}${canonicalUrl}` : SITE.url;
    const image = `${SITE.url}${ogImage}`;
    const keywordsValue = keywords.join(', ');
    const jsonLd = JSON.stringify(
        structuredData ?? {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE.name,
            description: SITE.description,
            url: SITE.url,
            logo: `${SITE.url}/ifinn_logo.svg`,
            sameAs: [],
            contactPoint: {
                '@type': 'ContactPoint',
                email: 'contact@ifinn.org',
                contactType: 'customer service',
            },
        },
    );

    useEffect(() => {
        document.title = fullTitle;

        setMeta('name', 'title', fullTitle);
        setMeta('name', 'description', description);
        setMeta('name', 'keywords', keywordsValue);
        setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
        setMeta('name', 'theme-color', '#0a0e0c');

        setMeta('property', 'og:type', ogType);
        setMeta('property', 'og:url', canonical);
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:image', image);
        setMeta('property', 'og:site_name', SITE.name);

        setMeta('property', 'twitter:card', 'summary_large_image');
        setMeta('property', 'twitter:url', canonical);
        setMeta('property', 'twitter:title', fullTitle);
        setMeta('property', 'twitter:description', description);
        setMeta('property', 'twitter:image', image);

        let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'canonical';
            document.head.appendChild(link);
        }
        link.href = canonical;

        let script = document.getElementById('seo-jsonld') as HTMLScriptElement | null;
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'seo-jsonld';
            document.head.appendChild(script);
        }
        script.textContent = jsonLd;
    }, [fullTitle, description, keywordsValue, canonical, image, ogType, jsonLd, noindex]);

    return null;
};

export default SEO;