import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import { teamMembers } from '../data/team';

export const Team: React.FC = () => {
    return (
        <>
            <SEO
                title="Our Team"
                description="Meet the team behind iFINN. Technical leaders, financial experts, and algorithm developers building the future of AI-driven financial intelligence."
                canonicalUrl="/team"
            />

            {/* Hero */}
            <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <span className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
                            Our Team
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-6">
                            The People Behind{' '}
                            <span className="gradient-text">iFINN</span>
                        </h1>
                        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                            A dedicated team of engineers, analysts, and domain experts committed to
                            democratizing institutional-grade financial intelligence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-16 lg:py-24 bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/team/${member.slug}`}
                                    className="group block p-6 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-accent)]/5"
                                >
                                    {/* Avatar Placeholder */}
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-gold)] flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-[var(--color-accent)]/30 transition-shadow">
                                        <span className="text-3xl font-bold text-white">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-[var(--color-accent)] text-sm font-medium mb-4">
                                            {member.role}
                                        </p>
                                        <p className="text-[var(--color-text-muted)] text-sm mb-4">
                                            {member.focus}
                                        </p>

                                        <div className="flex items-center justify-center text-sm text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                                            View Profile
                                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Us CTA */}
            <section className="py-16 lg:py-24 bg-[var(--color-primary-light)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
                            Join Our Team
                        </h2>
                        <p className="text-[var(--color-text-muted)] mb-8">
                            We're always looking for talented individuals passionate about finance and technology.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-6 py-3 bg-[var(--color-accent)] text-white font-medium rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
                        >
                            Get in Touch
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Team;
