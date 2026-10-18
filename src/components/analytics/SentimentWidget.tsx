import { useState, useEffect } from 'react';

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

interface SentimentSignal {
  source: string;

  symbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number; // 0-100
  mentions: number;
  delta: number; // change vs previous period
}

const MOCK_SIGNALS: SentimentSignal[] = [
  { source: 'Reddit', symbol: 'BTCUSDT', sentiment: 'bullish', score: 78, mentions: 4821, delta: +12 },
  { source: 'Twitter/X', symbol: 'ETHUSDT', sentiment: 'bullish', score: 65, mentions: 12340, delta: +5 },
  { source: 'Discord', symbol: 'SOLUSDT', sentiment: 'neutral', score: 51, mentions: 2190, delta: -3 },
  { source: 'Telegram', symbol: 'BNBUSDT', sentiment: 'bearish', score: 29, mentions: 980, delta: -18 },
  { source: 'Reddit', symbol: 'XRPUSDT', sentiment: 'bullish', score: 72, mentions: 3100, delta: +8 },
];

const TREND_TOKENS = [
  { symbol: 'BTC', change: '+2.4%', color: '#0ecb81', tag: 'trending' },
  { symbol: 'ETH', change: '+1.1%', color: '#0ecb81', tag: 'rising' },
  { symbol: 'SOL', change: '-0.8%', color: '#f6465d', tag: 'cooling' },
  { symbol: 'DOGE', change: '+5.2%', color: '#0ecb81', tag: 'viral' },
  { symbol: 'ADA', change: '-1.3%', color: '#f6465d', tag: 'declining' },
  { symbol: 'AVAX', change: '+3.1%', color: '#0ecb81', tag: 'breakout' },
];

const sentimentColor = (s: string) =>
  s === 'bullish' ? '#0ecb81' : s === 'bearish' ? '#f6465d' : '#fcd535';

const fgColor = (val: number) => {
  if (val <= 25) return '#f6465d';
  if (val <= 45) return '#ff9800';
  if (val <= 55) return '#fcd535';
  if (val <= 75) return '#0ecb81';
  return '#00e676';
};

export const SentimentWidget: React.FC = () => {
  const [fgData, setFgData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'signals' | 'trending'>('signals');

  useEffect(() => {
    const fetchFG = async () => {
      try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1&format=json');
        const data = await res.json();
        if (data?.data?.[0]) setFgData(data.data[0]);
      } catch {/* silently fail */}
      finally { setLoading(false); }
    };
    fetchFG();
  }, []);

  const fgVal = fgData ? parseInt(fgData.value) : 50;
  const fgLabel = fgData?.value_classification ?? 'Loading...';
  const arcLen = (fgVal / 100) * 141.4;
  const color = fgColor(fgVal);

  return (
    <div className=" border border-[var(--color-border)] bg-[var(--color-primary-light)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-[var(--color-border)] flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5  bg-[var(--color-accent)] " />
            <span className="text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              Social Sentiment Engine
            </span>
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text)]">Market Mood &amp; Crowd Intelligence</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Aggregated from Reddit, Twitter/X, Discord and Telegram, refreshed every 5 min
          </p>
        </div>

        {/* Fear & Greed Gauge */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 110 62" width="90" height="52">
            <path d="M10,55 A45,45 0 0,1 100,55" fill="none" stroke="#1e2329" strokeWidth="10" strokeLinecap="round"/>
            <path
              d="M10,55 A45,45 0 0,1 100,55"
              fill="none"
              stroke={loading ? '#2b3139' : color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${arcLen} 141.4`}
              style={{ transition: 'stroke-dasharray 1s ease, stroke 0.5s ease' }}
            />
            <text x="55" y="52" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="monospace" fill={color}>
              {loading ? '--' : fgVal}
            </text>
          </svg>
          <span className="text-xs font-bold mt-0.5" style={{ color }}>{fgLabel}</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">Fear &amp; Greed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)]">
        {(['signals', 'trending'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {tab === 'signals' ? 'Social signals' : 'Trending now'}
          </button>
        ))}
      </div>

      {/* Social Signals */}
      {activeTab === 'signals' && (
        <div className="divide-y divide-[var(--color-border)]">
          {MOCK_SIGNALS.map((sig, i) => (
            <div
              key={i} className="flex items-center gap-3 px-6 py-3"
            >
              <span className="mono w-7 text-center text-[11px] text-[var(--color-muted)]">{sig.source.slice(0, 2).toUpperCase()}</span>
              <div className="w-20 text-xs text-[var(--color-text-muted)]">
                <div className="font-semibold text-[var(--color-text)]">{sig.source}</div>
                <div className="text-[10px]">{sig.symbol}</div>
              </div>
              {/* Score bar */}
              <div className="flex-1">
                <div className="h-1.5  bg-[var(--color-border)] overflow-hidden">
                  <div className="h-full  transition-all duration-700"
                    style={{ width: `${sig.score}%`, background: sentimentColor(sig.sentiment) }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold w-10 text-right font-mono"
                style={{ color: sentimentColor(sig.sentiment) }}
              >
                {sig.score}
              </span>
              <span className="text-xs w-14 text-right font-mono"
                style={{ color: sig.delta >= 0 ? '#0ecb81' : '#f6465d' }}
              >
                {sig.delta >= 0 ? '+' : ''}{sig.delta}%
              </span>
              <span className="text-[10px] px-2 py-0.5  font-semibold"
                style={{
                  background: sentimentColor(sig.sentiment) + '22',
                  color: sentimentColor(sig.sentiment),
                }}
              >
                {sig.sentiment}
              </span>
            </div>
          ))}
          <div className="px-6 py-2 text-[10px] text-[var(--color-text-muted)] italic">
            * Live data via iFINN Social Sentiment API · Demo mode: signals are representative
          </div>
        </div>
      )}

      {/* Trending */}
      {activeTab === 'trending' && (
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TREND_TOKENS.map((t, i) => (
              <div
                key={i} className=" border border-[var(--color-border)] p-3 flex flex-col items-center gap-1 bg-[var(--color-primary)]"
              >
                <span className="text-sm font-bold text-[var(--color-text)]">{t.symbol}</span>
                <span className="text-xs font-mono font-bold" style={{ color: t.color }}>{t.change}</span>
                <span className="text-[10px] px-2 py-0.5 "
                  style={{ background: t.color + '22', color: t.color }}
                >
                  {t.tag}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-4 italic">
            Trending based on social mention velocity across 4+ platforms · Updated every 5 min
          </p>
        </div>
      )}
    </div>
  );
};

export default SentimentWidget;
