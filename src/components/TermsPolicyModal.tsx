import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Download,
  Printer,
  Scale,
  Lock,
  AlertTriangle,
  RotateCcw,
  Cookie,
  CheckCircle2,
} from 'lucide-react';
import { LEGAL_POLICIES, LegalPolicySection } from '../data/legalPolicies';

interface TermsPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicyKey?: string;
}

export const TermsPolicyModal: React.FC<TermsPolicyModalProps> = ({
  isOpen,
  onClose,
  initialPolicyKey = 'terms',
}) => {
  const [activeKey, setActiveKey] = useState<string>(initialPolicyKey);
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentPolicy: LegalPolicySection = LEGAL_POLICIES[activeKey] || LEGAL_POLICIES.terms;

  const tabs = [
    { key: 'terms', label: 'Terms of Service', icon: FileText },
    { key: 'privacy', label: 'Privacy Policy', icon: Lock },
    { key: 'aml', label: 'AML & Sanctions', icon: Scale },
    { key: 'risk', label: 'Risk Disclosures', icon: AlertTriangle },
    { key: 'refund', label: 'Refund & Lease Policy', icon: RotateCcw },
    { key: 'cookies', label: 'Cookie Policy', icon: Cookie },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleAcknowledge = () => {
    setAcknowledged((prev) => ({ ...prev, [activeKey]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  NEXUS HASH Legal &amp; Regulatory Repository
                </h3>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                  {currentPolicy.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Effective: {currentPolicy.effectiveDate} • Verified Cryptographic Standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print document"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-mono"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              id="btn-close-legal-modal"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tab Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveKey(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {acknowledged[tab.key] && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Policy Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-200">
          {/* Summary Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-xs uppercase font-mono font-bold text-cyan-400 flex items-center gap-2">
              <span>Executive Policy Summary</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-normal">Binding Legal Instrument</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentPolicy.summary}
            </p>
          </div>

          {/* Heading */}
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {currentPolicy.title}
            </h2>
          </div>

          {/* Clauses */}
          <div className="space-y-6">
            {currentPolicy.clauses.map((clause, idx) => (
              <div
                key={idx}
                className="space-y-2.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60"
              >
                <h4 className="text-sm sm:text-base font-bold text-cyan-200 flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-xs">§{idx + 1}</span>
                  <span>{clause.heading}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {clause.content}
                </p>
                {clause.subpoints && clause.subpoints.length > 0 && (
                  <ul className="space-y-1.5 pt-1 pl-3 border-l-2 border-slate-800 text-xs text-slate-400 font-mono">
                    {clause.subpoints.map((sub, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">
                        • {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Institutional Stamp */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-slate-500">Jurisdiction: </span>
              <span className="text-slate-300">Delaware, USA / Global Digital Asset Compliance</span>
            </div>
            <div>
              <span className="text-slate-500">Stratum Verification: </span>
              <span className="text-emerald-400 font-semibold">100% On-Chain Reconciled</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Document Status: Official &amp; Legally Binding</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAcknowledge}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                acknowledged[activeKey]
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{acknowledged[activeKey] ? 'Acknowledged' : 'Mark as Read & Acknowledged'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-950/40 transition-all"
            >
              Close Repository
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
