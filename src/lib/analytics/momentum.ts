/**
 * Technical Indicators - Momentum
 * ================================
 * Momentum-based technical indicators implementation in TypeScript
 */

import type { MACDResult, StochasticResult } from './types';

/**
 * Calculate Relative Strength Index (RSI)
 * 
 * RSI measures the speed and magnitude of recent price changes to evaluate
 * overbought or oversold conditions.
 * 
 * @param prices - Array of closing prices
 * @param period - Lookback period (default 14)
 * @returns Array of RSI values (0-100)
 */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsi: number[] = new Array(prices.length).fill(NaN);
  
  if (prices.length < period + 1) {
    return rsi;
  }
  
  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  // Separate gains and losses
  const gains = changes.map(c => c > 0 ? c : 0);
  const losses = changes.map(c => c < 0 ? -c : 0);
  
  // Calculate initial average gain/loss using SMA
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  // First RSI value
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi[period] = 100 - (100 / (1 + rs));
  
  // Calculate subsequent RSI values using Wilder's smoothing
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    
    const currentRs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi[i + 1] = 100 - (100 / (1 + currentRs));
  }
  
  return rsi;
}

/**
 * Calculate Moving Average Convergence Divergence (MACD)
 * 
 * MACD is a trend-following momentum indicator that shows the relationship
 * between two EMAs of prices.
 * 
 * @param prices - Array of closing prices
 * @param fastPeriod - Fast EMA period (default 12)
 * @param slowPeriod - Slow EMA period (default 26)
 * @param signalPeriod - Signal line EMA period (default 9)
 * @returns MACD line, signal line, and histogram
 */
export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const macd: number[] = new Array(prices.length).fill(NaN);
  const signal: number[] = new Array(prices.length).fill(NaN);
  const histogram: number[] = new Array(prices.length).fill(NaN);
  
  if (prices.length < slowPeriod) {
    return { macd, signal, histogram };
  }
  
  // Calculate EMAs
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  // Calculate MACD line
  for (let i = 0; i < prices.length; i++) {
    if (!isNaN(fastEMA[i]) && !isNaN(slowEMA[i])) {
      macd[i] = fastEMA[i] - slowEMA[i];
    }
  }
  
  // Calculate signal line (EMA of MACD)
  const validMacd = macd.filter(v => !isNaN(v));
  if (validMacd.length >= signalPeriod) {
    const signalEMA = calculateEMA(validMacd, signalPeriod);
    let signalIdx = 0;
    for (let i = 0; i < macd.length; i++) {
      if (!isNaN(macd[i])) {
        if (signalIdx < signalEMA.length) {
          signal[i] = signalEMA[signalIdx];
        }
        signalIdx++;
      }
    }
  }
  
  // Calculate histogram
  for (let i = 0; i < prices.length; i++) {
    if (!isNaN(macd[i]) && !isNaN(signal[i])) {
      histogram[i] = macd[i] - signal[i];
    }
  }
  
  return { macd, signal, histogram };
}

/**
 * Calculate Stochastic Oscillator
 * 
 * The stochastic oscillator compares a closing price to its price range
 * over a given time period.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param closes - Array of closing prices
 * @param kPeriod - %K period (default 14)
 * @param dPeriod - %D period (default 3)
 * @returns %K and %D values
 */
export function calculateStochastic(
  highs: number[],
  lows: number[],
  closes: number[],
  kPeriod: number = 14,
  dPeriod: number = 3
): StochasticResult {
  const k: number[] = new Array(closes.length).fill(NaN);
  const d: number[] = new Array(closes.length).fill(NaN);
  
  if (closes.length < kPeriod) {
    return { k, d };
  }
  
  // Calculate %K
  for (let i = kPeriod - 1; i < closes.length; i++) {
    const highSlice = highs.slice(i - kPeriod + 1, i + 1);
    const lowSlice = lows.slice(i - kPeriod + 1, i + 1);
    
    const highestHigh = Math.max(...highSlice);
    const lowestLow = Math.min(...lowSlice);
    
    if (highestHigh !== lowestLow) {
      k[i] = ((closes[i] - lowestLow) / (highestHigh - lowestLow)) * 100;
    } else {
      k[i] = 50; // Default when range is zero
    }
  }
  
  // Calculate %D (SMA of %K)
  for (let i = kPeriod + dPeriod - 2; i < closes.length; i++) {
    const kSlice = k.slice(i - dPeriod + 1, i + 1).filter(v => !isNaN(v));
    if (kSlice.length === dPeriod) {
      d[i] = kSlice.reduce((a, b) => a + b, 0) / dPeriod;
    }
  }
  
  return { k, d };
}

/**
 * Calculate Rate of Change (ROC)
 * 
 * ROC measures the percentage change between the current price and
 * the price n periods ago.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period (default 12)
 * @returns Array of ROC values (percentage)
 */
export function calculateROC(prices: number[], period: number = 12): number[] {
  const roc: number[] = new Array(prices.length).fill(NaN);
  
  for (let i = period; i < prices.length; i++) {
    if (prices[i - period] !== 0) {
      roc[i] = ((prices[i] - prices[i - period]) / prices[i - period]) * 100;
    }
  }
  
  return roc;
}

/**
 * Calculate Momentum
 * 
 * Simple momentum is the difference between current price and price n periods ago.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period (default 10)
 * @returns Array of momentum values
 */
export function calculateMomentum(prices: number[], period: number = 10): number[] {
  const momentum: number[] = new Array(prices.length).fill(NaN);
  
  for (let i = period; i < prices.length; i++) {
    momentum[i] = prices[i] - prices[i - period];
  }
  
  return momentum;
}

/**
 * Helper: Calculate Exponential Moving Average
 */
function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = new Array(prices.length).fill(NaN);
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  let sum = 0;
  for (let i = 0; i < period && i < prices.length; i++) {
    sum += prices[i];
  }
  
  if (prices.length >= period) {
    ema[period - 1] = sum / period;
    
    for (let i = period; i < prices.length; i++) {
      ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }
  }
  
  return ema;
}
