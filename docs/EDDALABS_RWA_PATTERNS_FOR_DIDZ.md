# Edda Labs / Brick Towers RWA Patterns, Implications for DIDz.io

**Source**: Edda Labs deep dive video by Erick (Part 2: ZK Identity for RWA)
**Video**: https://www.youtube.com/watch?v=l6hMb942sOA
**Repo analyzed**: https://github.com/BrickTowers/midnight-rwa
**Date**: April 11, 2026
**Relevance**: DIDz.io is our foundational identity/DID system, Brick Towers built a complete ZK identity verification system on Midnight that validates many of our architectural choices AND introduces patterns we should adopt.

---

## Executive Summary

Brick Towers' `midnight-rwa` is the first production-grade third-party implementation of ZK identity verification on Midnight that we've dissected line-by-line. Their architecture, a Trusted Identity Provider that bridges government credentials into JubJub ZK proofs, is essentially **our Trusted Issuer architecture in concrete code**. This document maps their implementation to DIDz.io's Trust Triangle and identifies what we should adopt, what we got right, and what we need to update.

---

## 1. Brick Towers' Architecture ↔ DIDz.io Trust Triangle

### The Mapping

```
Brick Towers midnight-rwa          DIDz.io Trust Triangle
═══════════════════════════        ═════════════════════════════
Identity Provider (IDP)       ←→   Trusted Issuer
  - Verifies gov signature          - Entity that creates credentials
  - Re-signs on JubJub              - Issues signed assertions
  - Public key sealed in contract   - Registered on-chain

Investor (user)               ←→   Holder
  - Submits passport + quiz          - Receives credentials
  - Gets onboarded via ZK proof      - Presents ZK proofs
  - Public key in auth tree          - DID registered on-chain

RWA Contract (verifier)       ←→   Verifier
  - Checks JubJub signature          - Verifies ZK proofs
  - Checks nationality allowlist     - Checks credential validity
  - Grants access via MerkleTree     - Grants resource access

Government (root trust)       ←→   Root of Trust
  - Issues passport (P-256)          - Government, institution, etc.
  - ICAO 9303 standard               - Various credential standards
  - Signature verified off-chain     - Verified off-chain by Issuer
```

### What This Confirms

**Our Trust Triangle architecture is correct.** Brick Towers independently arrived at the same three-party model:
1. A trusted entity verifies credentials off-chain (Issuer/IDP)
2. That entity re-signs with ZK-compatible keys (JubJub Schnorr)
3. The on-chain contract verifies only the ZK-compatible signature
4. The root trust (government) never touches the blockchain directly

### What They Did That We Haven't (Yet)

1. **Sealed IDP key**, Their `identityProviderPublicKey` is `sealed ledger`, immutable and invisible after deployment. Our Trusted Issuer Registry uses mutable ledger state.
2. **Concrete signature bridge**, They have working code for P-256 → JubJub. We've designed the concept but haven't implemented the bridge.
3. **Generic crypto module**, Their `crypto.compact` is fully generic over `T`. Our credential signing is conceptual.
4. **Compound onboard circuit**, Their `onboard()` bundles quiz + identity + wealth in one ZK proof. Our flows are still separate circuits.

---

## 2. The Signature Bridge, Critical for DIDz.io

### The Problem We Both Face

Government and institutional credentials use standard crypto (P-256, RSA, Ed25519). Midnight's ZK circuits run on BLS12-381/JubJub. You can't efficiently verify non-native signatures inside a ZK circuit.

### Brick Towers' Solution (Production Code)

**Off-chain verification** (Node.js `identity-api/src/government-signature-verifier.ts`):
```typescript
// Verify the government's P-256 ECDSA signature
const verifier = createVerify('sha256');
verifier.update(credential);
const isValid = verifier.verify(publicKey, signature);
if (!isValid) throw new Error('Invalid issuer signature');
```

**JubJub re-signing** (Node.js `identity-api/src/credential-service.ts`):
```typescript
// Deterministic k prevents nonce reuse attacks
const k = MidnightRwa.pureCircuits.generateDeterministicK(sk, credential);
const moduloK = k % FIELD_MODULUS;
const r = ecMulGenerator(moduloK);
const c = MidnightRwa.pureCircuits.computeChallengeForCredential(r, pk, credential);
const s = (moduloK + (c % FIELD_MODULUS) * sk) % FIELD_MODULUS;
```

