import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../seo/SEO';
import { getTeamMemberBySlug, teamMembers } from '../data/team';

const initials = (name: string) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

export const TeamMember: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const member = slug ? getTeamMemberBySlug(slug) : undefined;

    if (!member) {
        return <Navigate to="/team" replace />;
    }

    return (
        <>
            <SEO
                title={`${member.name}, ${member.role}`}
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
                        name: 'iFINN',
                    },
                }}
            />

            <section className="pb-14 pt-20 lg:pb-16 lg:pt-28">
                <div className="shell">
                    <Link
                        to="/team"
                        className="mono text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                    >
                        ← Team
                    </Link>

                    <div className="mt-8 grid gap-10 border-t border-[var(--color-ink)] pt-8 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-4">
                            <span
                                aria-hidden
                                className="mono flex h-24 w-24 items-center justify-center border border-[var(--color-line-strong)] text-2xl text-[var(--color-accent)]"
                            >
                                {initials(member.name)}
                            </span>
                            <h1 className="h1 mt-6">{member.name}</h1>
                            <p className="mono mt-3 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                {member.role}
                            </p>
                            <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-muted)]">
                                {member.focus}
                            </p>
                            {member.linkedInUrl && (
                                <a
                                    href={member.linkedInUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link mono mt-4 inline-block text-[13px]"
                                >
                                    LinkedIn profile
                                </a>
                            )}
                        </div>

                        <div className="lg:col-span-8">
                            <h2 className="h3">Background</h2>
                            <p className="prose mt-3 text-[16px]">{member.bio}</p>

                            <h2 className="mono mt-12 border-t border-[var(--color-line)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                                Expertise
                            </h2>
                            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
                                {member.expertiseHighlights.map((expertise) => (
                                    <li
                                        key={expertise}
                                        className="border-b border-[var(--color-line)] py-2.5 text-[14.5px] text-[var(--color-muted)]"
                                    >
                                        {expertise}
                                    </li>
                                ))}
                            </ul>

                            <h2 className="h3 mt-12">What {member.name.split(' ')[0]} is building toward</h2>
                            <p className="prose mt-3 text-[15px]">{member.visionContribution}</p>
                        </div>
                    </div>

                    <div className="mt-20">
                        <h2 className="mono border-t border-[var(--color-line)] pt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                            Others on the team
                        </h2>
                        <ul>
                            {teamMembers
                                .filter((other) => other.slug !== member.slug)
                                .map((other) => (
                                    <li key={other.slug} className="border-b border-[var(--color-line)]">
                                        <Link
                                            to={`/team/${other.slug}`}
                                            className="flex items-baseline justify-between gap-6 py-3 transition-colors hover:text-[var(--color-accent)]"
                                        >
                                            <span className="font-display text-[17px] tracking-tight">
                                                {other.name}
                                            </span>
                                            <span className="mono text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                                {other.role}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TeamMember;