# Nexus Hash - Cloud Mining & Multi-Coin Exchange Platform

Institutional-grade cloud mining infrastructure platform and multi-coin exchange router with real-time blockchain reconciliation, live dollar gain tracker, $1,000/minute revenue target engine, and MPC non-custodial custody & AML sanctions screening.

---

## ⚡ Key Architecture & Features

- **Full-Stack Architecture**: Modern React 19 SPA frontend served via Express API backend with Vite middleware in development and static caching in production.
- **Real-Time Blockchain Reconciliation**: Live simulated and RPC-connected nodes for BTC, ETH, LTC, SOL, KAS, DOGE, and USDC with block height tracking, ledger reconciliation, and confirmed hash generation.
- **Dynamic Exchange Router**: Real-time cross-asset swaps with slippage limits, network fee breakdown, and live USD value updates.
- **$1,000/Minute Revenue Target Engine**: Mathematical fleet-scaling model computing required terahashes, hardware lease capital, cooling costs, and live progress bars.
- **Institutional MPC Custody & AML Compliance**:
  - Non-Custodial Multi-Party Computation (MPC) signing architecture (Fireblocks / BitGo / Coinbase Prime / Air-gapped).
  - Chainalysis KYT-compatible automated AML risk screening and OFAC SDN sanctions filters.
  - FATF Travel Rule (IVMS-101) verification.
  - SEC *Howey* test physical computing lease legal framework & EU MiCA Article 68 sustainable energy compliance.
- **Autonomous AI Operations Agent**: Powered by Gemini API to monitor mining pool yields, dynamic ASIC thermal load, and automated profitability shifts.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+ (or Node 22+)
- npm 10+

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Start development server (serves on http://localhost:3000)
npm run dev
```

The application dev server starts at `http://localhost:3000`.

---

## 📦 Production Build & Run

```bash
# Compile frontend assets and bundle backend server
npm run build

# Start production server
npm start
```

---

## 🐳 Docker Deployment (Cloud Run, AWS ECS, VPS)

You can build and deploy the container image using the included standard Node container setup:

```bash
# Build Docker image
docker build -t nexus-hash-platform .

# Run Docker container on port 3000
docker run -p 3000:3000 -e PORT=3000 nexus-hash-platform
```

---

## 🌐 Deploy to Google Cloud Run

```bash
# Build and submit container via Google Cloud Build
gcloud builds submit --tag gcr.io/[PROJECT-ID]/nexus-hash-platform

# Deploy service to Cloud Run
gcloud run deploy nexus-hash-platform \
  --image gcr.io/[PROJECT-ID]/nexus-hash-platform \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

---

## 🔑 Environment Configuration

Key configuration parameters (see `.env.example` for comprehensive documentation):

| Variable | Description |
|---|---|
| `PORT` | Web server port (Default: `3000`) |
| `GEMINI_API_KEY` | Google Gemini API key for autonomous AI mining optimizations |
| `CUSTODIAN_PROVIDER` | `SANDBOX_SIMULATOR`, `FIREBLOCKS`, `BITGO`, or `COINBASE_PRIME` |
| `CUSTODIAN_MODE` | `SANDBOX_TESTNET` or `PRODUCTION` |
| `MAINNET_RPC_BTC` | Bitcoin Core bitcoind RPC endpoint |
| `MAINNET_RPC_ETH` | Ethereum JSON-RPC endpoint |
| `CHAINALYSIS_API_KEY` | Optional Chainalysis KYT API Key for live AML sanctions screening |

---

## 📄 License & Compliance Notice

This platform implements a commercial computing power lease model. All mining contracts constitute hardware allocation leases and do not constitute pooled investment funds or financial securities under SEC *Howey* test standards. Cryptocurrency assets are subject to market volatility and are not FDIC or SIPC insured.
