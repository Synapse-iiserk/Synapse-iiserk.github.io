// Team member data for Synapse
export interface TeamMember {
    slug: string;
    name: string;
    role: string;
    focus: string;
    bio: string;
    linkedInUrl?: string;
    expertiseHighlights: string[];
    visionContribution: string;
}

export const teamMembers: TeamMember[] = [
    {
        slug: 'shuvam-banerji-seal',
        name: 'Shuvam Banerji Seal',
        role: 'Co-founder',
        focus: 'Architecture, ML systems, infrastructure',
        bio: 'Shuvam leads the technical vision at iFINN, overseeing the architecture of our ML-powered financial analytics platform. With deep expertise in distributed systems and machine learning infrastructure, he ensures our platform delivers institutional-grade performance while remaining accessible to individual investors.',
        linkedInUrl: 'https://www.linkedin.com/in/mastersbs/',
        expertiseHighlights: [
            'Machine Learning Systems Architecture',
            'Distributed Computing Infrastructure',
            'Real-time Data Processing Pipelines',
            'Cloud-native Application Design',
            'Financial Data Engineering',
        ],
        visionContribution: 'Shuvam envisions iFINN as the bridge between cutting-edge AI research and practical financial intelligence, making sophisticated market analysis tools accessible to everyone while maintaining the rigor demanded by institutional investors.',
    },
    {
        slug: 'youktik-sajjan',
        name: 'Youktik Sajjan',
        role: 'Co-founder',
        focus: 'Market strategy, financial modeling, outreach',
        bio: 'Youktik drives market strategy and financial operations at iFINN. His expertise in financial modeling and market dynamics ensures our products address real-world investment challenges while maintaining regulatory compliance and market credibility.',
        linkedInUrl: 'https://www.linkedin.com/in/youktik-sajjan/',
        expertiseHighlights: [
            'Financial Market Strategy',
            'Quantitative Financial Modeling',
            'Regulatory Compliance Frameworks',
            'Investor Relations',
            'Growth Marketing for FinTech',
        ],
        visionContribution: 'Youktik is committed to building iFINN as a trusted name in financial technology, ensuring our solutions meet the stringent requirements of professional investors while remaining intuitive for newcomers to algorithmic trading.',
    },
    {
        slug: 'gautam-singh',
        name: 'Gautam Singh',
        role: 'Co-founder',
        focus: 'Product vision, execution, growth',
        bio: 'Gautam co-leads iFINN with a focus on translating ideas into practical products and scalable execution. He works across teams to align product direction, operations, and growth initiatives.',
        expertiseHighlights: [
            'Product Strategy',
            'Cross-functional Execution',
            'Startup Operations',
            'Growth Planning',
        ],
        visionContribution: 'Gautam is focused on building iFINN into a high-impact platform by combining ambitious product goals with disciplined execution and user-first thinking.',
    },
    {
        slug: 'aman',
        name: 'Aman',
        role: 'Lead Algorithm Development',
        focus: 'Algorithm design, optimization, model robustness',
        bio: 'Aman leads algorithm development at iFINN, designing and refining core models that power data-driven decision-making. His work emphasizes robustness, performance, and practical applicability.',
        expertiseHighlights: [
            'Algorithm Design',
            'Model Optimization',
            'Performance Tuning',
            'Applied Quantitative Methods',
        ],
        visionContribution: 'Aman is committed to building reliable and efficient algorithmic systems that translate complex data into actionable intelligence.',
    },
    {
        slug: 'ankan-basak',
        name: 'Ankan Basak',
        role: 'Marketing Partner',
        focus: 'Brand strategy, partnerships, market outreach',
        bio: 'Ankan leads marketing partnerships and brand outreach for iFINN, driving communication and growth initiatives that connect the product with the right audiences.',
        expertiseHighlights: [
            'Brand Positioning',
            'Marketing Partnerships',
            'Go-to-market Strategy',
            'Audience Development',
        ],
        visionContribution: 'Ankan aims to establish iFINN as a trusted and visible brand through clear storytelling, strategic partnerships, and market-focused execution.',
    },
];

export const getTeamMemberBySlug = (slug: string): TeamMember | undefined => {
    return teamMembers.find((member) => member.slug === slug);
};
