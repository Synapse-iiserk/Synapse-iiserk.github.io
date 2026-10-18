/**
 * Product data for the landing page and products page.
 * Every fact here mirrors the shipped platform (see ifinn-master AGENTS.md,
 * records dated 9-18 Oct 2026). Screenshots are the live product, captured
 * 2026-10-06 (ifinn-master/pitchdeck/screens, web-optimised in /public/screens).
 */

export interface ShowcaseTab {
    id: string;
    label: string;
    kicker: string;
    title: string;
    description: string;
    bullets: string[];
    image: string;
    url: string;
}

export const showcaseTabs: ShowcaseTab[] = [
    {
        id: 'workspace',
        label: 'Workspace',
        kicker: 'Trading desk',
        title: 'Chart-first workspace',
        description:
            'Candles, volume, RSI and MACD panes with a live WebSocket price chip, every panel docked around the chart you are analysing.',
        bullets: [
            '29 overlays computed server-side on the charted bars',
            '1m–1d intervals, multi-pane splits, saved layouts',
            'News, options & funding, signals and parameters one tab away',
        ],
        image: '/screens/workspace-chart.webp',
        url: 'ifinn.org/workspace · BTCUSDT',
    },
    {
        id: 'backtest',
        label: 'Backtest',
        kicker: 'Walk-forward engine',
        title: 'Honest backtesting',
        description:
            'Run up to four algorithms side by side on one shared bar window, real costs, train/test split, and metrics you can defend.',
        bullets: [
            'Net P&L, Sharpe, Sortino, max DD, win rate, profit factor',
            'Crashing algorithms are reported, never scored as flat',
            'Recent-runs history with full per-run reports',
        ],
        image: '/screens/backtest.webp',
        url: 'ifinn.org/workspace · Backtest',
    },
    {
        id: 'algorithms',
        label: 'Algorithms',
        kicker: '528 modules',
        title: 'A library, not a black box',
        description:
            'Browse 528 algorithms by family, trend, risk, fixed income, news sentiment and more, with tradable and analytics clearly separated.',
        bullets: [
            '281 tradable strategies, 247 analytics, labelled honestly',
            'Every module passes a strict conformance gate',
            'One click computes it on the charted bars',
        ],
        image: '/screens/workspace-algorithms.webp',
        url: 'ifinn.org/workspace · Algorithms',
    },
    {
        id: 'paper',
        label: 'Paper',
        kicker: 'Live tape',
        title: 'Paper trading sessions',
        description:
            'Trade the live market with simulated capital: positions, marks and a timestamped fill log, the same engine as the backtester.',
        bullets: [
            'Live positions with entry, mark and P&L per name',
            'Long and short, with a real margin model',
            'No exchange keys, no real orders, safe by design',
        ],
        image: '/screens/workspace-paper.webp',
        url: 'ifinn.org/workspace · Paper Trading',
    },
    {
        id: 'leaderboard',
        label: 'Leaderboard',
        kicker: '281 ranked',
        title: 'Measured against buy-and-hold',
        description:
            'Every tradable algorithm is backtested across BTC, AAPL, SPY and gold and ranked by median annualised Sharpe, no synthetic data, ever.',
        bullets: [
            'Excess return and beat-B&H flags on every row',
            'insufficient trades / no trades / errors labelled, not faked',
            'Filter by category: AI, technical, factors, DeFi and more',
        ],
        image: '/screens/leaderboard.webp',
        url: 'ifinn.org/leaderboard',
    },
    {
        id: 'markets',
        label: 'Markets',
        kicker: 'Derivatives desk',
        title: 'Every market, one terminal',
        description:
            '22+ providers feed boards for equities, crypto, FX, commodities and macro, plus an options and perpetual-funding desk.',
        bullets: [
            'BTC/ETH DVOL, put/call OI, IV term structure and smile',
            'Cross-venue funding: Binance, Bybit, Hyperliquid',
            'World page: 33 indices, BIS policy rates, OECD CLIs',
        ],
        image: '/screens/derivatives.webp',
        url: 'ifinn.org/derivatives',
    },
    {
        id: 'signals',
        label: 'Signals',
        kicker: 'Alternative data',
        title: 'Signals institutions pay for',
        description:
            'VIX term structure, CFTC positioning, FINRA short volume, Wikipedia attention and NY Fed funding, one card per source.',
        bullets: [
            'Volatility regime from the VIX curve (VIX1D → 6M)',
            'COT index, z-scores and crowding flags per market',
            'Every card fetched independently, with retry',
        ],
        image: '/screens/signals.webp',
        url: 'ifinn.org/signals',
    },
    {
        id: 'agent',
        label: 'AI agent',
        kicker: 'Grounded answers',
        title: 'AI chat with real tool calls',
        description:
            'Ask about markets, algorithms or backtests, the research agent calls 145 live platform tools and answers with the numbers it fetched.',
        bullets: [
            '“What’s BTC trading at?” → get_quote, 184 ms, live price',
            'Specialist agents: market data, backtest, derivatives, risk',
            'Export any session to Markdown; bring your own model',
        ],
        image: '/screens/chat-live.webp',
        url: 'ifinn.org/chat',
    },
];

