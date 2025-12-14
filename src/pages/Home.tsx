import SEO from '../seo/SEO';
import Hero from '../components/home/Hero';
import ProductCapabilities from '../components/home/ProductCapabilities';
import WhySynapse from '../components/home/WhySynapse';
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
                    name: 'Synapse',
                    description: 'AI-driven financial intelligence platform for stocks, derivatives, and crypto.',
                    url: 'https://synapse-iiserk.github.io/Synapse-iiserk.github.io',
                }}
            />
            <Hero />
            <ProductCapabilities />
            <WhySynapse />
            <TechStack />
            <CallToAction />
        </>
    );
};

export default Home;
