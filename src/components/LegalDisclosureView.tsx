import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  DollarSign,
  Scale,
  Building,
  CheckCircle2,
  Lock,
  RotateCcw,
  Cookie,
  Printer,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { LEGAL_POLICIES, LegalPolicySection } from '../data/legalPolicies';

export const LegalDisclosureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('infrastructure');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'terms-0': true,
    'privacy-0': true,
    'aml-0': true,
    'risk-0': true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navItems = [
    { id: 'infrastructure', label: 'Physical Infrastructure & PPAs', icon: Building },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'aml', label: 'AML & Sanctions', icon: Scale },
    { id: 'risk', label: 'Risk Disclosures', icon: AlertTriangle },
    { id: 'refund', label: 'Refund & Lease Policy', icon: RotateCcw },
    { id: 'cookies', label: 'Cookie Compliance', icon: Cookie },
  ];

  const currentPolicy = LEGAL_POLICIES[activeTab];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Legal, Regulatory &amp; Compliance Center
            </h2>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            NEXUS HASH operates in strict adherence to global cryptographic custody standards, international AML/Sanctions regulations, and transparent physical ASIC datacenter manifests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Compliance Docs</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab View */}
      {activeTab === 'infrastructure' ? (
        <div className="space-y-6">
          {/* Primary Disclosures Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Physical Infrastructure Reality */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Building className="w-4 h-4" />
                <span>1. Physical Hardware &amp; Operators</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                All cloud mining capacity offered through NEXUS HASH corresponds 1:1 to physical ASIC hardware owned by or contractually dedicated to the platform. Hardware is maintained by certified datacenter engineers across 3 Tier-3 facilities:
              </p>
              <ul className="space-y-1.5 text-slate-400 pl-2 border-l border-slate-800">
                <li>• Facility A: Rockdale, Texas (ERCOT grid, hydro-cooled immersion containers, 12.8 MW capacity)</li>
                <li>• Facility B: Keflavik, Iceland (Geothermal 100% renewable baseload, sub-zero natural cooling)</li>
                <li>• Facility C: Dale, Norway (Run-of-river hydroelectric facility, PUE 1.04)</li>
              </ul>
            </div>

            {/* Electricity & Hosting Costs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <DollarSign className="w-4 h-4" />
                <span>2. Power &amp; Hosting Fees</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Power rates are fixed via long-term Power Purchase Agreements (PPAs) ranging between $0.039 and $0.045 per kWh. Daily hosting fees cover power consumption, ambient filtration, high-voltage transformers, and 24/7 on-site technician response.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-400">
                Formula: Daily Hosting = (Watts / 1000) * 24 hrs * $0.042/kWh. All fees are deducted transparently prior to net reward crediting.
              </div>
            </div>

            {/* No Guaranteed Profit Rule */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>3. No Guaranteed Profit / Strict Risk Notice</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                NEXUS HASH does NOT guarantee returns, yields, or static profitability. Mining output is directly dependent on global network difficulty (which adjusts every 2,016 blocks on Bitcoin), block subsidy halvings, and secondary market exchange rates.
              </p>
              <p className="text-rose-400 font-semibold">
                Cryptocurrency values fluctuate. Users should evaluate hardware leases based on network fundamentals, not speculative return assumptions.
              </p>
            </div>

            {/* Exchange & Withdrawal Network Fees */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Scale className="w-4 h-4" />
                <span>4. Exchange &amp; Network Fees</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Multi-coin conversions are routed through verified third-party institutional liquidity providers (Binance/Kraken OTC orderbooks). Standard spread is 0.08% to 0.15%. Network withdrawal fees correspond strictly to blockchain miners/validators and are never marked up.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-400">
                Non-Custodial Integrity: NEXUS HASH will NEVER request your private keys or seed phrase.
              </div>
            </div>
          </div>

          {/* Compliance Certification Statement */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>Institutional Verification: All pool shares reconciled on-chain with Stratum V2 cryptographic headers.</span>
            </div>
            <span className="text-[11px] text-slate-500 whitespace-nowrap">Audit Hash: 0x9a8f...4e1b</span>
          </div>
        </div>
      ) : currentPolicy ? (
        /* Detailed Policy View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {currentPolicy.title}
                </h3>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                  {currentPolicy.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Effective: {currentPolicy.effectiveDate} • Delaware Governing Jurisdiction
              </p>
            </div>
          </div>

          {/* Policy Summary */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
            <span className="font-bold text-cyan-400 font-mono uppercase block mb-1">
              Summary Statement
            </span>
            {currentPolicy.summary}
          </div>

          {/* Clause List */}
          <div className="space-y-4">
            {currentPolicy.clauses.map((clause, idx) => {
              const secId = `${activeTab}-${idx}`;
              const isExpanded = expandedSections[secId] ?? true;

              return (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(secId)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-xs">§{idx + 1}</span>
                      <span>{clause.heading}</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-2.5 text-xs text-slate-300 border-t border-slate-900">
                      <p className="leading-relaxed font-sans">{clause.content}</p>
                      {clause.subpoints && clause.subpoints.length > 0 && (
                        <ul className="space-y-1.5 pl-3 border-l-2 border-slate-800 text-slate-400 font-mono pt-1">
                          {clause.subpoints.map((sub, sIdx) => (
                            <li key={sIdx} className="leading-relaxed">
                              • {sub}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between border-t border-slate-800">
            <span>Electronic Document Hash: SHA256(nexus_legal_{activeTab})</span>
            <span className="text-emerald-400">All Operators Legally Bound Upon Service Access</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
