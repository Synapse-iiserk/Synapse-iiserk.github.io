import { motion } from 'framer-motion';
import SEO from '../seo/SEO';

export const About: React.FC = () => {
    const roadmapItems = [
        { phase: 'Phase 1', title: 'Foundation', status: 'In Progress', items: ['Core platform', 'Market data', 'Basic analytics'] },
        { phase: 'Phase 2', title: 'Intelligence', status: 'Planned', items: ['AI strategy builder', 'Predictive models', 'Risk profiling'] },
        { phase: 'Phase 3', title: 'Expansion', status: 'Planned', items: ['Options analytics', 'Crypto suite', 'Mobile apps'] },
        { phase: 'Phase 4', title: 'Enterprise', status: 'Future', items: ['Institutional features', 'API platform', 'White-label'] },
    ];

    return (
        <>
            <SEO title="About Us" description="Learn about Synapse's mission to democratize AI-driven financial intelligence." canonicalUrl="/about" />

            <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <span className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">About Synapse</span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-6">
                            Democratizing Financial <span className="gradient-text">Intelligence</span>
                        </h1>
                        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                            We believe sophisticated financial analytics should be accessible to everyone.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 lg:py-24 bg-[var(--color-primary)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                    {/* Mission */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Our Mission</h2>
                        <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
                            Synapse bridges the gap between institutional-grade analytics and individual investors, combining cutting-edge ML with rigorous financial principles.
                        </p>
                    </motion.div>

                    {/* Vision */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Our Vision</h2>
                        <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
                            A future where every investor has access to the same analytical tools as the largest hedge funds, with AI augmenting human decision-making.
                        </p>
                    </motion.div>

                    {/* Ethical AI */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Ethical AI Commitment</h2>
                        <ul className="space-y-2 text-[var(--color-text-muted)]">
                            {['Explainable outputs with clear reasoning', 'Regular algorithmic bias auditing', 'Human-in-the-loop design', 'No black-box predictions'].map(item => (
                                <li key={item} className="flex items-center">
                                    <svg className="w-5 h-5 text-[var(--color-accent)] mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Disclaimer */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border)]">
                        <h2 className="text-xl font-bold text-[var(--color-gold)] mb-4">Financial Responsibility Disclaimer</h2>
                        <p className="text-[var(--color-text-muted)]">
                            Synapse provides analytical tools for informational purposes only. All investment decisions carry risk, including potential loss of principal.
                        </p>
                    </motion.div>

                    {/* Roadmap */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Roadmap</h2>
                        <div className="space-y-6">
                            {roadmapItems.map(phase => (
                                <div key={phase.phase} className="flex items-start space-x-4">
                                    <div className={`w-3 h-3 rounded-full mt-2 ${phase.status === 'In Progress' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`} />
                                    <div>
                                        <div className="flex items-center space-x-3 mb-1">
                                            <span className="text-xs font-medium text-[var(--color-accent)]">{phase.phase}</span>
                                            <h3 className="font-semibold text-[var(--color-text)]">{phase.title}</h3>
                                            <span className={`px-2 py-0.5 text-xs rounded ${phase.status === 'In Progress' ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'}`}>{phase.status}</span>
                                        </div>
                                        <p className="text-sm text-[var(--color-text-muted)]">{phase.items.join(' • ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default About;
