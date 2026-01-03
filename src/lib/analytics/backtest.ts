/**
 * Backtesting Module
 * ==================
 * Simple backtesting engine for strategy evaluation
 */

import type {
  OHLCV,
  Trade,
  BacktestConfig,
  BacktestResult,
  PerformanceMetrics,
} from './types';
import { calculateMaxDrawdown, calculateSharpeRatio, calculateCalmarRatio } from './statistics';

/**
 * Default backtest configuration
 */
export const DEFAULT_CONFIG: BacktestConfig = {
  initialCapital: 10000,
  leverage: 1,
  commission: 0.001, // 0.1%
  slippage: 0.0005, // 0.05%
  useTrailingStop: false,
  trailingStopPercent: 0.05,
};

/**
 * Simple Backtest Engine
 * 
 * Executes trades based on signals and tracks performance.
 */
export class BacktestEngine {
  private capital: number;
  private position: number = 0;
  private positionSide: 'long' | 'short' | null = null;
  private entryPrice: number = 0;
  private entryTime?: Date;
  private trades: Trade[] = [];
  private equityCurve: number[] = [];
  private trailingStop: number | null = null;
  private highWaterMark: number = 0;
  private config: BacktestConfig;
  
  constructor(config: Partial<BacktestConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.capital = this.config.initialCapital;
    this.equityCurve.push(this.capital);
  }
  
  /**
   * Run backtest with OHLCV data and signals
   * 
   * @param data - OHLCV data array
   * @param signals - Array of signals (1 = buy, -1 = sell, 0 = hold)
   * @returns Backtest results
   */
  run(data: OHLCV[], signals: number[]): BacktestResult {
    if (data.length !== signals.length) {
      throw new Error('Data and signals must have same length');
    }
    
    for (let i = 0; i < data.length; i++) {
      const candle = data[i];
      const signal = signals[i];
      
      // Update trailing stop if enabled
      if (this.config.useTrailingStop && this.position !== 0) {
        this.updateTrailingStop(candle.close);
        
        // Check if trailing stop hit
        if (this.trailingStop !== null) {
          if (this.positionSide === 'long' && candle.low <= this.trailingStop) {
            this.closePosition(this.trailingStop, candle.timestamp);
            continue;
          }
          if (this.positionSide === 'short' && candle.high >= this.trailingStop) {
            this.closePosition(this.trailingStop, candle.timestamp);
            continue;
          }
        }
      }
      
      // Process signal
      if (signal === 1 && this.position <= 0) {
        // Close short if exists
        if (this.position < 0) {
          this.closePosition(candle.close, candle.timestamp);
        }
        // Open long
        this.openPosition(candle.close, 'long', candle.timestamp);
      } else if (signal === -1 && this.position >= 0) {
        // Close long if exists
        if (this.position > 0) {
          this.closePosition(candle.close, candle.timestamp);
        }
        // Open short
        this.openPosition(candle.close, 'short', candle.timestamp);
      }
      
      // Update equity curve
      this.updateEquity(candle.close);
    }
    
    // Close any remaining position
    if (this.position !== 0 && data.length > 0) {
      this.closePosition(data[data.length - 1].close, data[data.length - 1].timestamp);
    }
    
    return {
      trades: this.trades,
      equityCurve: this.equityCurve,
      metrics: this.calculateMetrics(),
    };
  }
  
  /**
   * Open a new position
   */
  private openPosition(
    price: number,
    side: 'long' | 'short',
    timestamp?: number | Date
  ): void {
    // Apply slippage
    const slippageMultiplier = side === 'long' ? 1 + this.config.slippage : 1 - this.config.slippage;
    const entryPrice = price * slippageMultiplier;
    
    // Calculate position size
    const commission = this.capital * this.config.commission;
    const availableCapital = this.capital - commission;
    const positionValue = availableCapital * this.config.leverage;
    
    this.position = side === 'long' ? positionValue / entryPrice : -positionValue / entryPrice;
    this.positionSide = side;
    this.entryPrice = entryPrice;
    this.entryTime = timestamp instanceof Date ? timestamp : timestamp ? new Date(timestamp) : undefined;
    this.highWaterMark = entryPrice;
    this.trailingStop = null;
    
    // Deduct commission
    this.capital -= commission;
  }
  
