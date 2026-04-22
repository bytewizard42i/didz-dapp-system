# Blockfrost Midnight — DApp Integration for DIDz Identity Products

**Source**: https://docs.blockfrost.io/midnight/
**Date**: April 21, 2026
**Applies to**: DIDz-io, AgenticDID, KYCz, EnterpriseZK, SentinelDID

---

## 1. What Blockfrost Replaces

Previously, deploying a Midnight DApp required:
- Running your own Midnight node
- Running your own indexer
- Managing WebSocket infrastructure

**Now**: Blockfrost provides all three as a managed service. One `project_id` gives you full access.

---

## 2. DApp Provider Configuration

All DIDz products using the midnight.js SDK need three URLs:

```typescript
import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';

const NETWORK = 'preprod'; // or 'mainnet', 'preview'
const PROJECT_ID = process.env.BLOCKFROST_MIDNIGHT_PROJECT_ID;

const providerConfig = {
  // For midnight.js SDK — contract deployment & tx submission
  nodeRpcUrl: `https://rpc.midnight-${NETWORK}.blockfrost.io?project_id=${PROJECT_ID}`,

  // For contract state queries — GraphQL
  indexerUrl: `https://midnight-${NETWORK}.blockfrost.io/api/v0?project_id=${PROJECT_ID}`,

  // For real-time subscriptions — WebSocket
  indexerWsUrl: `wss://midnight-${NETWORK}.blockfrost.io/api/v0/ws?project_id=${PROJECT_ID}`,
};
```

**Note**: The `?project_id=` query param approach is specifically for midnight.js SDK compatibility where custom headers can't be set.

---

## 3. Contract Deployment & Discovery

### Deploy via Node RPC
The `nodeRpcUrl` endpoint is a direct JSON-RPC connection. Use it with `@midnight-ntwrk/midnight-js-contracts`:

```typescript
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';

// Deploy
const deployed = await deployContract(providers, {
  contract, initialPrivateState, privateStateId, args: [...]
});

// Find existing
const found = await findDeployedContract(providers, {
  contractAddress, contract, privateStateId, initialPrivateState
});
```

### Query Contract State via Indexer
After deployment, query the contract's on-chain state:

```graphql
query {
  contractAction(address: "DEPLOYED_CONTRACT_ADDRESS_HEX") {
    address
    state          # hex-encoded ledger state
    zswapState     # hex-encoded zswap state
    transaction { hash block { height timestamp } }
    unshieldedBalances { tokenType amount }
  }
}
```

### Monitor Contract Activity
Subscribe to all events for your deployed contract:

```graphql
subscription {
  contractActions(address: "DEPLOYED_CONTRACT_ADDRESS_HEX") {
    address state zswapState
    transaction { hash }
    unshieldedBalances { tokenType amount }
  }
}
```

This fires on every `ContractDeploy`, `ContractCall`, or `ContractUpdate` targeting your contract.

---

## 4. Shielded Transaction Scanning

For DApps that need to track wallet activity (e.g., KYCz checking if a user received tokens):

```typescript
// Step 1: Connect with viewing key
const connectResult = await fetch(indexerUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'project_id': PROJECT_ID },
  body: JSON.stringify({
    query: 'mutation($vk: ViewingKey!) { connect(viewingKey: $vk) }',
    variables: { vk: userViewingKey } // mn_shield-esk1... or hex
  })
});
const sessionId = (await connectResult.json()).data.connect;

// Step 2: Subscribe to shielded transactions
// (via WebSocket — see WebSocket examples in monolith-docs)

// Step 3: Disconnect when done
await fetch(indexerUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'project_id': PROJECT_ID },
  body: JSON.stringify({
    query: 'mutation($sid: HexEncoded!) { disconnect(sessionId: $sid) }',
    variables: { sid: sessionId }
  })
});
```

**Privacy consideration**: The viewing key is sent to Blockfrost's server. For maximum privacy, self-host the indexer. For development and non-sensitive operations, Blockfrost is convenient.

---

## 5. Per-Product Usage

### DIDz-io (Trust Registry)
- `contractAction` — query Trust Registry contract state
- `contractActions` subscription — watch for new issuer registrations
- Node RPC — deploy Trust Registry, submit verification txs

### AgenticDID (Agent Registry)
- `contractActions` subscription — monitor agent registrations and delegations in real-time
- `contractAction` — query agent authorization tree state
- Shielded txs — track agent staking tokens

### KYCz (Identity Verification)
- `contractAction` — query KYC contract state for verified users count
- `contractActions` — watch for new verifications as they happen
- `unshieldedTransactions` — monitor token flows in wealth verification

### EnterpriseZK (Enterprise Compliance)
- `contractActions` — audit trail of all compliance operations
- `contractAction` — query current authorization state
- `dustGenerationStatus` — monitor DUST for gas management
- `dParameterHistory` + `termsAndConditionsHistory` — governance audit

### SentinelDID (Security Monitoring)
- ALL subscriptions — comprehensive chain monitoring
- `contractActions` on ALL deployed DIDz contracts — anomaly detection
- Block stream — network health monitoring
- SPO queries — validator behavior analysis

---

## 6. Action Items

- [ ] Create Blockfrost Midnight project (blockfrost.io)
- [ ] Add `BLOCKFROST_MIDNIGHT_PROJECT_ID` to all DApp `.env` files
- [ ] Update provider configs in all midnight.js-based projects
- [ ] Test contract queries against preprod deployed contracts
- [ ] Build shared `BlockfrostMidnightClient` utility for the ecosystem

---

*Prepared by Cassie for DIDz identity products, April 21, 2026*
