import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronDown,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { AssetSymbol, CryptoAsset, ExchangeQuote, UserWalletLedger } from '../types';

interface ExchangeRouterProps {
  assets: CryptoAsset[];
  wallet: UserWalletLedger;
  onExecuteExchange: (quote: ExchangeQuote) => Promise<boolean>;
}

export const ExchangeRouterView: React.FC<ExchangeRouterProps> = ({
  assets,
  wallet,
  onExecuteExchange,
}) => {
  const [fromAsset, setFromAsset] = useState<AssetSymbol>('BTC');
  const [toAsset, setToAsset] = useState<AssetSymbol>('USDC');
  const [fromAmount, setFromAmount] = useState<string>('0.005');
  const [quote, setQuote] = useState<ExchangeQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastExecutedTx, setLastExecutedTx] = useState<any | null>(null);

  const availableRealBalance = wallet.realBalances[fromAsset] || 0;

  // Fetch quote from backend
  const fetchQuote = async () => {
    const parsedAmount = parseFloat(fromAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setQuote(null);
      return;
    }
    if (fromAsset === toAsset) {
      setErrorMessage('From and To assets cannot be identical.');
      setQuote(null);
      return;
    }

    setErrorMessage(null);
    setIsLoadingQuote(true);

    try {
      const res = await fetch('/api/exchange/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAsset,
          toAsset,
          fromAmount: parsedAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch quote');
      }
      setQuote(data.quote);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error requesting quote');
      setQuote(null);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuote();
    }, 400);
    return () => clearTimeout(timer);
  }, [fromAsset, toAsset, fromAmount]);

  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  const handleExecute = async () => {
    if (!quote) return;
    if (availableRealBalance < quote.fromAmount) {
      setErrorMessage(
        `Insufficient settled balance. You have ${availableRealBalance} ${fromAsset} settled. (Pending rewards cannot be exchanged until settled).`
      );
      return;
    }

    setIsExecuting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const ok = await onExecuteExchange(quote);
      if (ok) {
        setSuccessMessage(
          `Successfully converted ${quote.fromAmount} ${quote.fromAsset} to ${quote.estimatedToAmount} ${quote.toAsset} via ${quote.provider}.`
        );
        fetchQuote();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Exchange execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const fromAssetData = assets.find((a) => a.symbol === fromAsset);
  const toAssetData = assets.find((a) => a.symbol === toAsset);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>SMART LIQUIDITY ROUTER</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">Convert Mining Rewards to Target Assets</h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Route your accumulated blockchain rewards directly into stablecoins (USDC) or alternative digital assets via institutional liquidity providers.
        </p>
      </div>

      {/* Exchange Swap Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        {/* FROM ASSET */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>MINED COIN (SELL)</span>
            <span>
              Settled Balance:{' '}
              <button
                type="button"
                onClick={() => setFromAmount(availableRealBalance.toString())}
                className="text-cyan-400 hover:underline font-bold"
              >
                {availableRealBalance} {fromAsset}
              </button>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="input-exchange-amount"
              type="number"
              step="any"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-2xl font-mono font-bold text-white focus:outline-none"
            />

            <select
              id="select-from-asset"
              value={fromAsset}
              onChange={(e) => setFromAsset(e.target.value as AssetSymbol)}
              className="bg-slate-800 border border-slate-700 text-white font-bold text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            ≈ ${(parseFloat(fromAmount || '0') * (fromAssetData?.currentPriceUsd || 0)).toFixed(2)} USD
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            type="button"
            onClick={handleSwapAssets}
            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all shadow-md"
            title="Switch from/to assets"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* TO ASSET */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>DESTINATION COIN (RECEIVE)</span>
            <span>Current Holding: {wallet.realBalances[toAsset] || 0} {toAsset}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full text-2xl font-mono font-bold text-cyan-400">
              {isLoadingQuote ? (
                <span className="text-slate-500 text-base animate-pulse">Requesting real-time quote...</span>
              ) : quote ? (
                quote.estimatedToAmount
              ) : (
                '0.00'
              )}
            </div>

            <select
              id="select-to-asset"
              value={toAsset}
              onChange={(e) => setToAsset(e.target.value as AssetSymbol)}
              className="bg-slate-800 border border-slate-700 text-white font-bold text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            {quote ? `1 ${fromAsset} ≈ ${quote.exchangeRate.toFixed(6)} ${toAsset}` : 'Awaiting input'}
          </div>
        </div>

        {/* Quote Details & Transparency Disclosures Mandated by Prompt */}
        {quote && (
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Liquidity Provider:</span>
              <span className="text-slate-200 font-semibold">{quote.provider}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Effective Exchange Rate:</span>
              <span className="text-slate-200">
                1 {quote.fromAsset} = {quote.exchangeRate.toFixed(4)} {quote.toAsset}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Institutional Spread:</span>
              <span className="text-slate-200">{quote.spreadPercent}% (${quote.exchangeFeeUsd.toFixed(2)} USD)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Destination Network Fee:</span>
              <span className="text-slate-200">${quote.networkFeeUsd.toFixed(2)} USD</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-amber-400/90 text-[11px]">
              <div className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Rate is indicative and refreshed every 30s</span>
              </div>
              <div className="text-slate-400">TTL: {quote.expiresInSeconds}s</div>
            </div>
          </div>
        )}

        {/* Error / Success Messages */}
        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-3 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Execute Button */}
        <button
          id="btn-execute-exchange"
          onClick={handleExecute}
          disabled={!quote || isExecuting || availableRealBalance < (quote?.fromAmount || 0)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
        >
          {isExecuting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Executing via Liquidity Provider...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Execute Conversion</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500 text-center font-mono">
          Strict Policy: We never claim a conversion occurred until confirmed by the liquidity provider and written to the accounting ledger.
        </p>
      </div>
    </div>
  );
};
