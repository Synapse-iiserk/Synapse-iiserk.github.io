/**
 * Statistics Module
 * =================
 * Statistical calculations for financial analysis
 */

import type { StatisticsResult } from './types';

/**
 * Calculate R-squared (Coefficient of Determination)
 * 
 * Measures how well a regression line fits the data.
 * 
 * @param actual - Array of actual values
 * @param predicted - Array of predicted values
 * @returns R-squared value (0 to 1)
 */
export function calculateRSquared(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length || actual.length === 0) {
    return NaN;
  }
  
  const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
  
  let ssRes = 0;
  let ssTot = 0;
  
  for (let i = 0; i < actual.length; i++) {
    ssRes += Math.pow(actual[i] - predicted[i], 2);
    ssTot += Math.pow(actual[i] - mean, 2);
  }
  
  if (ssTot === 0) {
    return 1; // Perfect fit if no variance
  }
  
  return 1 - (ssRes / ssTot);
}

/**
 * Calculate Pearson Correlation Coefficient
 * 
 * Measures linear correlation between two variables.
 * 
 * @param x - First array of values
 * @param y - Second array of values
 * @returns Correlation coefficient (-1 to 1)
 */
export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) {
    return NaN;
  }
  
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumSqX += dx * dx;
    sumSqY += dy * dy;
  }
  
  const denominator = Math.sqrt(sumSqX * sumSqY);
  
  if (denominator === 0) {
    return NaN;
  }
  
  return numerator / denominator;
}

/**
 * Calculate Sharpe Ratio
 * 
 * Risk-adjusted return measure.
 * 
 * @param returns - Array of returns
 * @param riskFreeRate - Annual risk-free rate (default 0)
 * @param periodsPerYear - Number of periods per year (default 252)
 * @returns Annualized Sharpe ratio
 */
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0,
  periodsPerYear: number = 252
): number {
  if (returns.length < 2) {
    return NaN;
  }
  
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns
    .map(r => Math.pow(r - meanReturn, 2))
    .reduce((a, b) => a + b, 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) {
    return meanReturn > riskFreeRate / periodsPerYear ? Infinity : -Infinity;
  }
  
  const excessReturn = meanReturn - (riskFreeRate / periodsPerYear);
  const sharpe = (excessReturn / stdDev) * Math.sqrt(periodsPerYear);
  
  return sharpe;
}

/**
 * Calculate Sortino Ratio
 * 
 * Similar to Sharpe but only penalizes downside volatility.
 * 
 * @param returns - Array of returns
 * @param riskFreeRate - Annual risk-free rate (default 0)
 * @param periodsPerYear - Number of periods per year (default 252)
 * @returns Annualized Sortino ratio
 */
export function calculateSortinoRatio(
  returns: number[],
  riskFreeRate: number = 0,
  periodsPerYear: number = 252
): number {
  if (returns.length < 2) {
    return NaN;
  }
  
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const targetReturn = riskFreeRate / periodsPerYear;
  
  // Calculate downside deviation
  const downsideReturns = returns
    .filter(r => r < targetReturn)
    .map(r => Math.pow(r - targetReturn, 2));
  
  if (downsideReturns.length === 0) {
    return Infinity;
  }
  
  const downsideDeviation = Math.sqrt(
    downsideReturns.reduce((a, b) => a + b, 0) / returns.length
  );
  
  if (downsideDeviation === 0) {
    return Infinity;
  }
  
  const excessReturn = meanReturn - targetReturn;
  return (excessReturn / downsideDeviation) * Math.sqrt(periodsPerYear);
}

/**
 * Calculate Maximum Drawdown
 * 
 * Maximum peak-to-trough decline.
 * 
 * @param prices - Array of prices or equity values
 * @returns Maximum drawdown as a percentage (0 to 1)
 */
export function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length < 2) {
    return 0;
  }
  
  let maxDrawdown = 0;
  let peak = prices[0];
  
  for (const price of prices) {
    if (price > peak) {
      peak = price;
    }
    
    const drawdown = (peak - price) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown;
}

/**
 * Calculate Drawdown Series
 * 
 * Returns drawdown at each point.
 * 
 * @param prices - Array of prices
 * @returns Array of drawdown values
 */
export function calculateDrawdownSeries(prices: number[]): number[] {
  const drawdowns: number[] = new Array(prices.length).fill(0);
  let peak = prices[0];
  
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] > peak) {
      peak = prices[i];
    }
    
    if (peak > 0) {
      drawdowns[i] = (peak - prices[i]) / peak;
    }
  }
  
  return drawdowns;
}

/**
 * Calculate Calmar Ratio
 * 
 * Return divided by maximum drawdown.
 * 
 * @param prices - Array of prices
 * @param periodsPerYear - Periods per year (default 252)
 * @returns Calmar ratio
 */
