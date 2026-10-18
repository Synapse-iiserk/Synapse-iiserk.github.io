import SEO from '../seo/SEO';
import Hero from '../components/home/Hero';
import ProductShowcase from '../components/home/ProductShowcase';
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
                    description:
                        'Quantitative finance platform: 528 vetted algorithms, backtesting, paper trading, cross-asset market data and a grounded AI research agent.',
                    url: 'https://ifinn.org',
                }}
            />
            <Hero />
            <ProductShowcase />
            <ProductCapabilities />
            <WhyiFINN />
            <TechStack />
            <CallToAction />
        </>
    );
};

export default Home;
