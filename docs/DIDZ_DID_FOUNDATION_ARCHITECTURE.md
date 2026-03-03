# DIDz.io — Architecture Aligned with W3C DID Core & DIF Standards

**Author**: Penny 🎀
**Date**: March 3, 2026
**Status**: Architecture Proposal
**Sources**:
- W3C DID Core 1.0 Recommendation: https://www.w3.org/TR/did-core/
- Decentralized Identity Foundation (DIF): https://identity.foundation/
- W3C Verifiable Credentials Data Model 2.0: https://www.w3.org/TR/vc-data-model-2.0/

---

## 1. The DID Foundation — What It Is

There are **two** key organizations John should know about:

### 1.1 Decentralized Identity Foundation (DIF)
- **URL**: https://identity.foundation/
- **What**: An engineering-focused organization with 500+ member companies building interoperable decentralized identity systems
- **Notable members**: IOHK (Cardano/Midnight parent company), Microsoft, IBM, Mastercard, BlockchainCommons, Hyperledger ecosystem members
- **Key fact**: IOHK is a DIF member — this means DIDz.io's architecture direction is already aligned with the industry body that Midnight's parent company participates in

### 1.2 W3C DID Working Group
- **URL**: https://www.w3.org/TR/did-core/
- **What**: The W3C standard that defines the DID syntax, data model, and resolution process
- **Status**: W3C Recommendation (final standard) — this is the gold standard for DID implementations

