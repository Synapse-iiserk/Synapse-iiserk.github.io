import SEO from '../seo/SEO';
import Hero from '../components/home/Hero';
import ProductCapabilities from '../components/home/ProductCapabilities';
import WhyiFINN from '../components/home/WhyiFINN';
import TechStack from '../components/home/TechStack';
import CallToAction from '../components/home/CallToAction';

export const Home: React.FC = () => {
    return (
        <>
            <SEO
                canonicalUrl="/"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'iFINN',
                    description: 'AI-driven financial intelligence platform for stocks, derivatives, and crypto.',
                    url: 'https://synapse-iiserk.github.io/Synapse-iiserk.github.io',
                }}
            />
            <Hero />
            <ProductCapabilities />
            <WhyiFINN />
            <TechStack />
            <CallToAction />
        </>
    );
};

export default Home;
