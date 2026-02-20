import { motion } from 'framer-motion';
import SEO from '../seo/SEO';

const products = [
    {
        id: 'indicator-engine',
        title: '130+ Indicator Engine',
        description: 'Sub-millisecond technical analysis across NSE, BSE, and 50+ crypto assets — from Bollinger Bands to Ichimoku Cloud, all streaming live.',
        features: [
            '130+ technical indicators',
            '<1ms compute latency',
            'NSE & BSE native feeds',
            '50+ crypto pairs',
            'Multi-timeframe stacking',
            'Custom indicator builder',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        problem: 'Bloomberg terminal costs $24,000/year. Retail traders are left with lagging, siloed indicator tools that can not handle Indian market nuances.',
        solution: 'iFINN delivers Bloomberg-grade technical analysis at a fraction of the cost, with native NSE/BSE support and sub-millisecond streaming.',
    },
    {
        id: 'no-code-ai',
        title: 'No-Code AI Model Tuner',
        description: 'Point-and-click fine-tuning of LSTM, GRU, Transformer, and XGBoost models — no Python, no PhD required.',
        features: [
            'LSTM & GRU forecasting',
            'Transformer architectures',
            'XGBoost signal models',
            'Drag-and-drop pipeline',
            'Hyperparameter search',
            'Export to live trading',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        problem: 'Deploying ML models for trading requires specialized expertise in data pipelines, model architectures, and financial domain knowledge — a rare combination.',
        solution: 'iFINN abstracts the complexity. Non-programmers can build, train, and deploy production-ready AI trading signals through a visual interface.',
    },
    {
        id: 'pattern-detection',
        title: '18+ Pattern Detection Engine',
        description: 'Real-time recognition of candlestick and chart patterns with confidence scoring — powered by computer vision and rule-based hybrid models.',
        features: [
            '18+ candlestick patterns',
            'Head & Shoulders / W-bottom',
            'Flag, Wedge, Triangle patterns',
            'Confidence score overlay',
            'Historical hit-rate stats',
            'Multi-asset scanning',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
        problem: 'Manually scanning for chart patterns across hundreds of instruments is impossible in real time, causing traders to miss high-probability setups.',
        solution: 'iFINN scans the entire market universe in real time, surfacing patterns with statistical confidence intervals and historical success rates.',
    },
    {
        id: 'social-sentiment',
        title: 'Social Sentiment Engine',
        description: 'Aggregate and score financial sentiment from Reddit, Twitter/X, Discord, and Telegram — ahead of price moves.',
        features: [
            'Reddit WallStreetBets & NSE subs',
            'Twitter/X real-time firehose',
            'Discord & Telegram channels',
            'FinBERT NLP scoring',
            'Sentiment vs. price divergence',
            'Alert on sentiment spikes',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        problem: 'Social media moves markets — GME, Adani, Reliance — yet no Indian platform aggregates and quantifies these signals for retail traders.',
        solution: 'iFINN\'s FinBERT-powered sentiment engine processes 100,000+ posts/day, turning social noise into actionable trading signals.',
    },
    {
        id: 'options-analyzer',
        title: 'NSE/BSE Options Chain Analyzer',
        description: 'Full F&O analytics — OI buildup, PCR, IV surface, Greeks, and max pain — for India\'s equity derivatives market.',
        features: [
            'Live OI & OI change heatmap',
            'Put-Call Ratio (PCR) tracker',
            'IV percentile & skew',
            'Max Pain calculator',
            'Greeks visualization',
            'Block deal scanner',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
        ),
        problem: 'NSE\'s native options data is locked behind expensive data subscriptions, and no single tool ties together OI, PCR, and IV in real time.',
        solution: 'iFINN provides institutional-grade F&O analytics natively built for Indian markets, available to retail traders at an accessible price.',
    },
    {
        id: 'open-leaderboard',
        title: 'Open Model Leaderboard',
        badge: 'Beta',
        description: 'A "Kaggle for Finance" — submit your trading models, benchmark against the community, and discover alpha strategies.',
        features: [
            'Public model benchmarks',
            '50+ NSE/Crypto datasets',
            'Sharpe & Sortino scoring',
            'Community model sharing',
            'Live paper trading PnL',
            'API access for winners',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        problem: 'Quant researchers have no transparent, standardized benchmark to validate their models on real Indian market data.',
        solution: 'iFINN\'s Open Leaderboard gives quants a fair, reproducible benchmark — and the best models get integrated into the live platform.',
    },
];

export const Products: React.FC = () => {
    return (
        <>
            <SEO
                title="Products"
                description="Explore iFINN's suite of AI-powered financial analytics tools including market tracking, strategy building, derivatives analysis, and crypto intelligence."
                canonicalUrl="/products"
            />

            {/* Hero Section */}
            <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <span className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
                            Our Platform
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-6">
                            Bloomberg-Grade Tools.{' '}
                            <span className="gradient-text">Retail Price.</span>
                        </h1>
                        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                            iFINN is India's first AI-native trading platform — 130+ indicators,
                            no-code ML tuning, social sentiment, and NSE/BSE F&O analytics,
                            all in one place.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products List */}
            <section className="py-16 lg:py-24 bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-16 lg:space-y-24">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                id={product.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.6 }}
                                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Content */}
                                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-accent)]">
                                            {product.icon}
                                        </div>
                                        {product.badge && (
                                            <span className="px-3 py-1 text-xs font-medium bg-[var(--color-gold)]/20 text-[var(--color-gold)] rounded-full">
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                                        {product.title}
                                    </h2>
                                    <p className="text-lg text-[var(--color-text-muted)] mb-6">
                                        {product.description}
                                    </p>

                                    {/* Problem/Solution */}
                                    <div className="space-y-4 mb-8">
                                        <div className="p-4 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20">
                                            <span className="text-xs font-medium text-[var(--color-danger)] uppercase tracking-wider">The Problem</span>
                                            <p className="text-sm text-[var(--color-text-muted)] mt-1">{product.problem}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/20">
                                            <span className="text-xs font-medium text-[var(--color-success)] uppercase tracking-wider">Our Solution</span>
                                            <p className="text-sm text-[var(--color-text-muted)] mt-1">{product.solution}</p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.features.map((feature) => (
                                            <div key={feature} className="flex items-center text-sm text-[var(--color-text-muted)]">
                                                <svg className="w-4 h-4 text-[var(--color-accent)] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Visual */}
                                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <div className="aspect-[4/3] rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border)] overflow-hidden p-8 flex items-center justify-center">
                                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-gold)]/5 flex items-center justify-center">
                                            <div className="text-[var(--color-accent)]" style={{ transform: 'scale(3)' }}>
                                                {product.icon}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Products;
