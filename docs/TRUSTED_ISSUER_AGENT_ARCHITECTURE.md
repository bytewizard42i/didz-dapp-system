# DIDz.io × AgenticDID, Trusted Issuer → Agent → Credential Architecture

**Author**: Penny 🎀  
**Date**: March 21, 2026  
**Status**: Architecture, Cross-Pollination  
**Related**: [AgenticDID mirror doc](../../AgenticDID/agentic-did/docs/DIDZ_INTEGRATION_ARCHITECTURE.md)

---

## The Core Insight

DIDz.io and AgenticDID are two halves of the same system:

- **DIDz.io** defines *who can issue credentials and how they're verified* (the Trust Triangle)
- **AgenticDID** defines *how agents receive credentials, delegate authority, and act on behalf of users* (the Agentic Layer)

Neither is complete without the other. A Trusted Issuer that can't create agents is just a database. An agent without a Trusted Issuer is just an unsigned bot.

```
┌────────────────────────────────────────────────────────────────┐
│                    THE FULL STACK                               │
│                                                                │
│  DIDz.io Layer         AgenticDID Layer        Ecosystem Layer │
│  ────────────          ────────────────        ─────────────── │
│  Trust Triangle        Agent Registry          Product DApps   │
│  DID Method            Delegation Chains       KYCz, ProMingle │
│  Credential Schemas    Spoof Privacy           safeHealthData  │
│  Issuer Registration   Mutual Auth             EquinePro, etc  │
│  Verifier Integration  Agent Lifecycle         All DIDz suite  │
│                                                                │
│  "Who is trusted?"     "What can agents do?"   "What gets      │
│                                                 built on top?" │
└────────────────────────────────────────────────────────────────┘
```

---

## The Trusted Issuer DApp, Central to Both Repos

The **Trusted Issuer DApp** is the keystone that connects DIDz.io to AgenticDID. It is where:

1. An entity **proves its legitimacy** to the DIDz network (becomes a Trusted Issuer)
2. The Trusted Issuer **creates agents** that act on its behalf
3. Those agents **issue credentials** to holders (humans, other agents, animals, objects)
4. Verifiers **check credentials** via ZK proofs without seeing the underlying data

### What the DApp Does

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRUSTED ISSUER DApp                               │
│                                                                     │
│  1. ISSUER ONBOARDING                                               │
│     ├─ Entity applies to become Trusted Issuer                      │
│     ├─ Provides: legal name, entity type, domains, assurance level  │
│     ├─ Admin review (or automated for known entities)               │
│     ├─ Issuer DID created: did:midnight:issuer:abc123               │
│     └─ Issuer registered on DIDz TrustedIssuerRegistry contract     │
│                                                                     │
│  2. AGENT CREATION                                                  │
│     ├─ Trusted Issuer creates agents via AgenticDID Registry        │
│     ├─ Each agent gets: DID, role, scopes, expiration               │
│     ├─ Agent types: ISSUER_AGENT, TASK_AGENT, LOCAL_AGENT           │
│     ├─ Issuer signs agent's credential (proves parentage)           │
│     └─ Agent registered on AgenticDIDRegistry contract              │
│                                                                     │
│  3. CREDENTIAL ISSUANCE                                             │
│     ├─ Agent (on behalf of Issuer) verifies a claim about a Holder  │
│     ├─ Agent issues W3C Verifiable Credential to Holder             │
│     ├─ Credential stored in Holder's DIDz wallet (private state)    │
│     ├─ On-chain: credential hash anchored, revocation status set    │
│     └─ Off-chain: full credential in Holder's encrypted storage     │
│                                                                     │
│  4. VERIFICATION                                                    │
│     ├─ Verifier sends ZKQuery to Holder's wallet                    │
│     ├─ Holder's wallet generates ZK proof from credential           │
│     ├─ Verifier receives boolean answer (yes/no)                    │
│     ├─ Spoof transactions generated for timing privacy              │
│     └─ Verification logged on-chain (tamper-proof)                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How the Contracts Connect

### Current State

