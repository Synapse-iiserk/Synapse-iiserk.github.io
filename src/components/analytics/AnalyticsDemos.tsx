/**
 * Analytics Demo Components
 * =========================
 * Interactive React components demonstrating the analytics library
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateSMA,
  calculateEMA,
  fitLinear,
  fitQuadratic,
  calculateStatistics,
  calculateMaxDrawdown,
} from '../../lib/analytics';

// Generate sample price data
function generateSampleData(days: number, volatility: number = 0.02, trend: number = 0.0002): number[] {
  const prices: number[] = [100];
  for (let i = 1; i < days; i++) {
    const change = (Math.random() - 0.5) * volatility + trend;
    prices.push(prices[i - 1] * (1 + change));
  }
  return prices;
}

/**
 * RSI Calculator Demo
 */
export const RSICalculator: React.FC = () => {
  const [period, setPeriod] = useState(14);
  const [volatility, setVolatility] = useState(0.02);
  
  const { prices, rsi, currentRSI, signal } = useMemo(() => {
    const prices = generateSampleData(100, volatility);
    const rsi = calculateRSI(prices, period);
    const currentRSI = rsi[rsi.length - 1];
    
    let signal = 'Neutral';
    if (currentRSI > 70) signal = 'Overbought';
    else if (currentRSI < 30) signal = 'Oversold';
    
    return { prices, rsi, currentRSI, signal };
  }, [period, volatility]);
  
  const getSignalColor = () => {
    if (signal === 'Overbought') return 'text-red-400';
    if (signal === 'Oversold') return 'text-green-400';
    return 'text-yellow-400';
  };
  
  return (
    <div className="bg-[var(--color-primary-light)] rounded-xl p-6 border border-[var(--color-border)]">
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
        RSI Calculator
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-2">
            Period
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-[var(--color-text)]">{period}</span>
        </div>
        
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-2">
            Volatility
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={volatility * 100}
            onChange={(e) => setVolatility(Number(e.target.value) / 100)}
            className="w-full"
          />
          <span className="text-[var(--color-text)]">{(volatility * 100).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-[var(--color-primary)] rounded-lg">
        <div>
          <div className="text-sm text-[var(--color-text-muted)]">Current RSI</div>
          <div className="text-3xl font-bold text-[var(--color-text)]">
            {currentRSI.toFixed(2)}
          </div>
        </div>
        
        <div className={`text-xl font-semibold ${getSignalColor()}`}>
          {signal}
        </div>
      </div>
      
      {/* Mini RSI chart visualization */}
      <div className="mt-4 h-20 flex items-end gap-0.5">
        {rsi.slice(-50).map((value, idx) => (
          <div
            key={idx}
            className="flex-1 rounded-t transition-all"
            style={{
              height: `${Math.max(5, value)}%`,
              backgroundColor: value > 70 ? '#ef4444' : value < 30 ? '#22c55e' : '#f59e0b',
              opacity: 0.5 + (idx / 100),
            }}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-[var(--color-text-muted)]">
        <span>Oversold (30)</span>
        <span>Overbought (70)</span>
      </div>
    </div>
  );
};

/**
 * Moving Average Demo
 */
export const MovingAverageDemo: React.FC = () => {
  const [smaPeriod, setSMAPeriod] = useState(20);
  const [emaPeriod, setEMAPeriod] = useState(12);
  
  const { prices, sma, ema, crossover } = useMemo(() => {
    const prices = generateSampleData(100, 0.015, 0.001);
    const sma = calculateSMA(prices, smaPeriod);
    const ema = calculateEMA(prices, emaPeriod);
    
    // Detect crossover
    const lastSMA = sma[sma.length - 1];
    const lastEMA = ema[ema.length - 1];
    const prevSMA = sma[sma.length - 2];
    const prevEMA = ema[ema.length - 2];
    
    let crossover = 'None';
    if (lastEMA > lastSMA && prevEMA <= prevSMA) crossover = 'Bullish';
    else if (lastEMA < lastSMA && prevEMA >= prevSMA) crossover = 'Bearish';
    
    return { prices, sma, ema, crossover };
  }, [smaPeriod, emaPeriod]);
  
  const lastPrice = prices[prices.length - 1];
  const lastSMA = sma[sma.length - 1];
  const lastEMA = ema[ema.length - 1];
  
  return (
    <div className="bg-[var(--color-primary-light)] rounded-xl p-6 border border-[var(--color-border)]">
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
        Moving Averages
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-2">
            SMA Period: {smaPeriod}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={smaPeriod}
            onChange={(e) => setSMAPeriod(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-2">
            EMA Period: {emaPeriod}
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={emaPeriod}
            onChange={(e) => setEMAPeriod(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">Price</div>
          <div className="text-lg font-semibold text-[var(--color-text)]">
            ${lastPrice.toFixed(2)}
          </div>
        </div>
        
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">SMA({smaPeriod})</div>
          <div className="text-lg font-semibold text-blue-400">
            ${lastSMA.toFixed(2)}
          </div>
        </div>
        
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">EMA({emaPeriod})</div>
          <div className="text-lg font-semibold text-purple-400">
            ${lastEMA.toFixed(2)}
          </div>
        </div>
      </div>
      
      {crossover !== 'None' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-center ${
            crossover === 'Bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {crossover} Crossover Detected!
        </motion.div>
      )}
    </div>
  );
};

/**
 * Bollinger Bands Demo
 */
export const BollingerBandsDemo: React.FC = () => {
  const [period, setPeriod] = useState(20);
  const [stdDev, setStdDev] = useState(2);
  
  const { prices, bb, position, squeeze } = useMemo(() => {
    const prices = generateSampleData(100, 0.02);
    const bb = calculateBollingerBands(prices, period, stdDev);
    
    const lastPrice = prices[prices.length - 1];
    const lastUpper = bb.upper[bb.upper.length - 1];
    const lastLower = bb.lower[bb.lower.length - 1];
    const lastMiddle = bb.middle[bb.middle.length - 1];
    
    let position = 'Middle';
    if (lastPrice > lastUpper) position = 'Above Upper Band';
    else if (lastPrice < lastLower) position = 'Below Lower Band';
    else if (lastPrice > lastMiddle) position = 'Upper Half';
    else position = 'Lower Half';
    
    // Detect squeeze (narrow bands)
    const bandwidth = bb.bandwidth[bb.bandwidth.length - 1];
    const avgBandwidth = bb.bandwidth.slice(-20).filter(v => !isNaN(v)).reduce((a, b) => a + b, 0) / 20;
    const squeeze = bandwidth < avgBandwidth * 0.8;
    
    return { prices, bb, position, squeeze };
  }, [period, stdDev]);
  
  const lastBandwidth = bb.bandwidth[bb.bandwidth.length - 1];
  const lastPercentB = bb.percentB[bb.percentB.length - 1];
  
  return (
    <div className="bg-[var(--color-primary-light)] rounded-xl p-6 border border-[var(--color-border)]">
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
        Bollinger Bands
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-2">
            Period: {period}
          </label>
          <input
            type="range"
            min="10"
            max="50"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-2">
            Std Dev: {stdDev}
          </label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.5"
            value={stdDev}
            onChange={(e) => setStdDev(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">Bandwidth</div>
          <div className="text-lg font-semibold text-[var(--color-text)]">
            {(lastBandwidth * 100).toFixed(2)}%
          </div>
        </div>
        
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">%B</div>
          <div className="text-lg font-semibold text-[var(--color-text)]">
            {(lastPercentB * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-[var(--color-primary)] rounded-lg mb-4">
        <div className="text-sm text-[var(--color-text-muted)]">Position</div>
        <div className="text-[var(--color-text)] font-medium">{position}</div>
      </div>
      
      {squeeze && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400 text-center"
        >
          ⚠️ Bollinger Squeeze Detected - Potential Breakout
        </motion.div>
      )}
    </div>
  );
};

/**
 * Trend Analysis Demo
 */
export const TrendAnalysisDemo: React.FC = () => {
  const [dataPoints, setDataPoints] = useState(50);
  
  const { prices, linear, quadratic, stats } = useMemo(() => {
    const prices = generateSampleData(dataPoints, 0.015, 0.002);
    const linear = fitLinear(prices);
    const quadratic = fitQuadratic(prices);
    const stats = calculateStatistics(prices);
    
    return { prices, linear, quadratic, stats };
  }, [dataPoints]);
  
  const bestFit = linear.rSquared > quadratic.rSquared - 0.01 ? 'Linear' : 'Quadratic';
  
  return (
    <div className="bg-[var(--color-primary-light)] rounded-xl p-6 border border-[var(--color-border)]">
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
        Trend Analysis
      </h3>
      
      <div className="mb-6">
        <label className="block text-sm text-[var(--color-text-muted)] mb-2">
          Data Points: {dataPoints}
        </label>
        <input
          type="range"
          min="20"
          max="100"
          value={dataPoints}
          onChange={(e) => setDataPoints(Number(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">Linear R²</div>
          <div className="text-lg font-semibold text-blue-400">
            {(linear.rSquared * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">Quadratic R²</div>
          <div className="text-lg font-semibold text-purple-400">
            {(quadratic.rSquared * 100).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-[var(--color-primary)] rounded-lg mb-4">
        <div className="text-sm text-[var(--color-text-muted)] mb-2">Best Fit: {bestFit}</div>
        <code className="text-xs text-[var(--color-accent)] block">
          {bestFit === 'Linear' ? linear.equation : quadratic.equation}
        </code>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-[var(--color-primary)] rounded">
          <div className="text-xs text-[var(--color-text-muted)]">Mean</div>
          <div className="text-sm font-semibold text-[var(--color-text)]">
            ${stats.mean.toFixed(2)}
          </div>
        </div>
        <div className="p-2 bg-[var(--color-primary)] rounded">
          <div className="text-xs text-[var(--color-text-muted)]">Std Dev</div>
          <div className="text-sm font-semibold text-[var(--color-text)]">
            ${stats.std.toFixed(2)}
          </div>
        </div>
        <div className="p-2 bg-[var(--color-primary)] rounded">
          <div className="text-xs text-[var(--color-text-muted)]">Range</div>
          <div className="text-sm font-semibold text-[var(--color-text)]">
            ${(stats.max - stats.min).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Portfolio Risk Demo
 */
export const PortfolioRiskDemo: React.FC = () => {
  const [volatility, setVolatility] = useState(0.02);
  
  const { equityCurve, maxDD, stats, riskLevel } = useMemo(() => {
    const equityCurve = generateSampleData(252, volatility, 0.0003);
    const maxDD = calculateMaxDrawdown(equityCurve);
    const stats = calculateStatistics(equityCurve);
    
    let riskLevel = 'Low';
    if (maxDD > 0.2) riskLevel = 'High';
    else if (maxDD > 0.1) riskLevel = 'Medium';
    
    return { equityCurve, maxDD, stats, riskLevel };
  }, [volatility]);
  
  const totalReturn = (equityCurve[equityCurve.length - 1] - equityCurve[0]) / equityCurve[0];
  
  const getRiskColor = () => {
    if (riskLevel === 'High') return 'text-red-400';
    if (riskLevel === 'Medium') return 'text-yellow-400';
    return 'text-green-400';
  };
  
  return (
    <div className="bg-[var(--color-primary-light)] rounded-xl p-6 border border-[var(--color-border)]">
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">
        Portfolio Risk Analysis
      </h3>
      
      <div className="mb-6">
        <label className="block text-sm text-[var(--color-text-muted)] mb-2">
          Volatility: {(volatility * 100).toFixed(1)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={volatility * 100}
          onChange={(e) => setVolatility(Number(e.target.value) / 100)}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">Total Return</div>
          <div className={`text-lg font-semibold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(totalReturn * 100).toFixed(2)}%
          </div>
        </div>
        
        <div className="p-3 bg-[var(--color-primary)] rounded-lg">
          <div className="text-xs text-[var(--color-text-muted)]">Max Drawdown</div>
          <div className="text-lg font-semibold text-red-400">
            -{(maxDD * 100).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-[var(--color-primary)] rounded-lg flex items-center justify-between">
        <span className="text-[var(--color-text-muted)]">Risk Level</span>
        <span className={`text-xl font-bold ${getRiskColor()}`}>{riskLevel}</span>
      </div>
      
      {/* Mini equity curve */}
      <div className="mt-4 h-16 flex items-end gap-px">
        {equityCurve.slice(-60).map((value, idx) => {
          const min = Math.min(...equityCurve.slice(-60));
          const max = Math.max(...equityCurve.slice(-60));
          const height = ((value - min) / (max - min)) * 100;
          return (
            <div
              key={idx}
              className="flex-1 bg-[var(--color-accent)] rounded-t"
              style={{ height: `${Math.max(5, height)}%`, opacity: 0.5 + (idx / 120) }}
            />
          );
        })}
      </div>
    </div>
  );
};
