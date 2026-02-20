// Team member data for Synapse
export interface TeamMember {
    slug: string;
    name: string;
    role: string;
    focus: string;
    bio: string;
    expertiseHighlights: string[];
    visionContribution: string;
}

export const teamMembers: TeamMember[] = [
    {
        slug: 'shuvam-banerji-seal',
        name: 'Shuvam Banerji Seal',
        role: 'Lead Technical Head',
        focus: 'Architecture, ML systems, infrastructure',
        bio: 'Shuvam leads the technical vision at iFINN, overseeing the architecture of our ML-powered financial analytics platform. With deep expertise in distributed systems and machine learning infrastructure, he ensures our platform delivers institutional-grade performance while remaining accessible to individual investors.',
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
        role: 'Finance and Marketing',
        focus: 'Market strategy, financial modeling, outreach',
        bio: 'Youktik drives market strategy and financial operations at iFINN. His expertise in financial modeling and market dynamics ensures our products address real-world investment challenges while maintaining regulatory compliance and market credibility.',
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
        slug: 'himanshu-prakash-singh',
        name: 'Himanshu Prakash Singh',
        role: 'Algorithm Development',
        focus: 'Quantitative models, algorithmic strategies',
        bio: 'Himanshu architects the quantitative models and algorithmic strategies powering iFINN. His research-driven approach combines rigorous mathematical foundations with practical market insights to develop predictive models that withstand real-world market conditions.',
        expertiseHighlights: [
            'Quantitative Trading Strategies',
            'Statistical Modeling & Analysis',
            'Algorithmic Strategy Development',
            'Risk Quantification Methods',
            'Backtesting Framework Design',
        ],
        visionContribution: 'Himanshu believes in democratizing quantitative finance, bringing institutional-quality algorithmic tools to individual investors while maintaining the scientific rigor that separates reliable strategies from speculation.',
    },
];

export const getTeamMemberBySlug = (slug: string): TeamMember | undefined => {
    return teamMembers.find((member) => member.slug === slug);
};