| Contract | Repo | Purpose | Status |
|----------|------|---------|--------|
| `KYCzAnchor.compact` | DIDz-io (via KYCz) | Store KYC data, prove age/residency/sanctions | Compiles (7 circuits) |
| `AgenticDIDRegistry.compact` | AgenticDID | Register agents, create delegations, revoke | Written (needs compilation update) |
| `CredentialVerifier.compact` | AgenticDID | Verify credentials, spoof transactions | Written (needs compilation update) |

### Proposed Integration

```
┌──────────────────────────────┐
│  TrustedIssuerRegistry       │  ← NEW (DIDz-io)
│  (DIDz-io contract)         │
│                              │
│  - registerIssuer()          │  Issuer applies, admin approves
│  - getIssuerStatus()         │  Is this issuer still trusted?
│  - revokeIssuer()            │  Admin removes bad issuer
│  - getIssuerDomains()        │  What domains can issuer attest to?
│  - trustedIssuers: Set       │  On-chain registry of approved issuers
└──────────┬───────────────────┘
           │
           │ "Is this issuer trusted?"
           ▼
┌──────────────────────────────┐
│  AgenticDIDRegistry          │  ← EXISTS (AgenticDID)
│  (AgenticDID contract)       │
│                              │
│  - registerAgent()           │  Issuer creates an agent
│  - verifyAgent()             │  Is this agent valid?
│  - createDelegation()        │  User delegates to agent
│  - checkDelegation()         │  Is this delegation valid?
│  - revokeAgent()             │  Issuer/admin revokes agent
│  - revokeDelegation()        │  User revokes delegation
└──────────┬───────────────────┘
           │
           │ "Is this agent legit? Does it have delegation?"
           ▼
┌──────────────────────────────┐
│  CredentialVerifier          │  ← EXISTS (AgenticDID)
│  (AgenticDID contract)       │
│                              │
│  - verifyCredential()        │  Check a credential + spoof
│  - verifyDelegation()        │  Check a delegation + spoof
│  - getStats()                │  Public verification stats
│  - batchVerify()             │  Multi-agent verification
└──────────┬───────────────────┘
           │
           │ "Prove this fact about the Holder"
           ▼
┌──────────────────────────────┐
│  KYCzAnchor                  │  ← EXISTS (DIDz-io/KYCz)
│  (DIDz-io contract)         │
│                              │
│  - enrollAnchor()            │  Issuer stores verified data
│  - proveAgeAtLeast()         │  Holder proves age ≥ N
│  - proveKycPassed()          │  Holder proves KYC level
│  - proveResidency()          │  Holder proves country
│  - proveSanctionsClear()     │  Holder proves not sanctioned
│  - proveComposite()          │  Multiple proofs combined
│  - revokeAnchor()            │  Admin revokes credential
└──────────────────────────────┘
```

### The Flow (End-to-End)

```
1. ISSUER ONBOARDING
   Bank of America → TrustedIssuerRegistry.registerIssuer()
   → Admin approves → Bank gets did:midnight:issuer:boa

2. AGENT CREATION
   Bank → AgenticDIDRegistry.registerAgent(bankAgentDID, role=TASK_AGENT, scopes=[bank:*])
   → Bank Agent created: did:midnight:agent:boa_agent_001

3. USER DELEGATION
   John → AgenticDIDRegistry.createDelegation(johnDID, cometDID, scopes=[bank:balance])
   → Comet can now ask Bank Agent for John's balance

4. CREDENTIAL ISSUANCE
   Bank Agent → KYCzAnchor.enrollAnchor(johnDID, kycData)
   → John's KYC data stored in private state

5. VERIFICATION
   Liquor Store → KYCzAnchor.proveAgeAtLeast(johnDID, 21)
   → CredentialVerifier.verifyCredential() with spoof transactions
   → Returns: true (John is ≥ 21). Liquor store learns nothing else.
```

---

## Three-Axis Issuer Model (from AgenticDID → shared with DIDz-io)

AgenticDID's three-axis model should become the **standard for all DIDz Trusted Issuers**:

