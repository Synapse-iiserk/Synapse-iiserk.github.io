import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export const CoinGeckoWidget: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false'
        );
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setCoins(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6 text-center text-[var(--color-text-muted)]">Loading live market data...</div>;
  if (error) return <div className="p-6 text-center text-[var(--color-danger)]">Error: {error}</div>;

  return (
    <div className="bg-[var(--color-primary-light)] rounded-xl border border-[var(--color-border)] p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[var(--color-text)]">Live Crypto Markets</h3>
        <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
          Live Data via CoinGecko
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)] text-sm">
              <th className="pb-3 font-medium">Asset</th>
              <th className="pb-3 font-medium text-right">Price</th>
              <th className="pb-3 font-medium text-right">24h Change</th>
              <th className="pb-3 font-medium text-right hidden sm:table-cell">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <motion.tr 
                key={coin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-primary)]/50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-gold)]/20 flex items-center justify-center text-xs font-bold uppercase">
                      {coin.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-text)]">{coin.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)] uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right font-medium text-[var(--color-text)]">
                  ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </td>
                <td className="py-4 text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    coin.price_change_percentage_24h >= 0 
                      ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' 
                      : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
                  }`}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </td>
                <td className="py-4 text-right text-[var(--color-text-muted)] text-sm hidden sm:table-cell">
                  ${(coin.market_cap / 1000000000).toFixed(2)}B
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
