import { motion } from 'framer-motion';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../seo/SEO';
import { getTeamMemberBySlug, teamMembers } from '../data/team';

export const TeamMember: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const member = slug ? getTeamMemberBySlug(slug) : undefined;

    if (!member) {
        return <Navigate to="/team" replace />;
    }

    return (
        <>
            <SEO
                title={`${member.name} - ${member.role}`}
                description={member.bio}
                canonicalUrl={`/team/${member.slug}`}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: member.name,
                    jobTitle: member.role,
                    description: member.bio,
                    worksFor: {
                        '@type': 'Organization',
                        name: 'Synapse',
                    },
                }}
            />

            <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[var(--color-primary)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8"
                    >
                        <Link
                            to="/team"
                            className="inline-flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Team
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-12">
                            {/* Avatar */}
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-gold)] flex items-center justify-center shadow-xl shadow-[var(--color-accent)]/30">
                                <span className="text-4xl font-bold text-white">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>

                            <div className="text-center md:text-left">
                                <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-2">
                                    {member.name}
                                </h1>
                                <p className="text-xl text-[var(--color-accent)] font-medium mb-2">
                                    {member.role}
                                </p>
                                <p className="text-[var(--color-text-muted)]">
                                    {member.focus}
                                </p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-12">
                            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">About</h2>
                            <p className="text-[var(--color-text-muted)] leading-relaxed text-lg">
                                {member.bio}
                            </p>
                        </div>

                        {/* Expertise */}
                        <div className="mb-12">
                            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Expertise</h2>
                            <div className="flex flex-wrap gap-3">
                                {member.expertiseHighlights.map((expertise) => (
                                    <span
                                        key={expertise}
                                        className="px-4 py-2 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-sm"
                                    >
                                        {expertise}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="p-6 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-border)]">
                            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                                Vision for Synapse
                            </h2>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                {member.visionContribution}
                            </p>
                        </div>

                        {/* Other Team Members */}
                        <div className="mt-16 pt-12 border-t border-[var(--color-border)]">
                            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">
                                Other Team Members
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {teamMembers
                                    .filter((m) => m.slug !== member.slug)
                                    .map((otherMember) => (
                                        <Link
                                            key={otherMember.slug}
                                            to={`/team/${otherMember.slug}`}
                                            className="flex items-center p-4 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-gold)] flex items-center justify-center mr-4">
                                                <span className="text-sm font-bold text-white">
                                                    {otherMember.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-[var(--color-text)]">{otherMember.name}</h3>
                                                <p className="text-sm text-[var(--color-text-muted)]">{otherMember.role}</p>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default TeamMember;