```typescript
interface TrustedIssuer {
  issuerDID: string;                    // did:midnight:issuer:abc123
  
  // Axis 1: What kind of entity?
  issuerType: 'INDIVIDUAL' | 'CORPORATION' | 'GOVERNMENT_ENTITY' | 'INSTITUTION' | 'COOPERATIVE';
  
  // Axis 2: What domains can they attest to?
  domains: Array<
    'FINANCIAL' | 'IDENTITY_INFRA' | 'E_COMMERCE' | 'TRAVEL' |
    'GOV_SERVICES' | 'VOTING' | 'MEDICAL' | 'EDUCATION' |
    'RESEARCH' | 'VETERINARY' | 'EQUINE' | 'LEGAL' |
    'EMPLOYMENT' | 'REAL_ESTATE' | 'INSURANCE'
  >;
  
  // Axis 3: How much should you trust them?
  assuranceLevel: 'SELF_DECLARED' | 'PEER_REVIEWED' | 'REGULATED_ENTITY' | 'SYSTEM_CRITICAL';
}
```

### DIDz Ecosystem Issuers (Cross-Product)

| Issuer | Type | Domains | Products Served |
|--------|------|---------|-----------------|
| AgenticDID Foundation | COOPERATIVE | IDENTITY_INFRA | All products (root issuer) |
| Bank of America | CORPORATION | FINANCIAL | AgenticDID, SilentLedger, DownMan |
| DMV / Government | GOVERNMENT_ENTITY | GOV_SERVICES, VOTING | DIDz-io, KYCz, GeoZ |
| Stanford University | INSTITUTION | EDUCATION, RESEARCH, MEDICAL | ProMingle, safeHealthData |
| Veterinary Practice | CORPORATION | VETERINARY, MEDICAL | PetProData |
| Equine Registry (AQHA) | INSTITUTION | EQUINE | EquineProData |
| Law Firm | CORPORATION | LEGAL | AutoDiscovery.legal |
| Insurance Company | CORPORATION | INSURANCE, FINANCIAL | safeHealthData, PetProData, EquineProData |
| Employer | CORPORATION | EMPLOYMENT | ProMingle |
| Airline | CORPORATION | TRAVEL | AgenticDID |
| Ecuador Voting Dept | GOVERNMENT_ENTITY | GOV_SERVICES, VOTING | AgenticDID |

---

## Credential Type Registry (Shared Across DIDz + AgenticDID)

This is the **single source of truth** for what credentials exist in the ecosystem. Both DIDz-io and AgenticDID reference this registry.

### Core Identity Credentials (DIDz-io)
| Credential Type | Issued By | Products |
|----------------|-----------|----------|
| `KYC_TIER_1` | Any Trusted Issuer | All |
| `KYC_TIER_2` | Gov/Bank | Banking, Healthcare, Travel |
| `KYC_TIER_3` | Bank | Unlimited transactions, Voting |
| `AGE_VERIFICATION` | Government | PopCork, HuddleBridge |
| `RESIDENCY_PROOF` | Government | GeoZ, AutoDiscovery |
| `SANCTIONS_SCREENING` | Compliance Provider | KYCz |

### Agent Credentials (AgenticDID)
| Credential Type | Issued By | Products |
|----------------|-----------|----------|
| `AGENT_REGISTRATION` | AgenticDID Foundation | AgenticDID |
| `AGENT_DELEGATION` | Any user | AgenticDID |
| `AGENT_AUTHORIZATION` | Trusted Issuer | AgenticDID |
| `ISSUER_CERTIFICATION` | DIDz admin | DIDz-io |

### Domain-Specific Credentials (Ecosystem)
| Credential Type | Issued By | Products |
|----------------|-----------|----------|
| `PROFESSIONAL_CREDENTIAL` | Employer/University | ProMingle |
| `HEALTH_RECORD` | Hospital/Insurer | safeHealthData |
| `PET_HEALTH_RECORD` | Vet Practice | PetProData |
| `EQUINE_HEALTH_RECORD` | Equine Vet | EquineProData |
| `EQUINE_OWNERSHIP` | Registry/Auction | EquineProData |
| `ASSET_OWNERSHIP` | Exchange/Custodian | SilentLedger, DownMan |
| `FINANCIAL_ACCOUNT` | Bank | AgenticDID, SilentLedger |
| `SOCIAL_ATTESTATION` | Peer | SouLink, PopCork |

