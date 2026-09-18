import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, ExternalLink, Check } from 'lucide-react';

interface CookieComplianceBannerProps {
  onOpenPolicy: (key: string) => void;
}

export const CookieComplianceBanner: React.FC<CookieComplianceBannerProps> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // always required
    analytics: true,
    telemetry: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem('nexus_hash_cookie_consent_v1');
    if (!consent) {
      // Delay showing slightly for clean entrance animation
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'nexus_hash_cookie_consent_v1',
      JSON.stringify({ essential: true, analytics: true, telemetry: true, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem(
      'nexus_hash_cookie_consent_v1',
      JSON.stringify({ ...preferences, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md text-slate-200 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Institutional Privacy &amp; Cryptographic Security</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">
                  Zero Ad Trackers
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                GDPR • CCPA • Non-Custodial Session Tokens
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          NEXUS HASH utilizes strictly necessary local tokens to authenticate your hardware session, secure 2FA verifications, and record Stratum V2 pool rewards. We never sell personal data or embed third-party marketing trackers.
        </p>

        {showPreferences && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white">Essential Security &amp; Ledger Tokens</span>
                <p className="text-[11px] text-slate-400">Required for 2FA, wallet reconciliation, and auth.</p>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">
                Always Required
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-900">
              <div>
                <span className="font-bold text-white">Stratum Hashrate Telemetry</span>
                <p className="text-[11px] text-slate-400">Allows real-time display of mining share difficulty nonces.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.telemetry}
                onChange={(e) => setPreferences({ ...preferences, telemetry: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => onOpenPolicy('privacy')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
          >
            <span>Review Policy &amp; Terms</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-2">
            {!showPreferences ? (
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Preferences
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-3 py-1.5 rounded-lg border border-cyan-500/40 text-xs text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 transition-colors"
              >
                Save Custom
              </button>
            )}

            <button
              type="button"
              id="btn-accept-cookie-compliance"
              onClick={handleAcceptAll}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-950/30 transition-all"
            >
              Accept &amp; Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
