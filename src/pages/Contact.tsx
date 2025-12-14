import { motion } from 'framer-motion';
import { useState } from 'react';
import SEO from '../seo/SEO';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.honeypot) return; // Bot detected
        setIsLoading(true);
        // TODO: Integrate with backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        setIsLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <>
            <SEO title="Contact" description="Get in touch with the Synapse team. For investor inquiries, general questions, or support." canonicalUrl="/contact" />

            <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[var(--color-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <span className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">Contact</span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-6">
                            Get in <span className="gradient-text">Touch</span>
                        </h1>
                        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 lg:py-24 bg-[var(--color-primary)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-border)]">
                                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Investor Relations</h3>
                                    <a href="mailto:investors@synapse.finance" className="text-[var(--color-accent)] hover:underline">investors@synapse.finance</a>
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-border)]">
                                    <h3 className="font-semibold text-[var(--color-text)] mb-1">General Support</h3>
                                    <a href="mailto:support@synapse.finance" className="text-[var(--color-accent)] hover:underline">support@synapse.finance</a>
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-border)]">
                                    <h3 className="font-semibold text-[var(--color-text)] mb-1">Press & Media</h3>
                                    <a href="mailto:press@synapse.finance" className="text-[var(--color-accent)] hover:underline">press@synapse.finance</a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Honeypot */}
                                    <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Subject</label>
                                        <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]">
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="investment">Investment Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="press">Press/Media</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Message</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] resize-none" />
                                    </div>
                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-[var(--color-accent)] text-white font-semibold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50">
                                        {isLoading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            ) : (
                                <div className="p-8 rounded-2xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 text-center">
                                    <svg className="w-16 h-16 text-[var(--color-success)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">Message Sent</h3>
                                    <p className="text-[var(--color-text-muted)]">We'll get back to you as soon as possible.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