  /**
   * Close current position
   */
  private closePosition(price: number, timestamp?: number | Date): void {
    if (this.position === 0) return;
    
    // Apply slippage
    const slippageMultiplier = this.positionSide === 'long' ? 1 - this.config.slippage : 1 + this.config.slippage;
    const exitPrice = price * slippageMultiplier;
    
    // Calculate PnL
    let pnl: number;
    if (this.positionSide === 'long') {
      pnl = this.position * (exitPrice - this.entryPrice);
    } else {
      pnl = -this.position * (exitPrice - this.entryPrice);
    }
    
    // Deduct commission
    const commission = Math.abs(this.position * exitPrice) * this.config.commission;
    pnl -= commission;
    
    const pnlPercent = pnl / this.capital;
    
    // Record trade
    this.trades.push({
      entryPrice: this.entryPrice,
      exitPrice,
      side: this.positionSide!,
      entryTime: this.entryTime,
      exitTime: timestamp instanceof Date ? timestamp : timestamp ? new Date(timestamp) : undefined,
      pnl,
      pnlPercent,
      size: Math.abs(this.position),
    });
    
    // Update capital
    this.capital += pnl;
    
    // Reset position
    this.position = 0;
    this.positionSide = null;
    this.entryPrice = 0;
    this.entryTime = undefined;
    this.trailingStop = null;
  }
  
  /**
   * Update trailing stop
   */
  private updateTrailingStop(currentPrice: number): void {
    if (!this.config.useTrailingStop || this.position === 0) return;
    
    if (this.positionSide === 'long') {
      if (currentPrice > this.highWaterMark) {
        this.highWaterMark = currentPrice;
      }
      const newStop = this.highWaterMark * (1 - this.config.trailingStopPercent);
      if (this.trailingStop === null || newStop > this.trailingStop) {
        this.trailingStop = newStop;
      }
    } else {
      if (currentPrice < this.highWaterMark || this.highWaterMark === this.entryPrice) {
        this.highWaterMark = currentPrice;
      }
      const newStop = this.highWaterMark * (1 + this.config.trailingStopPercent);
      if (this.trailingStop === null || newStop < this.trailingStop) {
        this.trailingStop = newStop;
      }
    }
  }
  
  /**
   * Update equity curve
   */
  private updateEquity(currentPrice: number): void {
    let equity = this.capital;
    
    if (this.position !== 0) {
      if (this.positionSide === 'long') {
        equity += this.position * (currentPrice - this.entryPrice);
      } else {
        equity += -this.position * (currentPrice - this.entryPrice);
      }
    }
    
    this.equityCurve.push(equity);
  }
  
  /**
   * Calculate performance metrics
   */
  private calculateMetrics(): PerformanceMetrics {
    const initialCapital = this.config.initialCapital;
    const finalCapital = this.capital;
    const totalReturn = finalCapital - initialCapital;
    const totalReturnPercent = totalReturn / initialCapital;
    
    const winningTrades = this.trades.filter(t => t.pnl > 0);
    const losingTrades = this.trades.filter(t => t.pnl <= 0);
    
    const totalTrades = this.trades.length;
    const winRate = totalTrades > 0 ? winningTrades.length / totalTrades : 0;
    
    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
    
    const averageWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length
      : 0;
    const averageLoss = losingTrades.length > 0
      ? losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length
      : 0;
    const averageTrade = totalTrades > 0
      ? this.trades.reduce((sum, t) => sum + t.pnl, 0) / totalTrades
      : 0;
    
    // Calculate returns for Sharpe ratio
    const returns: number[] = [];
    for (let i = 1; i < this.equityCurve.length; i++) {
      returns.push((this.equityCurve[i] - this.equityCurve[i - 1]) / this.equityCurve[i - 1]);
    }
    
    const sharpeRatio = calculateSharpeRatio(returns);
    const maxDrawdown = calculateMaxDrawdown(this.equityCurve);
    const maxDrawdownPercent = maxDrawdown;
    const calmarRatio = calculateCalmarRatio(this.equityCurve);
    
    return {
      totalReturn,
      totalReturnPercent,
      winRate,
      profitFactor,
      sharpeRatio,
      maxDrawdown: maxDrawdown * finalCapital,
      maxDrawdownPercent,
      totalTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      averageWin,
      averageLoss,
      averageTrade,
      calmarRatio,
    };
  }
}

/**
 * Quick backtest function
 * 
 * Convenience function for simple backtests.
 * 
 * @param data - OHLCV data
 * @param signals - Trading signals
 * @param config - Optional configuration
 * @returns Backtest results
 */
export function runBacktest(
  data: OHLCV[],
  signals: number[],
  config?: Partial<BacktestConfig>
): BacktestResult {
  const engine = new BacktestEngine(config);
  return engine.run(data, signals);
}

/**
 * Calculate Win Rate
 */
export function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  return trades.filter(t => t.pnl > 0).length / trades.length;
}

/**
 * Calculate Profit Factor
 */
export function calculateProfitFactor(trades: Trade[]): number {
  const grossProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter(t => t.pnl <= 0).reduce((sum, t) => sum + t.pnl, 0));
  
  if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
  return grossProfit / grossLoss;
}

/**
 * Calculate Average Trade
 */
export function calculateAverageTrade(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  return trades.reduce((sum, t) => sum + t.pnl, 0) / trades.length;
}
