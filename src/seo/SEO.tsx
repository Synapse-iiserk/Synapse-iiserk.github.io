import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    structuredData?: object;
}

const defaultMeta = {
    siteName: 'iFINN',
    title: 'iFINN | AI-Driven Financial Intelligence',
    description: 'Unified AI-powered analytics for stocks, derivatives, and crypto. Advanced market monitoring, predictive analytics, and intelligent investment insights.',
    keywords: ['fintech', 'AI trading', 'financial analytics', 'stock market', 'crypto analytics', 'machine learning finance', 'algorithmic trading', 'market intelligence'],
    ogImage: '/og-image.png',
    siteUrl: 'https://synapse-iiserk.github.io/Synapse-iiserk.github.io',
};

export const SEO: React.FC<SEOProps> = ({
    title,
    description = defaultMeta.description,
    keywords = defaultMeta.keywords,
    ogImage = defaultMeta.ogImage,
    ogType = 'website',
    canonicalUrl,
    structuredData,
}) => {
    const fullTitle = title ? `${title} | ${defaultMeta.siteName}` : defaultMeta.title;
    const fullCanonicalUrl = canonicalUrl ? `${defaultMeta.siteUrl}${canonicalUrl}` : defaultMeta.siteUrl;

    const defaultStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'iFINN',
        description: defaultMeta.description,
        url: defaultMeta.siteUrl,
        logo: `${defaultMeta.siteUrl}/logo.png`,
        sameAs: [],
        contactPoint: {
            '@type': 'ContactPoint',
            email: 'contact@ifinn.finance',
            contactType: 'customer service',
        },
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <link rel="canonical" href={fullCanonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullCanonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${defaultMeta.siteUrl}${ogImage}`} />
            <meta property="og:site_name" content={defaultMeta.siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullCanonicalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${defaultMeta.siteUrl}${ogImage}`} />

            {/* Additional Meta */}
            <meta name="robots" content="index, follow" />
            <meta name="author" content="iFINN Team" />
            <meta name="theme-color" content="#0A0E27" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData || defaultStructuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
