/**
 * Core types for Cloud Mining & Multi-Coin Exchange Platform
 */

export type AssetSymbol = 'BTC' | 'ETH' | 'LTC' | 'DOGE' | 'USDC' | 'SOL' | 'KAS';

export interface CryptoAsset {
  symbol: AssetSymbol;
  name: string;
  network: string;
  addressFormat: string;
  addressRegex: string;
  minWithdrawal: number;
  networkFee: number;
  exchangeAvailable: boolean;
  depositAvailable: boolean;
  withdrawalAvailable: boolean;
  confirmationRequirements: number;
  currentPriceUsd: number;
  priceChange24h: number;
  iconColor: string;
  decimals: number;
}

export interface UserWalletLedger {
  realBalances: Record<AssetSymbol, number>; // Settled, physically withdrawable
  pendingBalances: Record<AssetSymbol, number>; // Unconfirmed pool rewards or pending conversions
  lockedBalances: Record<AssetSymbol, number>; // Reserved in pending withdrawal orders
  estimatedTotalUsd: number;
  lastReconciledAt: string;
}

export interface TransactionRecord {
  id: string;
  type: 'MINING_REWARD' | 'EXCHANGE' | 'WITHDRAWAL' | 'DEPOSIT' | 'FEE' | 'CONTRACT_PURCHASE';
  asset: AssetSymbol;
  amount: number;
  amountUsd: number;
  fee: number;
  feeAsset: AssetSymbol;
  status: 'PENDING' | 'SETTLED' | 'CONFIRMED' | 'FAILED' | 'REJECTED';
  txHash?: string;
  blockHeight?: number;
  timestamp: string;
  description: string;
  reconciliationProof?: {
    poolName: string;
    shareHash: string;
    blockRewardShare: number;
    verifiedAt: string;
  };
  exchangeDetails?: {
    fromAsset: AssetSymbol;
    toAsset: AssetSymbol;
    fromAmount: number;
    toAmount: number;
    rate: number;
    provider: string;
    providerTxId: string;
    spreadPercent: number;
  };
  withdrawalDetails?: {
    destinationAddress: string;
    network: string;
    confirmedAt?: string;
    amlScreening?: AMLScreeningResult;
    mpcSignerReceipt?: {
      provider: string;
      quorum: string;
      approvalId: string;
      signedAt: string;
      rpcEndpoint: string;
    };
  };
}

export interface MiningContract {
  id: string;
  name: string;
  coin: AssetSymbol;
  algorithm: string;
  hardwareModel: string;
  hashrate: number;
  hashrateUnit: 'TH/s' | 'GH/s' | 'MH/s';
  powerWatt: number;
  electricityCostPerKwh: number;
  dailyHostingFeeUsd: number;
  priceUsd: number;
  durationDays: number;
  status: 'AVAILABLE' | 'ACTIVE' | 'EXPIRED' | 'PAUSED';
  pool: string;
  facilityLocation: string;
  acceptedShares: number;
  rejectedShares: number;
  uptimePercent: number;
  totalAccumulatedCrypto: number;
  totalAccumulatedUsd: number;
  dailyRewardEstimatedCrypto: number;
  dailyRewardEstimatedUsd: number;
  startDate?: string;
  endDate?: string;
  contractType: 'OWNED_HOSTED' | 'LEASED_CAPACITY';
}

export interface MiningShareEvent {
  id: string;
  contractId: string;
  coin: AssetSymbol;
  timestamp: string;
  hashRateTh: number;
  difficulty: number;
  nonce: string;
  status: 'ACCEPTED' | 'REJECTED';
  rewardCrypto: number;
  rewardUsd: number;
  blockHash: string;
}

export interface RevenueTargetEngineState {
  targetPerMinute: number; // Configurable $1,000 USD default
  currentRevenuePerMinute: number;
  revenue1h: number;
  revenue24h: number;
  revenue7d: number;
  grossRevenue: number;
  miningOperatingCosts: number;
  exchangeFees: number;
  networkFees: number;
  userPayouts: number;
  platformRevenue: number;
  netRevenue: number;
  revenueGapPerMinute: number;
  gapPercentage: number;
  performanceRatio: number;
  isAlertActive: boolean;
  alertThresholdPercent: number;
}

