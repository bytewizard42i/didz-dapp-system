# DIDz.io, Deployment Guide

**Product role**: Foundational identity layer. Every DIDzMonolith product eventually consumes DIDz attestations, so DIDz.io is the first DApp to go live.
**Current status**: Contracts shipped (`c5380f4`). DApp not yet scaffolded.
**Validated against**: `compactc v0.30.0`, pragma `>= 0.16 && <= 0.21`.
**Reference architecture**: `bricktowers/midnight-identity` + `midnightntwrk/example-zkloan`.

See the master roadmap at `PixyPi/DEPLOYMENT_ROADMAP.md` for ecosystem-wide patterns. This file covers DIDz.io specifics only.

---

## What Gets Deployed

```
┌─────────────────────────────────────────────────────────────────┐
│ Vercel (free)                                                   │
│  ─ didz.io / didz-io.vercel.app, registration + attestation UI │
└───────────────────┬─────────────────────────────────────────────┘
                    │ HTTPS
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│ VPS (Hostinger KVM, Railway, Fly.io), est. $5-15/mo           │
│  ─ proof-server       :6300  (Docker, pre-baked ZK params)     │
│  ─ identity-provider  :3000  (Node: Schnorr-sign credentials)  │
│  ─ indexer            :8088  (optional, watches for new DIDs) │
└───────────────────┬─────────────────────────────────────────────┘
                    │ WebSocket
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Midnight testnet/mainnet (public)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Repo Layout (planned)

```
DIDz-io/
├── .nvmrc                          # Node 22
├── .envrc                          # direnv env loader
├── turbo.json                      # compact → build → typecheck → test → lint
├── package.json                    # Yarn 4 workspaces, root SDK deps
├── undeployed-compose.yml          # Local proof-server + indexer + node
├── contracts/                      # ✅ Existing, DIDzRegistry + TrustedIssuerRegistry .compact
├── didz-contract/                  # TS bindings + Vitest simulators
│   ├── src/
│   │   ├── witnesses.ts
│   │   └── test/
│   └── package.json
├── didz-api/                       # RxJS contract SDK (deploy/subscribe helpers)
│   ├── src/
│   │   ├── api.ts                  # register/attest/verify/delegate
│   │   ├── config.ts               # TestNet / MainNet configs
│   │   └── common-types.ts
│   └── package.json
├── didz-ui/                        # React + MUI + Vite
│   ├── public/config.json          # Runtime config (per-environment)
│   ├── src/
│   │   ├── components/             # WalletConnect, DidRegister, Attest, Verify
│   │   ├── contexts/               # DidzContext with RxJS streams
│   │   └── utils/
│   └── package.json
├── identity-provider-api/          # Node: issues Schnorr-signed credentials
│   ├── src/
│   │   ├── server.ts               # Restify/Express routes
│   │   ├── signing.ts              # JubJub signing
│   │   └── types.ts
│   └── package.json
└── didz-cli/                       # Admin CLI (deploy, rotate keys, etc.)
    └── package.json
```

---

## Pinned SDK Versions (from `example-zkloan` Apr 2026)

```json
{
  "@midnight-ntwrk/compact-js":      "2.4.0",
  "@midnight-ntwrk/compact-runtime": "0.14.0",
  "@midnight-ntwrk/ledger-v7":       "7.0.0",
  "@midnight-ntwrk/midnight-js-*":   "3.1.0",
  "@midnight-ntwrk/wallet-sdk-*":    "1.0.0 / 3.0.0"
}
```

**Do NOT copy Brick Towers' `midnight-identity` `package.json` verbatim**, they're on the older `midnight-js 0.2.5` series which is now outdated. Use the versions above instead. Brick Towers' repo is still useful for **architecture**, just not for SDK version pins.

---

## Local Development

### Prerequisites
- Node.js ≥ 22 (pinned in `.nvmrc`)
- Yarn 4 (enabled via `corepack enable`)
- Docker (for the proof-server + indexer + local node)
- `COMPACT_HOME` env var pointing at your local `compactc` install (or use the MCP playground for syntax validation)

### First-time setup
```bash
git clone git@github.com:bytewizard42i/DIDz-io.git
cd DIDz-io
corepack enable           # Activate Yarn 4
yarn install
docker compose -f undeployed-compose.yml up -d   # Start proof-server + indexer + local node
npx turbo run compact     # Compile Compact contracts
npx turbo run build       # Build all workspaces
```

### Dev loop
```bash
# Terminal 1, UI with hot reload
yarn workspace didz-ui dev              # http://localhost:5173

# Terminal 2, Identity provider API
yarn workspace identity-provider-api dev # http://localhost:3000