**On-chain verification** (`crypto.compact`):
```compact
export pure circuit verify<T>(credential: SignedCredential<T>, challenge: Field): Boolean {
  const lhs = ecMulGenerator(credential.signature.s);          // G * s
  const rhs = ecAdd(credential.signature.r, ecMul(credential.pk, challenge)); // R + pk*c
  return lhs == rhs;                                            // Schnorr check
}
```

### What DIDz.io Needs to Build

**Priority: HIGH**, This is the bridge between the real world and our ZK credential system.

1. **`DIDzSignatureBridge` service**, analogous to Brick Towers' `identity-api`:
   - Accepts credentials signed with standard crypto (P-256, RSA, Ed25519)
   - Verifies the original signature off-chain
   - Re-signs the credential data using Schnorr on JubJub
   - Returns a `SignedCredential<T>` compatible with our Compact contracts

2. **Multi-scheme support**, Brick Towers only handles P-256. DIDz.io needs:
   - P-256 (government passports, FIDO2/WebAuthn)
   - RSA (legacy corporate certificates, X.509)
   - Ed25519 (modern identity systems, Cardano native)
   - Each scheme has its own off-chain verifier, but all output the same JubJub `SignedCredential<T>`

3. **Port `crypto.compact`**, Their generic crypto module is directly reusable:
   ```compact
   module Crypto {
     export struct Signature { r: CurvePoint; s: Field; }
     export struct SignedCredential<T> { credential: T; signature: Signature; pk: CurvePoint; }
     export pure circuit verify<T>(...): Boolean { ... }
   }
   ```
   This becomes the cryptographic foundation for ALL DIDz credential types.

---

## 3. Credential Struct Design, ICAO 9303 as Template

### What Brick Towers Did

Every ICAO 9303 MRZ field becomes a `Field` in a Compact struct:

```compact
export struct PassportData {
  documentCode: Field;           // "P<", 2 bytes
  issuingOrganization: Field;    // ICAO state code, 3 bytes
  holderName: Field;             // surname<<given, 39 bytes
  documentNumber: Field;         // alphanumeric, 9 bytes
  nationality: Field;            // ICAO code, 3 bytes
  dateOfBirth: Field;            // YYMMDD, 6 bytes
  sex: Field;                    // M/F/<, 1 byte
  expiryDate: Field;             // YYMMDD, 6 bytes
  // ... check digits and optional data
}
```

All fields encoded as little-endian bigints, padded to 32 bytes:
```typescript
function toBigInt(str: string): bigint {
  const bytes = encoder.encode(str);
  const arr = new Uint8Array(32);
  arr.set(bytes.slice(0, 32));
  let result = 0n;
  for (let i = 0; i < arr.length; i++) {
    result += BigInt(arr[i]) * (256n ** BigInt(i));
  }
  return result;
}
```

### DIDz.io Credential Schema Family

Following this pattern, DIDz.io should define a family of credential structs:

```compact
// Passport credential (directly from Brick Towers pattern)
export struct PassportCredential {
  documentCode: Field;
  issuingOrganization: Field;
  nationality: Field;
  dateOfBirth: Field;
  expiryDate: Field;
  compositeCheckDigit: Field;
  // holderName and documentNumber EXCLUDED from on-chain struct
  // for maximum privacy, only the minimum needed for verification
}

// Professional license credential
export struct ProfessionalCredential {
  licenseType: Field;           // e.g., "MD", "JD", "CPA"
  issuingAuthority: Field;      // state/country code
  licenseNumber: Field;         // encoded as bigint
  issueDate: Field;
  expiryDate: Field;
  status: Field;                // active, suspended, revoked
}

// Age verification credential (minimal)
export struct AgeCredential {
  dateOfBirth: Field;
  nationality: Field;
  // Nothing else, minimum disclosure for age-gating
}

// Business entity credential
export struct BusinessCredential {
  entityType: Field;            // LLC, Corp, etc.
  jurisdiction: Field;
  registrationNumber: Field;
  registrationDate: Field;
  status: Field;
}
```

**Key design principle from Brick Towers**: Each struct contains ONLY the fields needed for on-chain verification. The full credential lives off-chain. The ZK proof covers the full data, but only the struct fields are available for circuit comparisons.

---

## 4. Sealed Ledger, Immutable Trust Configuration

### Brick Towers' Sealed Fields

