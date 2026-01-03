/**
 * Technical Indicators - Volatility
 * ==================================
 * Volatility-based technical indicators implementation in TypeScript
 */

import type { BollingerBandsResult } from './types';
import { calculateSMA } from './trend';

/**
 * Calculate Bollinger Bands
 * 
 * Bollinger Bands consist of a middle SMA band with upper and lower bands
 * at a standard deviation above and below.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period (default 20)
 * @param stdDev - Number of standard deviations (default 2)
 * @returns Upper, middle, lower bands, bandwidth, and %B
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): BollingerBandsResult {
  const upper: number[] = new Array(prices.length).fill(NaN);
  const middle: number[] = new Array(prices.length).fill(NaN);
  const lower: number[] = new Array(prices.length).fill(NaN);
  const bandwidth: number[] = new Array(prices.length).fill(NaN);
  const percentB: number[] = new Array(prices.length).fill(NaN);
  
  if (prices.length < period) {
    return { upper, middle, lower, bandwidth, percentB };
  }
  
  const sma = calculateSMA(prices, period);
  
  for (let i = period - 1; i < prices.length; i++) {
    // Calculate standard deviation
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = sma[i];
    const squaredDiffs = slice.map(p => Math.pow(p - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const std = Math.sqrt(variance);
    
    middle[i] = mean;
    upper[i] = mean + (stdDev * std);
    lower[i] = mean - (stdDev * std);
    
    // Bandwidth = (Upper - Lower) / Middle
    if (mean !== 0) {
      bandwidth[i] = (upper[i] - lower[i]) / mean;
    }
    
    // %B = (Price - Lower) / (Upper - Lower)
    const bandRange = upper[i] - lower[i];
    if (bandRange !== 0) {
      percentB[i] = (prices[i] - lower[i]) / bandRange;
    }
  }
  
  return { upper, middle, lower, bandwidth, percentB };
}

/**
 * Calculate Average True Range (ATR)
 * 
 * ATR measures market volatility by decomposing the entire range
 * of an asset for that period.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param closes - Array of closing prices
 * @param period - Lookback period (default 14)
 * @returns Array of ATR values
 */
export function calculateATR(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14
): number[] {
  const atr: number[] = new Array(closes.length).fill(NaN);
  
  if (closes.length < period + 1) {
    return atr;
  }
  
  // Calculate True Range
  const tr: number[] = [highs[0] - lows[0]];
  
  for (let i = 1; i < closes.length; i++) {
    const trueRange = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    tr.push(trueRange);
  }
  
  // First ATR is SMA of TR
  let atrValue = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  atr[period - 1] = atrValue;
  
  // Subsequent ATRs use Wilder's smoothing
  for (let i = period; i < closes.length; i++) {
    atrValue = (atrValue * (period - 1) + tr[i]) / period;
    atr[i] = atrValue;
  }
  
  return atr;
}

/**
 * Calculate Keltner Channels
 * 
 * Keltner Channels are volatility-based bands set above and below an EMA.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param closes - Array of closing prices
 * @param emaPeriod - EMA period (default 20)
 * @param atrPeriod - ATR period (default 10)
 * @param multiplier - ATR multiplier (default 2)
 * @returns Upper, middle, lower channels
 */
export function calculateKeltnerChannels(
  highs: number[],
  lows: number[],
  closes: number[],
  emaPeriod: number = 20,
  atrPeriod: number = 10,
  multiplier: number = 2
): { upper: number[]; middle: number[]; lower: number[] } {
  const upper: number[] = new Array(closes.length).fill(NaN);
  const middle: number[] = new Array(closes.length).fill(NaN);
  const lower: number[] = new Array(closes.length).fill(NaN);
  
  // Calculate EMA
  const ema = calculateEMAInternal(closes, emaPeriod);
  
  // Calculate ATR
  const atr = calculateATR(highs, lows, closes, atrPeriod);
  
  for (let i = 0; i < closes.length; i++) {
    if (!isNaN(ema[i]) && !isNaN(atr[i])) {
      middle[i] = ema[i];
      upper[i] = ema[i] + (multiplier * atr[i]);
      lower[i] = ema[i] - (multiplier * atr[i]);
    }
  }
  
  return { upper, middle, lower };
}

/**
 * Calculate Standard Deviation
 * 
 * Rolling standard deviation of prices.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period (default 20)
 * @returns Array of standard deviation values
 */
export function calculateStdDev(prices: number[], period: number = 20): number[] {
  const std: number[] = new Array(prices.length).fill(NaN);
  
  if (prices.length < period) {
    return std;
  }
  
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const squaredDiffs = slice.map(p => Math.pow(p - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    std[i] = Math.sqrt(variance);
  }
  
  return std;
}

/**
 * Calculate Historical Volatility
 * 
 * Annualized volatility based on log returns.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period (default 20)
 * @param annualizationFactor - Trading periods per year (default 252)
 * @returns Array of annualized volatility values
 */
export function calculateHistoricalVolatility(
  prices: number[],
  period: number = 20,
  annualizationFactor: number = 252
): number[] {
  const volatility: number[] = new Array(prices.length).fill(NaN);
  
  if (prices.length < period + 1) {
    return volatility;
  }
  
  // Calculate log returns
  const logReturns: number[] = [0];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] > 0 && prices[i] > 0) {
      logReturns.push(Math.log(prices[i] / prices[i - 1]));
    } else {
      logReturns.push(0);
    }
  }
  
  // Calculate rolling volatility
  for (let i = period; i < prices.length; i++) {
    const slice = logReturns.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const squaredDiffs = slice.map(r => Math.pow(r - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (period - 1);
    
    // Annualize
    volatility[i] = Math.sqrt(variance * annualizationFactor);
  }
  
  return volatility;
}

/**
 * Calculate Average Daily Range (ADR)
 * 
 * Average of daily high-low range over a period.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param period - Lookback period (default 14)
 * @returns Array of ADR values
 */
export function calculateADR(
  highs: number[],
  lows: number[],
  period: number = 14
): number[] {
  const adr: number[] = new Array(highs.length).fill(NaN);
  
  if (highs.length < period) {
    return adr;
  }
  
  // Calculate daily ranges
  const ranges = highs.map((h, i) => h - lows[i]);
  
  // Calculate SMA of ranges
  for (let i = period - 1; i < highs.length; i++) {
    const slice = ranges.slice(i - period + 1, i + 1);
    adr[i] = slice.reduce((a, b) => a + b, 0) / period;
  }
  
  return adr;
}

/**
 * Calculate Volatility Ratio
 * 
 * Ratio of current true range to average true range.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param closes - Array of closing prices
 * @param period - ATR period (default 14)
 * @returns Array of volatility ratio values
 */
export function calculateVolatilityRatio(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14
): number[] {
  const ratio: number[] = new Array(closes.length).fill(NaN);
  
  const atr = calculateATR(highs, lows, closes, period);
  
  for (let i = 1; i < closes.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    
    if (!isNaN(atr[i]) && atr[i] !== 0) {
      ratio[i] = tr / atr[i];
    }
  }
  
  return ratio;
}

// Internal EMA helper
function calculateEMAInternal(prices: number[], period: number): number[] {
  const ema: number[] = new Array(prices.length).fill(NaN);
  const multiplier = 2 / (period + 1);
  
  if (prices.length < period) {
    return ema;
  }
  
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema[period - 1] = sum / period;
  
  for (let i = period; i < prices.length; i++) {
    ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }
  
  return ema;
}
