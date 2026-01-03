/**
 * Technical Indicators - Trend
 * =============================
 * Trend-following technical indicators implementation in TypeScript
 */

/**
 * Calculate Simple Moving Average (SMA)
 * 
 * SMA is the arithmetic mean of prices over a specified period.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period
 * @returns Array of SMA values
 */
export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = new Array(prices.length).fill(NaN);
  
  if (prices.length < period) {
    return sma;
  }
  
  // Calculate first SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  sma[period - 1] = sum / period;
  
  // Rolling calculation for efficiency
  for (let i = period; i < prices.length; i++) {
    sum = sum - prices[i - period] + prices[i];
    sma[i] = sum / period;
  }
  
  return sma;
}

/**
 * Calculate Exponential Moving Average (EMA)
 * 
 * EMA gives more weight to recent prices, making it more responsive
 * to new information.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period
 * @returns Array of EMA values
 */
export function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = new Array(prices.length).fill(NaN);
  const multiplier = 2 / (period + 1);
  
  if (prices.length < period) {
    return ema;
  }
  
  // Start with SMA for first value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema[period - 1] = sum / period;
  
  // Calculate EMA
  for (let i = period; i < prices.length; i++) {
    ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }
  
  return ema;
}

/**
 * Calculate Weighted Moving Average (WMA)
 * 
 * WMA assigns linearly increasing weights to more recent prices.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period
 * @returns Array of WMA values
 */
export function calculateWMA(prices: number[], period: number): number[] {
  const wma: number[] = new Array(prices.length).fill(NaN);
  const divisor = (period * (period + 1)) / 2;
  
  if (prices.length < period) {
    return wma;
  }
  
  for (let i = period - 1; i < prices.length; i++) {
    let weightedSum = 0;
    for (let j = 0; j < period; j++) {
      weightedSum += prices[i - period + 1 + j] * (j + 1);
    }
    wma[i] = weightedSum / divisor;
  }
  
  return wma;
}

/**
 * Calculate Awesome Oscillator (AO)
 * 
 * AO is the difference between 5-period and 34-period SMA of median price.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param fastPeriod - Fast SMA period (default 5)
 * @param slowPeriod - Slow SMA period (default 34)
 * @returns Array of AO values
 */
export function calculateAwesomeOscillator(
  highs: number[],
  lows: number[],
  fastPeriod: number = 5,
  slowPeriod: number = 34
): number[] {
  const medianPrices = highs.map((h, i) => (h + lows[i]) / 2);
  
  const fastSMA = calculateSMA(medianPrices, fastPeriod);
  const slowSMA = calculateSMA(medianPrices, slowPeriod);
  
  const ao: number[] = new Array(highs.length).fill(NaN);
  
  for (let i = 0; i < highs.length; i++) {
    if (!isNaN(fastSMA[i]) && !isNaN(slowSMA[i])) {
      ao[i] = fastSMA[i] - slowSMA[i];
    }
  }
  
  return ao;
}

/**
 * Calculate Accelerator Oscillator (AC)
 * 
 * AC is the difference between AO and its 5-period SMA.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param aoPeriod - Period for AO calculation (default 5)
 * @returns Array of AC values
 */
export function calculateAcceleratorOscillator(
  highs: number[],
  lows: number[],
  aoPeriod: number = 5
): number[] {
  const ao = calculateAwesomeOscillator(highs, lows);
  const validAO = ao.filter(v => !isNaN(v));
  
  if (validAO.length < aoPeriod) {
    return new Array(highs.length).fill(NaN);
  }
  
  const aoSMA = calculateSMA(validAO, aoPeriod);
  
  const ac: number[] = new Array(highs.length).fill(NaN);
  let validIdx = 0;
  let smaIdx = 0;
  
  for (let i = 0; i < ao.length; i++) {
    if (!isNaN(ao[i])) {
      if (smaIdx < aoSMA.length && !isNaN(aoSMA[smaIdx])) {
        ac[i] = validAO[validIdx] - aoSMA[smaIdx];
      }
      validIdx++;
      smaIdx++;
    }
  }
  
  return ac;
}

/**
 * Calculate Moving Average Crossover Signals
 * 
 * Generates buy/sell signals based on MA crossovers.
 * 
 * @param prices - Array of prices
 * @param fastPeriod - Fast MA period
 * @param slowPeriod - Slow MA period
 * @param maType - Type of MA ('sma' or 'ema')
 * @returns Array of signals (1 = buy, -1 = sell, 0 = hold)
 */
export function calculateMACrossoverSignals(
  prices: number[],
  fastPeriod: number,
  slowPeriod: number,
  maType: 'sma' | 'ema' = 'ema'
): number[] {
  const signals: number[] = new Array(prices.length).fill(0);
  
  const fastMA = maType === 'ema' 
    ? calculateEMA(prices, fastPeriod)
    : calculateSMA(prices, fastPeriod);
  
  const slowMA = maType === 'ema'
    ? calculateEMA(prices, slowPeriod)
    : calculateSMA(prices, slowPeriod);
  
  for (let i = 1; i < prices.length; i++) {
    if (isNaN(fastMA[i]) || isNaN(slowMA[i]) || isNaN(fastMA[i-1]) || isNaN(slowMA[i-1])) {
      continue;
    }
    
    // Bullish crossover
    if (fastMA[i] > slowMA[i] && fastMA[i-1] <= slowMA[i-1]) {
      signals[i] = 1;
    }
    // Bearish crossover
    else if (fastMA[i] < slowMA[i] && fastMA[i-1] >= slowMA[i-1]) {
      signals[i] = -1;
    }
  }
  
  return signals;
}

/**
 * Calculate Trend Strength
 * 
 * Measures the strength of the current trend using ADX-like logic.
 * 
 * @param prices - Array of prices
 * @param period - Lookback period (default 14)
 * @returns Array of trend strength values (0-100)
 */
export function calculateTrendStrength(prices: number[], period: number = 14): number[] {
  const strength: number[] = new Array(prices.length).fill(NaN);
  
  if (prices.length < period + 1) {
    return strength;
  }
  
  for (let i = period; i < prices.length; i++) {
    const slice = prices.slice(i - period, i + 1);
    const returns = [];
    
    for (let j = 1; j < slice.length; j++) {
      returns.push((slice[j] - slice[j-1]) / slice[j-1]);
    }
    
    // Count positive and negative returns
    const positive = returns.filter(r => r > 0).length;
    const negative = returns.filter(r => r < 0).length;
    
    // Calculate directional strength
    const total = positive + negative;
    if (total > 0) {
      strength[i] = (Math.abs(positive - negative) / total) * 100;
    }
  }
  
  return strength;
}
