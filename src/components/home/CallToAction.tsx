import { motion } from 'framer-motion';
import { useState } from 'react';

export const CallToAction: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // TODO: Integrate with backend email service
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        setIsLoading(false);
        setEmail('');
    };

    return (
        <section className="py-24 lg:py-32 bg-[var(--color-primary)] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
                        Join the Waitlist
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mb-6">
                        Be First to{' '}
                        <span className="gradient-text">Experience Synapse</span>
                    </h2>
                    <p className="text-lg text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
                        Join our early access program and be among the first to leverage AI-powered
                        financial intelligence. Get exclusive updates, beta access, and priority support.
                    </p>

                    {/* Email Form */}
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="flex-1 px-5 py-4 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white font-semibold rounded-lg shadow-lg shadow-[var(--color-accent)]/25 hover:shadow-xl hover:shadow-[var(--color-accent)]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Get Early Access'
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] mt-3">
                                We respect your privacy. No spam, ever.
                            </p>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 max-w-md mx-auto"
                        >
                            <svg className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">You're on the list!</h3>
                            <p className="text-[var(--color-text-muted)]">
                                We'll be in touch with exclusive updates and early access information.
                            </p>
                        </motion.div>
                    )}

                    {/* Investor CTA */}
                    <div className="mt-16 pt-12 border-t border-[var(--color-border)]">
                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                            Investor Inquiries
                        </h3>
                        <p className="text-[var(--color-text-muted)] mb-6">
                            Interested in partnering with Synapse? We're building the future of financial intelligence.
                        </p>
                        <a
                            href="mailto:investors@synapse.finance"
                            className="inline-flex items-center px-6 py-3 rounded-lg border border-[var(--color-gold)] text-[var(--color-gold)] font-medium hover:bg-[var(--color-gold)]/10 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Investor Relations
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToAction;
