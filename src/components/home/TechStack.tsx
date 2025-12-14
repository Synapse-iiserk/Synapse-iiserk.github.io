import { motion } from 'framer-motion';

const techStack = [
    {
        category: 'ML Pipelines',
        items: ['Deep Learning Models', 'Feature Engineering', 'Automated Retraining', 'Model Versioning'],
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        category: 'Low-Latency Analytics',
        items: ['Stream Processing', 'In-Memory Computing', 'Edge Optimization', 'Real-time Aggregation'],
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        category: 'Secure Financial APIs',
        items: ['REST & WebSocket', 'OAuth 2.0', 'Rate Limiting', 'Data Encryption'],
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        category: 'Cloud-Native Architecture',
        items: ['Kubernetes', 'Auto-scaling', 'Multi-region', 'CDN Distribution'],
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
    },
];

export const TechStack: React.FC = () => {
    return (
        <section className="py-24 lg:py-32 bg-[var(--color-primary)] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-text) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4"
                    >
                        Technology
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mb-6"
                    >
                        Enterprise-Grade{' '}
                        <span className="gradient-text">Infrastructure</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto"
                    >
                        Built on modern, scalable architecture designed for reliability, security, and performance at scale.
                    </motion.p>
                </div>

                {/* Tech Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {techStack.map((tech, index) => (
                        <motion.div
                            key={tech.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-6 lg:p-8 rounded-2xl gradient-border hover:shadow-xl hover:shadow-[var(--color-accent)]/5 transition-all duration-300"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-gold)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-accent)]/30">
                                    {tech.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                                        {tech.category}
                                    </h3>
                                    <ul className="space-y-2">
                                        {tech.items.map((item) => (
                                            <li key={item} className="flex items-center text-[var(--color-text-muted)]">
                                                <svg className="w-4 h-4 text-[var(--color-accent)] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tech Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 p-8 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border)]"
                >
                    <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
                        {['Python', 'TypeScript', 'React', 'TensorFlow', 'PostgreSQL', 'Redis'].map((tech) => (
                            <div
                                key={tech}
                                className="text-[var(--color-text-muted)] font-medium opacity-60 hover:opacity-100 transition-opacity"
                            >
                                {tech}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TechStack;
