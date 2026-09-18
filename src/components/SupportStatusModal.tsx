import React, { useState } from 'react';
import {
  X,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  Send,
  LifeBuoy,
  Building,
  ShieldCheck,
} from 'lucide-react';

interface SupportStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPolicy: (key: string) => void;
}

export const SupportStatusModal: React.FC<SupportStatusModalProps> = ({
  isOpen,
  onClose,
  onOpenPolicy,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'support'>('status');
  const [ticketCategory, setTicketCategory] = useState('technical');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    const id = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedTicketId(id);
    setTicketSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                System Infrastructure &amp; Institutional Support
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Tier-3 Datacenter Telemetry • 24/7 Priority SLA Desk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'status'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Infrastructure Status (All Operational)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'support'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Submit Operator Ticket</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'status' ? (
            <div className="space-y-4">
              {/* Global Uptime Metric */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Global Hardware Uptime (30-Day Rolling)</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">99.98%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Active Dedicated Hashrate</div>
                  <div className="text-lg font-bold font-mono text-cyan-300">1,248.65 TH/s Pool Output</div>
                </div>
              </div>

              {/* Datacenter Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                  Physical Mining Facilities
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Facility A (USA)</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        Operational
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono space-y-1">
                      <div>Location: Rockdale, Texas</div>
                      <div>Cooling: Hydro Immersion</div>
                      <div>PPA Rate: $0.042 / kWh</div>
                      <div>Substation: 12.8 MW Draw</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Facility B (Iceland)</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        Operational
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono space-y-1">
                      <div>Location: Keflavik, Iceland</div>
                      <div>Power: 100% Geothermal</div>
                      <div>PPA Rate: $0.039 / kWh</div>
                      <div>Ambient Temp: 3.2°C</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Facility C (Norway)</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        Operational
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono space-y-1">
                      <div>Location: Dale, Norway</div>
                      <div>Power: Hydroelectric</div>
                      <div>PPA Rate: $0.045 / kWh</div>
                      <div>PUE Metric: 1.04</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Services */}
              <div className="space-y-2">
                <div className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                  Network &amp; Financial Services
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 divide-y divide-slate-900 text-xs font-mono">
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200">Stratum V2 Protocol Gateways (Foundry &amp; AntPool)</span>
                    </div>
                    <span className="text-emerald-400 font-bold">14ms Latency</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200">Institutional Multi-Coin Exchange Router</span>
                    </div>
                    <span className="text-emerald-400 font-bold">0.08% - 0.12% Spread</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200">On-Chain Ledger Withdrawal Broadcast Nodes</span>
                    </div>
                    <span className="text-emerald-400 font-bold">In-Sync (Block Height 861,942)</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-200">Daily Electricity PPA Cost Deduction Engine</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Automated Reconciled</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!ticketSubmitted ? (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    Submit inquiries directly to our certified datacenter operations and compliance team. Institutional accounts receive a guaranteed response within 15 minutes.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-mono">Department / Category</label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                      >
                        <option value="technical">ASIC Hashrate &amp; Stratum V2</option>
                        <option value="exchange">Multi-Coin Exchange &amp; Quotes</option>
                        <option value="withdrawal">Withdrawal &amp; 2FA Authentication</option>
                        <option value="institutional">Wholesale Datacenter Capacity Lease</option>
                        <option value="compliance">AML / KYC &amp; Regulatory Inquiries</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-mono">Subject / Summary</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Stratum worker latency query"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-mono">Detailed Request</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please include relevant transaction hashes or contract IDs..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:border-cyan-500 focus:outline-none font-sans resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenPolicy('terms')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono"
                    >
                      View SLA &amp; Support Guarantee Terms
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Encrypted Ticket</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Ticket Dispatched Successfully</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your request has been routed to on-duty datacenter engineers. Ticket reference:
                  </p>
                  <div className="inline-block bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg font-mono text-cyan-400 font-bold text-sm">
                    {generatedTicketId}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Priority SLA Target: Under 15 minutes • PGP-signed notification dispatched
                  </p>
                  <button
                    onClick={() => {
                      setTicketSubmitted(false);
                      setTicketSubject('');
                      setTicketMessage('');
                    }}
                    className="mt-3 px-4 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                  >
                    Submit Another Request
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
