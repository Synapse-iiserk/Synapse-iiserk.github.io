/**
 * Analytics Library Types
 * =======================
 * Type definitions for the iFINN analytics library
 */

// OHLCV Data Types
export interface OHLCV {
  timestamp: number | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OHLCVSeries {
  data: OHLCV[];
  symbol?: string;
  timeframe?: string;
}

// Indicator Result Types
export interface IndicatorResult {
  values: number[];
  name: string;
  period?: number;
}

export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

export interface BollingerBandsResult {
  upper: number[];
  middle: number[];
  lower: number[];
  bandwidth: number[];
  percentB: number[];
}

export interface StochasticResult {
  k: number[];
  d: number[];
}

// Regression Types
export interface RegressionResult {
  fitted: number[];
  rSquared: number;
  equation: string;
}

export interface LinearRegressionResult extends RegressionResult {
  slope: number;
  intercept: number;
}

export interface QuadraticRegressionResult extends RegressionResult {
  a: number;
  b: number;
  c: number;
}

// Backtest Types
export interface Trade {
  entryPrice: number;
  exitPrice: number;
  side: 'long' | 'short';
  entryTime?: Date;
  exitTime?: Date;
  pnl: number;
  pnlPercent: number;
  size?: number;
}

export interface BacktestConfig {
  initialCapital: number;
  leverage: number;
  commission: number;
  slippage: number;
  useTrailingStop: boolean;
  trailingStopPercent: number;
}

export interface BacktestResult {
  trades: Trade[];
  equityCurve: number[];
  metrics: PerformanceMetrics;
}

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  averageTrade: number;
  calmarRatio?: number;
}

// Swing Detection Types
export interface SwingPoint {
  index: number;
  price: number;
  type: 'peak' | 'trough';
  timestamp?: Date;
}

// Curve Analysis Types
export interface CurveAnalysis {
  pathLength: number;
  volatilityRatio: number;
  swings: SwingPoint[];
}

// Statistics Types
export interface CorrelationMatrix {
  symbols: string[];
  matrix: number[][];
}

export interface StatisticsResult {
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
  skewness: number;
  kurtosis: number;
}

// Chart Types for visualization
export interface ChartDataPoint {
  x: number | Date;
  y: number;
  label?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'scatter';
}
