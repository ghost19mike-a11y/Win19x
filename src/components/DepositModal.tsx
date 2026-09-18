import React, { useState } from 'react';
import { X, ArrowDownRight, Copy, CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';
import { AssetSymbol, CryptoAsset } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: CryptoAsset[];
  initialAsset?: string;
  onSimulateDeposit: (asset: AssetSymbol, amount: number) => Promise<void>;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  assets,
  initialAsset = 'USDC',
  onSimulateDeposit,
}) => {
  const [assetSymbol, setAssetSymbol] = useState<AssetSymbol>(
    (assets.some((a) => a.symbol === initialAsset) ? initialAsset : 'USDC') as AssetSymbol
  );
  const [depositAmount, setDepositAmount] = useState('500');
  const [copied, setCopied] = useState(false);
  const [isCrediting, setIsCrediting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const currentAsset = assets.find((a) => a.symbol === assetSymbol);

  // Dedicated deposit addresses
  const depositAddresses: Record<AssetSymbol, { address: string; network: string }> = {
    BTC: { address: 'bc1qm408v8g7c74vkwg9c2f68q5v7kxk0732u750q8', network: 'Bitcoin Mainnet' },
    ETH: { address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88', network: 'Ethereum ERC-20' },
    USDC: { address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88', network: 'Ethereum ERC-20' },
    LTC: { address: 'ltc1q7z5c5rkvlcvn5h4q760q55a828r7v6z2v3j6n7', network: 'Litecoin Network' },
    DOGE: { address: 'D8vFz6qE2p9K5T8mB1jL4xN7sC3wV9yZ1a', network: 'Dogecoin Network' },
    SOL: { address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', network: 'Solana SPL' },
    KAS: { address: 'kaspa:qr6e7x9q5k7p8h4m2n1v0l8k3j6h5g4f3d2s1a0z9y', network: 'Kaspa kHeavyHash' },
  };

  const currentInfo = depositAddresses[assetSymbol] || { address: '0x...', network: 'Mainnet' };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentInfo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstantCredit = async () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    setIsCrediting(true);
    try {
      await onSimulateDeposit(assetSymbol, amt);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCrediting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 relative">
        <button
          id="btn-close-deposit-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Deposit Digital Assets</h3>
          </div>
          <p className="text-xs text-slate-400">
            Funds will automatically be credited to your settled balance upon required network confirmations.
          </p>
        </div>

        <div className="space-y-3.5 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-slate-400">Select Coin to Deposit</label>
            <select
              id="select-deposit-coin"
              value={assetSymbol}
              onChange={(e) => setAssetSymbol(e.target.value as AssetSymbol)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-500"
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-center">
            {/* Visual QR code container */}
            <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center shadow-inner">
              <div className="w-full h-full border-4 border-slate-900 p-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-5 h-5 bg-slate-900"></div>
                  <div className="w-5 h-5 bg-slate-900"></div>
                </div>
                <div className="text-[9px] font-bold text-slate-900 tracking-widest uppercase">
                  {assetSymbol}
                </div>
                <div className="flex justify-between">
                  <div className="w-5 h-5 bg-slate-900"></div>
                  <div className="w-5 h-5 border-2 border-slate-900"></div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Network: {currentInfo.network}</span>
                <span>Confirmations: 2 Blocks</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-white text-[11px] font-bold break-all flex-1">
                  {currentInfo.address}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-cyan-400 hover:text-cyan-300 p-1 rounded hover:bg-slate-800"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <span className="text-emerald-400 text-[10px]">Address copied to clipboard!</span>}
            </div>
          </div>

          {/* Testnet / Simulation deposit credit option */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div className="text-slate-300 font-bold text-[11px]">Instant Blockchain Ingress (Simulation):</div>
            <div className="flex gap-2">
              <input
                id="input-deposit-amount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-2/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold"
              />
              <button
                id="btn-confirm-instant-deposit"
                type="button"
                onClick={handleInstantCredit}
                disabled={isCrediting || success}
                className="w-1/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1.5 rounded-lg text-xs transition-all"
              >
                {success ? 'Credited!' : isCrediting ? 'Confirming...' : 'Credit Balance'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Strict policy: Only send {assetSymbol} to this address. Sending other assets will cause permanent loss.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
