/**
 * Regression Module
 * =================
 * Trend fitting and regression analysis
 */

import type { LinearRegressionResult, QuadraticRegressionResult, RegressionResult } from './types';
import { calculateRSquared } from './statistics';

/**
 * Fit Linear Regression
 * 
 * Fits a line y = mx + b to the data using least squares.
 * 
 * @param data - Array of y values (x is assumed to be indices)
 * @returns Linear regression result with slope, intercept, fitted values, R²
 */
export function fitLinear(data: number[]): LinearRegressionResult {
  const n = data.length;
  
  if (n < 2) {
    return {
      slope: NaN,
      intercept: NaN,
      fitted: [],
      rSquared: NaN,
      equation: '',
    };
  }
  
  // Create x values (0, 1, 2, ...)
  const x = Array.from({ length: n }, (_, i) => i);
  
  // Calculate means
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = data.reduce((a, b) => a + b, 0) / n;
  
  // Calculate slope
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (data[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;
  
  // Calculate fitted values
  const fitted = x.map(xi => slope * xi + intercept);
  
  // Calculate R²
  const rSquared = calculateRSquared(data, fitted);
  
  // Create equation string
  const sign = intercept >= 0 ? '+' : '-';
  const equation = `y = ${slope.toFixed(4)}x ${sign} ${Math.abs(intercept).toFixed(4)}`;
  
  return { slope, intercept, fitted, rSquared, equation };
}

/**
 * Fit Quadratic Regression
 * 
 * Fits a parabola y = ax² + bx + c to the data.
 * 
 * @param data - Array of y values
 * @returns Quadratic regression result
 */
export function fitQuadratic(data: number[]): QuadraticRegressionResult {
  const n = data.length;
  
  if (n < 3) {
    return {
      a: NaN,
      b: NaN,
      c: NaN,
      fitted: [],
      rSquared: NaN,
      equation: '',
    };
  }
  
  // Create x values
  const x = Array.from({ length: n }, (_, i) => i);
  
  // Build matrices for normal equations
  // [Σx⁴  Σx³  Σx²] [a]   [Σx²y]
  // [Σx³  Σx²  Σx ] [b] = [Σxy ]
  // [Σx²  Σx   n  ] [c]   [Σy  ]
  
  let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
  let sumY = 0, sumXY = 0, sumX2Y = 0;
  
  for (let i = 0; i < n; i++) {
    const xi = x[i];
    const yi = data[i];
    const x2 = xi * xi;
    const x3 = x2 * xi;
    const x4 = x3 * xi;
    
    sumX += xi;
    sumX2 += x2;
    sumX3 += x3;
    sumX4 += x4;
    sumY += yi;
    sumXY += xi * yi;
    sumX2Y += x2 * yi;
  }
  
  // Solve using Cramer's rule (simplified for 3x3)
  const matrix = [
    [sumX4, sumX3, sumX2],
    [sumX3, sumX2, sumX],
    [sumX2, sumX, n],
  ];
  
  const det = determinant3x3(matrix);
  
  if (Math.abs(det) < 1e-10) {
    // Fall back to linear if matrix is singular
    const linear = fitLinear(data);
    return {
      a: 0,
      b: linear.slope,
      c: linear.intercept,
      fitted: linear.fitted,
      rSquared: linear.rSquared,
      equation: linear.equation,
    };
  }
  
  const matrixA = [
    [sumX2Y, sumX3, sumX2],
    [sumXY, sumX2, sumX],
    [sumY, sumX, n],
  ];
  
  const matrixB = [
    [sumX4, sumX2Y, sumX2],
    [sumX3, sumXY, sumX],
    [sumX2, sumY, n],
  ];
  
  const matrixC = [
    [sumX4, sumX3, sumX2Y],
    [sumX3, sumX2, sumXY],
    [sumX2, sumX, sumY],
  ];
  
  const a = determinant3x3(matrixA) / det;
  const b = determinant3x3(matrixB) / det;
  const c = determinant3x3(matrixC) / det;
  
  // Calculate fitted values
  const fitted = x.map(xi => a * xi * xi + b * xi + c);
  
  // Calculate R²
  const rSquared = calculateRSquared(data, fitted);
  
  // Create equation string
  const signB = b >= 0 ? '+' : '-';
  const signC = c >= 0 ? '+' : '-';
  const equation = `y = ${a.toFixed(4)}x² ${signB} ${Math.abs(b).toFixed(4)}x ${signC} ${Math.abs(c).toFixed(4)}`;
  
  return { a, b, c, fitted, rSquared, equation };
}

/**
 * Fit Exponential Regression
 * 
 * Fits y = a * e^(bx) to the data.
 * 
 * @param data - Array of positive y values
 * @returns Exponential regression result
 */
export function fitExponential(data: number[]): RegressionResult & { a: number; b: number } {
  const n = data.length;
  
  // Filter out non-positive values
  const validIndices: number[] = [];
  const logData: number[] = [];
  
  for (let i = 0; i < n; i++) {
    if (data[i] > 0) {
      validIndices.push(i);
      logData.push(Math.log(data[i]));
    }
  }
  
  if (logData.length < 2) {
    return {
      a: NaN,
      b: NaN,
      fitted: new Array(n).fill(NaN),
      rSquared: NaN,
      equation: '',
    };
  }
  
  // Fit linear to log-transformed data
  const linear = fitLinear(logData);
  
  // Transform back
  const b = linear.slope;
  const a = Math.exp(linear.intercept);
  
  // Calculate fitted values for original indices
  const fitted: number[] = [];
  for (let i = 0; i < n; i++) {
    fitted.push(a * Math.exp(b * i));
  }
  
  // Calculate R² on original scale
  const rSquared = calculateRSquared(
    validIndices.map(i => data[i]),
    validIndices.map(i => fitted[i])
  );
  
  const equation = `y = ${a.toFixed(4)} × e^(${b.toFixed(4)}x)`;
  
  return { a, b, fitted, rSquared, equation };
}

/**
 * Find Best Fit
 * 
 * Compares linear, quadratic, and exponential fits and returns the best one.
 * 
 * @param data - Array of values
 * @returns Best fitting model with type and parameters
 */
export function findBestFit(data: number[]): {
  bestFit: 'linear' | 'quadratic' | 'exponential';
  fits: {
    linear: LinearRegressionResult;
    quadratic: QuadraticRegressionResult;
    exponential: RegressionResult & { a: number; b: number };
  };
} {
  const linear = fitLinear(data);
  const quadratic = fitQuadratic(data);
  const exponential = fitExponential(data);
  
  // Compare R² values (penalize more complex models slightly)
  const linearScore = linear.rSquared;
  const quadraticScore = quadratic.rSquared - 0.01; // Penalty for complexity
  const exponentialScore = isNaN(exponential.rSquared) ? -1 : exponential.rSquared - 0.01;
  
  let bestFit: 'linear' | 'quadratic' | 'exponential' = 'linear';
  
  if (quadraticScore > linearScore && quadraticScore >= exponentialScore) {
    bestFit = 'quadratic';
  } else if (exponentialScore > linearScore && exponentialScore > quadraticScore) {
    bestFit = 'exponential';
  }
  
  return {
    bestFit,
    fits: { linear, quadratic, exponential },
  };
}

/**
 * Calculate Trend Line
 * 
 * Simple linear trend line through the data.
 * 
 * @param data - Array of values
 * @returns Array of trend line values
 */
export function calculateTrendLine(data: number[]): number[] {
  const { fitted } = fitLinear(data);
  return fitted;
}

/**
 * Predict Future Values
 * 
 * Extends the trend line into the future.
 * 
 * @param data - Historical data
 * @param steps - Number of steps to predict
 * @param fitType - Type of fit ('linear', 'quadratic', 'exponential')
 * @returns Predicted values
 */
export function predictFuture(
  data: number[],
  steps: number,
  fitType: 'linear' | 'quadratic' | 'exponential' = 'linear'
): number[] {
  const n = data.length;
  const predictions: number[] = [];
  
  if (fitType === 'linear') {
    const { slope, intercept } = fitLinear(data);
    for (let i = 0; i < steps; i++) {
      predictions.push(slope * (n + i) + intercept);
    }
  } else if (fitType === 'quadratic') {
    const { a, b, c } = fitQuadratic(data);
    for (let i = 0; i < steps; i++) {
      const x = n + i;
      predictions.push(a * x * x + b * x + c);
    }
  } else if (fitType === 'exponential') {
    const { a, b } = fitExponential(data);
    for (let i = 0; i < steps; i++) {
      predictions.push(a * Math.exp(b * (n + i)));
    }
  }
  
  return predictions;
}

// Helper: Calculate 3x3 matrix determinant
function determinant3x3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}
