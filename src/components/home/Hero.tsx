import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[var(--color-primary)]">
                {/* Video Background */}
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
                >
                    <source src="https://cdn.pixabay.com/video/2021/08/04/83866-584705237_large.mp4" type="video/mp4" />
                </video>
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--color-gold)]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-gold)]/10 rounded-full blur-3xl" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-border)] mb-8"
                    >
                        <span className="w-2 h-2 bg-[var(--color-success)] rounded-full mr-2 animate-pulse" />
                        <span className="text-sm text-[var(--color-text-muted)]">Team iFINN @ IISER Kolkata &mdash; Building in 2025</span>
                    </motion.div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--color-text)] mb-6 leading-tight">
                        <span className="gradient-text">Intelligent Financial</span>
                        <br />
                        Neural Network
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-3xl mx-auto mb-10 leading-relaxed">
                        The all-in-one AI platform that democratizes institutional-grade analytics for every trader.
                        130+ indicators, no-code ML tuning, social sentiment, backtesting, and live execution &mdash; in one unified interface.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/contact"
                            className="group px-8 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white font-semibold rounded-lg shadow-lg shadow-[var(--color-accent)]/25 hover:shadow-xl hover:shadow-[var(--color-accent)]/30 transition-all transform hover:-translate-y-0.5"
                        >
                            <span className="flex items-center">
                                Get Early Access
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </Link>
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-transparent text-[var(--color-text)] font-semibold rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                        >
                            Explore Platform
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                >
                    {[
                        { label: 'Technical Indicators', value: '130+' },
                        { label: 'Pattern Detectors', value: '18+' },
                        { label: 'Data Latency', value: '<1ms' },
                        { label: 'Assets Tracked', value: '50+' },
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className="p-4 rounded-xl bg-[var(--color-primary-light)]/50 border border-[var(--color-border)] backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</div>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 rounded-full border-2 border-[var(--color-border)] flex items-start justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