export function calculateCalmarRatio(
  prices: number[],
  periodsPerYear: number = 252
): number {
  if (prices.length < 2) {
    return NaN;
  }
  
  // Calculate annualized return
  const totalReturn = (prices[prices.length - 1] - prices[0]) / prices[0];
  const periods = prices.length - 1;
  const annualizedReturn = Math.pow(1 + totalReturn, periodsPerYear / periods) - 1;
  
  const maxDrawdown = calculateMaxDrawdown(prices);
  
  if (maxDrawdown === 0) {
    return Infinity;
  }
  
  return annualizedReturn / maxDrawdown;
}

/**
 * Calculate Basic Statistics
 * 
 * Computes common statistical measures for a dataset.
 * 
 * @param data - Array of numbers
 * @returns Statistical summary
 */
export function calculateStatistics(data: number[]): StatisticsResult {
  if (data.length === 0) {
    return {
      mean: NaN,
      std: NaN,
      min: NaN,
      max: NaN,
      median: NaN,
      skewness: NaN,
      kurtosis: NaN,
    };
  }
  
  const n = data.length;
  const sorted = [...data].sort((a, b) => a - b);
  
  // Mean
  const mean = data.reduce((a, b) => a + b, 0) / n;
  
  // Standard deviation
  const variance = data
    .map(x => Math.pow(x - mean, 2))
    .reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(variance);
  
  // Min/Max
  const min = sorted[0];
  const max = sorted[n - 1];
  
  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  
  // Skewness
  const m3 = data
    .map(x => Math.pow(x - mean, 3))
    .reduce((a, b) => a + b, 0) / n;
  const skewness = std > 0 ? m3 / Math.pow(std, 3) : 0;
  
  // Kurtosis (excess)
  const m4 = data
    .map(x => Math.pow(x - mean, 4))
    .reduce((a, b) => a + b, 0) / n;
  const kurtosis = std > 0 ? m4 / Math.pow(std, 4) - 3 : 0;
  
  return { mean, std, min, max, median, skewness, kurtosis };
}

/**
 * Calculate Rolling Correlation
 * 
 * Correlation between two series over rolling windows.
 * 
 * @param x - First array
 * @param y - Second array
 * @param period - Window size
 * @returns Array of correlation values
 */
export function calculateRollingCorrelation(
  x: number[],
  y: number[],
  period: number
): number[] {
  const correlations: number[] = new Array(x.length).fill(NaN);
  
  if (x.length !== y.length || x.length < period) {
    return correlations;
  }
  
  for (let i = period - 1; i < x.length; i++) {
    const xSlice = x.slice(i - period + 1, i + 1);
    const ySlice = y.slice(i - period + 1, i + 1);
    correlations[i] = calculateCorrelation(xSlice, ySlice);
  }
  
  return correlations;
}

/**
 * Calculate Beta
 * 
 * Measure of volatility relative to market.
 * 
 * @param assetReturns - Asset return series
 * @param marketReturns - Market return series
 * @returns Beta coefficient
 */
export function calculateBeta(
  assetReturns: number[],
  marketReturns: number[]
): number {
  if (assetReturns.length !== marketReturns.length || assetReturns.length < 2) {
    return NaN;
  }
  
  const n = assetReturns.length;
  const meanAsset = assetReturns.reduce((a, b) => a + b, 0) / n;
  const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / n;
  
  let covariance = 0;
  let marketVariance = 0;
  
  for (let i = 0; i < n; i++) {
    const dAsset = assetReturns[i] - meanAsset;
    const dMarket = marketReturns[i] - meanMarket;
    covariance += dAsset * dMarket;
    marketVariance += dMarket * dMarket;
  }
  
  if (marketVariance === 0) {
    return NaN;
  }
  
  return covariance / marketVariance;
}

/**
 * Calculate Alpha (Jensen's Alpha)
 * 
 * Excess return over CAPM expected return.
 * 
 * @param assetReturns - Asset returns
 * @param marketReturns - Market returns
 * @param riskFreeRate - Risk-free rate per period
 * @returns Alpha value
 */
export function calculateAlpha(
  assetReturns: number[],
  marketReturns: number[],
  riskFreeRate: number = 0
): number {
  const beta = calculateBeta(assetReturns, marketReturns);
  
  if (isNaN(beta)) {
    return NaN;
  }
  
  const meanAsset = assetReturns.reduce((a, b) => a + b, 0) / assetReturns.length;
  const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;
  
  // CAPM: Expected Return = Rf + Beta * (Rm - Rf)
  const expectedReturn = riskFreeRate + beta * (meanMarket - riskFreeRate);
  
  return meanAsset - expectedReturn;
}
