/**
 * Technical Indicators - Volume
 * ==============================
 * Volume-based technical indicators implementation in TypeScript
 */

/**
 * Calculate On-Balance Volume (OBV)
 * 
 * OBV is a cumulative indicator that adds volume on up days
 * and subtracts on down days.
 * 
 * @param closes - Array of closing prices
 * @param volumes - Array of volumes
 * @returns Array of OBV values
 */
export function calculateOBV(closes: number[], volumes: number[]): number[] {
  const obv: number[] = new Array(closes.length).fill(0);
  
  if (closes.length === 0) {
    return obv;
  }
  
  obv[0] = volumes[0];
  
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i - 1]) {
      obv[i] = obv[i - 1] + volumes[i];
    } else if (closes[i] < closes[i - 1]) {
      obv[i] = obv[i - 1] - volumes[i];
    } else {
      obv[i] = obv[i - 1];
    }
  }
  
  return obv;
}

/**
 * Calculate Accumulation/Distribution Line (ADL)
 * 
 * ADL uses the close location value (CLV) and volume to measure
 * the cumulative flow of money into and out of a security.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param closes - Array of closing prices
 * @param volumes - Array of volumes
 * @returns Array of ADL values
 */
export function calculateADL(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[]
): number[] {
  const adl: number[] = new Array(closes.length).fill(0);
  
  if (closes.length === 0) {
    return adl;
  }
  
  let cumulative = 0;
  
  for (let i = 0; i < closes.length; i++) {
    const range = highs[i] - lows[i];
    
    if (range !== 0) {
      // Close Location Value (CLV)
      const clv = ((closes[i] - lows[i]) - (highs[i] - closes[i])) / range;
      cumulative += clv * volumes[i];
    }
    
    adl[i] = cumulative;
  }
  
  return adl;
}

/**
 * Calculate Money Flow Index (MFI)
 * 
 * MFI is a volume-weighted RSI that measures buying and selling pressure.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param closes - Array of closing prices
 * @param volumes - Array of volumes
 * @param period - Lookback period (default 14)
 * @returns Array of MFI values (0-100)
 */
export function calculateMFI(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
  period: number = 14
): number[] {
  const mfi: number[] = new Array(closes.length).fill(NaN);
  
  if (closes.length < period + 1) {
    return mfi;
  }
  
  // Calculate typical price and raw money flow
  const typicalPrices: number[] = [];
  const rawMoneyFlow: number[] = [];
  
  for (let i = 0; i < closes.length; i++) {
    const tp = (highs[i] + lows[i] + closes[i]) / 3;
    typicalPrices.push(tp);
    rawMoneyFlow.push(tp * volumes[i]);
  }
  
  // Calculate MFI
  for (let i = period; i < closes.length; i++) {
    let positiveFlow = 0;
    let negativeFlow = 0;
    
    for (let j = i - period + 1; j <= i; j++) {
      if (typicalPrices[j] > typicalPrices[j - 1]) {
        positiveFlow += rawMoneyFlow[j];
      } else if (typicalPrices[j] < typicalPrices[j - 1]) {
        negativeFlow += rawMoneyFlow[j];
      }
    }
    
    if (negativeFlow === 0) {
      mfi[i] = 100;
    } else {
      const moneyFlowRatio = positiveFlow / negativeFlow;
      mfi[i] = 100 - (100 / (1 + moneyFlowRatio));
    }
  }
  
  return mfi;
}

/**
 * Calculate Chaikin Money Flow (CMF)
 * 
 * CMF measures the amount of money flow volume over a specific period.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param closes - Array of closing prices
 * @param volumes - Array of volumes
 * @param period - Lookback period (default 20)
 * @returns Array of CMF values (-1 to 1)
 */
