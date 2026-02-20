import { motion } from 'framer-motion';
import { useState } from 'react';
import SEO from '../seo/SEO';

const pricingTiers = [
    {
        name: 'Free',
        price: '$0',
        period: '/month',
        description: 'Perfect for exploring the platform and basic market monitoring.',
        badge: 'Coming Soon',
        features: [
            'Basic market data',
            'Limited watchlists',
            'Daily market summaries',
            'Community access',
            'Email support',
        ],
        notIncluded: [
            'Real-time data',
            'AI strategy tools',
            'Derivatives analysis',
            'API access',
        ],
        cta: 'Join Waitlist',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$49',
        period: '/month',
        description: 'For active traders who need real-time data and AI-powered insights.',
        badge: 'Coming Soon',
        features: [
            'Real-time market data',
            'Unlimited watchlists',
            'AI strategy builder',
            'Options analytics',
            'Crypto intelligence',
            'Custom alerts',
            'Priority support',
            'API access (limited)',
        ],
        notIncluded: [
            'Institutional features',
            'White-glove onboarding',
        ],
        cta: 'Join Waitlist',
        highlighted: true,
    },
    {
        name: 'Institutional',
        price: 'Custom',
        period: '',
        description: 'Enterprise-grade solutions for funds, family offices, and institutions.',
        badge: 'Coming Soon',
        features: [
            'Everything in Pro',
            'Dedicated infrastructure',
            'Custom integrations',
            'Unlimited API access',
            'Compliance reporting',
            'White-glove onboarding',
            'Dedicated account manager',
            'SLA guarantees',
        ],
        notIncluded: [],
        cta: 'Contact Sales',
        highlighted: false,
    },
];

export const Pricing: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        // TODO: Integrate with backend
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        setEmail('');
    };

    return (
        <>
            <SEO
                title="Pricing"
                description="Explore iFINN pricing plans. From free market monitoring to institutional-grade analytics. All plans currently in development."
                canonicalUrl="/pricing"
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
                            Pricing
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-6">
                            Simple, Transparent{' '}
                            <span className="gradient-text">Pricing</span>
                        </h1>
                        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                            Choose the plan that fits your investment needs. All plans are currently
                            in development and subject to regulatory review.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 lg:py-24 bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingTiers.map((tier, index) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-2xl p-8 ${tier.highlighted
                                        ? 'bg-gradient-to-b from-[var(--color-accent)]/20 to-[var(--color-primary-light)] border-2 border-[var(--color-accent)]'
                                        : 'bg-[var(--color-primary-light)] border border-[var(--color-border)]'
                                    }`}
                            >
                                {tier.highlighted && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="px-4 py-1 text-xs font-medium bg-[var(--color-accent)] text-white rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-[var(--color-text)]">{tier.name}</h3>
                                    <span className="px-3 py-1 text-xs font-medium bg-[var(--color-gold)]/20 text-[var(--color-gold)] rounded-full">
                                        {tier.badge}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-[var(--color-text)]">{tier.price}</span>
                                    <span className="text-[var(--color-text-muted)]">{tier.period}</span>
                                </div>

                                <p className="text-sm text-[var(--color-text-muted)] mb-6">{tier.description}</p>

                                <button
                                    className={`w-full py-3 rounded-lg font-medium transition-all mb-8 ${tier.highlighted
                                            ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]'
                                            : 'bg-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-accent)]/20'
                                        }`}
                                >
                                    {tier.cta}
                                </button>

                                <div className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <div key={feature} className="flex items-center text-sm">
                                            <svg className="w-4 h-4 text-[var(--color-success)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-[var(--color-text-muted)]">{feature}</span>
                                        </div>
                                    ))}
                                    {tier.notIncluded.map((feature) => (
                                        <div key={feature} className="flex items-center text-sm opacity-50">
                                            <svg className="w-4 h-4 text-[var(--color-text-muted)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-[var(--color-text-muted)]">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Email Notify */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                    >
                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                            Get notified when we launch
                        </h3>
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="flex-1 px-4 py-3 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-[var(--color-accent)] text-white font-medium rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
                                >
                                    Notify Me
                                </button>
                            </form>
                        ) : (
                            <div className="p-4 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 max-w-md mx-auto">
                                <p className="text-[var(--color-success)]">You're on the list! We'll notify you when pricing is available.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Disclaimer */}
                    <div className="mt-16 p-6 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-border)]">
                        <p className="text-sm text-[var(--color-text-muted)] text-center">
                            <strong className="text-[var(--color-gold)]">Disclaimer:</strong> All pricing displayed above is
                            preliminary and subject to change. Final pricing will be determined after completion of regulatory
                            compliance review and platform development. iFINN reserves the right to modify pricing structures
                            prior to launch.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Pricing;
