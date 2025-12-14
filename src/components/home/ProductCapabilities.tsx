import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const capabilities = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'AI Market Monitoring',
        description: 'Real-time surveillance across global markets with intelligent anomaly detection and trend analysis powered by deep learning models.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        title: 'Predictive Analytics',
        description: 'Advanced forecasting models that analyze historical patterns, market sentiment, and macroeconomic indicators to identify opportunities.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Risk Profiling',
        description: 'Comprehensive risk assessment frameworks that quantify exposure, volatility, and correlation across your entire portfolio.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        ),
        title: 'Portfolio Optimization',
        description: 'Mathematical optimization algorithms that balance risk and return, aligning your portfolio with your investment objectives.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        title: 'Explainable ML Models',
        description: 'Transparent AI systems that provide clear reasoning behind predictions, enabling informed decision-making and regulatory compliance.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Real-time Dashboards',
        description: 'Customizable visualization interfaces with live data streaming, interactive charts, and comprehensive market overviews.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export const ProductCapabilities: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="py-24 lg:py-32 bg-[var(--color-primary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4"
                    >
                        Platform Capabilities
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mb-6"
                    >
                        Intelligent Tools for{' '}
                        <span className="gradient-text">Modern Finance</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto"
                    >
                        Comprehensive suite of AI-powered analytics designed to give you an edge in today's complex financial markets.
                    </motion.p>
                </div>

                {/* Capabilities Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {capabilities.map((capability) => (
                        <motion.div
                            key={capability.title}
                            variants={itemVariants}
                            className="group p-6 lg:p-8 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-accent)]/5"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-accent)] mb-6 group-hover:shadow-lg group-hover:shadow-[var(--color-accent)]/20 transition-shadow">
                                {capability.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">
                                {capability.title}
                            </h3>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                {capability.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ProductCapabilities;
