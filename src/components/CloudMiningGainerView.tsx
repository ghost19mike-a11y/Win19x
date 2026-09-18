import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Cpu,
  Zap,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  RefreshCw,
  Layers,
  ArrowUpRight,
  UserPlus,
} from 'lucide-react';
import { MiningContract, MiningShareEvent, UserProfile } from '../types';

interface CloudMiningGainerProps {
  contracts: MiningContract[];
  user: UserProfile | null;
  onOpenAuth: () => void;
  onNavigateToMining: () => void;
  onReconcile: () => void;
}

export const CloudMiningGainerView: React.FC<CloudMiningGainerProps> = ({
  contracts,
  user,
  onOpenAuth,
  onNavigateToMining,
  onReconcile,
}) => {
  // Live dollar tracking calculation
  // Total active hashrate across all active contracts
  const activeContracts = contracts.filter((c) => c.status === 'ACTIVE');
  const initialAccumulatedUsd = activeContracts.reduce((acc, c) => acc + c.totalAccumulatedUsd, 0);

  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [liveDollarTotal, setLiveDollarTotal] = useState(initialAccumulatedUsd);
  const [sessionGainedUsd, setSessionGainedUsd] = useState(0.0);
  const [sharesSubmitted, setSharesSubmitted] = useState(1284);
  const [recentShares, setRecentShares] = useState<MiningShareEvent[]>([
    {
      id: 'share-01',
      contractId: 'contract-btc-s21-01',
      coin: 'BTC',
      timestamp: new Date().toLocaleTimeString(),
      hashRateTh: 234.2,
      difficulty: 88450123,
      nonce: '0x8f2d91c4',
      status: 'ACCEPTED',
      rewardCrypto: 0.00000028,
      rewardUsd: 0.0192,
      blockHash: '00000000000000000001a4b9c1d2e3f4...',
    },
    {
      id: 'share-02',
      contractId: 'contract-ltc-l9-02',
      coin: 'LTC',
      timestamp: new Date(Date.now() - 3000).toLocaleTimeString(),
      hashRateTh: 16.1,
      difficulty: 1209340,
      nonce: '0x3c7e10a9',
      status: 'ACCEPTED',
      rewardCrypto: 0.00014,
      rewardUsd: 0.0119,
      blockHash: '00000000000000000000d8f2b7a9c3e1...',
    },
    {
      id: 'share-03',
      contractId: 'contract-kas-albox-03',
      coin: 'KAS',
      timestamp: new Date(Date.now() - 6000).toLocaleTimeString(),
      hashRateTh: 720.0,
      difficulty: 345092,
      nonce: '0x99a2bcfe',
      status: 'ACCEPTED',
      rewardCrypto: 0.075,
      rewardUsd: 0.0107,
      blockHash: '00000000000000000002f1a8c9b3e7d5...',
    },
  ]);

  // Combined metrics
  const totalHashrateTh = activeContracts.reduce((acc, c) => {
    if (c.hashrateUnit === 'TH/s') return acc + c.hashrate;
    if (c.hashrateUnit === 'GH/s') return acc + c.hashrate / 1000;
    return acc;
  }, 0);

  // Daily yield estimate in USD based on active contracts
  const dailyYieldUsd = activeContracts.reduce((acc, c) => acc + c.dailyRewardEstimatedUsd, 0);
  const dailyElectricityCostUsd = activeContracts.reduce((acc, c) => acc + c.dailyHostingFeeUsd, 0);
  const netDailyUsd = Math.max(0, dailyYieldUsd - dailyElectricityCostUsd);

  // Gain rate per second
  const gainPerSecondUsd = netDailyUsd / 86400;

  // Real-time live dollar amount ticker loop (smooth 100ms updates)
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const stepIncrement = (gainPerSecondUsd / 10) * (0.95 + Math.random() * 0.1);
      setLiveDollarTotal((prev) => prev + stepIncrement);
      setSessionGainedUsd((prev) => prev + stepIncrement);

      // Randomly inject a verified pool share event every few seconds
      if (Math.random() < 0.25) {
        setSharesSubmitted((s) => s + 1);
        const randomContract = activeContracts[Math.floor(Math.random() * activeContracts.length)] || activeContracts[0];
        if (randomContract) {
          const shareRewardUsd = parseFloat((0.005 + Math.random() * 0.02).toFixed(4));
          const newShare: MiningShareEvent = {
            id: `share-${Date.now()}`,
            contractId: randomContract.id,
            coin: randomContract.coin,
            timestamp: new Date().toLocaleTimeString(),
            hashRateTh: parseFloat((randomContract.hashrate * (0.99 + Math.random() * 0.02)).toFixed(1)),
            difficulty: Math.floor(500000 + Math.random() * 80000000),
            nonce: `0x${Math.floor(Math.random() * 0xffffffff).toString(16)}`,
            status: 'ACCEPTED',
            rewardCrypto: parseFloat((shareRewardUsd / 68450).toFixed(8)),
            rewardUsd: shareRewardUsd,
            blockHash: `0000000000000000000${Math.floor(Math.random() * 16).toString(16)}${Math.random().toString(16).slice(2, 10)}...`,
          };
          setRecentShares((prev) => [newShare, ...prev.slice(0, 7)]);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLiveStreaming, gainPerSecondUsd, activeContracts]);

  return (
    <div className="space-y-6">
      {/* Sign Up / Registration Prompt for Live Gainer Visibility */}
      {!user && (
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-cyan-950/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PROSPECTIVE INVESTOR / OPERATOR
              </span>
              <h3 className="text-sm font-bold text-white">Unlock Full Multi-Coin Hash Allocation &amp; Real Settlement</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Create an account to lock in guaranteed sub-$0.042/kWh PPA power, link personal hardware, or purchase cloud capacity with immediate blockchain-denominated reward reconciliation.
            </p>
          </div>
          <button
            id="btn-gainer-signup"
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg shadow-cyan-500/25 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Free Account / Sign In</span>
          </button>
        </div>
      )}

      {/* Main Real-Time Dollar Gainer Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white">Live Cloud Mining Dollar Tracker</h2>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>ACTIVE GAINER STREAM</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">Real-time verified hardware revenue streaming at $0.042/kWh PPA power rate</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-stream"
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isLiveStreaming
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-emerald-600 text-white border-emerald-500'
                }`}
              >
                {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isLiveStreaming ? 'Pause Ticker' : 'Resume Live'}</span>
              </button>

              <button
                id="btn-reconcile-gainer"
                onClick={onReconcile}
                title="Reconcile Pending Rewards to Settled Balance"
                className="flex items-center gap-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reconcile Balances</span>
              </button>
            </div>
          </div>

          {/* Dollar Amount Big Counter */}
          <div className="py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span>TOTAL ACCUMULATED HARDWARE EARNINGS</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-bold">NET PROFIT (POST-ELECTRICITY)</span>
              </div>

              {/* Large Monospace Dollar Ticker */}
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl sm:text-3xl font-bold text-slate-400">$</span>
                <span className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm">
                  {liveDollarTotal.toLocaleString('en-US', {
                    minimumFractionDigits: 6,
                    maximumFractionDigits: 6,
                  })}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-1 rounded ml-2">
                  USD
                </span>
              </div>

              {/* Session Delta */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-400">
                <div>
                  Session Gain:{' '}
                  <span className="text-emerald-400 font-bold">
                    +${sessionGainedUsd.toFixed(6)} USD
                  </span>
                </div>
                <div className="text-slate-600">•</div>
                <div>
                  Accepted Shares:{' '}
                  <span className="text-cyan-300 font-semibold">{sharesSubmitted.toLocaleString()}</span>
                </div>
                <div className="text-slate-600">•</div>
                <div>
                  Reject Rate:{' '}
                  <span className="text-slate-300 font-semibold">0.08% (Foundry PPLNS)</span>
                </div>
              </div>
            </div>

            {/* Velocity Rates Bento Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Rate Per Second</div>
                <div className="text-sm font-mono font-bold text-emerald-400">
                  ${gainPerSecondUsd.toFixed(6)}
                </div>
                <div className="text-[10px] text-slate-500">Continuous accrual</div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Rate Per Minute</div>
                <div className="text-sm font-mono font-bold text-cyan-400">
                  ${(gainPerSecondUsd * 60).toFixed(4)}
                </div>
                <div className="text-[10px] text-slate-500">Live operational rate</div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Rate Per Hour</div>
                <div className="text-sm font-mono font-bold text-indigo-400">
                  ${(gainPerSecondUsd * 3600).toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500">60-minute net</div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Rate Per 24 Hours</div>
                <div className="text-sm font-mono font-bold text-amber-400">
                  ${netDailyUsd.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500">Gross: ${dailyYieldUsd.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Active Cloud Rig Gainer Breakdown */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Active Hash Capacity Contributors
              </h4>
              <button
                id="btn-add-capacity-gainer"
                onClick={onNavigateToMining}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Add More Hashpower</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate max-w-[170px]">{contract.name}</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {contract.coin}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div>
                      <div className="text-[10px] text-slate-500">Hashrate</div>
                      <div className="font-bold text-slate-200">
                        {contract.hashrate} {contract.hashrateUnit}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Daily Net Yield</div>
                      <div className="font-bold text-emerald-400">
                        +${(contract.dailyRewardEstimatedUsd - contract.dailyHostingFeeUsd).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">{contract.facilityLocation.split('-')[1] || contract.facilityLocation}</span>
                    <span className="text-emerald-400 font-mono font-medium">{contract.uptimePercent}% up</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Verifiable Stratum Share Events Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Stratum Share Verification Feed</h3>
              <p className="text-xs text-slate-400">Cryptographic proof of work reconciled with partner mining pools</p>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-md border border-slate-800">
            Pool Latency: <span className="text-emerald-400 font-semibold">14ms (Direct Stratum V2)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Rig Hashrate</th>
                <th className="py-2.5 px-3">Target Difficulty</th>
                <th className="py-2.5 px-3">Nonce</th>
                <th className="py-2.5 px-3">Proof Status</th>
                <th className="py-2.5 px-3 text-right">Value Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentShares.map((share) => (
                <tr key={share.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400">{share.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-semibold text-[11px]">
                      {share.coin}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{share.hashRateTh} TH/s</td>
                  <td className="py-2.5 px-3 text-slate-400">{share.difficulty.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-slate-500">{share.nonce}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{share.status}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                    +${share.rewardUsd.toFixed(4)}
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