```compact
export sealed ledger identityProviderPublicKey: CurvePoint;  // who can issue
export sealed ledger ALLOWED_COUNTRY_CODE1: Field;           // jurisdiction 1
export sealed ledger ALLOWED_COUNTRY_CODE2: Field;           // jurisdiction 2
export sealed ledger EIGHTEEN_YEARS_IN_SECONDS: Uint<64>;    // age threshold
export sealed ledger tbtcCoinColor: Bytes<32>;               // token identity
```

**`sealed`** means: set once in constructor, immutable forever, not externally readable.

### DIDz.io Application

Our Trusted Issuer Registry should use sealed fields for deployment-time trust anchors:

```compact
// DIDz Trust Registry, sealed configuration
export sealed ledger networkId: Bytes<32>;                // which DIDz network
export sealed ledger rootIssuerPublicKey: CurvePoint;     // root trust anchor
export sealed ledger minimumAssuranceLevel: Uint<32>;     // min credential level
export sealed ledger schemaVersion: Uint<32>;             // prevents schema mismatch
export sealed ledger credentialTTL: Uint<64>;             // max credential lifetime (seconds)
```

### The Sealed vs. Mutable Decision

| Parameter | Sealed? | Rationale |
|-----------|---------|-----------|
| Root trust anchor key | ✅ Sealed | Core trust assumption, changing it changes everything |
| Network identity | ✅ Sealed | A contract belongs to one network forever |
| Schema version | ✅ Sealed | Prevents schema confusion post-deployment |
| Individual issuer keys | ❌ Mutable | Issuers come and go, use HistoricMerkleTree |
| Credential revocation list | ❌ Mutable | Must be updatable |
| Jurisdiction allowlist | ⚠️ Design choice | Sealed = simpler, Mutable = more flexible |

### Impact on Current Architecture

Our `TRUSTED_ISSUER_AGENT_ARCHITECTURE.md` describes issuer registration as a mutable ledger operation. The sealed pattern suggests a **hybrid approach**:

1. **Sealed**: Root trust anchor, network ID, schema version, minimum assurance level
2. **Mutable (HistoricMerkleTree)**: Individual Trusted Issuer public keys, added via admin circuits
3. **Mutable (Map)**: Credential revocation status

This matches Brick Towers' pattern exactly, they seal the IDP key but use HistoricMerkleTree for investor authorizations.

---

## 5. HistoricMerkleTree for Credential/Authorization Tracking

### Why Brick Towers Chose HistoricMerkleTree

```compact
export ledger issuerAuthorizations: HistoricMerkleTree<32, Bytes<32>>;
export ledger authorizations: HistoricMerkleTree<32, ZswapCoinPublicKey>;
```

**Three critical advantages over Set/Map**:

1. **Race condition immunity**: If User A generates a Merkle proof, and User B gets added to the tree before A's tx is submitted, A's proof still works because `checkRoot()` validates against ALL historical roots.

2. **Privacy**: The tree's contents are not enumerable from outside. You can prove you're IN the tree, but nobody can list all members.

3. **Scale**: Depth 32 = 2^32 ≈ 4 billion possible entries.

### The Authorization Pattern

```compact
// Check if a user is authorized
circuit isAuthorized(userPk: ZswapCoinPublicKey): Boolean {
  const authPath = findAuthorizationPath(userPk);  // witness: O(n) off-chain
  const root = merkleTreePathRoot<32, ZswapCoinPublicKey>(disclose(authPath));
  return authorizations.checkRoot(root);  // O(1) on-chain
}
```

**The witness does the heavy lifting**:
```typescript
findAuthorizationPath(context, pk) {
  const path = context.ledger.authorizations.findPathForLeaf(pk);
  if (!path) throw new Error(`Not found`);
  return [context.privateState, path];
}
```

### DIDz.io Application

**Replace our Map-based registries with HistoricMerkleTree**:

```compact
// Current (Map-based):
export ledger trustedIssuers: Map<Bytes<32>, IssuerRecord>;

// Proposed (HistoricMerkleTree-based):
export ledger trustedIssuers: HistoricMerkleTree<32, Bytes<32>>;
export ledger verifiedHolders: HistoricMerkleTree<32, Bytes<32>>;
```

**Trade-offs**:
- ✅ Race condition proof, privacy, scale
- ❌ No `lookup()`, you can only prove membership, not retrieve data
- ❌ `findPathForLeaf()` is O(n) in TypeScript, expensive for very large trees
- 💡 **Hybrid**: Use HistoricMerkleTree for membership proofs + Map for data retrieval

### Recommended Hybrid for DIDz Trust Registry

