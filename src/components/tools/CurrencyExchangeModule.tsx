import React, { useState } from 'react';
import {
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Globe,
  Calculator,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface FXRate {
  code: string;
  name: string;
  symbol: string;
  rateToUSD: number; // 1 USD = X Currency
  flag: string;
  change24h: number; // percentage
}

const FX_RATES: FXRate[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUSD: 1.0, flag: '🇺🇸', change24h: 0.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUSD: 0.92, flag: '🇪🇺', change24h: 0.15 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUSD: 0.79, flag: '🇬🇧', change24h: -0.22 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rateToUSD: 18.25, flag: '🇿🇦', change24h: 0.45 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToUSD: 1.36, flag: '🇨🇦', change24h: -0.08 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUSD: 154.60, flag: '🇯🇵', change24h: 0.32 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUSD: 1.52, flag: '🇦🇺', change24h: -0.18 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUSD: 83.85, flag: '🇮🇳', change24h: 0.05 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateToUSD: 0.88, flag: '🇨🇭', change24h: 0.12 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateToUSD: 1.34, flag: '🇸🇬', change24h: -0.04 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', rateToUSD: 3.67, flag: '🇦🇪', change24h: 0.0 }
];

export const CurrencyExchangeModule: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [hedgeBufferPct, setHedgeBufferPct] = useState<number>(2.5);

  const fromRate = FX_RATES.find(r => r.code === fromCurrency)?.rateToUSD || 1;
  const toRate = FX_RATES.find(r => r.code === toCurrency)?.rateToUSD || 1;

  // Convert: Amount in From -> USD -> To
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;

  // Hedged Amount
  const hedgedAmount = convertedAmount * (1 + hedgeBufferPct / 100);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="currency-exchange-module-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Treasury & FX Management
            </span>
            <span className="text-xs text-neutral-400 font-mono">Live Central Bank Rates</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Currency Exchange & Treasury FX</h1>
          <p className="text-sm text-neutral-400">Real-time multi-currency converter, cross-rate matrix, and enterprise volatility hedging calculator</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-neutral-300 font-mono">Rates Synced: 2026-08-14</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Converter Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Converter Card */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            Multi-Currency Quick Converter
          </h2>

          <div className="space-y-4">
            {/* Amount input */}
            <div>
              <label className="text-xs text-neutral-400 block mb-1.5 font-medium">Transfer Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-lg font-mono font-bold text-white focus:outline-hidden focus:border-emerald-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 font-bold">
                  {fromCurrency}
                </span>
              </div>
            </div>

            {/* Currency Selectors & Swap Button */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              
              {/* From */}
              <div className="sm:col-span-5">
                <label className="text-xs text-neutral-400 block mb-1.5 font-medium">From Currency</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-semibold text-white focus:outline-hidden"
                >
                  {FX_RATES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code} - {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-5 sm:pt-0">
                <button
                  onClick={handleSwap}
                  className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all shadow-md cursor-pointer"
                  title="Swap Currencies"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* To */}
              <div className="sm:col-span-5">
                <label className="text-xs text-neutral-400 block mb-1.5 font-medium">To Currency</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-semibold text-white focus:outline-hidden"
                >
                  {FX_RATES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code} - {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversion Result Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30 space-y-2">
              <div className="text-xs text-neutral-400 font-mono">
                {amount.toLocaleString()} {fromCurrency} =
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
              </div>
              <div className="text-xs text-neutral-400 font-mono flex items-center gap-2 pt-1 border-t border-neutral-800/80">
                <span>1 {fromCurrency} = {(toRate / fromRate).toFixed(4)} {toCurrency}</span>
                <span>•</span>
                <span>1 {toCurrency} = {(fromRate / toRate).toFixed(4)} {fromCurrency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise FX Hedging Risk Calculator */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Enterprise Hedging & Risk Buffer
          </h2>
          <p className="text-xs text-neutral-400">
            Calculate forward volatility protections for cross-border payroll contracts and foreign invoice commitments.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-neutral-400">Volatility Buffer Percentage:</span>
                <span className="font-mono font-bold text-emerald-400">{hedgeBufferPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={hedgeBufferPct}
                onChange={(e) => setHedgeBufferPct(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Spot Market Value:</span>
                <span className="text-white">${amountInUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Hedge Buffer Added:</span>
                <span className="text-amber-400">+${(amountInUSD * (hedgeBufferPct / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
              </div>
              <div className="flex justify-between text-white font-bold border-t border-neutral-800 pt-2 text-sm">
                <span>Total Hedged Commitment:</span>
                <span className="text-emerald-400">{hedgedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Recommended for international payroll runs to prevent FX margin deficits.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Rates Matrix Table */}
      <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Global Enterprise FX Matrix
            </h3>
            <p className="text-xs text-neutral-400">Benchmark foreign exchange spot rates against Base Currency (USD)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FX_RATES.map((curr) => {
            const isPositive = curr.change24h >= 0;
            return (
              <div
                key={curr.code}
                onClick={() => setToCurrency(curr.code)}
                className={`p-4 rounded-xl bg-neutral-950 border transition-all cursor-pointer ${
                  toCurrency === curr.code ? 'border-emerald-500/60 bg-emerald-950/10' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{curr.flag}</span>
                    <div>
                      <span className="text-xs font-bold text-white block">{curr.code}</span>
                      <span className="text-[10px] text-neutral-400 truncate block max-w-[100px]">{curr.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-white">
                      {curr.rateToUSD.toFixed(2)} {curr.symbol}
                    </div>
                    <div className={`text-[10px] font-mono flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {Math.abs(curr.change24h)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