export interface ProductModule {
    id: string;
    title: string;
    tagline: string;
    description: string;
    features: string[];
    problem: string;
    solution: string;
    image: string;
    imageAlt: string;
    url: string;
}

export const productModules: ProductModule[] = [
    {
        id: 'workspace',
        title: 'Quant Workspace',
        tagline: 'Chart-first terminal',
        description:
            'A dockable trading workspace: candles, volume, RSI and MACD panes, 29 server-computed overlays, live WebSocket price updates and saved layouts, with news, options, signals and parameters docked around the chart.',
        features: [
            '29 chart overlays computed on the charted bars',
            'Live price stream with in-place candle updates',
            'Signal-scored analysis table (hit rate, Sharpe, DD)',
            'Per-user tuned parameters with live recompute',
            'News, options & funding, signals dock panels',
            'Saved chart layouts and multi-pane splits',
        ],
        problem:
            'Retail tooling fragments charts, news and analytics across five disconnected apps, so context is lost between them.',
        solution:
            'One terminal keeps every pane (chart, overlays, news, derivatives, diagnostics) one tab away from the instrument you are analysing.',
        image: '/screens/workspace-chart.webp',
        imageAlt: 'iFINN workspace with BTCUSDT candles, overlays, RSI/MACD panes and a backtest panel',
        url: 'ifinn.org/workspace',
    },
    {
        id: 'algorithms',
        title: '528-Algorithm Library',
        tagline: 'Vetted, documented, reproducible',
        description:
            'Thirteen families of quantitative models, technical analysis, machine learning, portfolio optimisation, factors, time series, options, microstructure, statistical arbitrage, DeFi, quantum and more, every one gated by a conformance harness before it ships.',
        features: [
            '528 algorithms; 281 tradable strategies',
            'Conformance gate: 528/528 pass (crash, determinism, edge cases)',
            'Tunable parameters with bounds, choices and safe coercion',
            '1,659 documents with maths, parameters and signal semantics',
            'No look-ahead: deterministic, seeded, prefix-stable',
            'Analytics vs tradable clearly separated in the UI',
        ],
        problem:
            '“AI trading” usually means a black box you cannot inspect, reproduce or trust with real capital.',
        solution:
            'Every algorithm is open, documented and tested, signals are reproducible on your own bars, and only genuinely tradable models reach the leaderboard.',
        image: '/screens/workspace-algorithms.webp',
        imageAlt: 'iFINN algorithm library browsed by family with tradable and analytics split',
        url: 'ifinn.org/workspace · Algorithms',
    },
    {
        id: 'backtest',
        title: 'Backtesting & Paper Trading',
        tagline: 'Same engine, real costs',
        description:
            'A walk-forward engine with configurable capital, costs and train/test splits, run up to four algorithms at once, then take them live on the same engine as a paper-trading session trading the real tape.',
        features: [
            'Net P&L, return, Sharpe, Sortino, max DD, win rate, PF',
            'Per-algorithm breakdown and recent-runs history',
            'Crashing algorithms reported, not silently scored flat',
            'Paper sessions with live positions and fill logs',
            'Server-priced manual fills; margin model for shorts',
            'No exchange keys needed, simulation only',
        ],
        problem:
            'Trading ideas die in spreadsheets, and paper practice on a live tape rarely uses the same engine you backtested with.',
        solution:
            'One engine powers both: backtest with honest costs and failure reporting, then paper-trade the live market under identical mechanics.',
        image: '/screens/workspace-paper.webp',
        imageAlt: 'iFINN paper trading session with live positions, marks and a timestamped trade log',
        url: 'ifinn.org/workspace · Paper',
    },
    {
        id: 'markets',
        title: 'Cross-Asset Markets & Derivatives',
        tagline: 'One router, 22+ providers',
        description:
            'Every board on one page: US equities, indices, India, FX, commodities, crypto and macro, plus an options desk (Cboe chains, Deribit DVOL, IV smile) and cross-venue perpetual funding.',
        features: [
            'Boards per asset class with news-sentiment pills',
            'Options chains, IV smile, put/call OI (Cboe, Deribit)',
            'Perp funding side by side: Binance, Bybit, Hyperliquid',
            'World page: 33 indices, BIS policy rates, OECD CLIs',
            'Prediction markets: Polymarket, Kalshi, Manifold',
            'Write-through store behind every request',
        ],
        problem:
            'Bloomberg-class coverage runs $24k a year, and retail stacks never combine asset classes in one view.',
        solution:
            'A single provider router (cache, then dataset, then provider fallback) serves every market and records what it serves, so history compounds daily.',
        image: '/screens/derivatives.webp',
        imageAlt: 'iFINN derivatives desk with BTC and ETH volatility indices and put/call open interest',
        url: 'ifinn.org/derivatives',
    },
    {
        id: 'signals',
        title: 'Signals & Alternative Data',
        tagline: 'Data funds pay for, free',
        description:
            'Keyless alternative-data boards: VIX term structure and regime, CFTC positioning, FINRA short volume, Wikipedia attention, NY Fed funding rates, plus persisted news sentiment.',
        features: [
            'VIX curve VIX1D → 6M with contango/backwardation regime',
            'CFTC COT: net, 1w change, COT index, crowding flags',
            'FINRA Reg SHO short-volume share with z-scores',
            'Wikipedia attention spikes per ticker',
            'NY Fed SOFR/EFFR/OBFR/TGCR/BGCR rates',
            '20 RSS feeds with symbol-scoped lexicon sentiment',
        ],
        problem:
            'Alternative data is usually locked behind fund-sized contracts or scattered across incompatible sources.',
        solution:
            'Each source is an independent, self-retrying card with its own computation, no key required for most, so the signal board works out of the box.',
        image: '/screens/signals.webp',
        imageAlt: 'iFINN signals page with VIX term structure and NY Fed funding rate cards',
        url: 'ifinn.org/signals',
    },
    {
        id: 'ai-agent',
        title: 'AI Research Agent',
        tagline: 'Every number is a tool call',
        description:
            'An LLM agent wired to 145 live platform tools via MCP: quotes, OHLCV, news, derivatives, backtests, risk and the Master Eye influence graph, it fetches the numbers instead of guessing them.',
        features: [
            '145-tool MCP server over the whole platform',
            'Grounded answers with visible tool-call traces',
            'Specialist agents for market data, backtests, risk',
            'Session export to Markdown; multi-agent mode',
            'Bring your own OpenAI-compatible model',
            'Works from any MCP client, not just our chat',
        ],
        problem:
            'Generic chatbots hallucinate prices and cannot run a backtest or read your watchlist.',
        solution:
            'The agent answers by calling the same APIs the product uses: “BTC is trading at $86,291” is a live get_quote result, not a guess.',
        image: '/screens/chat-live.webp',
        imageAlt: 'iFINN AI chat answering a live BTC price question via a get_quote tool call',
        url: 'ifinn.org/chat',
    },
    {
        id: 'leaderboard',
        title: 'Open Leaderboard & Algo Hub',
        tagline: 'Kaggle for finance',
        description:
            'Every tradable algorithm ranked head-to-head against buy-and-hold on a cross-asset universe, and a community hub to author, publish, fork and benchmark your own strategies in a sandbox.',
        features: [
            '281 algorithms ranked by median annualised Sharpe',
            'BTC, AAPL, SPY and gold · 300 daily bars each',
            'Compares against buy-and-hold on the same bars',
            'Author & publish strategies in the Algo Hub',
            'Sandboxed benchmark runner: AST allowlist + rlimits',
            'Same engine and costs as the Backtest tab',
        ],
        problem:
            'There is no transparent, reproducible benchmark for “AI trading strategies”, just marketing claims.',
        solution:
            'A fixed, hashed benchmark spec with honest statuses (insufficient trades, errors), and community algorithms measured on exactly the same yardstick.',
        image: '/screens/leaderboard.webp',
        imageAlt: 'iFINN algorithm leaderboard ranking strategies by median annualised Sharpe vs buy-and-hold',
        url: 'ifinn.org/leaderboard',
    },
    {
        id: 'risk-data',
        title: 'Risk Analytics & Data Store',
        tagline: 'History that compounds',
        description:
            'Portfolio VaR, CVaR, Sharpe, Sortino and drawdown on live bars, over a persistent PostgreSQL dataset where every bar, quote and headline ever fetched is written through and re-served.',
        features: [
            'Portfolio and per-symbol equity curves',
            'Historical VaR / CVaR with adjustable weights',
            'Write-through store: 758k+ bars, 2,270+ series',
            'Fresh versus stale contract: stale data is never served as fresh',
            'CSV export, backfill and dataset snapshots',
            '30s connectivity breaker protects the store',
        ],
        problem:
            'Market data disappears when providers fail, rate-limit or change their APIs, and free tiers make it worse.',
        solution:
            'The platform keeps what it fetches: every request flows through a database that grows daily and falls back to stored history when providers go down.',
        image: '/screens/risk.webp',
        imageAlt: 'iFINN risk dashboard with volatility gauges and portfolio VaR/CVaR analytics',
        url: 'ifinn.org/risk',
    },
];

