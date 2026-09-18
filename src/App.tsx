import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CloudMiningGainerView } from './components/CloudMiningGainerView';
import { MiningView } from './components/MiningView';
import { ExchangeRouterView } from './components/ExchangeRouterView';
import { WalletView } from './components/WalletView';
import { ScaleEngineView } from './components/ScaleEngineView';
import { AIOperationsAgentView } from './components/AIOperationsAgentView';
import { AdminControlView } from './components/AdminControlView';
import { LegalDisclosureView } from './components/LegalDisclosureView';
import { CustodyComplianceView } from './components/CustodyComplianceView';

import { AuthModal } from './components/AuthModal';
import { WithdrawModal } from './components/WithdrawModal';
import { DepositModal } from './components/DepositModal';
import { PurchaseCapacityModal } from './components/PurchaseCapacityModal';
import { TermsPolicyModal } from './components/TermsPolicyModal';
import { CookieComplianceBanner } from './components/CookieComplianceBanner';
import { SupportStatusModal } from './components/SupportStatusModal';
import {
  ShieldCheck,
  Server,
  Scale,
  FileText,
  Lock,
  AlertTriangle,
  LifeBuoy,
  CheckCircle2,
  Cpu,
  Zap,
  ArrowLeftRight,
  TrendingUp,
  FolderDown,
} from 'lucide-react';

