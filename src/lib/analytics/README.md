# Synapse Analytics Library (TypeScript)

A client-side financial analytics library for React applications, ported from the Python `analytics_oi_fin` package.

## Overview

This library provides TypeScript implementations of professional trading indicators and analysis tools that run entirely in the browser. No server calls needed for calculations.

## Installation

The library is included in the Synapse website source under `src/lib/analytics/`.

```typescript
import { 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands,
  TechnicalAnalysis 
} from '@/lib/analytics';
```

## Available Modules

### Momentum Indicators (`momentum.ts`)

- **RSI (Relative Strength Index)**: Measures overbought/oversold conditions
- **MACD**: Trend-following momentum indicator
- **Stochastic Oscillator**: Compares closing price to price range
- **ROC (Rate of Change)**: Percentage price change
- **Momentum**: Simple price difference

```typescript
import { calculateRSI, calculateMACD, calculateStochastic } from '@/lib/analytics';

const prices = [100, 101, 102, 99, 103, 105, 104];
const rsi = calculateRSI(prices, 14);
const { macd, signal, histogram } = calculateMACD(prices, 12, 26, 9);
```

### Trend Indicators (`trend.ts`)

- **SMA (Simple Moving Average)**
- **EMA (Exponential Moving Average)**
- **WMA (Weighted Moving Average)**
- **Awesome Oscillator**
- **Accelerator Oscillator**
- **MA Crossover Signals**

```typescript
import { calculateSMA, calculateEMA, calculateMACrossoverSignals } from '@/lib/analytics';

const sma20 = calculateSMA(prices, 20);
const ema12 = calculateEMA(prices, 12);
const signals = calculateMACrossoverSignals(prices, 12, 26, 'ema');
```

### Volume Indicators (`volume.ts`)

- **OBV (On-Balance Volume)**
- **ADL (Accumulation/Distribution Line)**
- **MFI (Money Flow Index)**
- **CMF (Chaikin Money Flow)**
- **PVT (Price Volume Trend)**
- **VWAP (Volume Weighted Average Price)**

```typescript
import { calculateOBV, calculateMFI, calculateVWAP } from '@/lib/analytics';

const obv = calculateOBV(closes, volumes);
const mfi = calculateMFI(highs, lows, closes, volumes, 14);
```

### Volatility Indicators (`volatility.ts`)

- **Bollinger Bands**
- **ATR (Average True Range)**
- **Keltner Channels**
- **Standard Deviation**
- **Historical Volatility**
- **ADR (Average Daily Range)**

```typescript
import { calculateBollingerBands, calculateATR } from '@/lib/analytics';

const bb = calculateBollingerBands(prices, 20, 2);
// bb.upper, bb.middle, bb.lower, bb.bandwidth, bb.percentB

const atr = calculateATR(highs, lows, closes, 14);
```

### Statistics (`statistics.ts`)

- **R-squared**: Regression fit quality
- **Correlation**: Pearson correlation coefficient
- **Sharpe Ratio**: Risk-adjusted returns
- **Sortino Ratio**: Downside risk-adjusted returns
- **Max Drawdown**: Peak-to-trough decline
- **Calmar Ratio**: Return/drawdown ratio
- **Beta**: Market sensitivity
- **Alpha**: Excess return

```typescript
import { calculateSharpeRatio, calculateMaxDrawdown, calculateCorrelation } from '@/lib/analytics';

const sharpe = calculateSharpeRatio(returns, 0, 252);
const maxDD = calculateMaxDrawdown(equityCurve);
const corr = calculateCorrelation(asset1Returns, asset2Returns);
```

### Regression (`regression.ts`)

- **Linear Regression**: y = mx + b
- **Quadratic Regression**: y = ax² + bx + c
- **Exponential Regression**: y = a × e^(bx)
- **Best Fit Selection**: Auto-select best model
- **Trend Line**: Simple linear trend
- **Prediction**: Future value forecasting

```typescript
import { fitLinear, fitQuadratic, findBestFit, predictFuture } from '@/lib/analytics';

const linear = fitLinear(prices);
// linear.slope, linear.intercept, linear.rSquared, linear.equation

const { bestFit, fits } = findBestFit(prices);
const predictions = predictFuture(prices, 10, 'linear');
```

### Backtesting (`backtest.ts`)

- **BacktestEngine**: Full-featured backtesting engine
- **Signal Processing**: Handle buy/sell signals
- **Performance Metrics**: Comprehensive statistics
- **Trailing Stop**: Dynamic stop-loss support

```typescript
import { BacktestEngine, runBacktest } from '@/lib/analytics';

const engine = new BacktestEngine({
  initialCapital: 10000,
  leverage: 1,
  commission: 0.001,
  slippage: 0.0005,
  useTrailingStop: true,
  trailingStopPercent: 0.05,
});

const results = engine.run(ohlcvData, signals);
// results.trades, results.equityCurve, results.metrics
```

## TechnicalAnalysis Class

Convenience class for working with OHLCV data:

```typescript
import { TechnicalAnalysis } from '@/lib/analytics';

const ta = new TechnicalAnalysis({
  close: closePrices,
  high: highPrices,
  low: lowPrices,
  volume: volumes,
});

// All indicators available as methods
const rsi = ta.rsi(14);
const { macd, signal } = ta.macd(12, 26, 9);
const bb = ta.bollingerBands(20, 2);
const obv = ta.obv();
```

## Types

All types are exported from `types.ts`:

```typescript
import type {
  OHLCV,
  OHLCVSeries,
  MACDResult,
  BollingerBandsResult,
  Trade,
  BacktestConfig,
  BacktestResult,
  PerformanceMetrics,
  StatisticsResult,
} from '@/lib/analytics';
```

## React Components

Interactive demo components are available in `src/components/analytics/`:

- `RSICalculator`: Interactive RSI with adjustable parameters
- `MovingAverageDemo`: SMA/EMA with crossover detection
- `BollingerBandsDemo`: Bands with squeeze detection
- `TrendAnalysisDemo`: Linear/quadratic regression comparison
- `PortfolioRiskDemo`: Drawdown and risk analysis

## Performance Considerations

- All calculations are O(n) or O(n²) at worst
- Uses TypeScript for type safety
- Minimal dependencies (only React for components)
- Suitable for real-time chart updates

## Corresponding Python Package

This library is a TypeScript port of the Python `analytics_oi_fin` package located at:
`/analytics_oi_fin/`

The Python version includes additional features for server-side processing and data loading.
