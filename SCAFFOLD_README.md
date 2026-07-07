# DIDz.io DApp Scaffold, Phase 1 Status

**Created**: Apr 17, 2026 by Penny 🎀
**Reference architecture**: `bricktowers/midnight-identity` (layout) + `midnightntwrk/example-zkloan` (SDK versions)
**Status**: Scaffold in progress, root config and `didz-api`/`didz-contract`/`didz-ui`/`identity-provider-api` workspace stubs.

See `DEPLOYMENT.md` for production deployment plan and `docs/FI_STANDARDS_APPLIED_TO_DIDZ.md` for the protocol rules this scaffold encodes.

---

## Workspaces

| Workspace | Role | Status |
|-----------|------|--------|
| `didz-contract/` | TS bindings + Vitest simulators for `DIDzRegistry.compact` + `TrustedIssuerRegistry.compact` | ⏳ stub |
| `didz-api/` | RxJS-based SDK consumed by UI + CLI. Includes Fi Standards types + DID format helpers | ⏳ stub with types |
| `didz-ui/` | React + MUI + Vite consumer UI (register DID, attest, verify) | ⏳ minimal boot |
| `identity-provider-api/` | Node: Schnorr-signing credential issuer service | ⏳ stub |
| `didz-cli/` | Admin CLI (deploy contracts, rotate keys, activate issuers) | ⏳ deferred |

## Fi Standards Compliance

This scaffold encodes **Fi Standards** (see `docs/FI_STANDARDS_APPLIED_TO_DIDZ.md`):
- DID format: `did:midnight:<type>:<hash>` (snake_case, immutable)
- Three-axis Trusted Issuer model: `IssuerType` + `IssuerDomain[]` + `AssuranceLevel`
- `SCREAMING_SNAKE_CASE` credential types with allowed/forbidden lists per issuer
- Reserved ranges protected (`agent_0`..`agent_100`, `canonical_agent_101`, `trusted_issuer_0`)
- TD Bank philosophy: build `didz_foundation_0` first, test E2E, then replicate

## Quick Start (once scaffold is complete)

```bash
# First-time setup
corepack enable
yarn install

# Start local Midnight stack
yarn stack:up            # docker compose up -d

# Compile Compact contracts
npx turbo run compact

# Build all workspaces
npx turbo run build

# Dev: UI with hot reload
yarn dev:ui              # http://localhost:5173

# Dev: Identity provider API
yarn dev:idp             # http://localhost:3000
```

## Pinned SDK Versions

See root `package.json`. Matching `midnightntwrk/example-zkloan` (Apr 2026 stable):
- `midnight-js-*` 3.1.0
- `ledger-v7` 7.0.0
- `compact-js` 2.4.0
- `compact-runtime` 0.14.0
- `wallet-sdk-*` 1.0.0 / 3.0.0
