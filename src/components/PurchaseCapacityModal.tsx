import React, { useState } from 'react';
import { X, Cpu, Zap, ShieldCheck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { MiningContract, UserWalletLedger } from '../types';

interface PurchaseCapacityModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: MiningContract | null;
  wallet: UserWalletLedger;
  onConfirmPurchase: (contractId: string, durationDays: number) => Promise<boolean>;
  onOpenPolicy?: (key: string) => void;
}

export const PurchaseCapacityModal: React.FC<PurchaseCapacityModalProps> = ({
  isOpen,
  onClose,
  contract,
  wallet,
  onConfirmPurchase,
  onOpenPolicy,
}) => {
  const [durationDays, setDurationDays] = useState<number>(365);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !contract) return null;

  const durationMultiplier = durationDays / 365;
  const totalPriceUsd = Math.round(contract.priceUsd * durationMultiplier);
  const usdcBalance = wallet.realBalances['USDC'] || 0;

  const handlePurchase = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (usdcBalance < totalPriceUsd) {
      setErrorMessage(
        `Insufficient USDC balance. You have ${usdcBalance} USDC, but this contract lease requires ${totalPriceUsd} USDC. Please deposit or convert funds.`
      );
      return;
    }

    setIsProcessing(true);
    try {
      const ok = await onConfirmPurchase(contract.id, durationDays);
      if (ok) {
        setSuccessMessage(`Capacity contract successfully provisioned for ${durationDays} days!`);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to provision mining contract');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 relative">
        <button
          id="btn-close-purchase-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Provision Mining Capacity Contract
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Dedicated ASIC hardware allocation connected directly to verifiable stratum mining pools.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-2.5 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-2.5 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-3.5 text-xs font-mono">
          {/* Hardware Specs */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold text-white">
              <span>{contract.name}</span>
              <span className="text-cyan-400">{contract.hashrate} {contract.hashrateUnit}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>Hardware: {contract.hardwareModel}</div>
              <div>Algorithm: {contract.algorithm}</div>
              <div>Power: {contract.powerWatt}W @ ${contract.electricityCostPerKwh}/kWh</div>
              <div>Stratum Pool: {contract.pool}</div>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-400">Contract Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[90, 180, 365, 730].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDurationDays(days)}
                  className={`py-2 px-2 rounded-lg border text-center font-bold text-xs transition-all ${
                    durationDays === days
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Economic Calculation Breakdown */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Est. Daily Reward:</span>
              <span className="text-emerald-400 font-bold">
                +{contract.dailyRewardEstimatedCrypto} {contract.coin} (~${contract.dailyRewardEstimatedUsd.toFixed(2)}/day)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Daily Hosting &amp; Power Fee:</span>
              <span className="text-slate-300">${contract.dailyHostingFeeUsd}/day</span>
            </div>
            <div className="flex justify-between">
              <span>Available USDC Settlement Balance:</span>
              <span className="text-white font-bold">{usdcBalance} USDC</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-800 font-bold text-sm text-white">
              <span>Total Contract Lease:</span>
              <span className="text-cyan-400">${totalPriceUsd} USDC</span>
            </div>
          </div>

          {/* Legal Non-Guarantee Disclaimer Mandated by Prompt */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-500 leading-relaxed space-y-1">
            <div>
              <span className="font-bold text-slate-400">Risk Disclosure: </span>
              Mining rewards are variable and dependent on global network difficulty and coin prices. Hashpower allocations correspond 1:1 to dedicated physical ASIC hardware. No fixed or guaranteed returns are promised.
            </div>
            {onOpenPolicy && (
              <div className="flex items-center gap-3 pt-0.5 text-cyan-400 font-mono">
                <button
                  type="button"
                  onClick={() => onOpenPolicy('terms')}
                  className="underline hover:text-cyan-300"
                >
                  View Lease SLA &amp; Terms
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('refund')}
                  className="underline hover:text-cyan-300"
                >
                  Refund &amp; Cancellation Policy
                </button>
              </div>
            )}
          </div>

          <button
            id="btn-confirm-lease"
            type="button"
            onClick={handlePurchase}
            disabled={isProcessing || usdcBalance < totalPriceUsd}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-950/50"
          >
            {isProcessing ? 'Provisioning ASIC Rig...' : `Confirm & Lease Hashpower ($${totalPriceUsd} USDC)`}
          </button>
        </div>
      </div>
    </div>
  );
};
