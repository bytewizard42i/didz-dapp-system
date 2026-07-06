# DIDz-io — demoLand vs realDeal

> Convention: every DIDzMonolith product ships two modes.
> Canonical spec: `~/PixyPi/docs/DEMOLAND_AUTH_STANDARD.md`

## demoLand (current)

- **Port**: 3013
- **Server**: `frontend-demoland/server.js` (Express, static files + health check)
- **Chain**: simulated — all state lives in client-side JavaScript
- **Auth**: 7-method standard (see canonical doc)
- **No Docker required** — just `npm install && npm start`
- **Safe to record** — deterministic, no network calls

## realDeal (planned)

- **Chain**: Midnight (undeployed localnet → testnet → mainnet)
- **Contracts**: DIDz registries (identity, machine, human) on `compactc 0.31.1`
- **Full stack**: `undeployed-compose.yml` (node :9944, indexer :8088, proof server :6300)
- **Identity provider API**: `identity-provider-api/` connects to local node
- **UI**: `didz-ui/` connects to identity-provider-api

## Rules

1. Shared pipeline logic written ONCE — both sides are thin orchestrators
2. The UI must never know which mode it's in (provider context switch)
3. demoLand must show the amber `🎭 DEMO MODE` banner
4. Auth must implement the 7-method standard