```compact
// Membership proofs (private, race-safe):
export ledger issuerTree: HistoricMerkleTree<32, Bytes<32>>;

// Data retrieval (for admin/query operations):
export ledger issuerRecords: Map<Bytes<32>, IssuerMetadata>;

// Registration circuit adds to BOTH:
export circuit registerIssuer(issuerPk: Bytes<32>, metadata: IssuerMetadata): [] {
  checkAdmin();
  issuerTree.insert(disclose(issuerPk));
  issuerRecords.insert(disclose(issuerPk), disclose(metadata));
}

// Verification circuit uses ONLY the tree:
circuit isIssuerTrusted(issuerPk: Bytes<32>): [] {
  const path = findIssuerPath(issuerPk);
  assert(issuerTree.checkRoot(
    merkleTreePathRoot<32, Bytes<32>>(disclose(path))
  ), "Issuer not trusted");
}
```

---

## 6. The Compound Onboard Circuit, Design Pattern

### Brick Towers' `onboard()` in One Atomic Proof

```compact
export circuit onboard(quiz: QuizResult, inputCoin: CoinInfo, identity: SignedCredential<PassportData>): [] {
  assert(quizCommit(quiz) == quizHash, "Quiz incorrect");     // knowledge proof
  assertIdentity(identity);                                     // identity proof
  assertCoinValue(inputCoin);                                   // wealth proof
  authorizations.insert(ownPublicKey());                        // grant access
}
```

Three independent assertions verified in one transaction, one ZK proof, one gas cost.

### DIDz.io Compound Verification Circuits

Following this pattern, DIDz.io credential verification should bundle related checks:

```compact
// DIDz compound onboard, all checks in one proof
export circuit verifyAndRegisterHolder(
  identityCred: SignedCredential<PassportCredential>,
  professionalCred: SignedCredential<ProfessionalCredential>,
  wealthCoin: CoinInfo,
  assuranceLevel: Uint<32>
): [] {
  // 1. Verify identity credential signature
  assertCredentialValid(identityCred);

  // 2. Verify professional credential signature
  assertCredentialValid(professionalCred);

  // 3. Check jurisdiction allowlist
  assert(
    disclose(identityCred.credential.nationality) == ALLOWED_JURISDICTION_1 ||
    disclose(identityCred.credential.nationality) == ALLOWED_JURISDICTION_2,
    "Jurisdiction not allowed"
  );

  // 4. Check professional license is active
  assert(
    disclose(professionalCred.credential.status) == ACTIVE_STATUS,
    "License not active"
  );

  // 5. Wealth threshold (temporary deposit pattern)
  assertMinimumWealth(wealthCoin);

  // 6. All passed, register holder in tree
  verifiedHolders.insert(ownPublicKey());
}
```

**Benefits**:
- **Atomic**, all-or-nothing, no partial onboarding
- **Single proof**, one ZK proof covers all assertions
- **Privacy**, only `nationality` and `status` are disclosed; everything else stays in the circuit
- **Efficiency**, one transaction instead of three

---

## 7. Explicit Disclosure Analysis, The Privacy Boundary

### What Brick Towers Discloses (and Why)

| Data | Disclosed | Reason |
|------|-----------|--------|
| `nationality` | ✅ | Must compare against allowlist in circuit |
| `inputCoin` (color, value) | ✅ | Must verify token type and minimum amount |
| `authPath` (Merkle proof) | ✅ | Must compute root for `checkRoot()` |
| `recipient.is_left` | ✅ | Branching on public/contract recipient |
| Name, DOB, doc number, sex | ❌ | Never needed for verification logic |
| Quiz answers | ❌ | Only commitment compared |
| IDP public key | ❌ | Sealed, compared inside circuit |
| Secret key | ❌ | Witness, never leaves user's machine |

### The Pattern

Every `disclose()` call is **the minimum required for the verification logic**. If a comparison can be done without disclosure (e.g., comparing against a sealed ledger value), it's done without disclosure.

### DIDz.io Disclosure Policy

Based on this analysis, DIDz.io should establish a formal disclosure policy:

**Always disclose** (required for circuit logic):
- Merkle proof paths (for `checkRoot()`)
- Credential fields being compared against allowlists
- Token colors and values (for coin operations)
- Boolean branching conditions

**Never disclose** (stay in the circuit):
- Holder names, addresses, personal identifiers
- Document numbers, serial numbers
- Exact dates of birth (disclose age range instead)
- Secret keys, nonces, blinding factors

