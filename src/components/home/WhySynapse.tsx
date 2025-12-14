import { motion } from 'framer-motion';

const reasons = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: 'Speed',
        description: 'Sub-100ms latency for real-time market data processing and analysis.',
        metric: '<100ms',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Accuracy',
        description: 'Rigorously validated models with continuous performance monitoring.',
        metric: 'Validated',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ),
        title: 'Transparency',
        description: 'Explainable AI providing clear reasoning behind every recommendation.',
        metric: 'Explainable',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        title: 'Security',
        description: 'Enterprise-grade encryption and data protection protocols.',
        metric: 'Encrypted',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Browser Optimized',
        description: 'On-device processing for sensitive calculations and minimal server dependency.',
        metric: 'Edge-first',
    },
];

export const WhySynapse: React.FC = () => {
    return (
        <section className="py-24 lg:py-32 bg-[var(--color-primary-light)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4"
                        >
                            Why Choose Synapse
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-6"
                        >
                            Built for the{' '}
                            <span className="gradient-text">Modern Investor</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-[var(--color-text-muted)] mb-8"
                        >
                            We combine cutting-edge machine learning with battle-tested financial principles to deliver
                            analytics that are fast, accurate, and trustworthy.
                        </motion.p>

                        <div className="space-y-4">
                            {reasons.map((reason, index) => (
                                <motion.div
                                    key={reason.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-accent)]">
                                        {reason.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-[var(--color-text)]">{reason.title}</h3>
                                            <span className="text-xs font-medium text-[var(--color-gold)] bg-[var(--color-gold)]/10 px-2 py-1 rounded">
                                                {reason.metric}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--color-text-muted)]">{reason.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] border border-[var(--color-border)] overflow-hidden">
                            {/* Animated visualization placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-64 h-64">
                                    {/* Central node */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-gold)] flex items-center justify-center shadow-2xl shadow-[var(--color-accent)]/30 animate-pulse-glow">
                                        <span className="text-white font-bold text-2xl">S</span>
                                    </div>

                                    {/* Orbiting elements */}
                                    {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
                                        <div
                                            key={i}
                                            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[var(--color-accent)]/60"
                                            style={{
                                                transform: `rotate(${rotation}deg) translateX(100px) translateY(-6px)`,
                                                animation: 'orbit 8s linear infinite',
                                                animationDelay: `${i * -1.33}s`,
                                            }}
                                        />
                                    ))}

                                    {/* Connecting lines */}
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                                        <circle
                                            cx="128"
                                            cy="128"
                                            r="100"
                                            fill="none"
                                            stroke="var(--color-border)"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                        <circle
                                            cx="128"
                                            cy="128"
                                            r="70"
                                            fill="none"
                                            stroke="var(--color-accent)"
                                            strokeWidth="1"
                                            strokeOpacity="0.3"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Corner accents */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[var(--color-accent)]/30 rounded-tl-lg" />
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--color-accent)]/30 rounded-tr-lg" />
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--color-accent)]/30 rounded-bl-lg" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[var(--color-accent)]/30 rounded-br-lg" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhySynapse;
