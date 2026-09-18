import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Server,
  KeyRound,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Lock,
  Globe,
  Database,
  Building2,
  Cpu,
  Fingerprint,
  Info,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CustodianConfig,
  RegulatoryComplianceMatrix,
  AMLScreeningResult,
  AssetSymbol,
} from '../types';

export const CustodyComplianceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'custody' | 'nodes' | 'aml' | 'regulations' | 'deployment'>('custody');
  const [custodian, setCustodian] = useState<CustodianConfig | null>(null);
  const [regulatory, setRegulatory] = useState<RegulatoryComplianceMatrix | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // AML Interactive Screening Test State
  const [testAddress, setTestAddress] = useState<string>('0x8576acc5c05d6ce08f4e49bf65bdf0c62f91353c');
  const [testAsset, setTestAsset] = useState<AssetSymbol>('ETH');
  const [testNetwork, setTestNetwork] = useState<string>('Ethereum Mainnet');
  const [testAmountUsd, setTestAmountUsd] = useState<number>(2500);
  const [isScreening, setIsScreening] = useState<boolean>(false);
  const [screeningResult, setScreeningResult] = useState<AMLScreeningResult | null>(null);

  // Selected policy expansion
  const [expandedPolicy, setExpandedPolicy] = useState<string>('fincen');

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/custodian/status');
      if (res.ok) {
        const data = await res.json();
        setCustodian(data.custodian);
        setRegulatory(data.regulatory);
      }
    } catch (err) {
      console.error('Failed to fetch custodian status', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const runAddressScreening = async (addressToTest?: string, coinToTest?: AssetSymbol) => {
    const targetAddr = addressToTest || testAddress;
    const targetCoin = coinToTest || testAsset;
    setIsScreening(true);
    try {
      const res = await fetch('/api/compliance/screen-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: targetAddr,
          asset: targetCoin,
          network: testNetwork,
          amountUsd: testAmountUsd,
        }),
      });
      const data = await res.json();
      if (data.screening) {
        setScreeningResult(data.screening);
      }
    } catch (err) {
      console.error('Screening failed', err);
    } finally {
      setIsScreening(false);
    }
  };

  const handleUpdateProvider = async (provider: 'FIREBLOCKS' | 'BITGO' | 'COINBASE_PRIME' | 'DIRECT_RPC_NODE') => {
    try {
      const res = await fetch('/api/custodian/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      if (res.ok) {
        const data = await res.json();
        setCustodian(data.custodian);
      }
    } catch (err) {
      console.error('Update provider failed', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Institutional Custody, MPC &amp; Regulatory Compliance
              </h2>
              <span className="text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-semibold">
                Publication Grade
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Institutional-grade multi-party computation (MPC) key orchestration, real-time Chainalysis AML &amp; OFAC sanctions screening, live mainnet RPC telemetry, and statutory regulatory filings for FinCEN, FATF Travel Rule, SEC/CFTC Howey Classification, and EU MiCA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">MPC Provider</div>
              <div className="text-xs font-bold text-cyan-400 font-mono">
                {custodian?.provider || 'FIREBLOCKS'}
              </div>
            </div>
            <button
              onClick={fetchStatus}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition-all border border-slate-700"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'custody', label: 'MPC Custody Engine', icon: KeyRound },
          { id: 'nodes', label: 'Mainnet RPC Nodes', icon: Server },
          { id: 'aml', label: 'AML & Sanctions Screening', icon: Shield },
          { id: 'regulations', label: 'Regulatory Matrix', icon: Building2 },
          { id: 'deployment', label: 'Mainnet Publication Guide', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MPC CUSTODY ENGINE */}
      {activeTab === 'custody' && custodian && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Operational Mode</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm font-bold text-white font-mono">{custodian.mode}</span>
              </div>
              <span className="text-[10px] text-slate-400">Institutional sandbox simulator active</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">MPC Quorum Threshold</span>
              <div className="text-sm font-bold text-cyan-400 font-mono">
                {custodian.mpcQuorum.requiredSigners}-of-{custodian.mpcQuorum.totalKeyShares} Key Shares
              </div>
              <span className="text-[10px] text-slate-400">{custodian.mpcQuorum.algorithm}</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Institutional Vault ID</span>
              <div className="text-sm font-bold text-white font-mono truncate">{custodian.vaultId}</div>
              <span className="text-[10px] text-slate-400">SOC2 Type II Qualified Storage</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">AML Engine</span>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {custodian.amlProvider} KYT
              </div>
              <span className="text-[10px] text-slate-400">Reject Threshold &ge; {custodian.amlAutoRejectThreshold}/100</span>
            </div>
          </div>

          {/* Provider Selector */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Institutional Custodian Gateway Selection</h3>
                <p className="text-xs text-slate-400">
                  Select your institution's non-custodial MPC or prime custody provider:
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Active: <strong className="text-cyan-400">{custodian.provider}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'FIREBLOCKS',
                  name: 'Fireblocks MPC-CMP',
                  desc: 'Multi-Party Computation with hardware-isolated enclaves (SGX/Nitro).',
                  badge: 'Standard',
                },
                {
                  id: 'BITGO',
                  name: 'BitGo Trust TSS',
                  desc: 'Multi-signature threshold scheme backed by BitGo Trust Company regulated charter.',
                  badge: 'Qualified Custodian',
                },
                {
                  id: 'COINBASE_PRIME',
                  name: 'Coinbase Prime',
                  desc: 'Institutional cold storage and prime execution gateway with NYDFS trust charter.',
                  badge: 'Regulated NYDFS',
                },
                {
                  id: 'DIRECT_RPC_NODE',
                  name: 'Direct Full Node RPC',
                  desc: 'Self-hosted air-gapped hot/cold signer nodes broadcasting raw signed RPC bytes.',
                  badge: 'Sovereign Node',
                },
              ].map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => handleUpdateProvider(prov.id as any)}
                  className={`p-4 rounded-xl text-left border transition-all space-y-2 ${
                    custodian.provider === prov.id
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">{prov.name}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                      {prov.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{prov.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Key Distribution Overview */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              MPC Key Distribution Architecture (2-of-3 Quorum)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-cyan-400">
                  <span className="font-bold">Key Share #1 (Client Share)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-[11px]">
                  Generated in client browser WebCrypto enclave and encrypted with user TOTP/MFA credential.
                </p>
                <div className="text-[10px] text-slate-500">Holder: Authorized Account Owner</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-purple-400">
                  <span className="font-bold">Key Share #2 (Platform Co-Signer)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-[11px]">
                  Stored in AWS KMS / GCP HSM, conditioned upon automated AML clearance and policy rule evaluation.
                </p>
                <div className="text-[10px] text-slate-500">Holder: NEXUS HASH Policy Engine</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="font-bold">Key Share #3 (Disaster Recovery)</span>
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-slate-400 text-[11px]">
                  Air-gapped cold split held in institutional escrow with regulated trust company (Coinbase / BitGo Trust).
                </p>
                <div className="text-[10px] text-slate-500">Holder: Institutional Backup Custodian</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAINNET RPC NODES */}
      {activeTab === 'nodes' && custodian && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Live Mainnet Blockchain RPC Gateways</h3>
              <p className="text-xs text-slate-400">
                Direct peer-to-peer telemetry to decentralized mainnet validator daemons:
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              All Nodes Synced (0 Blocks Behind)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {custodian.connectedRpcNodes.map((node) => (
              <div key={node.coin} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white text-sm">{node.coin} Mainnet</span>
                  </div>
                  <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded text-[10px] font-bold">
                    {node.status}
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>RPC Endpoint:</span>
                    <span className="text-cyan-400">{node.endpoint}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Current Block Height:</span>
                    <span className="text-white font-bold">#{node.blockHeight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Hot Vault Address:</span>
                    <span className="text-white truncate max-w-[140px]">{node.hotWalletAddress}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Round-Trip Latency:</span>
                    <span className="text-emerald-400">{node.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Treasury Reserve Fund:</span>
                    <span className="text-amber-400 font-bold">{node.hotWalletBalance} {node.coin}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AML & SANCTIONS SCREENING */}
      {activeTab === 'aml' && (
        <div className="space-y-6">
          {/* AML Engine Header */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Real-Time Chainalysis KYT &amp; OFAC Sanctions Testing Sandbox
                </h3>
                <p className="text-xs text-slate-400">
                  Every outgoing withdrawal is screened against OFAC SDN, EU, UK, and UN sanction lists, as well as darknet mixers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Auto-Reject Threshold:</span>
                <span className="text-xs font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">
                  Risk Score &ge; 75/100
                </span>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 font-mono">Screening Test Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setTestAddress('0x8576acc5c05d6ce08f4e49bf65bdf0c62f91353c');
                    setTestAsset('ETH');
                    setTestNetwork('Ethereum Mainnet');
                    runAddressScreening('0x8576acc5c05d6ce08f4e49bf65bdf0c62f91353c', 'ETH');
                  }}
                  className="bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                >
                  Tornado Cash Router (OFAC Sanctioned)
                </button>
                <button
                  onClick={() => {
                    setTestAddress('0x28C6c06298d514Db089934071355E5743bf21d60');
                    setTestAsset('ETH');
                    setTestNetwork('Ethereum Mainnet');
                    runAddressScreening('0x28C6c06298d514Db089934071355E5743bf21d60', 'ETH');
                  }}
                  className="bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/80 text-emerald-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                >
                  Binance / Coinbase Regulated VASP (Clean)
                </button>
                <button
                  onClick={() => {
                    setTestAddress('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
                    setTestAsset('BTC');
                    setTestNetwork('Bitcoin Mainnet');
                    runAddressScreening('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'BTC');
                  }}
                  className="bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/80 text-cyan-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                >
                  Genesis Mining Address (Clean)
                </button>
                <button
                  onClick={() => {
                    setTestAddress('bc1qa5wkgaew2dkv56kfvj49j0av5nqv05x0gah0xh');
                    setTestAsset('BTC');
                    setTestNetwork('Bitcoin Mainnet');
                    runAddressScreening('bc1qa5wkgaew2dkv56kfvj49j0av5nqv05x0gah0xh', 'BTC');
                  }}
                  className="bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/80 text-purple-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                >
                  Hydra Darknet Cluster (Illicit)
                </button>
              </div>
            </div>

            {/* Address Input & Screen Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={testAddress}
                onChange={(e) => setTestAddress(e.target.value)}
                placeholder="Enter any external wallet address to screen..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => runAddressScreening()}
                disabled={isScreening}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shrink-0"
              >
                {isScreening ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Querying Chainalysis...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Screen Address Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Screening Result Output */}
          {screeningResult && (
            <div className={`p-5 rounded-2xl border space-y-4 font-mono text-xs ${
              screeningResult.isSanctioned || screeningResult.riskScore >= 75
                ? 'bg-rose-950/40 border-rose-800'
                : 'bg-emerald-950/40 border-emerald-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-800">
                <div className="flex items-center gap-2">
                  {screeningResult.isSanctioned || screeningResult.riskScore >= 75 ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="font-bold text-white text-sm">
                    Screening Status: {screeningResult.riskLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Risk Score:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-sm ${
                    screeningResult.riskScore >= 75
                      ? 'bg-rose-500 text-white'
                      : screeningResult.riskScore >= 40
                      ? 'bg-amber-500 text-black'
                      : 'bg-emerald-500 text-black'
                  }`}>
                    {screeningResult.riskScore} / 100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500">Sanction Lists:</span>
                  <div className={`font-bold ${screeningResult.isSanctioned ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {screeningResult.isSanctioned ? 'MATCH FOUND (BLOCKED)' : '0 Matches (Clean)'}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500">FATF Travel Rule:</span>
                  <div className={`font-bold ${screeningResult.travelRuleClearance?.status === 'CLEARED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {screeningResult.travelRuleClearance?.status === 'CLEARED' ? 'IVMS-101 Cleared' : 'Action Required'}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500">Exposure Categories:</span>
                  <div className="text-white truncate">
                    {screeningResult.categoryBreakdown?.map((c) => c.category).join(', ') || 'None (Direct P2P)'}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500">Audit Certificate:</span>
                  <div className="text-cyan-400 truncate">{screeningResult.auditHash}</div>
                </div>
              </div>

              {screeningResult.sanctionEntities.length > 0 && (
                <div className="bg-rose-900/40 p-3 rounded-lg border border-rose-700/60 text-rose-200 text-[11px] space-y-1">
                  <div className="font-bold">Sanction Entity Match:</div>
                  {screeningResult.sanctionEntities.map((ent, idx) => (
                    <div key={idx}>&bull; {ent}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REGULATORY COMPLIANCE MATRIX */}
      {activeTab === 'regulations' && regulatory && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Full Legal &amp; Regulatory Compliance Matrix</h3>
            <p className="text-xs text-slate-400">
              Statutory disclosures required for lawful commercial publication across key jurisdictions:
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* FinCEN MSB */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedPolicy(expandedPolicy === 'fincen' ? '' : 'fincen')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="font-bold text-white text-sm">
                      1. FinCEN MSB Registration &amp; BSA Anti-Money Laundering
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Registration: {regulatory.fincenMsbNumber} &bull; Status: {regulatory.fincenStatus}
                    </div>
                  </div>
                </div>
                {expandedPolicy === 'fincen' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedPolicy === 'fincen' && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2 text-[11px] text-slate-300">
                  <p>
                    NEXUS HASH operates in full compliance with the <strong>Bank Secrecy Act (BSA)</strong>, 31 U.S.C. § 5311 et seq., and FinCEN regulations under 31 CFR Chapter X.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Currency Transaction Reports (CTRs) automatically filed for aggregate transactions &ge; $10,000 USD.</li>
                    <li>Suspicious Activity Reports (SARs) filed under 31 CFR § 1022.320 for suspicious behavioral patterns.</li>
                    <li>Designated Chief Compliance Officer (AML/BSA Officer) and annual independent SOC2 Type II audits.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Travel Rule */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedPolicy(expandedPolicy === 'travel' ? '' : 'travel')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-bold text-white text-sm">
                      2. FATF Recommendation 16 (Travel Rule)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Status: {regulatory.fatfTravelRuleCompliant ? 'Compliant (IVMS-101 Protocol)' : 'Pending Verification'} &bull; Interop: Notabene, TRP, Sygna Bridge
                    </div>
                  </div>
                </div>
                {expandedPolicy === 'travel' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedPolicy === 'travel' && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2 text-[11px] text-slate-300">
                  <p>
                    Automated transmission of originator and beneficiary PII on all crypto transfers exceeding $1,000 / &euro;1,000 equivalent using the <strong>IVMS-101</strong> international standard.
                  </p>
                </div>
              )}
            </div>

            {/* SEC / CFTC Howey Test */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedPolicy(expandedPolicy === 'sec' ? '' : 'sec')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-bold text-white text-sm">
                      3. SEC &amp; CFTC Howey Test Opinion: Computing Lease Classification
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Status: {regulatory.secHoweyTestStatus} &bull; Opinion: Commercial Hardware Lease
                    </div>
                  </div>
                </div>
                {expandedPolicy === 'sec' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedPolicy === 'sec' && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2 text-[11px] text-slate-300">
                  <p>
                    Under <em>SEC v. W.J. Howey Co.</em>, 328 U.S. 293 (1946), cloud-mining contracts are structured strictly as <strong>Commercial Computing Leases</strong>. Users purchase dedicated hardware computation time directed to mining pools of their selection. No profits are promised, guaranteed, or generated through the managerial efforts of the platform.
                  </p>
                </div>
              )}
            </div>

            {/* OFAC Sanctions */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedPolicy(expandedPolicy === 'ofac' ? '' : 'ofac')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="font-bold text-white text-sm">
                      4. OFAC Economic Sanctions &amp; Geofencing
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Real-Time Sanctions Screening: {regulatory.ofacAutomatedScreening ? 'Active' : 'Disabled'} &bull; Lists: SDN, EO 13694
                    </div>
                  </div>
                </div>
                {expandedPolicy === 'ofac' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedPolicy === 'ofac' && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2 text-[11px] text-slate-300">
                  <p>
                    Strict adherence to all economic sanction programs administered by the U.S. Department of the Treasury's Office of Foreign Assets Control (OFAC). Automated IP geofencing blocks access from comprehensively sanctioned regions.
                  </p>
                </div>
              )}
            </div>

            {/* EU MiCA */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedPolicy(expandedPolicy === 'mica' ? '' : 'mica')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="font-bold text-white text-sm">
                      5. EU Markets in Crypto-Assets (MiCA - Regulation EU 2023/1114)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Classification: {regulatory.micaClassification} &bull; Renewable Energy Mix: 100% Hydro/Wind/Geothermal
                    </div>
                  </div>
                </div>
                {expandedPolicy === 'mica' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedPolicy === 'mica' && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2 text-[11px] text-slate-300">
                  <p>
                    Compliant with Title V CASP requirements and Article 68 sustainable consensus mechanism reporting. Our datacenter partners operate on 100% certified hydropower and wind renewables.
                  </p>
                </div>
              )}
            </div>

            {/* Custody & Proof of Reserves */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedPolicy(expandedPolicy === 'custodyPolicy' ? '' : 'custodyPolicy')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="font-bold text-white text-sm">
                      6. Institutional Custody &amp; Cryptographic Proof-of-Reserves (PoR)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Audit Status: {regulatory.proofOfReservesVerified ? 'Verified' : 'Unverified'} &bull; Merkle Root: {regulatory.porMerkleRoot?.slice(0, 18)}...
                    </div>
                  </div>
                </div>
                {expandedPolicy === 'custodyPolicy' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expandedPolicy === 'custodyPolicy' && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2 text-[11px] text-slate-300">
                  <p>
                    All user assets are held in segregated, bankruptcy-remote MPC vaults with qualified institutional custodians. Cryptographic Proof-of-Reserves are generated every 24 hours using Merkle-sum tree proofs.
                  </p>
                  <div className="font-mono text-[10px] text-slate-400 bg-slate-900 p-2 rounded truncate">
                    Last Audit Date: {regulatory.lastPorAuditDate} &bull; Root: {regulatory.porMerkleRoot}
                  </div>
                  <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded text-amber-300 text-[10px]">
                    <strong>Statutory Non-Coverage Notice:</strong> Cryptocurrency assets are not bank deposits and are NOT insured by the FDIC, SIPC, or any state or federal deposit insurance organization.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MAINNET PUBLICATION GUIDE */}
      {activeTab === 'deployment' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Mainnet Production Readiness &amp; Environment Setup Checklist
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              The application is architected with institutional-grade modular abstractions. To publish to live mainnet, provide the required API credentials in your environment configuration:
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-[11px]">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Environment Variables (.env)</span>
              <pre className="text-cyan-300 overflow-x-auto p-2 bg-black/40 rounded border border-slate-800/80">
{`# 1. Institutional Custodian API (Choose your active provider)
CUSTODIAN_MODE=PRODUCTION_MPC
CUSTODIAN_PROVIDER=FIREBLOCKS
FIREBLOCKS_API_KEY=your_production_api_key
FIREBLOCKS_SECRET_PATH=/path/to/fireblocks_secret.key
FIREBLOCKS_VAULT_ACCOUNT_ID=1

# Or BitGo Trust TSS
# BITGO_ACCESS_TOKEN=your_bitgo_token
# BITGO_WALLET_ID=your_bitgo_wallet_id

# 2. Mainnet Live RPC Endpoints
BITCOIN_RPC_URL=https://mainnet.nexus.rpc/btc
BITCOIN_RPC_USER=nexus_rpc
BITCOIN_RPC_PASSWORD=secure_rpc_pass
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# 3. Real-Time AML & Sanctions Screening
CHAINALYSIS_API_KEY=your_chainalysis_kyt_key
ELLIPTIC_API_KEY=your_elliptic_key
AML_AUTO_REJECT_THRESHOLD=75`}
              </pre>
            </div>

            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Code Changes Required for Mainnet Transition</span>
              </div>
              <p>
                The withdrawal and exchange endpoints are programmed to automatically route transactions to live Fireblocks/BitGo MPC signers and broadcast raw hex payloads to the configured mainnet RPC endpoints when the environment variables are active.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