**Selectively disclose** (per-use-case):
- Nationality, only when jurisdiction matters
- Professional license type, only when role-gating
- Entity type, only when business classification matters

---

## 8. The `ecMulGenerator` Workaround, Important Bug Context

### The Problem

Brick Towers comments in their code:
```compact
// We are exporting these signing primitives instead of the pure sign circuit
// due to broken ecMulGenerator in CompactRuntime
export { computeChallengeForCredential };
export { generateDeterministicK };
// export { sign };
```

The `sign` circuit works in Compact but fails in the CompactRuntime (TypeScript). This means:
- **Signing happens in TypeScript**, using the exported pure circuits as helpers
- **Verification works fine in-circuit**, `ecMulGenerator` works in the ZK prover
- The bug is specifically in the JavaScript runtime's `ecMulGenerator` implementation

### DIDz.io Impact

1. **Design around the bug**, credential signing should be TypeScript-side (like Brick Towers)
2. **Monitor the fix**, when CompactRuntime `ecMulGenerator` is fixed, signing can move fully on-chain
3. **Our credential service** should follow the same pattern: export `computeChallenge` and `generateDeterministicK` as pure circuits, call them from TypeScript

---

## 9. Witness Design Patterns

### Brick Towers' Witness Architecture

```typescript
export type RwaPrivateState = {
  readonly secretKey: Uint8Array;  // ONLY the secret key, nothing else
};

export const witnesses = {
  localSecretKey(context): [RwaPrivateState, Uint8Array] {
    return [context.privateState, context.privateState.secretKey];
  },

  findIssuerPath(context, pk): [RwaPrivateState, MerkleTreePath<Uint8Array>] {
    const path = context.ledger.issuerAuthorizations.findPathForLeaf(pk);
    if (!path) throw new Error(`Issuer not found`);
    return [context.privateState, path];
  },

  // Field reduction workaround
  reduceChallenge(context, challenge): [RwaPrivateState, bigint] {
    return [context.privateState, challenge % FIELD_MODULUS];
  },
};
```

### Key Design Decisions

1. **Minimal private state**, only the user's secret key. Everything else is derived or passed as parameters.
2. **Ledger queries in witnesses**, `context.ledger` provides read access to the on-chain state for Merkle path lookups.
3. **Workaround witnesses**, `reduceChallenge` does modular reduction that the circuit can't do natively. This is a pragmatic pattern for working around ZK circuit limitations.
4. **Every witness returns `[updatedState, value]`**, the private state is threaded through even if unchanged.

### DIDz.io Witness Architecture

Following this pattern:

```typescript
export type DIDzPrivateState = {
  readonly secretKey: Uint8Array;
  // NO credentials stored here, passed as circuit params
  // NO cached data, queried fresh from ledger
};

export const witnesses = {
  localSecretKey(context): [DIDzPrivateState, Uint8Array] {
    return [context.privateState, context.privateState.secretKey];
  },

  findIssuerPath(context, issuerPk): [DIDzPrivateState, MerkleTreePath<Uint8Array>] {
    const path = context.ledger.issuerTree.findPathForLeaf(issuerPk);
    if (!path) throw new Error(`Issuer not in trust registry`);
    return [context.privateState, path];
  },

  findHolderPath(context, holderPk): [DIDzPrivateState, MerkleTreePath<Uint8Array>] {
    const path = context.ledger.verifiedHolders.findPathForLeaf(holderPk);
    if (!path) throw new Error(`Holder not verified`);
    return [context.privateState, path];
  },

  reduceChallenge(context, challenge): [DIDzPrivateState, bigint] {
    const FIELD_MODULUS = 6554484396890773809930967563523245729705921265872317281365359162392183254199n;
    return [context.privateState, challenge % FIELD_MODULUS];
  },
};
```

---

## 10. Token Color Pattern, Cross-Contract Token Identity

### How Brick Towers Identifies Tokens

```compact
// In constructor:
tbtcCoinColor = tokenType(pad(32, "brick-towers:coin:tbtc"), tBTCaddress);

// For self-minted tokens:
circuit thfCoinColor(): Bytes<32> {
  return tokenType(pad(32, "brick-towers:coin:thf"), kernel.self());
}
```

**`tokenType(domainSeparator, contractAddress)`** = hash(domain + address). This creates a globally unique token identity tied to a specific contract.

### DIDz.io Application