# Terminal 3, (optional) watch contracts for changes
yarn workspace didz-contract test:watch
```

---

## Environments

| Env | Network | Proof server | Indexer | UI host |
|-----|---------|--------------|---------|---------|
| `local` | Undeployed (local node) | `localhost:6300` | `localhost:8088` | `localhost:5173` |
| `testnet` | Midnight TestNet | `proof.didz.io` (VPS) | Midnight public indexer | `didz-io.vercel.app` |
| `mainnet` | Midnight MainNet | `proof.didz.io` (VPS) | Midnight public indexer | `didz.io` (custom domain) |

### Runtime config pattern
The UI loads `/public/config.json` at startup. Example for testnet:
```json
{
  "networkId": "TestNet",
  "proofServerUrl": "https://proof.didz.io",
  "indexerUrl": "https://indexer.testnet.midnight.network",
  "identityProviderUrl": "https://idp.didz.io",
  "didzRegistryAddress": "0x...",
  "trustedIssuerRegistryAddress": "0x..."
}
```

Swap `config.json` per environment, no rebuild required. Vercel supports this via per-environment deployments or edge middleware.

---

## Deploying the Frontend (Vercel)

1. Push `DIDz-io` to GitHub (already at `bytewizard42i/DIDz-io` ✅)
2. Connect the repo in Vercel Dashboard → New Project
3. Configure:
   - **Root Directory**: `didz-ui/`
   - **Build Command**: `yarn workspace didz-ui build`
   - **Output Directory**: `dist/`
   - **Install Command**: `yarn install --immutable`
   - **Node Version**: 22
4. Add environment variables (or skip if using runtime `config.json`):
   - `VITE_NETWORK_ID=TestNet`
5. First deploy builds and issues a `didz-io.vercel.app` URL

### Custom domain (didz.io)
1. Buy `didz.io`, Hostinger's registrar is fine (just the domain, not hosting)
2. Vercel Dashboard → Domains → Add
3. Update Hostinger DNS per Vercel's instructions (CNAME `@` → `cname.vercel-dns.com`)
4. Vercel auto-provisions Let's Encrypt SSL

---

## Deploying the Backend (Proof Server + IDP API)

### Option A, Railway.app (easiest, ~$5/mo)

**Proof server:**
1. Fork `bricktowers/midnight-proof-server` (or use their image directly)
2. Railway → New Project → Deploy from GitHub
3. Exposes `https://proof-didz.up.railway.app`
4. CNAME `proof.didz.io` → that Railway URL

**Identity Provider API:**
1. In the DIDz-io repo: configure a `Dockerfile` at `identity-provider-api/Dockerfile`
2. Railway → New Service → Deploy from the same repo, root = `identity-provider-api/`
3. Set env vars: `PROVIDER_SECRET_KEY`, `PROVIDER_ID`
4. CNAME `idp.didz.io` → that Railway URL

### Option B, Hostinger KVM VPS ($4.49/mo)

```bash
# On the VPS after ssh:
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# Proof server (pre-baked image)
docker run -d --name proof-server --restart unless-stopped \
  -p 127.0.0.1:6300:6300 \
  ghcr.io/bricktowers/midnight-proof-server:prebaked

# Identity Provider API (you build + push this image to a registry first)
docker run -d --name didz-idp --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  -e PROVIDER_SECRET_KEY=... \
  your-registry/didz-identity-provider:latest

# Nginx reverse proxy with Let's Encrypt (caddy is simpler)
apt install caddy
# /etc/caddy/Caddyfile:
# proof.didz.io { reverse_proxy 127.0.0.1:6300 }
# idp.didz.io   { reverse_proxy 127.0.0.1:3000 }
systemctl reload caddy
```

---

## Phase Roadmap

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 0 | Compact contracts compile | ✅ Shipped `c5380f4` |
| 1 | Monorepo scaffold (didz-contract, didz-api, didz-ui, identity-provider-api) | ⏳ Next |
| 2 | Local `docker compose` stack runs end-to-end | ⏳ |
| 3 | Vercel preview deploy (TestNet) | ⏳ |
| 4 | First 10 test DIDs registered via UI | ⏳ |
| 5 | TrustedIssuer onboarding flow (CLI + admin UI) | ⏳ |
| 6 | MainNet deploy + `didz.io` domain | ⏳ |

---

## Known Constraints

- **Lace Wallet** does NOT expose a sign-message API. We handle this the same way Brick Towers does, users generate a local signing key pair, register its pubkey in the `SignatureRegistry` contract, and sign off-chain messages with the local key. The contract verifies the signature + the pubkey registration.
- **ZK params are 3 GB**. Pre-bake them into the proof-server Docker image; don't rely on runtime download (it fails intermittently).
- **Proof generation takes 3-30 seconds per TX**. Vercel's serverless functions are not suitable for proof generation, always proxy to a stateful VPS-hosted proof server.

---

## References

- Master roadmap: `PixyPi/DEPLOYMENT_ROADMAP.md`
- Reference DApp: https://github.com/bricktowers/midnight-identity (architecture)
- Current SDK reference: https://github.com/midnightntwrk/example-zkloan (version pins)
- Pre-baked proof server: https://github.com/bricktowers/midnight-proof-server
- Midnight Magazine Edda Labs writeup: https://themidnightmagazine.wordpress.com/2026/03/16/digital-identity-verification-without-data-leaks-how-midnight-does-it/
- Edda Labs (real-world DIDz-style patterns): https://github.com/eddalabs

---

*Built by Penny 🎀 on Apr 17, 2026.*
