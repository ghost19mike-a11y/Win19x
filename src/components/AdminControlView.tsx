import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Zap,
  DollarSign,
  Server,
  Activity,
  Users,
  Power,
  RefreshCw,
  Lock,
  Unlock,
} from 'lucide-react';
import { MiningContract, RevenueTargetEngineState, UserProfile } from '../types';

interface AdminControlProps {
  revenueState: RevenueTargetEngineState;
  contracts: MiningContract[];
  emergencyPause: boolean;
  onToggleEmergencyPause: () => Promise<void>;
  user: UserProfile | null;
}

export const AdminControlView: React.FC<AdminControlProps> = ({
  revenueState,
  contracts,
  emergencyPause,
  onToggleEmergencyPause,
  user,
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleEmergencyPause();
    } catch (err) {
      console.error(err);
    } finally {
      setIsToggling(false);
    }
  };

  const totalHashrateTh = contracts.reduce((acc, c) => {
    if (c.hashrateUnit === 'TH/s') return acc + c.hashrate;
    if (c.hashrateUnit === 'GH/s') return acc + c.hashrate / 1000;
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Title & Emergency Switch */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Platform Admin Mission Control
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-semibold">
              SUPERVISOR TIER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global monitoring of physical ASICs, substation electrical loads, platform liquidity, and circuit breakers.
          </p>
        </div>

        {/* Emergency Withdrawal Pause Button */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <div className="text-left font-mono">
            <div className="text-[10px] uppercase text-slate-400">Emergency Circuit Breaker</div>
            <div className="text-xs font-bold text-white">
              Status: {emergencyPause ? <span className="text-red-400">PAUSED</span> : <span className="text-emerald-400">OPERATIONAL</span>}
            </div>
          </div>

          <button
            id="btn-toggle-emergency-pause"
            onClick={handleToggle}
            disabled={isToggling}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              emergencyPause
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-900/60'
            }`}
          >
            {emergencyPause ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{emergencyPause ? 'Resume Withdrawals' : 'Pause Withdrawals'}</span>
          </button>
        </div>
      </div>

      {/* Admin Executive Metrics Mandated by Prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Total Hashpower</span>
          <div className="text-xl font-bold text-white">{totalHashrateTh.toFixed(1)} TH/s</div>
          <span className="text-[10px] text-slate-500">Across 3 Data Centers</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Platform Liquidity</span>
          <div className="text-xl font-bold text-emerald-400">$1,450,000 USD</div>
          <span className="text-[10px] text-slate-500">Multi-Exchange Hot/Cold Reserves</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Network Fees Incurred</span>
          <div className="text-xl font-bold text-slate-200">${revenueState.networkFees.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">On-chain broadcast costs</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">System Uptime</span>
          <div className="text-xl font-bold text-emerald-400">99.98%</div>
          <span className="text-[10px] text-slate-500">Zero unplanned outages</span>
        </div>
      </div>

      {/* Pool Distribution & Hardware Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pool Allocation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
          <h3 className="font-bold text-white text-sm">Stratum Mining Pools Routing</h3>
          <div className="space-y-2">
            {[
              { pool: 'Foundry USA Pool', share: '54%', latency: '14ms', algo: 'SHA-256 (BTC)', fee: '1.5% FPPS' },
              { pool: 'F2Pool Scrypt Merged', share: '24%', latency: '28ms', algo: 'Scrypt (LTC/DOGE)', fee: '1.25% PPLNS' },
              { pool: 'AntPool Immersion Tier', share: '12%', latency: '35ms', algo: 'SHA-256 (BTC)', fee: '1.5% FPPS' },
              { pool: 'Kaspa WoolyPooly', share: '10%', latency: '19ms', algo: 'kHeavyHash (KAS)', fee: '0.9% PPLNS' },
            ].map((p) => (
              <div key={p.pool} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">{p.pool}</div>
                  <div className="text-[10px] text-slate-500">{p.algo} • {p.fee}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">{p.share} Hash Share</div>
                  <div className="text-[10px] text-emerald-400">{p.latency} ping</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Fleet Inventory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono text-xs">
          <h3 className="font-bold text-white text-sm">Hardware Inventory &amp; Facility Loads</h3>
          <div className="space-y-2">
            {[
              { model: 'Bitmain Antminer S21 Pro', total: 45, online: 45, load: '157.9 kW', loc: 'Rockdale, Texas' },
              { model: 'MicroBT Whatsminer M63S Hydro', total: 12, online: 12, load: '86.5 kW', loc: 'Rockdale, Texas' },
              { model: 'Bitmain Antminer L9', total: 20, online: 20, load: '67.2 kW', loc: 'Keflavik, Iceland' },
              { model: 'Goldshell AL-BOX II', total: 18, online: 18, load: '6.4 kW', loc: 'Dale, Norway' },
            ].map((hw) => (
              <div key={hw.model} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">{hw.model}</div>
                  <div className="text-[10px] text-slate-500">{hw.loc} • Load: {hw.load}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{hw.online}/{hw.total} Online</div>
                  <div className="text-[10px] text-slate-400">100% telemetry</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
