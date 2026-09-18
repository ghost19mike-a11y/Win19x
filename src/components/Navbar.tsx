import React from 'react';
import {
  Cpu,
  TrendingUp,
  ArrowLeftRight,
  Wallet,
  ShieldCheck,
  Zap,
  Bot,
  Scale,
  FileText,
  User,
  LogOut,
  AlertTriangle,
  KeyRound,
  FolderDown,
} from 'lucide-react';
import { RevenueTargetEngineState, UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  revenueState: RevenueTargetEngineState;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  emergencyPause: boolean;
  onOpenSupport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  revenueState,
  user,
  onOpenAuth,
  onLogout,
  emergencyPause,
  onOpenSupport,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Cpu },
    { id: 'gainer', label: 'Live Gainer', icon: TrendingUp, highlight: true },
    { id: 'mining', label: 'Cloud Mining', icon: Zap },
    { id: 'exchange', label: 'Exchange Router', icon: ArrowLeftRight },
    { id: 'wallet', label: 'Wallet & Ledger', icon: Wallet },
    { id: 'custody', label: 'Custody & AML', icon: KeyRound },
    { id: 'scale', label: '$1K/Min Scale', icon: Scale },
    { id: 'ai-agent', label: 'AI Operations', icon: Bot },
    { id: 'admin', label: 'Admin Ops', icon: ShieldCheck, adminOnly: true },
    { id: 'legal', label: 'Transparency', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 text-white">
      {/* Top Ticker Bar */}
      <div className="bg-slate-900/80 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 overflow-x-auto py-0.5 scrollbar-none">
          <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM LIVE</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">TARGET:</span>
            <span className="font-mono text-amber-300 font-bold">${revenueState.targetPerMinute.toLocaleString()}/min</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">ACTUAL:</span>
            <span className="font-mono text-cyan-300 font-semibold">${revenueState.currentRevenuePerMinute.toFixed(2)}/min</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">GAP:</span>
            <span className="font-mono text-rose-400 font-semibold">-${revenueState.revenueGapPerMinute.toFixed(2)}/min</span>
          </div>

          {revenueState.isAlertActive && (
            <div className="flex items-center gap-1 text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded font-mono text-[11px]">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Target Gap &gt; {100 - revenueState.alertThresholdPercent}%</span>
            </div>
          )}

          {emergencyPause && (
            <div className="flex items-center gap-1 text-red-400 bg-red-950/70 border border-red-800 px-2 py-0.5 rounded font-mono text-[11px] animate-pulse">
              <span>WITHDRAWALS PAUSED</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <button
            onClick={onOpenSupport}
            className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline flex items-center gap-1 cursor-pointer underline decoration-dotted"
          >
            Uptime: 99.98% (Live Telemetry)
          </button>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <button
            onClick={onOpenSupport}
            className="text-slate-400 hover:text-cyan-400 transition-colors hidden md:inline cursor-pointer"
          >
            Facilities: TX (USA) • IS (Geothermal) • NO (Hydro)
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight leading-tight flex items-center gap-1.5">
                <span>NEXUS</span>
                <span className="text-cyan-400">HASH</span>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                  INSTITUTIONAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-mono leading-none">Cloud Mining &amp; Exchange</p>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {tabs.map((tab) => {
            if (tab.adminOnly && user?.role !== 'ADMIN') return null;
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : tab.highlight
                    ? 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : tab.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User / Auth Controls */}
        <div className="flex items-center gap-2.5">
          <a
            id="btn-download-github-zip"
            href="/api/download-zip"
            download="nexus-hash-platform.zip"
            title="Download full project repository as ZIP for GitHub deployment"
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all"
          >
            <FolderDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Export ZIP</span>
          </a>

          {user ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 pr-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</div>
                <div className="text-[10px] font-mono text-cyan-400 leading-none">
                  {user.role} {user.mfaEnabled && '• MFA ACTIVE'}
                </div>
              </div>
              <button
                id="btn-logout"
                onClick={onLogout}
                title="Sign Out"
                className="ml-1.5 text-slate-400 hover:text-rose-400 transition-colors p-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-auth"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign Up / Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="lg:hidden border-t border-slate-800/80 px-2 py-1.5 overflow-x-auto flex items-center gap-1 scrollbar-none bg-slate-950">
        {tabs.map((tab) => {
          if (tab.adminOnly && user?.role !== 'ADMIN') return null;
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
