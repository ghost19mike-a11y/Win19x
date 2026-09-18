import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  MapPin,
  DollarSign,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { MiningContract, CryptoAsset } from '../types';

interface MiningViewProps {
  contracts: MiningContract[];
  assets: CryptoAsset[];
  onOpenPurchaseModal: (contract: MiningContract) => void;
  onReconcile: () => void;
  isReconciling: boolean;
}

export const MiningView: React.FC<MiningViewProps> = ({
  contracts,
  assets,
  onOpenPurchaseModal,
  onReconcile,
  isReconciling,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'AVAILABLE'>('ALL');

  const filteredContracts = contracts.filter((c) => {
    if (selectedFilter === 'ACTIVE') return c.status === 'ACTIVE';
    if (selectedFilter === 'AVAILABLE') return c.status === 'AVAILABLE';
    return true;
  });

  const activeCount = contracts.filter((c) => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Cloud Mining Infrastructure Engine</h2>
            <span className="text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-semibold">
              LEGITIMATE HARDWARE
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Real ASIC hardware contracts deployed across low-cost hydroelectric and geothermal high-density data centers. Rewards are calculated directly from verified pool shares (FPPS / PPLNS) and reconciled on-chain.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-reconcile-mining-page"
            onClick={onReconcile}
            disabled={isReconciling}
            className="flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800/80 text-cyan-300 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
            <span>{isReconciling ? 'Reconciling...' : 'Reconcile Rewards'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'ACTIVE', 'AVAILABLE'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === filter
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {filter === 'ACTIVE' ? `Active Rigs (${activeCount})` : filter}
          </button>
        ))}
      </div>

      {/* Mining Hardware Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredContracts.map((contract) => {
          const coinAsset = assets.find((a) => a.symbol === contract.coin);
          const coinPrice = coinAsset?.currentPriceUsd || 1;
          const isActive = contract.status === 'ACTIVE';

          return (
            <div
              key={contract.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all space-y-4 ${
                isActive ? 'border-cyan-500/30 ring-1 ring-cyan-500/10' : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{contract.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>{contract.hardwareModel}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">{contract.algorithm}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                      isActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isActive ? 'MINING LIVE' : 'CAPACITY AVAILABLE'}
                  </span>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">
                    {contract.contractType === 'OWNED_HOSTED' ? 'Owned / Hosted' : 'Leased Capacity'}
                  </div>
                </div>
              </div>

              {/* Hardware Performance Metrics Mandated by Prompt */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Hashrate</span>
                  <div className="font-bold text-slate-200">
                    {contract.hashrate} {contract.hashrateUnit}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Pool Uptime</span>
                  <div className="font-bold text-emerald-400">{contract.uptimePercent}%</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Accepted Shares</span>
                  <div className="font-bold text-cyan-400">{contract.acceptedShares.toLocaleString()}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Rejected Shares</span>
                  <div className="font-bold text-slate-400">{contract.rejectedShares.toLocaleString()}</div>
                </div>
              </div>

              {/* Economic & Cost Transparency Mandated by Prompt */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Power &amp; PPA Rate</div>
                  <div className="font-semibold text-slate-200">{contract.powerWatt}W @ ${contract.electricityCostPerKwh}/kWh</div>
                  <div className="text-[10px] text-slate-500">Hosting: ${contract.dailyHostingFeeUsd}/day</div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Est. Daily Reward</div>
                  <div className="font-semibold text-emerald-400">
                    +{contract.dailyRewardEstimatedCrypto} {contract.coin}
                  </div>
                  <div className="text-[10px] text-slate-400">≈ ${contract.dailyRewardEstimatedUsd.toFixed(2)} USD/day</div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400">Stratum Mining Pool</div>
                  <div className="font-semibold text-slate-200 truncate">{contract.pool}</div>
                  <div className="text-[10px] text-slate-500">Fee: 1.5% FPPS/PPLNS</div>
                </div>
              </div>

              {/* Verified Blockchain Reconciled Accumulation */}
              {isActive && (
                <div className="bg-cyan-950/20 border border-cyan-800/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-mono">
                    <span className="text-slate-400">Total Accumulated Rewards: </span>
                    <span className="font-bold text-emerald-400">
                      {contract.totalAccumulatedCrypto} {contract.coin}
                    </span>
                    <span className="text-slate-400"> (${contract.totalAccumulatedUsd.toFixed(2)} USD)</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Blockchain Verified</span>
                  </div>
                </div>
              )}

              {/* Card Footer: Location & Action */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px] truncate max-w-[200px]">{contract.facilityLocation}</span>
                </div>

                {!isActive ? (
                  <button
                    id={`btn-lease-${contract.id}`}
                    onClick={() => onOpenPurchaseModal(contract)}
                    className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-md shadow-cyan-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Lease Hashpower (${contract.priceUsd})</span>
                  </button>
                ) : (
                  <button
                    id={`btn-extend-${contract.id}`}
                    onClick={() => onOpenPurchaseModal(contract)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 py-1"
                  >
                    Upgrade / Extend Duration &rarr;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
