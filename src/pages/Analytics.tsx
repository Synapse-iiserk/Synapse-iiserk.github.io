/**
 * Analytics Demo Page
 * ===================
 * Interactive demonstrations of iFINN analytics capabilities
 */

import { motion } from 'framer-motion';
import SEO from '../seo/SEO';
import {
  RSICalculator,
  MovingAverageDemo,
  BollingerBandsDemo,
  TrendAnalysisDemo,
  PortfolioRiskDemo,
  CoinGeckoWidget,
  SentimentWidget,
} from '../components/analytics';

export const Analytics: React.FC = () => {
  return (
    <>
      <SEO
        title="Analytics Demo"
        description="Interactive demonstrations of iFINN's financial analytics capabilities including RSI, Moving Averages, Bollinger Bands, and more."
        canonicalUrl="/analytics"
      />

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block text-[var(--color-accent)] text-sm font-medium tracking-wider uppercase mb-4">
              Live Demo
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-6">
              Analytics{' '}
              <span className="gradient-text">Playground</span>
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Explore our client-side analytics engine. All calculations run directly in your browser
              using our TypeScript implementation of professional trading indicators.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8 bg-[var(--color-primary-light)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Real-time calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Client-side processing</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>No data leaves your browser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Data Section */}
      <section className="py-12 bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CoinGeckoWidget />
        </div>
      </section>

      {/* Social Sentiment Section */}
      <section className="py-12 bg-[var(--color-primary-light)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SentimentWidget />
        </div>
      </section>

      {/* Demos Grid */}
      <section className="py-16 lg:py-24 bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Momentum Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              Momentum Indicators
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Measure the speed and magnitude of price movements
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <RSICalculator />
              <MovingAverageDemo />
            </div>
          </motion.div>

          {/* Volatility Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              Volatility Analysis
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Understand market volatility and potential breakouts
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <BollingerBandsDemo />
              <PortfolioRiskDemo />
            </div>
          </motion.div>

          {/* Trend Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              Trend & Regression Analysis
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Fit mathematical models to price data
            </p>
            
            <div className="max-w-xl">
              <TrendAnalysisDemo />
            </div>
          </motion.div>

          {/* Available Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              Full Indicator Library
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Our analytics library includes all these indicators and more
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { category: 'Momentum', items: ['RSI', 'MACD', 'Stochastic', 'ROC', 'Momentum'] },
                { category: 'Trend', items: ['SMA', 'EMA', 'WMA', 'Awesome Oscillator', 'Accelerator'] },
                { category: 'Volume', items: ['OBV', 'ADL', 'MFI', 'CMF', 'PVT', 'VWAP'] },
                { category: 'Volatility', items: ['Bollinger Bands', 'ATR', 'Keltner', 'Std Dev', 'Historical Vol'] },
              ].map((group) => (
                <div
                  key={group.category}
                  className="p-4 bg-[var(--color-primary-light)] rounded-xl border border-[var(--color-border)]"
                >
                  <h3 className="text-[var(--color-accent)] font-semibold mb-3">
                    {group.category}
                  </h3>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-[var(--color-text-muted)] flex items-center gap-2"
                      >
                        <svg className="w-3 h-3 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--color-primary-light)] border-t border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
            Ready for More?
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            These demos showcase just a fraction of our analytics capabilities.
            The full platform includes real-time data feeds, advanced backtesting,
            and AI-powered insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/products"
              className="px-6 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-lg hover:bg-[var(--color-accent)]/90 transition-colors"
            >
              View All Products
            </a>
            <a
              href="/contact"
              className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-text)] font-semibold rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Analytics;
