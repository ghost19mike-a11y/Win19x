export interface LegalPolicySection {
  id: string;
  title: string;
  category:
    | 'terms'
    | 'privacy'
    | 'aml'
    | 'risk'
    | 'refund'
    | 'cookies'
    | 'fincen'
    | 'travelrule'
    | 'seccftc'
    | 'mica'
    | 'ofac'
    | 'custody';
  effectiveDate: string;
  version: string;
  summary: string;
  clauses: {
    heading: string;
    content: string;
    subpoints?: string[];
  }[];
}

export const LEGAL_POLICIES: Record<string, LegalPolicySection> = {
  terms: {
    id: 'terms',
    title: 'Terms of Service & Cloud Mining Service Agreement',
    category: 'terms',
    effectiveDate: 'September 18, 2026',
    version: 'v3.4.1-PROD',
    summary:
      'Governs the lease of dedicated ASIC computing capacity, daily stratum pool revenue reconciliation, multi-coin exchange routing, fee structures, and mutual obligations between NEXUS HASH and registered enterprise or individual operators.',
    clauses: [
      {
        heading: '1. Acceptance of Terms & Eligibility',
        content:
          'By accessing or using the NEXUS HASH platform, leasing computing capacity, or engaging in multi-coin liquidity swaps, you certify that you are at least 18 years of age, possess full legal capacity to enter into binding contracts, and are not a resident or citizen of any prohibited jurisdiction subject to comprehensive international sanctions.',
        subpoints: [
          'User must maintain accurate account identification and keep Two-Factor Authentication (TOTP 2FA) enabled for all withdrawal actions.',
          'NEXUS HASH reserves the right to restrict or terminate access to any account found violating anti-abuse or botnet mitigation rules.',
          'Institutional entities must provide verifiable corporate registration numbers upon request for high-throughput capacity leasing.',
        ],
      },
      {
        heading: '2. Cloud Mining Capacity Lease & Stratum Protocol',
        content:
          'NEXUS HASH provides access to physically owned or contractually secured ASIC computational capacity situated in Tier-3 datacenter facilities. All leased capacity is connected directly to public Stratum V2 mining pools (such as Foundry USA, AntPool, and ViaBTC).',
        subpoints: [
          'Capacity leases are measured in Terahashes per second (TH/s), Gigahashes per second (GH/s), or Petahashes per second (PH/s).',
          'Stratum shares are validated cryptographically against real-time network block headers. Invalids, stales, or rejected shares above 1.5% trigger automated hardware failover.',
          'Hashrate allocation begins within 180 seconds of confirmation of the capacity lease payment on the native blockchain.',
        ],
      },
      {
        heading: '3. Electricity, Hosting & Power Purchase Agreements (PPAs)',
        content:
          'Hardware operation requires sustained electrical consumption and thermal management. Daily hosting costs are deducted directly from gross mining rewards prior to net balance crediting.',
        subpoints: [
          'Power rates are anchored to long-term renewable Power Purchase Agreements: Texas ($0.042/kWh), Iceland ($0.039/kWh geothermal), and Norway ($0.045/kWh hydroelectric).',
          'Formula: Daily Operating Fee = (Hardware Watts / 1000) * 24 hrs * Contract PPA Rate ($/kWh).',
          'If mining yields are insufficient to cover power consumption due to extreme difficulty increases or coin devaluation, machines may be temporarily throttled to prevent negative balance accrual.',
        ],
      },
      {
        heading: '4. Service Level Agreement (SLA) & Uptime Guarantee',
        content:
          'NEXUS HASH guarantees a minimum monthly hardware uptime of 99.80%. Uptime is measured by continuous active Stratum pool share submission.',
        subpoints: [
          'In the event of unscheduled datacenter power interruption exceeding 120 consecutive minutes, users receive automated compensatory capacity credits matching 125% of downtime hashrate.',
          'Scheduled preventative maintenance is announced at least 48 hours in advance and executed with secondary cluster failover where available.',
        ],
      },
      {
        heading: '5. Multi-Coin Exchange & Liquidity Routing',
        content:
          'Asset conversions executed through the NEXUS HASH exchange router are fulfilled via non-custodial smart routing and tier-1 institutional OTC liquidity venues.',
        subpoints: [
          'Exchange quotes are guaranteed for a maximum window of 30 seconds from quote issuance to prevent slippage during market volatility.',
          'Standard liquidity routing spreads range from 0.08% to 0.15% depending on pair liquidity depth (BTC/USDC vs. KAS/USDC).',
          'Settled exchange funds are credited directly to your internal user ledger upon execution confirmation.',
        ],
      },
      {
        heading: '6. Internal Ledger Accounting & Withdrawal Executions',
        content:
          'NEXUS HASH maintains strict separation between Settled Real Balances, Pending Pool Rewards, and Locked Balances. Cryptographic withdrawals require hardware 2FA approval and are broadcast directly to native blockchain mempools.',
        subpoints: [
          'Withdrawals are subject to real-time network gas or miner fees paid to node validators without markup.',
          'The platform reserves an emergency withdrawal pause mechanism in the event of detected anomalous mempool re-orgs or suspected smart contract compromise.',
        ],
      },
      {
        heading: '7. Limitation of Liability & Governing Law',
        content:
          'NEXUS HASH shall not be held liable for indirect, incidental, or consequential damages resulting from global blockchain network reorgs, protocol forks, or catastrophic grid curtailment. This agreement is governed by Delaware commercial contract principles and international digital asset standards.',
      },
    ],
  },
  privacy: {
    id: 'privacy',
    title: 'Global Privacy Policy & Data Protection',
    category: 'privacy',
    effectiveDate: 'September 18, 2026',
    version: 'v2.8.0',
    summary:
      'Outlines our strict data minimization principles, non-custodial key philosophy, zero-sale of customer data, and compliance with GDPR, CCPA, and international cryptographic privacy frameworks.',
    clauses: [
      {
        heading: '1. Core Non-Custodial Privacy Philosophy',
        content:
          'At NEXUS HASH, your private keys and seed phrases remain strictly your own. Our platform will NEVER ask for, store, transmit, or process your private keys, seed phrases, or external wallet passwords.',
      },
      {
        heading: '2. Information We Collect & Process',
        content:
          'We collect only the technical telemetry and identity data strictly necessary to provision cloud computing and ensure AML compliance:',
        subpoints: [
          'Account Identity: Email address, operator display name, and hashed authentication secrets.',
          'Cryptographic Telemetry: Public deposit and withdrawal wallet addresses, transaction hashes (txHash), and Stratum worker share rates.',
          'System Telemetry: IP addresses, browser user-agent tokens, and session timestamps for 2FA validation and intrusion detection.',
        ],
      },
      {
        heading: '3. Zero Data Sale Guarantee',
        content:
          'We do not sell, rent, monetize, or disclose your personal data, transaction histories, or mining telemetry to any third-party advertisers, data brokers, or marketing networks under any circumstances.',
      },
      {
        heading: '4. Data Retention & Cryptographic Encryption',
        content:
          'All database records are encrypted at rest using AES-256-GCM. Session transport utilizes TLS 1.3 with Perfect Forward Secrecy (PFS). Transaction histories are preserved in compliance with statutory financial audit obligations.',
      },
      {
        heading: '5. GDPR & CCPA User Rights',
        content:
          'Users residing in the European Economic Area (EEA), United Kingdom, California, and equivalent jurisdictions possess statutory rights to request account data export, rectification, and complete erasure subject to regulatory audit retention rules.',
      },
    ],
  },
  aml: {
    id: 'aml',
    title: 'Anti-Money Laundering (AML) & Sanctions Compliance Policy',
    category: 'aml',
    effectiveDate: 'September 18, 2026',
    version: 'v4.1.2',
    summary:
      'Rigorous compliance architecture adhering to FATF guidelines, FinCEN regulations, OFAC sanctions lists, real-time mempool taint screening, and suspicious activity reporting (SAR).',
    clauses: [
      {
        heading: '1. Regulatory Commitment & Framework',
        content:
          'NEXUS HASH maintains an active risk-based Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) program. The platform complies with Financial Action Task Force (FATF) Travel Rule recommendations and Bank Secrecy Act standards.',
      },
      {
        heading: '2. Sanctions Screening & Prohibited Jurisdictions',
        content:
          'The platform automatically blocks IP addresses and enforces restricted access for individuals and corporations located in FATF high-risk jurisdictions or countries subject to OFAC, EU, or UN comprehensive sanctions (including Cuba, Iran, North Korea, Syria, and restricted occupied regions).',
      },
      {
        heading: '3. Real-Time Mempool Address Taint Analysis',
        content:
          'All inbound deposits and outbound withdrawal destination addresses are screened against global blockchain intelligence feeds (e.g., Chainalysis, Elliptic):',
        subpoints: [
          'Addresses linked to ransomware, darknet marketplaces, sanctioned entities, or exploit drainers are rejected immediately.',
          'Flagged transactions are quarantined for operator compliance review.',
          'Users submitting tainted funds may be required to furnish proof of source of funds before asset release.',
        ],
      },
      {
        heading: '4. Threshold Monitoring & Escalation',
        content:
          'Single-day aggregate withdrawals exceeding $50,000 USD equivalent trigger automated secondary compliance verification and multi-signature cold-storage release protocols.',
      },
    ],
  },
  risk: {
    id: 'risk',
    title: 'Cryptocurrency Mining & Volatility Risk Disclosures',
    category: 'risk',
    effectiveDate: 'September 18, 2026',
    version: 'v3.0.0',
    summary:
      'Essential disclosures regarding the speculative nature of proof-of-work mining, network difficulty adjustments, block subsidy halvings, electricity fluctuations, and the absolute absence of guaranteed yields.',
    clauses: [
      {
        heading: '1. No Guaranteed Profit / Yield Disclaimer',
        content:
          'CLOUD MINING CARRIES INHERENT FINANCIAL RISK. NEXUS HASH DOES NOT GUARANTEE ANY SPECIFIC REVENUE, RETURN ON INVESTMENT (ROI), OR PROFITABILITY. ALL DOLLAR-VALUE COUNTERS DISPLAYED IN THE INTERFACE REFLECT CURRENT REAL-TIME HASHPRICE AND NETWORK DIFFICULTY BUT ARE NOT BINDING FORECASTS.',
      },
      {
        heading: '2. Network Difficulty & Halving Dynamics',
        content:
          'Proof-of-work mining rewards depend directly on total global network hashrate and difficulty algorithms. Bitcoin difficulty adjusts every 2,016 blocks (~14 days). An increase in global network hashrate reduces the crypto output of each TH/s.',
        subpoints: [
          'Bitcoin block subsidies halve approximately every four years (210,000 blocks), cutting gross block reward output by 50%.',
          'Secondary altcoins (Litecoin/Dogecoin, Kaspa) exhibit unique difficulty retargeting windows and halving schedules that directly affect mining payouts.',
        ],
      },
      {
        heading: '3. Market Price Volatility',
        content:
          'Cryptocurrency market exchange rates fluctuate wildly. An asset mined profitably today may decline in fiat market value, rendering previously mined assets worth less in dollar terms.',
      },
      {
        heading: '4. Electrical Grid Curtailment & Force Majeure',
        content:
          'Datacenter operators participate in grid reliability response programs during extreme weather conditions (e.g., Texas winter freezes or summer heatwaves). Voluntary power curtailment aids public grid stability and may occasionally cause temporary hash reductions.',
      },
    ],
  },
  refund: {
    id: 'refund',
    title: 'Refund, Cancellation & Capacity Lease Policy',
    category: 'refund',
    effectiveDate: 'September 18, 2026',
    version: 'v2.1.0',
    summary:
      'Clear provisions governing capacity lease terms, upfront electrical capital allocation, hardware transferability, and non-refundable operating expenditure policies.',
    clauses: [
      {
        heading: '1. Upfront Capital & Electrical Allocation',
        content:
          'Upon activation of a cloud mining capacity lease, NEXUS HASH immediately locks physical hardware slots, assigns power transformer capacity, and enters binding electricity hedges on the user’s behalf. Consequently, base lease purchases are considered final and non-refundable once hash generation commences.',
      },
      {
        heading: '2. Defective Hardware & Automatic Redundancy',
        content:
          'In the event of ASIC board failure, power supply burnout, or thermal throttling at the physical facility, our automated Stratum controller shifts hash allocation to our on-site 10% hot-spare redundant fleet within 60 seconds with zero loss of earned rewards.',
      },
      {
        heading: '3. Capacity Lease Resale & Subletting',
        content:
          'Users who wish to liquidate active multi-month or annual capacity contracts may list their active hashrate slots on the NEXUS HASH internal secondary marketplace for reassignment to other institutional operators.',
      },
    ],
  },
  cookies: {
    id: 'cookies',
    title: 'Cookie & Local Storage Compliance Policy',
    category: 'cookies',
    effectiveDate: 'September 18, 2026',
    version: 'v1.5.0',
    summary:
      'Transparency regarding our use of strictly necessary session storage, cryptographic authentication tokens, and our absolute refusal to employ cross-site tracking cookies.',
    clauses: [
      {
        heading: '1. Strictly Necessary Storage',
        content:
          'We use local browser storage and session cookies exclusively to maintain authenticated operator sessions, remember your Two-Factor Authentication state, store pending transaction nonces, and preserve your customized dashboard layout.',
      },
      {
        heading: '2. No Third-Party Tracking Cookies',
        content:
          'NEXUS HASH does NOT embed third-party advertising pixels, Facebook Pixel, Google AdSense, or behavioral tracking tags. Your navigation across our financial interface is strictly confidential.',
      },
      {
        heading: '3. Managing Preferences',
        content:
          'You may clear your browser storage or delete cookies at any time via your browser settings. Note that clearing local storage will require re-authentication and re-verification of hardware MFA tokens.',
      },
    ],
  },
  fincen: {
    id: 'fincen',
    title: 'FinCEN MSB Registration & Bank Secrecy Act (BSA) Framework',
    category: 'fincen',
    effectiveDate: 'September 18, 2026',
    version: 'v4.0.0-REG',
    summary:
      'Statutory compliance framework addressing FinCEN Guidance FIN-2019-G001 regarding Convertible Virtual Currencies (CVC), Money Services Business (MSB) categorization, and commercial hardware computation classification.',
    clauses: [
      {
        heading: '1. Commercial Computational Facility Classification',
        content:
          'Under FinCEN 2019 Guidance (Section 2.1.2), entities providing bona fide computing resources and datacenter hosting that lease hashing capacity to independent operators who control pool destination nonces are classified as computational hosting providers. NEXUS HASH strictly operates as a hardware infrastructure host and liquidity routing gateway.',
        subpoints: [
          'Direct miners submitting Stratum V2 shares to independent pools act as primary coin producers.',
          'To the extent liquidity router conversions are provided, trades are executed through FinCEN-registered partner MSBs (Kraken / Payward Inc. and Binance US / BAM Trading Services).',
          'Suspicious Activity Reports (SARs) and Currency Transaction Reports (CTRs) are filed through authorized compliance channels when transaction volumes exceed statutory thresholds.',
        ],
      },
      {
        heading: '2. Anti-Money Laundering (AML) Program Administration',
        content:
          'NEXUS HASH maintains a comprehensive BSA/AML compliance program designated under a certified Chief Compliance Officer (ACAMS certified). The program includes continuous risk-based transaction monitoring, independent third-party annual audits, and ongoing compliance officer training.',
      },
    ],
  },
  travelrule: {
    id: 'travelrule',
    title: 'FATF Recommendation 16 (Travel Rule) Compliance Protocol',
    category: 'travelrule',
    effectiveDate: 'September 18, 2026',
    version: 'v3.2.0-FATF',
    summary:
      'Inter-VASP communication and originator/beneficiary data verification protocol implementing the Financial Action Task Force (FATF) Travel Rule for cross-border digital asset transfers.',
    clauses: [
      {
        heading: '1. De Minimis Thresholds & VASP Verification',
        content:
          'In accordance with FATF Recommendation 16 and national enacting legislation (e.g. US BSA Travel Rule at $3,000 threshold and EU TFR at €1,000 threshold), all withdrawals exceeding statutory limits require verified identification of the receiving Virtual Asset Service Provider (VASP) or unhosted wallet declaration.',
        subpoints: [
          'Transfers above $1,000 USD equivalent automatically trigger pre-broadcast Travel Rule messaging via decentralized IVMS 101 standards.',
          'Transfers directed to unhosted (self-custody) wallets require cryptographic proof of address control (message signing or satoshi challenge test).',
          'Sanctioned VASPs or entities operating without registered AML oversight are systematically rejected prior to on-chain broadcast.',
        ],
      },
    ],
  },
  seccftc: {
    id: 'seccftc',
    title: 'SEC & CFTC Regulatory Classification (Howey Test Analysis)',
    category: 'seccftc',
    effectiveDate: 'September 18, 2026',
    version: 'v2.8.0-LEGAL',
    summary:
      'Detailed statutory legal opinion establishing that cloud hashrate capacity leases are commercial hardware computing leases and do NOT constitute investment contracts or securities under SEC v. W.J. Howey Co.',
    clauses: [
      {
        heading: '1. Non-Security Commercial Hardware Lease Doctrine',
        content:
          'NEXUS HASH capacity contracts represent the commercial lease of physical computational power (measured in TH/s) and datacenter rack space. The legal classification establishes:',
        subpoints: [
          'No Common Enterprise: Lessees retain independent discretion to route their dedicated hashpower to any public Stratum V2 mining pool (Foundry, F2Pool, AntPool, ViaBTC).',
          'No Passive Reliance on the Efforts of Others: Mining output is governed by global consensus difficulty algorithms and independent pool luck, not entrepreneurial or managerial efforts of NEXUS HASH.',
          'No Guaranteed Yield or Return: As highlighted across all interfaces, no fixed return, APY, or capital preservation is promised. Cryptocurrency mining is inherently speculative and subject to network difficulty.',
        ],
      },
      {
        heading: '2. Commodity & Multi-Coin Routing Disclosures',
        content:
          'Bitcoin and Litecoin are recognized commodities subject to the Commodity Exchange Act (CEA) and CFTC jurisdiction. Multi-coin conversions are executed as spot liquidity swaps without leverage, margin, or derivative speculation.',
      },
    ],
  },
  mica: {
    id: 'mica',
    title: 'EU Markets in Crypto-Assets (MiCA) Regulation Compliance',
    category: 'mica',
    effectiveDate: 'September 18, 2026',
    version: 'v1.9.0-EU',
    summary:
      'Compliance declarations under Regulation (EU) 2023/1114 (MiCA) regarding Crypto-Asset Service Provider (CASP) standards, environmental sustainability metrics, and reverse solicitation disclosures.',
    clauses: [
      {
        heading: '1. Article 68 & Sustainability Disclosures',
        content:
          'NEXUS HASH publishes real-time datacenter energy consumption and Power Usage Effectiveness (PUE) metrics in compliance with MiCA Article 68 environmental standards. 100% of European facilities in Dale, Norway and Keflavik, Iceland operate on certified zero-emission hydroelectric and geothermal baseloads.',
      },
      {
        heading: '2. Reverse Solicitation & Non-Custodial Integrity',
        content:
          'European Union residents access the platform under strict reverse solicitation principles. NEXUS HASH does not hold client private keys and facilitates non-custodial payouts directly to user-designated hardware or external MPC wallets.',
      },
    ],
  },
  ofac: {
    id: 'ofac',
    title: 'OFAC Sanctions & Automated Blocklist Enforcement Policy',
    category: 'ofac',
    effectiveDate: 'September 18, 2026',
    version: 'v4.1.0-OFAC',
    summary:
      'Continuous automated screening protocol against U.S. Treasury Office of Foreign Assets Control (OFAC) Specially Designated Nationals (SDN), designated cryptocurrency addresses, and comprehensive geofencing.',
    clauses: [
      {
        heading: '1. Prohibited Jurisdictions & Geofencing',
        content:
          'NEXUS HASH strictly prohibits access, account creation, or withdrawal broadcasts to individuals or entities located in, organized under, or resident of sanctioned jurisdictions including Cuba, Iran, North Korea, Syria, and the Crimea, Donetsk, and Luhansk regions of Ukraine.',
      },
      {
        heading: '2. Automated Blockchain Sanctions Screening',
        content:
          'All withdrawal destination addresses are queried in real time against Chainalysis and Elliptic intelligence feeds. Transactions involving known OFAC SDN addresses, privacy mixers (e.g. Tornado Cash, Sinbad), or illicit darknet markets are immediately aborted and blocked.',
      },
    ],
  },
  custody: {
    id: 'custody',
    title: 'Institutional MPC Custody & Merkle Proof-of-Reserves (PoR)',
    category: 'custody',
    effectiveDate: 'September 18, 2026',
    version: 'v3.0.0-MPC',
    summary:
      'Cryptographic architecture governing multi-party computation (MPC), multi-sig key share distribution, cold storage quorum protocols, and daily cryptographic Proof-of-Reserves auditing.',
    clauses: [
      {
        heading: '1. Multi-Party Computation (MPC-CMP) Architecture',
        content:
          'Platform treasury and liquidity pools are protected using institutional MPC key generation (Threshold Signature Scheme). Private keys never exist in full at any single physical location or on any single server.',
        subpoints: [
          'Withdrawal broadcasts require an authenticated 2-of-3 quorum across isolated HSM signers (Hardware Security Modules).',
          'Compatible with Fireblocks MPC-CMP, BitGo Multisig/TSS, and Coinbase Prime institutional custody engines.',
          'Daily limits and automated rate-limiting circuit breakers protect against anomalous transaction velocity.',
        ],
      },
      {
        heading: '2. Cryptographic Proof-of-Reserves (PoR)',
        content:
          'User ledger balances are reconciled against on-chain reserve addresses via daily Merkle tree snapshots. Operators may independently verify that liabilities match active blockchain reserves using our published Merkle roots.',
      },
      {
        heading: '3. FDIC & SIPC Non-Coverage Statutory Warning',
        content:
          'Cryptographic assets held or leased through NEXUS HASH are NOT deposits insured by the Federal Deposit Insurance Corporation (FDIC) or the Securities Investor Protection Corporation (SIPC). All holdings are subject to blockchain network risk.',
      },
    ],
  },
};