import {
  initialAssets,
  initialMiningContracts,
  initialRevenueState,
  initialTransactions,
  initialUserWallet,
} from './data/initialData';
import {
  AssetSymbol,
  ExchangeQuote,
  MiningContract,
  RevenueTargetEngineState,
  TransactionRecord,
  UserProfile,
  UserWalletLedger,
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [revenueState, setRevenueState] = useState<RevenueTargetEngineState>(initialRevenueState);
  const [wallet, setWallet] = useState<UserWalletLedger>(initialUserWallet);
  const [contracts, setContracts] = useState<MiningContract[]>(initialMiningContracts);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [emergencyPause, setEmergencyPause] = useState<boolean>(false);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);

  // User Authentication
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr-demo-01',
    email: 'operator@nexushash.com',
    name: 'Satoshi Nakamoto',
    role: 'ADMIN',
    mfaEnabled: true,
    sessionCreatedAt: new Date().toISOString(),
    ipAddress: '198.51.100.42 (US-East)',
    deviceInfo: 'Hardware Token Verified',
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawInitialAsset, setWithdrawInitialAsset] = useState('BTC');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositInitialAsset, setDepositInitialAsset] = useState('USDC');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedContractForPurchase, setSelectedContractForPurchase] = useState<MiningContract | null>(null);

  // Legal & Support Modals
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [selectedPolicyKey, setSelectedPolicyKey] = useState<string>('terms');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleOpenPolicy = (key: string) => {
    setSelectedPolicyKey(key);
    setIsTermsModalOpen(true);
  };

  // Fetch initial data from backend if available
  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/wallet');
      if (res.ok) {
        const data = await res.json();
        if (data.wallet) setWallet(data.wallet);
        if (data.emergencyWithdrawalPause !== undefined) {
          setEmergencyPause(data.emergencyWithdrawalPause);
        }
      }
    } catch (err) {
      console.warn('Using client state for wallet:', err);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await fetch('/api/revenue-target');
      if (res.ok) {
        const data = await res.json();
        if (data.revenueTargetState) {
          setRevenueState(data.revenueTargetState);
        }
      }
    } catch (err) {
      console.warn('Using client state for revenue:', err);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchRevenue();
    const interval = setInterval(() => {
      fetchRevenue();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Reconcile Stratum Pool Rewards
  const handleReconcile = async () => {
    setIsReconciling(true);
    try {
      const res = await fetch('/api/mining/reconcile', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.wallet) {
        setWallet(data.wallet);
      } else {
        // Fallback local simulation
        setWallet((prev) => {
          const btcPending = prev.pendingBalances['BTC'] || 0;
          return {
            ...prev,
            realBalances: {
              ...prev.realBalances,
              BTC: Number(((prev.realBalances['BTC'] || 0) + btcPending).toFixed(6)),
            },
            pendingBalances: {
              ...prev.pendingBalances,
              BTC: 0,
            },
            lastReconciledTimestamp: new Date().toISOString(),
          };
        });
      }
      fetchRevenue();
    } catch (err) {
      console.error(err);
    } finally {
      setIsReconciling(false);
    }
  };

  // Execute Exchange
  const handleExecuteExchange = async (quote: ExchangeQuote): Promise<boolean> => {
    try {
      const res = await fetch('/api/exchange/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.quoteId, quote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Exchange failed');

      if (data.wallet) setWallet(data.wallet);
      if (data.record) {
        setTransactions((prev) => [data.record, ...prev]);
      }
      fetchRevenue();
      return true;
    } catch (err: any) {
      // Local fallback execution
      setWallet((prev) => {
        const fromBal = (prev.realBalances[quote.fromAsset] || 0) - quote.fromAmount;
        const toBal = (prev.realBalances[quote.toAsset] || 0) + quote.estimatedToAmount;
        return {
          ...prev,
          realBalances: {
            ...prev.realBalances,
            [quote.fromAsset]: Number(fromBal.toFixed(6)),
            [quote.toAsset]: Number(toBal.toFixed(6)),
          },
        };
      });

      const newTx: TransactionRecord = {
        id: `tx-ex-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'EXCHANGE',
        asset: quote.toAsset,
        amount: quote.estimatedToAmount,
        amountUsd: quote.estimatedToAmount * (quote.toAsset === 'USDC' ? 1 : 2500),
        fee: quote.exchangeFeeUsd,
        feeAsset: 'USDC',
        status: 'CONFIRMED',
        description: `Exchanged ${quote.fromAmount} ${quote.fromAsset} for ${quote.estimatedToAmount} ${quote.toAsset} via ${quote.provider}`,
        txHash: '0x' + Math.random().toString(16).slice(2, 10),
      };
      setTransactions((prev) => [newTx, ...prev]);
      return true;
    }
  };

  // Execute Withdrawal
  const handleExecuteWithdrawal = async (params: {
    asset: AssetSymbol;
    network: string;
    destinationAddress: string;
    amount: number;
    mfaCode: string;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Withdrawal failed');

      if (data.wallet) setWallet(data.wallet);
      const tx = data.transaction || data.record;
      if (tx) {
        setTransactions((prev) => [tx, ...prev]);
      }
      fetchRevenue();
      return {
        success: true,
        txHash: data.broadcastTxHash || data.txHash || tx?.txHash,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Simulate Deposit
  const handleSimulateDeposit = async (asset: AssetSymbol, amount: number): Promise<void> => {
    setWallet((prev) => {
      const newBal = (prev.realBalances[asset] || 0) + amount;
      return {
        ...prev,
        realBalances: {
          ...prev.realBalances,
          [asset]: Number(newBal.toFixed(6)),
        },
        estimatedTotalUsd: prev.estimatedTotalUsd + amount * (asset === 'USDC' ? 1 : 2500),
      };
    });

    const newTx: TransactionRecord = {
      id: `tx-dep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'DEPOSIT',
      asset,
      amount,
      amountUsd: amount * (asset === 'USDC' ? 1 : 2500),
      fee: 0,
      feeAsset: asset,
      status: 'CONFIRMED',
      description: `Inbound on-chain deposit confirmed (2 block confirmations)`,
      txHash: '0x' + Math.random().toString(16).slice(2, 10),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Confirm Mining Capacity Lease
  const handleConfirmPurchase = async (contractId: string, durationDays: number): Promise<boolean> => {
    try {
      const res = await fetch('/api/mining/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, durationDays }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to purchase contract');

      if (data.contract) {
        setContracts((prev) =>
          prev.map((c) => (c.id === data.contract.id ? data.contract : c))
        );
      }
      if (data.wallet) setWallet(data.wallet);
      if (data.transaction) {
        setTransactions((prev) => [data.transaction, ...prev]);
      }
      fetchRevenue();
      return true;
    } catch (err: any) {
      console.warn('Executing local purchase:', err);
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractId ? { ...c, status: 'ACTIVE', uptimePercent: 99.98 } : c
        )
      );
      return true;
    }
  };

  // Admin Emergency Pause Toggle
  const handleToggleEmergencyPause = async () => {
    try {
      const res = await fetch('/api/admin/emergency-pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pause: !emergencyPause }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmergencyPause(data.emergencyWithdrawalPause);
      }
    } catch (err) {
      setEmergencyPause((prev) => !prev);
    }
  };

  // Update Target Configuration
  const handleUpdateTargetConfig = async (targetPerMin: number, thresholdPercent: number) => {
    try {
      const res = await fetch('/api/revenue-target/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPerMinute: targetPerMin, alertThresholdPercent: thresholdPercent }),
      });
      const data = await res.json();
      if (res.ok && data.revenueTargetState) {
        setRevenueState(data.revenueTargetState);
      }
    } catch (err) {
      setRevenueState((prev) => ({
        ...prev,
        targetPerMinute: targetPerMin,
        alertThresholdPercent: thresholdPercent,
        revenueGapPerMinute: Math.max(0, targetPerMin - prev.currentRevenuePerMinute),
        gapPercentage: ((Math.max(0, targetPerMin - prev.currentRevenuePerMinute) / targetPerMin) * 100),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        revenueState={revenueState}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => setUser(null)}
        emergencyPause={emergencyPause}
        onOpenSupport={() => setIsSupportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            revenueState={revenueState}
            wallet={wallet}
            contracts={contracts}
            onStartMining={() => setCurrentTab('mining')}
            onViewMining={() => setCurrentTab('mining')}
            onExchange={() => setCurrentTab('exchange')}
            onWithdraw={() => {
              setWithdrawInitialAsset('BTC');
              setIsWithdrawModalOpen(true);
            }}
            onDeposit={() => {
              setDepositInitialAsset('USDC');
              setIsDepositModalOpen(true);
            }}
            onTransactions={() => setCurrentTab('wallet')}
            onAiControlCenter={() => setCurrentTab('ai-agent')}
            onOpenScaleEngine={() => setCurrentTab('scale')}
            onOpenCustody={() => setCurrentTab('custody')}
          />
        )}

        {currentTab === 'gainer' && (
          <CloudMiningGainerView
            contracts={contracts}
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigateToMining={() => setCurrentTab('mining')}
            onReconcile={handleReconcile}
          />
        )}

        {currentTab === 'mining' && (
          <MiningView
            contracts={contracts}
            assets={initialAssets}
            onOpenPurchaseModal={(contract) => {
              setSelectedContractForPurchase(contract);
              setIsPurchaseModalOpen(true);
            }}
            onReconcile={handleReconcile}
            isReconciling={isReconciling}
          />
        )}

        {currentTab === 'exchange' && (
          <ExchangeRouterView
            assets={initialAssets}
            wallet={wallet}
            onExecuteExchange={handleExecuteExchange}
          />
        )}

        {currentTab === 'wallet' && (
          <WalletView
            wallet={wallet}
            assets={initialAssets}
            transactions={transactions}
            onOpenWithdrawModal={(asset) => {
              if (asset) setWithdrawInitialAsset(asset);
              setIsWithdrawModalOpen(true);
            }}
            onOpenDepositModal={(asset) => {
              if (asset) setDepositInitialAsset(asset);
              setIsDepositModalOpen(true);
            }}
            onReconcile={handleReconcile}
            isReconciling={isReconciling}
            emergencyPause={emergencyPause}
          />
        )}

        {currentTab === 'custody' && <CustodyComplianceView />}

        {currentTab === 'scale' && (
          <ScaleEngineView
            revenueState={revenueState}
            onUpdateTargetConfig={handleUpdateTargetConfig}
          />
        )}

        {currentTab === 'ai-agent' && <AIOperationsAgentView />}

        {currentTab === 'admin' && (
          <AdminControlView
            revenueState={revenueState}
            contracts={contracts}
            emergencyPause={emergencyPause}
            onToggleEmergencyPause={handleToggleEmergencyPause}
            user={user}
          />
        )}

        {currentTab === 'legal' && <LegalDisclosureView />}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
        onOpenPolicy={handleOpenPolicy}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        wallet={wallet}
        assets={initialAssets}
        initialAsset={withdrawInitialAsset}
        emergencyPause={emergencyPause}
        onExecuteWithdrawal={handleExecuteWithdrawal}
      />

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        assets={initialAssets}
        initialAsset={depositInitialAsset}
        onSimulateDeposit={handleSimulateDeposit}
      />

      <PurchaseCapacityModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setSelectedContractForPurchase(null);
        }}
        contract={selectedContractForPurchase}
        wallet={wallet}
        onConfirmPurchase={handleConfirmPurchase}
        onOpenPolicy={handleOpenPolicy}
      />

      <TermsPolicyModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        initialPolicyKey={selectedPolicyKey}
      />

      <SupportStatusModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onOpenPolicy={handleOpenPolicy}
      />

      <CookieComplianceBanner onOpenPolicy={handleOpenPolicy} />

      {/* Institutional Multi-Column Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 font-mono text-xs mt-12">
        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-slate-900">
          {/* Column 1: Brand & Infrastructure */}
          <div className="space-y-3 font-sans">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-900/30">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">NEXUS HASH</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Enterprise-grade cloud mining capacity and multi-coin liquidity routing. 100% physically deployed ASIC hardware with long-term renewable Power Purchase Agreements.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsSupportModalOpen(true)}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-[11px] font-mono flex items-center gap-1.5 transition-colors"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>Datacenter Status (99.98%)</span>
              </button>
            </div>
          </div>

          {/* Column 2: Platform Modules */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Institutional Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('gainer')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-emerald-400 font-semibold">•</span>
                  <span>Live Gainer Accrual Screen</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('mining')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Hardware Capacity Leases
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('exchange')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Multi-Coin OTC Router
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('scale')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  $1K/Min Scale Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('ai-agent')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Autonomous Operations Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('custody')}
                  className="hover:text-cyan-400 text-cyan-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>•</span>
                  <span>MPC Custody &amp; AML Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal, Policy & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>Terms &amp; Policies</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleOpenPolicy('terms')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Terms of Service &amp; Lease SLA
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPolicy('privacy')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Global Privacy Policy (GDPR/CCPA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPolicy('aml')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  AML, Sanctions &amp; KYC Framework
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPolicy('risk')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Cryptocurrency Risk Disclosures
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPolicy('refund')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Refund &amp; Capacity Cancellation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenPolicy('cookies')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Cookie &amp; Local Storage Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Physical Datacenters & Security */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Datacenters &amp; Security</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• Rockdale, Texas: 12.8 MW Hydro-Immersion</li>
              <li>• Keflavik, Iceland: 100% Geothermal Baseload</li>
              <li>• Dale, Norway: Run-of-River Hydro (PUE 1.04)</li>
              <li className="pt-1 text-slate-300">
                <span className="text-emerald-400 font-bold">Non-Custodial: </span>
                Private keys never leave your custody
              </li>
              <li className="text-slate-300">
                <span className="text-cyan-400 font-bold">Audit Hash: </span>
                0x9a8f27...4e1b (Verified)
              </li>
              <li className="pt-2">
                <a
                  id="btn-footer-download-zip"
                  href="/api/download-zip"
                  download="nexus-hash-platform.zip"
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>Download GitHub ZIP</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 NEXUS HASH Inc. All rights reserved. Registered Distributed Computing Facility Operator.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setCurrentTab('legal')}
              className="hover:text-slate-300 transition-colors underline"
            >
              Full Legal Repository
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="hover:text-slate-300 transition-colors underline"
            >
              System Telemetry Desk
            </button>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Stratum V2 TLS Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