---

## What DIDz-io Gives to AgenticDID

1. **Trust Triangle Framework**, The Holder→Issuer→Verifier model that AgenticDID's agents operate within
2. **W3C DID Core Compliance**, `did:midnight` method spec that makes agent DIDs globally resolvable
3. **KYCz Anchor Contract**, The proven ZK proof engine (7 circuits, compiles) that agents use for credential verification
4. **Credential Schema Registry**, Machine-readable definitions of what credentials contain
5. **Hierarchical Privacy Wallet**, The folderized wallet where users store credentials agents issue
6. **Verifier Integration DApp**, The standard way external services query ZK proofs

## What AgenticDID Gives to DIDz-io

1. **Agent Registry Contract**, The on-chain registry for agents created by Trusted Issuers
2. **Delegation Chain Model**, How users authorize agents to act on their behalf with scoped, time-limited, revocable permissions
3. **Three-Axis Issuer Model**, The composable `(type, domains, assurance)` classification that replaces category explosion
4. **Spoof Transaction Privacy**, The novel timing-attack defense that should protect ALL DIDz verification queries
5. **Mutual Authentication Flow**, The bidirectional trust establishment protocol (User↔Agent, Agent↔Agent)
6. **TD Bank Philosophy**, "Build one perfect flow and replicate", the canonical agent_0 pattern

---

## Shared TypeScript SDK: `@didz/core`

Both repos should import from a shared SDK:

```typescript
// From DIDz-io
export { createDID, resolveDID } from './did';
export { requestProof, presentCredential } from './proofs';
export { TrustedIssuerRegistry } from './issuers';
export { CredentialSchemaRegistry } from './schemas';

// From AgenticDID
export { AgentRegistry, registerAgent, verifyAgent } from './agents';
export { DelegationManager, createDelegation, checkDelegation } from './delegations';
export { SpoofTransactionManager } from './privacy';
export { MutualAuthProtocol } from './auth';

// Shared
export type { DIDzIdentity, TrustedIssuer, AgentCredential, Delegation } from './types';
export type { VerifiableCredential, VerifiablePresentation } from './w3c-types';
```

---

## Build Priority (Combined)

| Priority | Item | Owner | Why |
|----------|------|-------|-----|
| **1** | Update AgenticDID contracts to Compact ≥0.25.0 syntax | AgenticDID | Nothing works without compilable contracts |
| **2** | `TrustedIssuerRegistry.compact` contract | DIDz-io | The missing piece, on-chain issuer trust |
| **3** | Wire AgenticDIDRegistry ↔ TrustedIssuerRegistry | Both | Agents can only be created by registered issuers |
| **4** | `@didz/core` shared TypeScript SDK | Both | One package, all products import |
| **5** | Trusted Issuer DApp frontend (demoLand) | DIDz-io | The UI where issuers register, create agents, issue creds |
| **6** | agent_0 canonical flow (end-to-end) | AgenticDID | Prove the pattern works |
| **7** | Credential Schema Registry | DIDz-io | Machine-readable credential types |
| **8** | Spoof transaction integration for all DIDz proofs | Both | Timing privacy everywhere |

---

## References

- DIDz-io Foundation Architecture: `docs/DIDZ_DID_FOUNDATION_ARCHITECTURE.md`
- DIDz-io Miro Architecture: `docs/DIDZ_MIRO_ARCHITECTURE.md`
- DIDz-io Synopsis: `docs/DIDZ_SYNOPSIS.md`
- AgenticDID Grand Vision: `AgenticDID/agentic-did/docs/GRAND_VISION.md`
- AgenticDID Privacy Architecture: `AgenticDID/agentic-did/docs/PRIVACY_ARCHITECTURE.md`
- AgenticDID Delegation Workflow: `AgenticDID/agentic-did/docs/AGENT_DELEGATION_WORKFLOW.md`
- AgenticDID Issuers & Agents Chart: `AgenticDID/agentic-did/docs/ISSUERS_AND_AGENTS_CHART.md`
- W3C DID Core 1.0: https://www.w3.org/TR/did-core/
- W3C VC Data Model 2.0: https://www.w3.org/TR/vc-data-model-2.0/