If DIDz.io ever issues credential tokens or staking tokens:
```compact
// DIDz credential token, tied to this contract
const didzCredTokenColor = tokenType(pad(32, "didz:credential:token"), kernel.self());

// DIDz staking token, tied to a separate staking contract
export sealed ledger stakingTokenColor: Bytes<32>;
// Set in constructor: tokenType(pad(32, "didz:staking:token"), stakingContractAddress)
```

---

## 11. Testing Infrastructure

### Brick Towers' Simulator Pattern

```typescript
class MidnightRwaSimulator {
  contract: Contract<RwaPrivateState>;
  circuitContext: CircuitContext<RwaPrivateState>;

  // Switch user context (chainable)
  as(privateState: RwaPrivateState): this {
    this.circuitContext = { ...this.circuitContext, currentPrivateState: privateState };
    return this;
  }

  // Execute circuits
  onboardUser(quiz, coin, identity) {
    this.circuitContext = this.contract.impureCircuits.onboard(
      this.circuitContext, quiz, coin, identity
    ).context;
    return ledger(this.circuitContext.transactionContext.state);
  }
}
```

**Test coverage**:
- Happy path: full onboard + trade flow
- Insufficient balance rejection
- Tampered credential rejection
- Wrong country rejection
- Wrong quiz answers rejection

### DIDz.io Should Build

A `DIDzTrustRegistrySimulator`:
- `as(userState)`, switch between issuer, holder, verifier, admin
- `registerIssuer(pk, metadata)`, test issuer onboarding
- `verifyHolder(credentials)`, test compound verification
- `revokeCredential(id)`, test revocation
- `checkIssuerTrust(pk)`, test Merkle proof verification

Use `setNetworkId(NetworkId.Undeployed)` for purely local simulation, no testnet needed.

---

## 12. Action Items for DIDz.io

### Architecture Updates

- [ ] **Adopt sealed ledger** for root trust anchor, network ID, schema version
- [ ] **Implement hybrid HistoricMerkleTree + Map** for Trusted Issuer Registry
- [ ] **Port `crypto.compact`** as DIDz cryptographic foundation module
- [ ] **Design compound verification circuits** following onboard pattern
- [ ] **Define credential struct family** (Passport, Professional, Age, Business)
- [ ] **Establish formal disclosure policy** per the analysis above

### Implementation Tasks

- [ ] **Build `DIDzSignatureBridge` service**, P-256/RSA/Ed25519 → JubJub
- [ ] **Create `DIDzCredentialService`**, sign credentials using exported pure circuits
- [ ] **Build `DIDzTrustRegistrySimulator`** for local testing
- [ ] **Update `TRUSTED_ISSUER_AGENT_ARCHITECTURE.md`** with sealed ledger patterns
- [ ] **Add witness architecture** matching the minimal private state pattern

### Documentation Updates

- [ ] **Update `DIDZ_DID_FOUNDATION_ARCHITECTURE.md`** with HistoricMerkleTree migration plan
- [ ] **Update `KYCZ_BINDING_STACK.md`** with signature bridge details
- [ ] **Create `CRYPTO_MODULE_SPECIFICATION.md`** documenting the generic Schnorr library

---

## 13. Edda Labs / Brick Towers SDK Version Reference

For compatibility, Brick Towers targets the same Testnet_02 SDK versions we should target:

| Package | Version |
|---------|---------|
| `@midnight-ntwrk/compact-runtime` | 0.9.0 |
| `@midnight-ntwrk/ledger` | 4.0.0 |
| `@midnight-ntwrk/midnight-js-contracts` | 2.0.2 |
| `@midnight-ntwrk/wallet` | 5.0.0 |
| `@midnight-ntwrk/wallet-api` | 5.0.0 |
| `@midnight-ntwrk/dapp-connector-api` | 3.0.0 |
| `@midnight-ntwrk/zswap` | 4.0.0 |
| Language pragma | `0.18` (Minokawa) |

---

## 14. Resources

- **Edda Labs**: https://eddalabs.io | https://github.com/eddalabs | https://x.com/eddalabs_io
- **Brick Towers midnight-rwa**: https://github.com/BrickTowers/midnight-rwa
- **Midnight Compact lang ref**: https://docs.midnight.network/compact
- **Explicit disclosure docs**: https://docs.midnight.network/compact/reference/explicit-disclosure
- **ICAO 9303 MRZ spec**: https://www.icao.int/publications/pages/publication.aspx?docnum=9303

---

*Analysis by Cassie for the DIDz.io team, April 11, 2026*
*Source: Edda Labs video series by Erick, https://eddalabs.io*
