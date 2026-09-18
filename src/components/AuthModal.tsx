import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  onOpenPolicy?: (key: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenPolicy,
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [acknowledgeRisk, setAcknowledgeRisk] = useState(true);
  const [mfaCode, setMfaCode] = useState('');
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (isSignUp) {
      if (!name) {
        setError('Please enter your full name or entity name.');
        return;
      }
      if (!agreeTerms) {
        setError('You must agree to the Terms of Service and Privacy Policy to proceed.');
        return;
      }
      if (!acknowledgeRisk) {
        setError('You must acknowledge the cryptocurrency mining risk disclosure.');
        return;
      }
    }

    // Move to 2FA verification step for security best practice
    if (!isMfaStep) {
      setIsMfaStep(true);
      return;
    }

    // Check MFA code
    if (mfaCode.length < 6) {
      setError('Please enter the 6-digit TOTP security code (e.g. 123456).');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role,
      mfaEnabled: true,
      mfaSecret: 'JBSWY3DPEHPK3PXP',
      sessionCreatedAt: new Date().toISOString(),
      ipAddress: '198.51.100.42 (US)',
      deviceInfo: 'Hardware Authenticated Browser',
    };

    onSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 relative">
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {isMfaStep
                ? 'Two-Factor Authentication (MFA)'
                : isSignUp
                ? 'Create Institutional Mining Account'
                : 'Account Sign In'}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {isMfaStep
              ? 'Enter the 6-digit code from your Google Authenticator or hardware token.'
              : 'Secure access to cloud hash contracts, multi-coin exchange, and settlement ledger.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-2.5 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
          {!isMfaStep ? (
            <>
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-slate-400">Full Name or Operating Entity</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      id="input-auth-name"
                      type="text"
                      placeholder="Satoshi Nakamoto / Mining Capital LLC"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-400">Work / Operator Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-auth-email"
                    type="email"
                    placeholder="operator@nexushash.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-auth-password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Account Access Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('USER')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      role === 'USER'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    User / Miner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`py-2 px-3 rounded-lg border text-center transition-all ${
                      role === 'ADMIN'
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Platform Admin
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2.5 pt-1 text-xs">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-slate-300">
                    <input
                      id="checkbox-agree-terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
                    />
                    <span className="leading-snug">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => onOpenPolicy?.('terms')}
                        className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => onOpenPolicy?.('privacy')}
                        className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer select-none text-slate-300">
                    <input
                      id="checkbox-acknowledge-risk"
                      type="checkbox"
                      checked={acknowledgeRisk}
                      onChange={(e) => setAcknowledgeRisk(e.target.checked)}
                      className="mt-0.5 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
                    />
                    <span className="leading-snug">
                      I understand that crypto mining outputs vary with network difficulty and{' '}
                      <button
                        type="button"
                        onClick={() => onOpenPolicy?.('risk')}
                        className="text-amber-400 hover:text-amber-300 underline font-semibold"
                      >
                        returns are not guaranteed
                      </button>
                    </span>
                  </label>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-center">
                <div className="text-[11px] text-slate-400">Demo Security TOTP Key:</div>
                <div className="text-xs font-bold text-cyan-400 tracking-widest font-mono">123456</div>
                <div className="text-[10px] text-slate-500">You can type 123456 to verify test MFA</div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Enter 6-Digit TOTP Code</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-auth-mfa"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white font-bold text-center tracking-widest text-base focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            id="btn-submit-auth"
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-950/40"
          >
            {isMfaStep ? 'Verify MFA & Complete Session' : isSignUp ? 'Continue to 2FA Verification' : 'Sign In'}
          </button>
        </form>

        {!isMfaStep && (
          <div className="text-center pt-2 border-t border-slate-800">
            <button
              id="btn-switch-auth-mode"
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create Free Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