export function calculateCMF(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
  period: number = 20
): number[] {
  const cmf: number[] = new Array(closes.length).fill(NaN);
  
  if (closes.length < period) {
    return cmf;
  }
  
  // Calculate money flow multiplier and volume
  const mfMultiplier: number[] = [];
  const mfVolume: number[] = [];
  
  for (let i = 0; i < closes.length; i++) {
    const range = highs[i] - lows[i];
    
    if (range !== 0) {
      const mult = ((closes[i] - lows[i]) - (highs[i] - closes[i])) / range;
      mfMultiplier.push(mult);
      mfVolume.push(mult * volumes[i]);
    } else {
      mfMultiplier.push(0);
      mfVolume.push(0);
    }
  }
  
  // Calculate CMF
  for (let i = period - 1; i < closes.length; i++) {
    const volumeSum = volumes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    const mfvSum = mfVolume.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    
    if (volumeSum !== 0) {
      cmf[i] = mfvSum / volumeSum;
    }
  }
  
  return cmf;
}

/**
 * Calculate Price Volume Trend (PVT)
 * 
 * PVT is similar to OBV but includes the percentage change in price.
 * 
 * @param closes - Array of closing prices
 * @param volumes - Array of volumes
 * @returns Array of PVT values
 */
export function calculatePVT(closes: number[], volumes: number[]): number[] {
  const pvt: number[] = new Array(closes.length).fill(0);
  
  if (closes.length === 0) {
    return pvt;
  }
  
  pvt[0] = 0;
  
  for (let i = 1; i < closes.length; i++) {
    const priceChange = (closes[i] - closes[i - 1]) / closes[i - 1];
    pvt[i] = pvt[i - 1] + (priceChange * volumes[i]);
  }
  
  return pvt;
}

/**
 * Calculate Volume Weighted Average Price (VWAP)
 * 
 * VWAP is the ratio of value traded to total volume traded.
 * 
 * @param highs - Array of high prices
 * @param lows - Array of low prices
 * @param closes - Array of closing prices
 * @param volumes - Array of volumes
 * @returns Array of VWAP values
 */
export function calculateVWAP(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[]
): number[] {
  const vwap: number[] = new Array(closes.length).fill(NaN);
  
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  
  for (let i = 0; i < closes.length; i++) {
    const typicalPrice = (highs[i] + lows[i] + closes[i]) / 3;
    cumulativeTPV += typicalPrice * volumes[i];
    cumulativeVolume += volumes[i];
    
    if (cumulativeVolume !== 0) {
      vwap[i] = cumulativeTPV / cumulativeVolume;
    }
  }
  
  return vwap;
}

/**
 * Calculate Volume Rate of Change
 * 
 * Measures the percentage change in volume over a specified period.
 * 
 * @param volumes - Array of volumes
 * @param period - Lookback period (default 12)
 * @returns Array of volume ROC values
 */
export function calculateVolumeROC(volumes: number[], period: number = 12): number[] {
  const vroc: number[] = new Array(volumes.length).fill(NaN);
  
  for (let i = period; i < volumes.length; i++) {
    if (volumes[i - period] !== 0) {
      vroc[i] = ((volumes[i] - volumes[i - period]) / volumes[i - period]) * 100;
    }
  }
  
  return vroc;
}

/**
 * Calculate Volume-Price Confirmation
 * 
 * Checks if volume confirms price movements (higher volume on moves).
 * 
 * @param closes - Array of closing prices
 * @param volumes - Array of volumes
 * @param period - Lookback period (default 10)
 * @returns Array of confirmation scores (-100 to 100)
 */
export function calculateVolumePriceConfirmation(
  closes: number[],
  volumes: number[],
  period: number = 10
): number[] {
  const confirmation: number[] = new Array(closes.length).fill(NaN);
  
  if (closes.length < period) {
    return confirmation;
  }
  
  for (let i = period; i < closes.length; i++) {
    const priceChange = closes[i] - closes[i - period];
    const avgVolume = volumes.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
    const currentVolume = volumes[i];
    
    // Price up with above-average volume = positive confirmation
    // Price down with above-average volume = negative confirmation
    const volumeRatio = avgVolume !== 0 ? currentVolume / avgVolume : 1;
    
    if (priceChange > 0) {
      confirmation[i] = Math.min(100, volumeRatio * 50);
    } else if (priceChange < 0) {
      confirmation[i] = Math.max(-100, -volumeRatio * 50);
    } else {
      confirmation[i] = 0;
    }
  }
  
  return confirmation;
}
