import { motion } from 'framer-motion';
import SEO from '../seo/SEO';

const products = [
    {
        id: 'market-tracking',
        title: 'Market Tracking Engine',
        description: 'Real-time surveillance across global equity, derivatives, and cryptocurrency markets with intelligent anomaly detection.',
        features: [
            'Multi-asset class coverage',
            'Real-time price feeds',
            'Volume analysis',
            'Correlation tracking',
            'Custom watchlists',
            'Alert systems',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        problem: 'Traditional market monitoring tools are fragmented across asset classes, requiring investors to juggle multiple platforms.',
        solution: 'Synapse unifies market data into a single, intelligent interface that adapts to your investment style.',
    },
    {
        id: 'strategy-builder',
        title: 'AI Strategy Builder',
        description: 'Develop, test, and refine quantitative trading strategies with AI-assisted optimization and risk modeling.',
        features: [
            'Visual strategy designer',
            'AI-powered suggestions',
            'Risk parameter tuning',
            'Multi-timeframe analysis',
            'Position sizing',
            'Exit rule optimization',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        problem: 'Building robust trading strategies requires deep technical expertise and extensive backtesting infrastructure.',
        solution: 'Our AI assistant guides you through strategy development, highlighting potential risks and optimization opportunities.',
    },
    {
        id: 'options-analyzer',
        title: 'Options & Futures Analyzer',
        description: 'Comprehensive derivatives analysis with Greeks visualization, volatility surface modeling, and scenario simulation.',
        features: [
            'Greeks calculation',
            'IV surface visualization',
            'Strategy payoff diagrams',
            'Scenario analysis',
            'Term structure analysis',
            'Spread comparison',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
        problem: 'Derivatives trading involves complex calculations and multi-dimensional risk factors that are difficult to visualize.',
        solution: 'Interactive visualization tools make understanding options Greeks and volatility dynamics intuitive.',
    },
    {
        id: 'crypto-intelligence',
        title: 'Crypto Intelligence Suite',
        description: 'On-chain analytics, DeFi monitoring, and sentiment analysis for digital asset portfolios.',
        features: [
            'On-chain metrics',
            'Wallet tracking',
            'DeFi protocol analysis',
            'Social sentiment',
            'Network health',
            'Token correlation',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        problem: 'Crypto markets move 24/7 with unique data sources like on-chain metrics that traditional tools ignore.',
        solution: 'Purpose-built analytics for digital assets, integrating blockchain data with traditional financial analysis.',
    },
    {
        id: 'backtesting',
        title: 'Backtesting & Simulations',
        badge: 'Coming Soon',
        description: 'Historical strategy testing with realistic market simulation including slippage, fees, and liquidity constraints.',
        features: [
            'Historical data replay',
            'Monte Carlo simulation',
            'Slippage modeling',
            'Transaction costs',
            'Portfolio attribution',
            'Drawdown analysis',
        ],
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        problem: 'Backtests often produce unrealistic results due to look-ahead bias and oversimplified market assumptions.',
        solution: 'Rigorous simulation engine with realistic friction modeling and statistical validation.',
    },
];

export const Products: React.FC = () => {
    return (
        <>
            <SEO
                title="Products"
                description="Explore Synapse's suite of AI-powered financial analytics tools including market tracking, strategy building, derivatives analysis, and crypto intelligence."
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
                            Powerful Tools for{' '}
                            <span className="gradient-text">Every Market</span>
                        </h1>
                        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                            A comprehensive suite of AI-driven analytics designed to give investors
                            the edge they need in today's complex financial landscape.
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