### 1.3 W3C Verifiable Credentials (VC) Working Group
- **URL**: https://www.w3.org/TR/vc-data-model-2.0/
- **What**: The standard for how credentials (driver's license, degree, KYC attestation) are structured, issued, and verified
- **Status**: W3C Recommendation — the companion spec to DID Core
- **Three roles**: Issuer, Holder, Verifier — **exactly matching** John's Miro board architecture

---

## 2. W3C DID Core — Key Concepts for DIDz

### 2.1 DID Syntax
A DID is a simple URI with three parts:
```
did:method:method-specific-identifier
```

For DIDz on Midnight, this would be:
```
did:midnight:abc123def456...
```

**Proposal**: DIDz should define a `did:midnight` DID method. This makes DIDz identities globally resolvable and interoperable with any W3C DID-compatible system worldwide.

### 2.2 DID Document
Every DID resolves to a **DID Document** — a JSON-LD structure containing:
- **Verification Methods** — cryptographic public keys for authentication
- **Services** — endpoints where you can interact with the DID subject
- **Verification Relationships** — what each key is authorized to do

Example DID Document for a DIDz identity:
```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:midnight:7kczeph82d3p9fuxercd6s0vyc9nv0se",
  "authentication": [{
    "id": "did:midnight:7kczeph82d3p9fuxercd6s0vyc9nv0se#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:midnight:7kczeph82d3p9fuxercd6s0vyc9nv0se",
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam..."
  }],
  "service": [{
    "id": "did:midnight:7kczeph82d3p9fuxercd6s0vyc9nv0se#kycz-anchor",
    "type": "KYCzAnchor",
    "serviceEndpoint": "midnight://contract/KYCzAnchor/abc123..."
  }]
}
```

### 2.3 DID Subject Categories (from W3C spec)
The W3C spec explicitly states that **anything** can be a DID subject:
- **Persons** — humans (DIDz core use case)
- **Organizations** — companies, governments, institutions
- **Things** — IoT devices, physical objects, supply chain items
- **Abstract entities** — data models, concepts
- **Autonomous software** — AI agents (AgenticDID use case!)

**This validates John's full ecosystem design**:
- DIDz.io → persons, organizations, objects
- AgenticDID.io → autonomous AI agents
- The W3C spec supports ALL of these as first-class DID subjects

### 2.4 Verification Relationships (Critical for DIDz)
The W3C spec defines 5 verification relationships. Each DIDz should support:

| Relationship | Purpose | DIDz Use |
|---|---|---|
| **Authentication** | Prove you control this DID | Login, identity verification |
| **Assertion** | Make verifiable claims | KYCz proofs, credential presentations |
| **Key Agreement** | Establish encrypted channels | E2E encrypted comms between DIDs |
| **Capability Invocation** | Execute authorized actions | Trusted Issuer enrolling credentials |
| **Capability Delegation** | Delegate authority to others | AgenticDID delegation chains |

### 2.5 Multiple Controllers
W3C spec supports **multiple DID controllers** — meaning a single DID can be controlled by more than one entity. This enables:
- **Recovery**: A DIDz can have a backup controller (a trusted family member, a lawyer, etc.)
- **DownMan integration**: Estate planning — add a dead-man's switch controller via Shamir shares
- **Organizational DIDs**: Multiple admins control one organization DID
- **Group control**: Require M-of-N signatures for critical DID operations (multi-sig)

---

## 3. W3C Verifiable Credentials — Key Concepts for DIDz

### 3.1 The Three-Party Model
The VC spec defines the exact same three roles as John's Miro board:
- **Issuer** → Trusted Issuer (DMV, bank, hospital)
- **Holder** → User (Alice)
- **Verifier** → Entity checking a claim (liquor store, election poll agent)

This is NOT a coincidence — John independently arrived at the same architecture the W3C standardized. **DIDz is already architecturally aligned.**

### 3.2 Zero-Knowledge Proofs in the VC Spec
Section 5.7 of the VC 2.0 spec explicitly discusses ZKPs:
- A holder can derive a **verifiable presentation** that reveals only selected attributes
- The verifier can verify the presentation without learning the underlying data
- This is EXACTLY what KYCz does with `proveAgeAtLeast`, `proveResidency`, etc.

### 3.3 Credential Schemas
The VC spec supports **data schemas** — machine-readable descriptions of what claims a credential contains. DIDz should define schemas for:
- `KYCzCredential` — age, residency, sanctions status, assurance level
- `AgenticDIDCredential` — agent role, scopes, delegation chain
- `ProMingleCredential` — professional certifications, employment history
- `HealthCredential` — medical records, vaccination status (safeHealthData)

### 3.4 Credential Status
The VC spec defines a `credentialStatus` property for checking revocation. This maps directly to:
- KYCz: `revokedAnchors` set
- AgenticDID: `revocations` map
- The on-chain revocation registries we already have

---

## 4. DID Method: `did:midnight` — What We Should Build

### 4.1 The DID Method Specification
Every DID ecosystem needs a **DID Method specification** — a document that defines how DIDs are created, resolved, updated, and deactivated on a specific ledger. DIDz should author:

**`did:midnight` Method Specification** — published at `https://didz.io/did-method/`

This spec would define:
- **Create**: Deploy a DIDz smart contract that stores the DID Document in Midnight private state
- **Resolve**: Query the Midnight indexer to retrieve the DID Document (public parts only)
- **Update**: Owner signs a transaction to update verification methods or services
- **Deactivate**: Owner or recovery controller marks the DID as deactivated

### 4.2 DID Resolution on Midnight
```
Resolver                  Midnight Network
   |                            |
   |-- resolve(did:midnight:X) -->|
   |                            |-- query indexer for contract state
   |                            |-- build DID Document from ledger
   |<-- DID Document -----------|
```

The DID Document is constructed from on-chain data:
- Public keys from `sealed ledger` fields
- Service endpoints from `export ledger` fields
- Verification relationships from circuit permissions

### 4.3 Privacy-Enhanced Resolution
Unlike most DID methods, `did:midnight` can offer **privacy-enhanced resolution**:
- The DID Document contains ONLY public information
- Private attributes (DOB, address, etc.) remain in Midnight private state
- Verifiers can request ZK proofs about private attributes WITHOUT resolving them
- This is a **unique competitive advantage** over `did:web`, `did:ion`, `did:key`, etc.

---

## 5. Concrete Build-Out Ideas

### 5.1 DIDz Smart Contract Evolution
The KYCz contract is solid. Here's how to evolve it into a full DIDz contract:

```
KYCzAnchor.compact (current)       DIDzIdentity.compact (proposed)
├── issuerKey (sealed)              ├── adminKey (sealed)
│                                   ├── trustedIssuers: Set<Bytes<32>>
│                                   ├── issuerType: Map (HUMAN/AGENT/ORG)
├── anchorData (11 fields)          ├── anchorData (inherited from KYCz)
│                                   ├── credentialSchemas: Map<Bytes<32>, Schema>
│                                   ├── verificationMethods: Map<Bytes<32>, VMethod>
│                                   ├── serviceEndpoints: Map<Bytes<32>, Service>
├── prove* circuits (5)             ├── prove* circuits (inherited)
│                                   ├── issueCredential (new)
│                                   ├── presentCredential (new — selective disclosure)
│                                   ├── delegateCapability (new — for AgenticDID)
│                                   ├── rotateKey (new — key rotation)
│                                   ├── addRecoveryController (new — DownMan)
├── revokeAnchor                    ├── revokeAnchor (inherited)
│                                   ├── revokeCredential (new)
│                                   ├── deactivateDID (new)
```

### 5.2 Credential Type Registry
Define a catalog of credential types that ALL ecosystem products share:

| Credential Type | Issuer | Consumer Products |
|---|---|---|
| `KYCzBasicCredential` | Any KYCz Trusted Issuer | All products |
| `AgeVerification` | Government (DMV) | PopCork, ProMingle, HuddleBridge |
| `ResidencyProof` | Government | GeoZ, autoDiscovery.legal |
| `ProfessionalCredential` | Employer, University | ProMingle |
| `AgentAuthorization` | AgenticDID Issuer | AgenticDID, SentinelAI |
| `HealthRecord` | Hospital, Insurance | safeHealthData |
| `AssetOwnership` | Exchange, Custodian | SilentLedger, DownMan |
| `SanctionsScreening` | Compliance Provider | KYCz, autoDiscovery.legal |

### 5.3 TypeScript SDK: `@didz/core`
Build a shared TypeScript package that ALL ecosystem products import:

```typescript
// @didz/core — shared DIDz SDK
export interface DIDzIdentity {
  did: string;                          // did:midnight:abc123...
  document: DIDDocument;                // W3C DID Document
  credentials: VerifiableCredential[];  // W3C VCs
}

export interface DIDzProofRequest {
  type: 'age_gte' | 'residency' | 'kyc_passed' | 'sanctions_clear' | 'composite';
  params: Record<string, unknown>;
}

export interface DIDzProofResponse {
  verified: boolean;
  proofHash: string;
  timestamp: number;
}

// Core functions
export function createDID(options: CreateDIDOptions): Promise<DIDzIdentity>;
export function resolveDID(did: string): Promise<DIDDocument>;
export function requestProof(did: string, request: DIDzProofRequest): Promise<DIDzProofResponse>;
export function issueCredential(issuerDID: string, holderDID: string, claims: Claims): Promise<VerifiableCredential>;
export function presentCredential(credential: VerifiableCredential, disclosures: string[]): Promise<VerifiablePresentation>;
```

### 5.4 Interoperability Bridge
Because DIDz follows W3C standards, it can interoperate with:
- **Hyperledger Identus** (already in John's architecture) — for DID creation and credential exchange
- **did:web** — any website with a DID Document at `/.well-known/did.json`
- **did:key** — ephemeral DIDs for one-time interactions
- **OpenID Connect for Verifiable Credentials (OID4VC)** — browser-based credential exchange
- **DIDComm** — DIF's protocol for encrypted DID-to-DID messaging

### 5.5 Registering `did:midnight` with W3C
The W3C maintains a registry of DID methods: https://www.w3.org/TR/did-extensions-methods/

At the time of the DID Core publication, there were **103 experimental DID methods** registered. Registering `did:midnight` would:
- Give DIDz global credibility
- Make it discoverable by any DID resolver
- Position Midnight as a privacy-first verifiable data registry
- Attract developers from the broader SSI (Self-Sovereign Identity) community

---

## 6. What's Missing from Current Architecture (Gaps to Fill)

### 6.1 No DID Document Structure
The current KYCz contract stores KYC attributes but doesn't produce a W3C-compliant DID Document. We need a contract (or off-chain layer) that:
- Maps on-chain state to a DID Document JSON-LD structure
- Exposes public verification methods while keeping private data in ZK state
- Supports key rotation, service updates, and deactivation

### 6.2 No Credential Schema Definitions
We have circuits that prove things (`proveAgeAtLeast`, etc.) but no formal schemas defining what claims a credential contains. Adding schemas would:
- Enable machine-readable credential discovery
- Let verifiers auto-discover what proofs they can request
- Support interop with other VC ecosystems

### 6.3 No DIDComm Layer
DIDComm is the DIF standard for encrypted messaging between DIDs. Adding it would enable:
- Credential offer/request protocol between Issuers and Holders
- Proof request/response protocol between Verifiers and Holders
- HuddleBridge space invitations (ZK-verified) via DIDComm

### 6.4 No Key Rotation
The current KYCz contract uses a sealed `issuerKey` that can never change. In production:
- Keys get compromised and need rotation
- Organizations change key custodians
- W3C spec explicitly calls out key rotation as a security requirement
- DIDz needs `rotateVerificationMethod()` circuit

### 6.5 No Recovery Mechanism
W3C spec section 9.9 discusses DID recovery. DIDz needs:
- Recovery controllers (trusted parties who can help regain control)
- Social recovery (M-of-N trusted contacts)
- This dovetails perfectly with DownMan's Shamir secret sharing

---

## 7. Build Priority Recommendation

| Priority | Item | Why |
|---|---|---|
| **1** | Fix all contracts to Compact 0.29.0 syntax | Nothing works without compilable contracts |
| **2** | KYCz multi-issuer + participant types | Enables the cloneable pattern for DIDz |
| **3** | DIDz contract with DID Document support | The W3C-compliant identity layer |
| **4** | `@didz/core` TypeScript SDK | Shared code for all ecosystem products |
| **5** | `did:midnight` method specification | Global interoperability and credibility |
| **6** | Credential schema registry | Machine-readable credential types |
| **7** | DIDComm integration | Encrypted DID-to-DID messaging |
| **8** | Key rotation + recovery | Production security requirements |

---

## 8. Competitive Positioning

| Feature | DIDz (did:midnight) | did:web | did:ion | did:key | Worldcoin |
|---|---|---|---|---|---|
| ZK proofs native | Yes | No | No | No | Partial |
| Private state | Yes (Midnight) | No | No | No | No |
| Selective disclosure | Yes (circuits) | No | No | No | Limited |
| W3C compliant | Yes (proposed) | Yes | Yes | Yes | No |
| Biometric binding | Yes (face+finger+pulse) | No | No | No | Yes (iris only) |
| Anti-Sybil | Yes (one finger per DID) | No | No | No | Yes (one iris) |
| Credential revocation | Yes (on-chain sets) | Manual | Bitcoin anchor | No | No |
| Key rotation | Planned | Yes | Yes | No (ephemeral) | Unknown |
| Interop with VCs | Yes (planned) | Yes | Yes | Partial | No |
| Open source | Yes | Yes | Yes | Yes | Partial |

**DIDz's unique advantage**: ZK proofs + private state + biometric binding. No other DID method offers all three.

---

## 9. References

- **W3C DID Core 1.0**: https://www.w3.org/TR/did-core/
- **W3C VC Data Model 2.0**: https://www.w3.org/TR/vc-data-model-2.0/
- **DIF (Decentralized Identity Foundation)**: https://identity.foundation/
- **W3C DID Method Registry**: https://www.w3.org/TR/did-extensions-methods/
- **DIDComm Messaging v2**: https://identity.foundation/didcomm-messaging/spec/
- **OpenID for Verifiable Credentials**: https://openid.net/sg/openid4vc/
- **Hyperledger Identus**: https://hyperledger.github.io/identus-docs/
- **Midnight Network Docs**: https://docs.midnight.network/

---

*This architecture proposal aligns DIDz.io with global W3C standards while leveraging Midnight's unique privacy capabilities that no other DID method can match.*
