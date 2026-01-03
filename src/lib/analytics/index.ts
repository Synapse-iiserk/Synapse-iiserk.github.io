/**
 * Synapse Analytics Library
 * =========================
 * Client-side financial analytics for React applications
 * 
 * This library provides TypeScript implementations of common financial
 * indicators, statistics, regression analysis, and backtesting tools.
 */

// Types
export type {
  OHLCV,
  OHLCVSeries,
  IndicatorResult,
  MACDResult,
  BollingerBandsResult,
  StochasticResult,
  RegressionResult,
  LinearRegressionResult,
  QuadraticRegressionResult,
  Trade,
  BacktestConfig,
  BacktestResult,
  PerformanceMetrics,
  SwingPoint,
  CurveAnalysis,
  CorrelationMatrix,
  StatisticsResult,
  ChartDataPoint,
  ChartSeries,
} from './types';

// Momentum Indicators
export {
  calculateRSI,
  calculateMACD,
  calculateStochastic,
  calculateROC,
  calculateMomentum,
} from './momentum';

// Trend Indicators
export {
  calculateSMA,
  calculateEMA,
  calculateWMA,
  calculateAwesomeOscillator,
  calculateAcceleratorOscillator,
  calculateMACrossoverSignals,
  calculateTrendStrength,
} from './trend';

// Volume Indicators
export {
  calculateOBV,
  calculateADL,
  calculateMFI,
  calculateCMF,
  calculatePVT,
  calculateVWAP,
  calculateVolumeROC,
  calculateVolumePriceConfirmation,
} from './volume';

// Volatility Indicators
export {
  calculateBollingerBands,
  calculateATR,
  calculateKeltnerChannels,
  calculateStdDev,
  calculateHistoricalVolatility,
  calculateADR,
  calculateVolatilityRatio,
} from './volatility';

// Statistics
export {
  calculateRSquared,
  calculateCorrelation,
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateMaxDrawdown,
  calculateDrawdownSeries,
  calculateCalmarRatio,
  calculateStatistics,
  calculateRollingCorrelation,
  calculateBeta,
  calculateAlpha,
} from './statistics';

// Regression
export {
  fitLinear,
  fitQuadratic,
  fitExponential,
  findBestFit,
  calculateTrendLine,
  predictFuture,
} from './regression';

// Backtesting
export {
  BacktestEngine,
  runBacktest,
  calculateWinRate,
  calculateProfitFactor,
  calculateAverageTrade,
  DEFAULT_CONFIG,
} from './backtest';

// Import functions for TechnicalAnalysis class
import { calculateRSI, calculateMACD, calculateStochastic } from './momentum';
import { calculateSMA, calculateEMA } from './trend';
import { calculateOBV, calculateMFI, calculateVWAP } from './volume';
import { calculateBollingerBands, calculateATR, calculateKeltnerChannels } from './volatility';

// Convenience class for all indicators
export class TechnicalAnalysis {
  private closes: number[];
  private highs: number[];
  private lows: number[];
  private volumes: number[];
  
  constructor(data: { close: number[]; high?: number[]; low?: number[]; volume?: number[] }) {
    this.closes = data.close;
    this.highs = data.high || data.close;
    this.lows = data.low || data.close;
    this.volumes = data.volume || new Array(data.close.length).fill(1);
  }
  
  // Momentum
  rsi(period = 14) {
    return calculateRSI(this.closes, period);
  }
  
  macd(fast = 12, slow = 26, signal = 9) {
    return calculateMACD(this.closes, fast, slow, signal);
  }
  
  stochastic(kPeriod = 14, dPeriod = 3) {
    return calculateStochastic(this.highs, this.lows, this.closes, kPeriod, dPeriod);
  }
  
  // Trend
  sma(period: number) {
    return calculateSMA(this.closes, period);
  }
  
  ema(period: number) {
    return calculateEMA(this.closes, period);
  }
  
  // Volume
  obv() {
    return calculateOBV(this.closes, this.volumes);
  }
  
  mfi(period = 14) {
    return calculateMFI(this.highs, this.lows, this.closes, this.volumes, period);
  }
  
  vwap() {
    return calculateVWAP(this.highs, this.lows, this.closes, this.volumes);
  }
  
  // Volatility
  bollingerBands(period = 20, stdDev = 2) {
    return calculateBollingerBands(this.closes, period, stdDev);
  }
  
  atr(period = 14) {
    return calculateATR(this.highs, this.lows, this.closes, period);
  }
  
  keltnerChannels(emaPeriod = 20, atrPeriod = 10, multiplier = 2) {
    return calculateKeltnerChannels(this.highs, this.lows, this.closes, emaPeriod, atrPeriod, multiplier);
  }
}
