import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  History,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { CryptoAsset, TransactionRecord, UserWalletLedger } from '../types';

interface WalletViewProps {
  wallet: UserWalletLedger;
  assets: CryptoAsset[];
  transactions: TransactionRecord[];
  onOpenWithdrawModal: (assetSymbol?: string) => void;
  onOpenDepositModal: (assetSymbol?: string) => void;
  onReconcile: () => void;
  isReconciling: boolean;
  emergencyPause: boolean;
}

export const WalletView: React.FC<WalletViewProps> = ({
  wallet,
  assets,
  transactions,
  onOpenWithdrawModal,
  onOpenDepositModal,
  onReconcile,
  isReconciling,
  emergencyPause,
}) => {
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(id);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Pause Banner if active */}
      {emergencyPause && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-4 rounded-xl flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">SYSTEM NOTICE: </span>
              <span>Emergency Withdrawal Pause is currently active for network security verification. Outbound transfers temporarily locked.</span>
            </div>
          </div>
          <span className="text-[11px] font-mono uppercase bg-rose-900 px-2 py-0.5 rounded text-rose-300 font-bold">
            PAUSED
          </span>
        </div>
      )}

      {/* Economic Accounting Ledger Card mandated by prompt */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Internal Accounting Ledger</h2>
              <span className="text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-semibold">
                VERIFIED SETTLEMENT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Strict accounting separation: Only settled Real Balances are eligible for withdrawal. Pending or projected amounts are never withdrawable.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-reconcile-wallet"
              onClick={onReconcile}
              disabled={isReconciling}
              className="flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800/80 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
              <span>{isReconciling ? 'Reconciling Pool Shares...' : 'Reconcile Rewards'}</span>
            </button>
          </div>
        </div>

        {/* Total Ledger Values Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase">ESTIMATED TOTAL ASSETS (USD)</div>
            <div className="text-2xl font-extrabold text-white">
              ${wallet.estimatedTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500">Includes settled real + pending rewards</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-emerald-400 uppercase font-semibold">SETTLED REAL BALANCE</div>
            <div className="text-2xl font-extrabold text-emerald-400">
              WITHDRAWABLE
            </div>
            <div className="text-[10px] text-slate-400">100% physically backed &amp; reconciled</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-amber-400 uppercase font-semibold">PENDING MINING REWARDS</div>
            <div className="text-2xl font-extrabold text-amber-300">
              RECONCILING
            </div>
            <div className="text-[10px] text-slate-400">Awaiting block confirmation height</div>
          </div>
        </div>

        {/* Per-Asset Balance Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3">Asset</th>
                <th className="py-3 px-3">Real (Settled) Balance</th>
                <th className="py-3 px-3">Pending Rewards</th>
                <th className="py-3 px-3">Market Price</th>
                <th className="py-3 px-3">Total Value (USD)</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assets.map((asset) => {
                const real = wallet.realBalances[asset.symbol] || 0;
                const pending = wallet.pendingBalances[asset.symbol] || 0;
                const totalValueUsd = (real + pending) * asset.currentPriceUsd;

                return (
                  <tr key={asset.symbol} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                          style={{ backgroundColor: asset.iconColor }}
                        >
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm">{asset.symbol}</span>
                          <span className="text-[11px] text-slate-400 ml-1.5 hidden sm:inline">{asset.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-emerald-400 text-sm">
                        {real.toLocaleString('en-US', { maximumFractionDigits: 8 })} {asset.symbol}
                      </div>
                      <div className="text-[10px] text-slate-500">Withdrawable</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-amber-300 font-medium">
                        {pending > 0 ? `+${pending} ${asset.symbol}` : '0.00'}
                      </div>
                      <div className="text-[10px] text-slate-500">Stratum unconfirmed</div>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      ${asset.currentPriceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-100">
                      ${totalValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`btn-deposit-${asset.symbol}`}
                          onClick={() => onOpenDepositModal(asset.symbol)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs font-semibold transition-all border border-slate-700"
                        >
                          Deposit
                        </button>
                        <button
                          id={`btn-withdraw-${asset.symbol}`}
                          onClick={() => onOpenWithdrawModal(asset.symbol)}
                          disabled={real <= 0 || emergencyPause}
                          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1 rounded text-xs font-semibold transition-all"
                        >
                          Withdraw
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History & Audit Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Audit Trail &amp; Transaction Ledger</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">{transactions.length} Records Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Verification TX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'MINING_REWARD'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : tx.type === 'EXCHANGE'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : tx.type === 'WITHDRAWAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{tx.description}</td>
                  <td className="py-2.5 px-3 font-bold text-white">
                    {tx.type === 'WITHDRAWAL' ? '-' : '+'}
                    {tx.amount} {tx.asset}
                    <span className="text-[10px] text-slate-400 ml-1">(${tx.amountUsd.toFixed(2)})</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{tx.status}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {tx.txHash ? (
                      <button
                        onClick={() => copyToClipboard(tx.txHash || '', tx.id)}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] inline-flex items-center gap-1"
                        title="Copy Tx Hash"
                      >
                        <span>{tx.txHash.slice(0, 8)}...</span>
                        <Copy className="w-3 h-3" />
                        {copiedTxId === tx.id && <span className="text-emerald-400 text-[10px]">Copied!</span>}
                      </button>
                    ) : (
                      <span className="text-slate-500">Internal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