export interface ScaleEngineCapacityPlan {
  targetRevPerMin: number;
  currentRevPerMin: number;
  gapPerMin: number;
  requiredAdditionalDailyRev: number;
  networkConditions: {
    btcPrice: number;
    btcDifficultyTrillion: number;
    blockReward: number;
    hashratePricePerThPerDay: number;
  };
  requiredCapacity: {
    hashrateRequiredTh: number;
    asicUnitsNeeded: number;
    asicModel: string;
    capexHardwareUsd: number;
    powerDemandMw: number;
    monthlyOpexElectricityUsd: number;
    estimatedMonthlyGrossMargin: number;
    projectedCustomersNeeded: number;
    avgRevPerCustomerMonthly: number;
  };
  aiStrategicAnalysis?: string;
  timestamp: string;
}

export type AgentStage =
  | 'DISCOVER'
  | 'ANALYZE'
  | 'CALCULATE'
  | 'SIMULATE'
  | 'RECOMMEND'
  | 'USER_APPROVAL'
  | 'EXECUTE'
  | 'VERIFY'
  | 'MONITOR'
  | 'OPTIMIZE';

export interface AgentStageItem {
  stage: AgentStage;
  label: string;
  status: 'completed' | 'in_progress' | 'pending' | 'approval_required';
  description: string;
  timestamp?: string;
}

export interface AgentRecommendation {
  id: string;
  title: string;
  action: string;
  targetPool: string;
  sourcePool: string;
  hashrateShiftTh: number;
  projectedProfitDeltaUsdDaily: number;
  estimatedFeeUsd: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  approved: boolean;
  executed: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  stage: string;
  message: string;
  verifiedOnChain: boolean;
  blockReference?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  mfaEnabled: boolean;
  mfaSecret?: string;
  sessionCreatedAt: string;
  ipAddress: string;
  deviceInfo: string;
}

export interface ExchangeQuote {
  quoteId: string;
  fromAsset: AssetSymbol;
  toAsset: AssetSymbol;
  fromAmount: number;
  estimatedToAmount: number;
  exchangeRate: number;
  spreadPercent: number;
  exchangeFeeUsd: number;
  networkFeeUsd: number;
  provider: string;
  expiresInSeconds: number;
}

export type CustodianProvider = 'FIREBLOCKS' | 'BITGO' | 'COINBASE_PRIME' | 'DIRECT_RPC_NODE' | 'SANDBOX_SIMULATOR';

export interface CustodianConfig {
  provider: CustodianProvider;
  mode: 'PRODUCTION' | 'SANDBOX_TESTNET';
  vaultId: string;
  mpcQuorum: {
    requiredSigners: number;
    totalKeyShares: number;
    algorithm: string; // 'MPC-CMP' | 'TSS-Ed25519-Secp256k1'
    status: 'HEALTHY' | 'SYNCHRONIZING' | 'DEGRADED';
  };
  connectedRpcNodes: {
    coin: AssetSymbol;
    network: string;
    endpoint: string;
    blockHeight: number;
    latencyMs: number;
    status: 'ONLINE' | 'STANDBY' | 'SYNCING';
    isFunded: boolean;
    hotWalletBalance: number;
    hotWalletAddress: string;
  }[];
  amlProvider: 'CHAINALYSIS' | 'ELLIPTIC' | 'TRM_LABS';
  amlAutoRejectThreshold: number; // e.g. 75 / 100
  travelRuleVaspId: string;
}

export interface AMLScreeningResult {
  screeningId: string;
  address: string;
  asset: AssetSymbol;
  network: string;
  riskScore: number; // 0 - 100 (0 = clean, 100 = severe sanction/terrorist financing)
  riskLevel: 'CLEAN' | 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'SANCTIONED_BLOCKED';
  isSanctioned: boolean;
  sanctionEntities: string[];
  categoryBreakdown: {
    category: string;
    exposurePercentage: number;
    severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  }[];
  mixerExposure: boolean;
  darknetExposure: boolean;
  scamExposure: boolean;
  travelRuleClearance: {
    status: 'CLEARED' | 'INFO_REQUIRED' | 'BLOCKED';
    vaspName?: string;
    beneficiaryVerified: boolean;
  };
  screenedAt: string;
  auditHash: string;
}

export interface RegulatoryComplianceMatrix {
  fincenMsbNumber: string;
  fincenStatus: 'REGISTERED' | 'EXEMPT_COMMERCIAL_COMPUTING';
  fatfTravelRuleCompliant: boolean;
  secHoweyTestStatus: 'COMMERCIAL_COMPUTATION_LEASE_NOT_SECURITY';
  ofacAutomatedScreening: boolean;
  micaClassification: 'CASP_EXEMPT_PHYSICAL_HOSTING';
  proofOfReservesVerified: boolean;
  lastPorAuditDate: string;
  porMerkleRoot: string;
}