export interface DataSource {
    name: string;
    category: string;
}

/** Keyless / no-account sources the platform reads in production. */
export const dataSources: DataSource[] = [
    { name: 'Binance', category: 'Crypto' },
    { name: 'Yahoo Finance', category: 'Equities' },
    { name: 'Cboe', category: 'Options' },
    { name: 'Deribit', category: 'Crypto options' },
    { name: 'Hyperliquid', category: 'Perps' },
    { name: 'Bybit', category: 'Perps' },
    { name: 'CoinGecko', category: 'Crypto' },
    { name: 'DexScreener', category: 'DEX' },
    { name: 'Polymarket', category: 'Predictions' },
    { name: 'Kalshi', category: 'Predictions' },
    { name: 'Manifold', category: 'Predictions' },
    { name: 'CFTC', category: 'Positioning' },
    { name: 'FINRA', category: 'Short volume' },
    { name: 'NY Fed', category: 'Funding' },
    { name: 'BIS', category: 'Policy rates' },
    { name: 'OECD', category: 'Leading indicators' },
    { name: 'FRED', category: 'Macro' },
    { name: 'SEC EDGAR', category: 'Filings' },
    { name: 'World Bank', category: 'Macro' },
    { name: 'ECB / Eurostat', category: 'Macro' },
    { name: 'RSS feeds × 20', category: 'News' },
    { name: 'Wikimedia', category: 'Attention' },
];
