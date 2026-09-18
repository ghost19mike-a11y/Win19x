import React, { useState } from 'react';
import {
  Scale,
  Cpu,
  Zap,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Sliders,
  DollarSign,
  ShieldAlert,
  Server,
  Users,
} from 'lucide-react';
import { RevenueTargetEngineState, ScaleEngineCapacityPlan } from '../types';

interface ScaleEngineProps {
  revenueState: RevenueTargetEngineState;
  onUpdateTargetConfig: (targetPerMin: number, thresholdPercent: number) => Promise<void>;
}

export const ScaleEngineView: React.FC<ScaleEngineProps> = ({
  revenueState,
  onUpdateTargetConfig,
}) => {
  const [targetInput, setTargetInput] = useState(revenueState.targetPerMinute.toString());
  const [thresholdInput, setThresholdInput] = useState(revenueState.alertThresholdPercent.toString());
  const [plan, setPlan] = useState<ScaleEngineCapacityPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Generate AI Capacity Plan from backend
  const handleGeneratePlan = async () => {
    setIsLoadingPlan(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/ai/capacity-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPerMinute: parseFloat(targetInput) || 1000,
          currentRevPerMinute: revenueState.currentRevenuePerMinute,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate plan');
      setPlan(data.plan);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await onUpdateTargetConfig(parseFloat(targetInput) || 1000, parseFloat(thresholdInput) || 30);
      setStatusMessage('Revenue Target and Alert Threshold updated successfully.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage(`Failed to update: ${err.message}`);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const currentTarget = parseFloat(targetInput) || 1000;
  const currentActual = revenueState.currentRevenuePerMinute;
  const gap = Math.max(0, currentTarget - currentActual);
  const gapPercent = ((gap / currentTarget) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Title & Disclaimers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  $1,000/Minute Scale Engine &amp; Capacity Planner
                </h2>
                <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-semibold">
                  AI SIMULATION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mathematical modeling of physical hashpower, power infrastructure, and CapEx/OpEx required to legitimately bridge the revenue target gap.
              </p>
            </div>
          </div>

          <button
            id="btn-run-capacity-sim"
            onClick={handleGeneratePlan}
            disabled={isLoadingPlan}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-amber-950/40 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoadingPlan ? 'animate-spin' : ''}`} />
            <span>{isLoadingPlan ? 'Running AI Model...' : 'Calculate Capacity Model'}</span>
          </button>
        </div>

        {/* Mandated Disclaimers on Profit Guarantee */}
        <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Economic Transparency Rule: </span>
            <span>
              The $1,000/minute metric is an operational benchmark for the platform's aggregate business performance, NOT a guaranteed return to users. The AI Capacity Planner models theoretical infrastructure additions; expansion does NOT guarantee revenue due to network difficulty fluctuations and coin market volatility.
            </span>
          </div>
        </div>
      </div>

      {/* Target Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Configurable System Targets</span>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Target Revenue ($ USD / Minute)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
                <input
                  id="input-target-revenue"
                  type="number"
                  step="10"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Automated Alert Threshold (% of Target)</label>
              <div className="relative">
                <input
                  id="input-alert-threshold"
                  type="number"
                  step="5"
                  max="100"
                  min="5"
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-500"
                />
                <span className="absolute right-3 top-2.5 text-slate-500">%</span>
              </div>
              <p className="text-[10px] text-slate-500">Alert fires if current performance drops below this percentage.</p>
            </div>

            <button
              id="btn-save-target-config"
              type="submit"
              disabled={isSavingConfig}
              className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold py-2 rounded-lg transition-all"
            >
              {isSavingConfig ? 'Saving...' : 'Apply Target Parameters'}
            </button>
          </form>

          {statusMessage && (
            <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 p-2.5 rounded-lg border border-cyan-800">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Current Gap Monitor */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Live Mathematical Gap Analysis</span>
            {revenueState.isAlertActive && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>ALERT: Performance Below {revenueState.alertThresholdPercent}% Threshold</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">TARGET</span>
              <div className="text-xl font-bold text-amber-300">${currentTarget.toLocaleString()}/min</div>
              <span className="text-[10px] text-slate-500">${(currentTarget * 60 * 24).toLocaleString()}/day</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase">ACTUAL</span>
              <div className="text-xl font-bold text-cyan-400">${currentActual.toFixed(2)}/min</div>
              <span className="text-[10px] text-slate-500">${(currentActual * 60 * 24).toLocaleString()}/day</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase">GAP</span>
              <div className="text-xl font-bold text-rose-400">-${gap.toFixed(2)}/min</div>
              <span className="text-[10px] text-rose-400 font-semibold">{gapPercent}% Shortfall</span>
            </div>
          </div>

          {/* Prompt requirement example illustration */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">Target Reconciliation Logic:</div>
            <div>TARGET: ${currentTarget.toLocaleString()}/minute</div>
            <div>ACTUAL: ${currentActual.toFixed(2)}/minute</div>
            <div className="text-rose-400 font-bold">GAP: ${gap.toFixed(2)}/minute</div>
            <div className="text-slate-500 pt-1">
              Note: The platform explicitly displays the gap rather than inventing fabricated revenue.
            </div>
          </div>
        </div>
      </div>

      {/* AI Capacity Plan Results */}
      {plan ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Projected Hardware &amp; Electrical Architecture Required
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Network Hashprice: ${plan.networkConditions.hashratePricePerThPerDay}/TH/day
            </span>
          </div>

          {/* Bento Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Required Hash Capacity</span>
              <div className="text-lg font-bold text-white mt-1">
                {(plan.requiredCapacity.hashrateRequiredTh / 1000).toFixed(2)} PH/s
              </div>
              <div className="text-[10px] text-slate-500">
                {plan.requiredCapacity.hashrateRequiredTh.toLocaleString()} TH/s
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">ASIC Hardware Fleet</span>
              <div className="text-lg font-bold text-cyan-400 mt-1">
                {plan.requiredCapacity.asicUnitsNeeded.toLocaleString()} Units
              </div>
              <div className="text-[10px] text-slate-500">{plan.requiredCapacity.asicModel.split('(')[0]}</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Power Demand</span>
              <div className="text-lg font-bold text-amber-400 mt-1">
                {plan.requiredCapacity.powerDemandMw} MW
              </div>
              <div className="text-[10px] text-slate-500">Substation interconnection</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Est. Gross Margin</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">
                {plan.requiredCapacity.estimatedMonthlyGrossMargin}%
              </div>
              <div className="text-[10px] text-slate-500">At $0.042/kWh PPA</div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Total Hardware CapEx</span>
              <div className="text-lg font-bold text-white">
                ${(plan.requiredCapacity.capexHardwareUsd / 1_000_000).toFixed(2)}M USD
              </div>
              <span className="text-[10px] text-slate-500">Wholesale Bitmain contract pricing</span>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Monthly Electricity OpEx</span>
              <div className="text-lg font-bold text-rose-400">
                ${(plan.requiredCapacity.monthlyOpexElectricityUsd / 1_000_000).toFixed(2)}M USD/mo
              </div>
              <span className="text-[10px] text-slate-500">Calculated on 24/7 high-density runtime</span>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400">Customer Base Required</span>
              <div className="text-lg font-bold text-indigo-400">
                ~{plan.requiredCapacity.projectedCustomersNeeded.toLocaleString()} Subscriptions
              </div>
              <span className="text-[10px] text-slate-500">At ${plan.requiredCapacity.avgRevPerCustomerMonthly}/mo ARPU</span>
            </div>
          </div>

          {/* Gemini AI Strategic Analysis */}
          {plan.aiStrategicAnalysis && (
            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini Operations Architect Strategic Assessment</span>
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                {plan.aiStrategicAnalysis}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Scale className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">Capacity Model Not Yet Run for Current Parameters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Calculate Capacity Model" above to trigger our AI Scale Engine. It will calculate exact ASIC hardware units, MW substation capacity, CapEx, OpEx, and operating margins required to reach the target.
          </p>
        </div>
      )}
    </div>
  );
};
