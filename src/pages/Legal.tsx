import SEO from '../seo/SEO';

type LegalKind = 'privacy' | 'terms' | 'disclaimer';

interface LegalSection {
    heading: string;
    paragraphs: string[];
}

const content: Record<LegalKind, { title: string; intro: string; sections: LegalSection[] }> = {
    privacy: {
        title: 'Privacy Policy',
        intro:
            'This page describes what happens to data when you visit ifinn.org. The short version: this marketing site is static, has no advertising or analytics trackers, and the forms on it do not store anything in this build.',
        sections: [
            {
                heading: 'This website',
                paragraphs: [
                    'ifinn.org is a static marketing site. It does not set advertising cookies and does not run third-party analytics or tracking pixels.',
                    'The waitlist and contact forms on this site are placeholders in the current build: submitting them does not transmit or store your data anywhere. When the forms are connected to our backend, this policy will be updated before that happens.',
                    'If you email us (for example investors@ifinn.org), we use your address and message only to respond to you.',
                ],
            },
            {
                heading: 'Third-party requests from your browser',
                paragraphs: [
                    'Some demo widgets (for example the Analytics playground) fetch public market data directly from third-party APIs such as CoinGecko. Those requests come from your browser, and the respective providers’ privacy policies apply to them.',
                    'This site is hosted on GitHub Pages. GitHub may log basic technical request data (such as IP address) as described in GitHub’s own privacy statement.',
                ],
            },
            {
                heading: 'The platform',
                paragraphs: [
                    'The iFINN platform (the application behind the sign-in) stores account data and workspace data you create (watchlists, tuned parameters, saved layouts, paper-trading sessions and backtest history) so it can be shown back to you.',
                    'API keys you add for data providers are encrypted at rest (Fernet) and used only to fetch data on your behalf.',
                    'You can delete your account from the profile page; associated personal data is then removed.',
                ],
            },
            {
                heading: 'Contact',
                paragraphs: [
                    'For any privacy question or request, write to contact@ifinn.org and we will respond.',
                ],
            },
        ],
    },
    terms: {
        title: 'Terms of Service',
        intro:
            'These terms govern your use of ifinn.org and the iFINN platform. By using the site you agree to them.',
        sections: [
            {
                heading: 'The service',
                paragraphs: [
                    'iFINN provides quantitative analysis tools, market data, backtesting and simulated (paper) trading for informational purposes. The platform does not execute real trades and does not hold your capital.',
                    'The service is provided “as is” and “as available”, without warranties of any kind, express or implied.',
                ],
            },
            {
                heading: 'Acceptable use',
                paragraphs: [
                    'You agree not to misuse the site or platform: no attempts to disrupt, overload, or gain unauthorised access to it, and no scraping or automated access that violates applicable law or the terms of the underlying data providers.',
                    'You are responsible for keeping your account credentials secure.',
                ],
            },
            {
                heading: 'Intellectual property',
                paragraphs: [
                    'Unless stated otherwise, the content on this site (text, graphics, screenshots and design) is owned by iFINN and may not be copied for commercial use without permission.',
                    'The iFINN platform codebase is released under the MIT licence; that licence governs your use of the code.',
                ],
            },
            {
                heading: 'Changes and liability',
                paragraphs: [
                    'We may change, suspend or discontinue any part of the site or platform at any time.',
                    'To the maximum extent permitted by law, iFINN is not liable for indirect or consequential loss arising from your use of the site or platform.',
                    'These terms are being finalised with counsel; nothing here overrides a separately signed agreement.',
                ],
            },
        ],
    },
    disclaimer: {
        title: 'Financial Disclaimer',
        intro:
            'iFINN builds analytical tools. We are not an investment adviser and nothing on this site or platform is investment advice.',
        sections: [
            {
                heading: 'Not investment advice',
                paragraphs: [
                    'All content, signals, scores, backtests and AI-generated answers are provided for informational and educational purposes only. They are not financial, investment, legal or tax advice, and they are not an offer or solicitation to buy or sell any security or instrument.',
                    'You alone are responsible for your investment decisions. Consult a qualified adviser before acting on anything you see here.',
                ],
            },
            {
                heading: 'Data and results',
                paragraphs: [
                    'Market data is sourced from third-party providers and may be delayed, incomplete or inaccurate. We flag freshness where we can, but we do not guarantee the accuracy of any data.',
                    'Backtesting and paper trading are simulations. Results are hypothetical, do not reflect real execution (fills, slippage and liquidity may differ), and past performance never guarantees future results.',
                ],
            },
            {
                heading: 'Risk',
                paragraphs: [
                    'Trading and investing in financial markets involves substantial risk, including the loss of your entire principal. Never trade with money you cannot afford to lose.',
                    'Algorithmic signals can fail. Even algorithms that pass our conformance gate can lose money in live markets.',
                ],
            },
            {
                heading: 'Features under development',
                paragraphs: [
                    'Features marked “coming soon” are under development and subject to change, including pricing, which is preliminary until launch.',
                ],
            },
        ],
    },
};

export const LegalPage: React.FC<{ kind: LegalKind }> = ({ kind }) => {
    const page = content[kind];

    return (
        <>
            <SEO
                title={page.title}
                description={`iFINN ${page.title.toLowerCase()}.`}
                canonicalUrl={`/${kind}`}
            />
            <section className="pb-14 pt-20 lg:pb-20 lg:pt-28">
                <div className="shell">
                    <div className="max-w-[70ch]">
                        <span className="eyebrow reveal">Legal</span>
                        <h1 className="h1 reveal mt-4">{page.title}</h1>
                        <p className="lead mt-5 text-[17px]">{page.intro}</p>
                        <p className="mono mt-4 text-[12px] text-[var(--color-muted)]">
                            Last updated 19 October 2026 · draft pending legal review
                        </p>

                        <div className="mt-12 flex flex-col gap-10">
                            {page.sections.map((section) => (
                                <section key={section.heading}>
                                    <h2 className="mono border-t border-[var(--color-ink)] pt-3 text-[12px] uppercase tracking-[0.12em]">
                                        {section.heading}
                                    </h2>
                                    <div className="mt-4 flex flex-col gap-4">
                                        {section.paragraphs.map((paragraph) => (
                                            <p key={paragraph} className="prose text-[15.5px]">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>

                        <div className="mt-14 border-t border-[var(--color-line)] pt-4">
                            <p className="mono text-[12px] leading-relaxed text-[var(--color-muted)]">
                                Questions about this page? Write to{' '}
                                <a href="mailto:contact@ifinn.org" className="link">
                                    contact@ifinn.org
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LegalPage;
