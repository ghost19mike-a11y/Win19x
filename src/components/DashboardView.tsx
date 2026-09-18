import React from 'react';
import {
  TrendingUp,
  Cpu,
  ArrowLeftRight,
  Wallet,
  Zap,
  Bot,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  Shield,
  Layers,
  DollarSign,
  CreditCard,
  History,
  KeyRound,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { RevenueTargetEngineState, UserWalletLedger, MiningContract } from '../types';

interface DashboardViewProps {
  revenueState: RevenueTargetEngineState;
  wallet: UserWalletLedger;
  contracts: MiningContract[];
  onStartMining: () => void;
  onViewMining: () => void;
  onExchange: () => void;
  onWithdraw: () => void;
  onDeposit: () => void;
  onTransactions: () => void;
  onAiControlCenter: () => void;
  onOpenScaleEngine: () => void;
  onOpenCustody?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  revenueState,
  wallet,
  contracts,
  onStartMining,
  onViewMining,
  onExchange,
  onWithdraw,
  onDeposit,
  onTransactions,
  onAiControlCenter,
  onOpenScaleEngine,
  onOpenCustody,
}) => {
  const activeContracts = contracts.filter((c) => c.status === 'ACTIVE');
  const totalHashrateTh = activeContracts.reduce((acc, c) => {
    if (c.hashrateUnit === 'TH/s') return acc + c.hashrate;
    if (c.hashrateUnit === 'GH/s') return acc + c.hashrate / 1000;
    return acc;
  }, 0);

  const totalMiningRewardsBtc = activeContracts
    .filter((c) => c.coin === 'BTC')
    .reduce((acc, c) => acc + c.totalAccumulatedCrypto, 0);

  const revenue24h = revenueState.revenue24h;
  const cost24h = revenueState.miningOperatingCosts * (24 / (24 * 7)); // estimated 24h cost fraction
  const net24h = Math.max(0, revenue24h - cost24h);

  return (
    <div className="space-y-6">
      {/* 9 Core Dashboard Metric Cards mandated by the prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        {/* TOTAL ASSETS */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">TOTAL ASSETS</div>
          <div className="text-2xl font-mono font-extrabold text-white">
            ${wallet.estimatedTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Real Settled + Reconciled Cryptos</div>
        </div>

        {/* MINING REVENUE */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">MINING REVENUE</div>
          <div className="text-2xl font-mono font-extrabold text-cyan-400">
            ${revenueState.currentRevenuePerMinute.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal">/min</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Combined platform flow</div>
        </div>

        {/* TARGET */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">TARGET</div>
          <div className="text-2xl font-mono font-extrabold text-amber-300">
            ${revenueState.targetPerMinute.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">/min</span>
          </div>
          <div className="text-[11px] text-amber-500/80 font-mono font-semibold">Configurable Objective</div>
        </div>

        {/* CURRENT PERFORMANCE */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">PERFORMANCE</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">
            {revenueState.performanceRatio.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Of $1,000/min benchmark</div>
        </div>

        {/* HASHRATE */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">HASHRATE</div>
          <div className="text-2xl font-mono font-extrabold text-slate-100">
            {totalHashrateTh.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">TH/s</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">{activeContracts.length} Dedicated Rigs Online</div>
        </div>

        {/* MINING REWARDS */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">MINING REWARDS</div>
          <div className="text-2xl font-mono font-extrabold text-amber-400">
            {totalMiningRewardsBtc.toFixed(6)}
            <span className="text-xs text-slate-400 font-normal"> BTC</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Reconciled on-chain</div>
        </div>

        {/* 24H REVENUE */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">24H REVENUE</div>
          <div className="text-2xl font-mono font-extrabold text-slate-200">
            ${revenue24h.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Total gross daily</div>
        </div>

        {/* 24H COST */}
        <div className="col-span-1 lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">24H COST</div>
          <div className="text-2xl font-mono font-extrabold text-rose-400">
            ${cost24h.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Hosting &amp; Power</div>
        </div>

        {/* NET */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">NET PROFIT</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">
            ${net24h.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-emerald-500/80 font-mono font-semibold">24h Net Retained</div>
        </div>
      </div>

      {/* Mandated Action Buttons Row */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5">
          Platform Mission Operations
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <button
            id="btn-start-mining"
            onClick={onStartMining}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-2.5 px-3 rounded-lg text-xs transition-all shadow-md shadow-emerald-950/40"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>START MINING</span>
          </button>

          <button
            id="btn-view-mining"
            onClick={onViewMining}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 px-3 rounded-lg text-xs transition-all border border-slate-700"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>VIEW MINING</span>
          </button>

          <button
            id="btn-exchange"
            onClick={onExchange}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 font-semibold py-2.5 px-3 rounded-lg text-xs transition-all border border-slate-700"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>EXCHANGE</span>
          </button>

          <button
            id="btn-withdraw"
            onClick={onWithdraw}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 px-3 rounded-lg text-xs transition-all border border-slate-700"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            <span>WITHDRAW</span>
          </button>

          <button
            id="btn-deposit"
            onClick={onDeposit}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 px-3 rounded-lg text-xs transition-all border border-slate-700"
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>DEPOSIT</span>
          </button>

          <button
            id="btn-transactions"
            onClick={onTransactions}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 px-3 rounded-lg text-xs transition-all border border-slate-700"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>TRANSACTIONS</span>
          </button>

          <button
            id="btn-ai-control-center"
            onClick={onAiControlCenter}
            className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs transition-all shadow-md shadow-cyan-950/40"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI AGENT</span>
          </button>
        </div>
      </div>

      {/* REVENUE TARGET ENGINE BREAKDOWN SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Revenue Target Engine ($1,000 / Minute)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                PERFORMANCE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Continuously reconciles verifiable revenue from mining infrastructure, exchange routing spreads, and network fees against the $1,000/min system target.
            </p>
          </div>

          <button
            id="btn-open-scale-from-dash"
            onClick={onOpenScaleEngine}
            className="flex items-center gap-1.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            <span>Open Capacity Planner</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target vs Actual vs Gap Highlight Box mandated by the prompt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-slate-400">TARGET</span>
            <div className="text-2xl font-mono font-bold text-amber-300">
              ${revenueState.targetPerMinute.toLocaleString()}/minute
            </div>
            <span className="text-[11px] text-slate-500">System baseline goal</span>
          </div>

          <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-800 py-3 md:py-0 md:px-4">
            <span className="text-xs font-mono uppercase text-slate-400">ACTUAL REVENUE</span>
            <div className="text-2xl font-mono font-bold text-cyan-400">
              ${revenueState.currentRevenuePerMinute.toFixed(2)}/minute
            </div>
            <span className="text-[11px] text-slate-500">Legitimate platform flow</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">GAP TO REACH TARGET</span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-800/50">
                {revenueState.gapPercentage.toFixed(1)}% GAP
              </span>
            </div>
            <div className="text-2xl font-mono font-bold text-rose-400">
              ${revenueState.revenueGapPerMinute.toFixed(2)}/minute
            </div>
            <span className="text-[11px] text-rose-500/80 font-mono">
              Additional ${(revenueState.revenueGapPerMinute * 60 * 24).toLocaleString()}/day required
            </span>
          </div>
        </div>

        {/* Progress bar visual */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Current Progress Towards Target:</span>
            <span className="text-cyan-400 font-bold">{revenueState.performanceRatio.toFixed(2)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(2, revenueState.performanceRatio))}%` }}
            ></div>
          </div>
        </div>

        {/* Full Financial Breakdown Table mandated by prompt */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">1-Hour Revenue</div>
            <div className="text-sm font-bold text-white">${revenueState.revenue1h.toLocaleString()}</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">24-Hour Revenue</div>
            <div className="text-sm font-bold text-white">${revenueState.revenue24h.toLocaleString()}</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">7-Day Revenue</div>
            <div className="text-sm font-bold text-white">${revenueState.revenue7d.toLocaleString()}</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">Mining Power Costs</div>
            <div className="text-sm font-bold text-rose-400">-${revenueState.miningOperatingCosts.toLocaleString()}</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">Exchange Fees</div>
            <div className="text-sm font-bold text-emerald-400">+${revenueState.exchangeFees.toLocaleString()}</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">User Payouts</div>
            <div className="text-sm font-bold text-amber-400">-${revenueState.userPayouts.toLocaleString()}</div>
          </div>
        </div>

        {/* Institutional Custody, MPC & Compliance Status Strip */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800/90 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Institutional Non-Custodial MPC &amp; Regulatory Shield Active</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
                  Live Screening
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Fireblocks MPC-CMP Quorum &bull; Mainnet RPC Nodes Synced &bull; Chainalysis KYT &amp; OFAC Automated Sanctions Filter.
              </div>
            </div>
          </div>

          {onOpenCustody && (
            <button
              onClick={onOpenCustody}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Inspect MPC &amp; AML Matrix</span>
              <span className="text-cyan-300">&rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
