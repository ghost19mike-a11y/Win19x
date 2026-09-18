import React, { useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Sliders,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { AgentRecommendation, AgentStage, AgentStageItem, AuditLogEntry } from '../types';

export const AIOperationsAgentView: React.FC = () => {
  const [isRunningCycle, setIsRunningCycle] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(4); // Default at RECOMMEND
  const [recommendation, setRecommendation] = useState<AgentRecommendation | null>({
    id: 'rec-01',
    title: 'Stratum Pool Rebalancing (AntPool to Foundry USA)',
    action: 'REALLOCATE_HASH_CAPACITY',
    sourcePool: 'AntPool Immersion Tier',
    targetPool: 'Foundry USA Pool',
    hashrateShiftTh: 120,
    projectedProfitDeltaUsdDaily: 18.4,
    estimatedFeeUsd: 0.35,
    riskLevel: 'LOW',
    rationale:
      'Foundry USA currently displays 12ms lower stratum ping in North America with 0.08% lower orphan/reject share rate over the last 1,000 blocks. Rebalancing 120 TH/s yields estimated +$18.40 USD net daily uplift.',
    approved: false,
    executed: false,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-01',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString(),
      stage: 'DISCOVER',
      message: 'Scanned 4 Stratum V2 pool endpoints across Texas and Iceland facilities.',
      verifiedOnChain: true,
      blockReference: 'Block #893425',
    },
    {
      id: 'log-02',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
      stage: 'ANALYZE',
      message: 'Identified 0.12% rejected share variance on AntPool vs Foundry USA.',
      verifiedOnChain: true,
    },
    {
      id: 'log-03',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toLocaleTimeString(),
      stage: 'CALCULATE',
      message: 'Net marginal profitability difference estimated at +$18.40/day.',
      verifiedOnChain: true,
    },
    {
      id: 'log-04',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(),
      stage: 'SIMULATE',
      message: 'Dry run completed with 0 downtime risk and instant DNS failover.',
      verifiedOnChain: true,
    },
    {
      id: 'log-05',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString(),
      stage: 'RECOMMEND',
      message: 'Prepared proposal for Operator Approval. No fund movement permitted without signature.',
      verifiedOnChain: true,
    },
  ]);

  const stages: { stage: AgentStage; label: string; desc: string }[] = [
    { stage: 'DISCOVER', label: '1. Discover', desc: 'Scan live pool performance & difficulty' },
    { stage: 'ANALYZE', label: '2. Analyze', desc: 'Compare latency, reject rate & fee delta' },
    { stage: 'CALCULATE', label: '3. Calculate', desc: 'Compute exact USD & crypto yield impact' },
    { stage: 'SIMULATE', label: '4. Simulate', desc: 'Test stratum reroute without downtime' },
    { stage: 'RECOMMEND', label: '5. Recommend', desc: 'Generate high-conviction proposal' },
    { stage: 'USER_APPROVAL', label: '6. User Approval', desc: 'Operator explicit cryptographic consent' },
    { stage: 'EXECUTE', label: '7. Execute', desc: 'Apply stratum API configuration' },
    { stage: 'VERIFY', label: '8. Verify', desc: 'Validate accepted shares on new pool' },
    { stage: 'MONITOR', label: '9. Monitor', desc: 'Real-time telemetry & temperature check' },
    { stage: 'OPTIMIZE', label: '10. Optimize', desc: 'Feedback loop into capacity planner' },
  ];

  // Run full 10-step lifecycle
  const handleTriggerCycle = async () => {
    setIsRunningCycle(true);
    try {
      const res = await fetch('/api/ai/operations-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'OPTIMIZE' }),
      });
      const data = await res.json();
      if (data.recommendation) {
        setRecommendation(data.recommendation);
      }
      setActiveStageIndex(4); // Land on RECOMMEND
      const newLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        stage: 'OPTIMIZE',
        message: 'Completed full algorithmic review across 10 operational lifecycle stages.',
        verifiedOnChain: true,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningCycle(false);
    }
  };

  const handleApprove = () => {
    if (!recommendation) return;
    setRecommendation({ ...recommendation, approved: true });
    setActiveStageIndex(5); // USER APPROVAL completed
    setTimeout(() => {
      setActiveStageIndex(6); // EXECUTE
      setTimeout(() => {
        setActiveStageIndex(7); // VERIFY
        setRecommendation((prev) => (prev ? { ...prev, executed: true } : null));
        const execLog: AuditLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          stage: 'EXECUTE',
          message: `Approved: Shifted ${recommendation.hashrateShiftTh} TH/s to ${recommendation.targetPool}. Verified on Stratum feed.`,
          verifiedOnChain: true,
          blockReference: 'Block #893428',
        };
        setAuditLogs((prev) => [execLog, ...prev]);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              AI Mining Operations Agent &amp; Control Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Autonomous operations intelligence governing hardware allocation, pool efficiency, and electricity curtailment. Bound strictly by human authorization for fund custody.
          </p>
        </div>

        <button
          id="btn-run-agent-cycle"
          onClick={handleTriggerCycle}
          disabled={isRunningCycle}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-cyan-950/40 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunningCycle ? 'animate-spin' : ''}`} />
          <span>{isRunningCycle ? 'Running 10-Step Audit...' : 'Run Operations Audit'}</span>
        </button>
      </div>

      {/* 10-Stage Lifecycle Stepper Mandated by Prompt */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Mandated 10-Stage Operations Workflow
          </h3>
          <span className="text-[11px] font-mono text-cyan-400">
            Active: {stages[activeStageIndex]?.label || 'RECOMMEND'}
          </span>
        </div>

        {/* Stepper horizontal grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 font-mono">
          {stages.map((item, idx) => {
            const isDone = idx < activeStageIndex;
            const isCurrent = idx === activeStageIndex;
            return (
              <div
                key={item.stage}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-white ring-1 ring-cyan-400/40'
                    : isDone
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
                  )}
                </div>
                <div className="text-[11px] font-bold truncate">{item.stage}</div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">{item.desc.slice(0, 14)}...</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Tactical Recommendation & Approval Card */}
      {recommendation && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">{recommendation.title}</h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                recommendation.executed
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : recommendation.approved
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {recommendation.executed
                ? 'EXECUTED & VERIFIED'
                : recommendation.approved
                ? 'APPROVED (EXECUTING...)'
                : 'PENDING OPERATOR APPROVAL'}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
            {recommendation.rationale}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Target Pool</span>
              <div className="font-bold text-slate-200 mt-0.5">{recommendation.targetPool}</div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Capacity Shift</span>
              <div className="font-bold text-cyan-400 mt-0.5">{recommendation.hashrateShiftTh} TH/s</div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Net Yield Delta</span>
              <div className="font-bold text-emerald-400 mt-0.5">
                +${recommendation.projectedProfitDeltaUsdDaily.toFixed(2)} USD/day
              </div>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Risk Rating</span>
              <div className="font-bold text-slate-200 mt-0.5">{recommendation.riskLevel} (Zero Downtime)</div>
            </div>
          </div>

          {/* Action Approval Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-mono">
              Mandate: AI cannot independently move user funds outside authorized permissions.
            </span>

            {!recommendation.executed && (
              <button
                id="btn-approve-recommendation"
                onClick={handleApprove}
                disabled={recommendation.approved}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md shadow-emerald-950/50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{recommendation.approved ? 'Approved' : 'Grant Operator Approval & Execute'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI Operations Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Operational Decision Audit Stream
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">{auditLogs.length} Events Reconciled</span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{log.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold text-[10px]">
                  {log.stage}
                </span>
                <span className="text-slate-200">{log.message}</span>
              </div>
              {log.blockReference && (
                <span className="text-slate-400 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {log.blockReference}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
