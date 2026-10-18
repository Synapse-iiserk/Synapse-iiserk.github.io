import { Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import { teamMembers } from '../data/team';

const initials = (name: string) =>
    name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

export const Team: React.FC = () => {
    return (
        <>
            <SEO
                title="Team"
                description="The people building iFINN at IISER Kolkata: engineering, quantitative research, market operations and product."
                canonicalUrl="/team"
            />

            <section className="pb-14 pt-20 lg:pb-16 lg:pt-28">
                <div className="shell">
                    <span className="eyebrow reveal">Team</span>
                    <h1 className="h-display reveal mt-5">Who builds it.</h1>
                    <p className="lead mt-6">
                        Engineers and quant researchers at IISER Kolkata, working on the platform in
                        the open. Every member owns a layer of the stack and writes the tests that
                        guard it.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <ul>
                        {teamMembers.map((member) => (
                            <li key={member.slug} className="border-t border-[var(--color-line)] last:border-b">
                                <Link
                                    to={`/team/${member.slug}`}
                                    className="grid items-baseline gap-x-8 gap-y-1 py-5 transition-colors sm:grid-cols-[3.5rem_15rem_minmax(0,1fr)_auto]"
                                >
                                    <span
                                        aria-hidden
                                        className="mono flex h-12 w-12 items-center justify-center border border-[var(--color-line-strong)] text-[13px] text-[var(--color-accent)]"
                                    >
                                        {initials(member.name)}
                                    </span>
                                    <span>
                                        <span className="block font-display text-[19px] font-medium tracking-tight">
                                            {member.name}
                                        </span>
                                        <span className="mono mt-1 block text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                            {member.role}
                                        </span>
                                    </span>
                                    <span className="text-[15px] leading-relaxed text-[var(--color-muted)]">
                                        {member.focus}
                                    </span>
                                    <span className="mono text-[12px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                                        Profile
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-16 grid gap-6 border-t border-[var(--color-ink)] pt-6 lg:grid-cols-12">
                        <h2 className="h3 lg:col-span-5">Work with us</h2>
                        <div className="lg:col-span-7">
                            <p className="prose text-[15px]">
                                We take on research engineers, quant developers and growth work as the
                                alpha grows. Send a note with something you have built and we will read
                                it properly.
                            </p>
                            <Link to="/contact" className="btn btn-primary mt-6">
                                Get in touch
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Team;