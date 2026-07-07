# Fi Standards Applied to DIDz.io

**Purpose**: Bridge the authoritative **Fi Standards** (established in AgenticDID) to DIDz.io's concrete implementation. Every DIDz.io contract, DApp, and integration MUST follow these standards.
**Canonical source**: [`bytewizard42i/AgenticDID_io_me_MAIN/docs-nerds-only/Fi _Standards-AKA-FIST/FI_STANDARDS_FOR_DIDS_TIS_AND_RAS.md`](https://github.com/bytewizard42i/AgenticDID_io_me_MAIN/blob/main/docs-nerds-only/Fi%20_Standards-AKA-FIST/FI_STANDARDS_FOR_DIDS_TIS_AND_RAS.md)
**Last updated**: Apr 17, 2026 by Penny 🎀

> *"One day there will just be 'Fi'."*, Charles Hoskinson. Fi Standards are the rails to get there.

---

## Executive Summary

Fi Standards are **protocol law** for John's identity ecosystem. They govern how DIDs are named, how Trusted Issuers are classified, how agents are scoped, and the build order that makes the system trustworthy. AgenticDID defined them first; DIDz.io applies them across the broader identity universe (humans, orgs, animals, devices, objects).

**Good news**: DIDz.io's existing contracts (`DIDzRegistry.compact` + `TrustedIssuerRegistry.compact`) already implement most of Fi Standards correctly. This doc is the reconciliation + the small list of things still to migrate.

---

## 1. DID Namespace Split, Not a Conflict, a Division of Labor

Fi Standards specify the DID format `did:agentic:<issuer_id>`. DIDz.io uses `did:midnight:<type>:<hash>`. **Both coexist** because they serve different scopes:

| Namespace | Who issues | Scope | Who resolves |
|-----------|------------|-------|--------------|
| `did:agentic:<name>` | AgenticDID protocol (`trusted_issuer_0`, `agent_0`, `comet`) | Internal agent registry (system agents, issuer agents, task agents) | AgenticDID DApp |
| `did:midnight:human:<hash>` | DIDz.io `DIDzRegistry` | Human identity | DIDz.io DApp |
| `did:midnight:agent:<hash>` | DIDz.io (mirror of `did:agentic:` entries, one-way) | External references to AgenticDID agents from non-agent DApps | DIDz.io DApp |
| `did:midnight:org:<hash>` | DIDz.io | Organization identity (corporations, institutions, governments) | DIDz.io DApp |
| `did:midnight:animal:<hash>` | DIDz.io | Pets (petProData) + horses (equineProData) | DIDz.io DApp + petProData/equineProData |
| `did:midnight:device:<hash>` | DIDz.io | IoT devices, hardware wallets | DIDz.io DApp |
| `did:midnight:object:<hash>` | DIDz.io | Supply-chain objects, RWA assets | DIDz.io DApp |

**The rule**: `did:agentic:` is the **protocol-internal** identifier for AgenticDID. `did:midnight:` is the **ecosystem-wide** identifier for everything else. When an AgenticDID agent needs to appear in a non-AgenticDID DApp, DIDz.io mirrors it as `did:midnight:agent:<hash>`, a one-way reference so external DApps don't need to understand AgenticDID internals.

### Format conventions (apply to both namespaces)

- Snake_case only (`trusted_issuer_0`, not `TrustedIssuer0` or `trusted-issuer-0`)
- No spaces, no special characters except underscore
- Globally unique, immutable after issuance
- The `did:midnight:<type>:<hash>` hash is a `persistentHash<T>` of the canonical ID inputs (already implemented in `DIDzRegistry.compact`)

### Reserved ranges (Fi Standards, PROTECT THESE)

| Range | Purpose |
|-------|---------|
| `agent_0` through `agent_100` | System agents (protocol-controlled) |
| `canonical_agent_101` | **Comet**, reference `LOCAL_AGENT` implementation (ACTIVE) |
| `trusted_issuer_0` | **AgenticDID Foundation**, canonical `TRUSTED_ISSUER` (ACTIVE) |

Don't issue anything in these ranges unless you are the AgenticDID Foundation.

---

## 2. Three-Axis Issuer Model, Already In Our Contract ✅

Fi Standards require every Trusted Issuer to be characterized by three independent dimensions. **`TrustedIssuerRegistry.compact` already implements this**, check these lines:

| Axis | Fi Standard | `TrustedIssuerRegistry.compact` |
|------|-------------|-------------------------------|
| **Axis 1**, Legal Form | `IssuerType` enum (SELF_SOVEREIGN, CORPORATION, GOVERNMENT_ENTITY, INSTITUTION) | ✅ `export enum IssuerType { … }` at line 68 |
| **Axis 2**, Sector | `IssuerDomain[]` array (multiple allowed) | ⚠️ Currently modeled as single domain; **TODO: migrate to array-per-issuer** |
| **Axis 3**, Trust Strength | `AssuranceLevel` (UNVERIFIED, BASIC_KYC, REGULATED_ENTITY, SYSTEM_CRITICAL) | ✅ `export enum AssuranceLevel { … }` at line 79 |

### Phase 2 contract update (post-MVP)

The one Fi Standards gap in our current contract: an issuer can operate in **multiple domains** (Stanford = `[EDUCATION, RESEARCH, MEDICAL]`, Blue Cross = `[FINANCIAL, MEDICAL]`). Our v1 contract stores a single domain. Phase 2 should migrate to a `Set<Uint<8>>` or `Vector<N, Uint<8>>` per issuer.

Until that migration: **register multi-domain issuers once per domain** as a short-term workaround, OR use the domain they operate in MOST heavily and document secondary domains off-chain.

---

## 3. EntityType vs IssuerType, Different Models, Same Pattern

Don't confuse the two enums:

| Enum | Scope | Who it describes |
|------|-------|------------------|
| `EntityType` (in `DIDzRegistry.compact`) | 7 categories of **DID subjects** (HUMAN, AGENT, ANIMAL, ORGANIZATION, DEVICE, OBJECT, LOCATION) | What KIND of thing a DID represents |
| `IssuerType` (in `TrustedIssuerRegistry.compact`, Axis 1) | 4 categories of **Trusted Issuer legal forms** (SELF_SOVEREIGN, CORPORATION, GOVERNMENT_ENTITY, INSTITUTION) | What KIND of entity is doing the issuing |

A single issuer can issue credentials to DIDs of many EntityTypes. Stanford (IssuerType=INSTITUTION) issues credentials to human alumni (EntityType=HUMAN) and campus devices (EntityType=DEVICE).

---

## 4. Credential Type Naming, Fi Standards Format

All credential types MUST follow:
- `SCREAMING_SNAKE_CASE`
- Descriptive (no abbreviations)
- Clear semantic meaning

Examples for DIDz.io consumer products:

```
✅ KYC_TIER_1              (KYCz, basic email + phone verification)
✅ KYC_TIER_2              (KYCz, DL barcode + face match)
✅ KYC_TIER_3              (KYCz, biometric + KBA + Plaid)

✅ VAX_RABIES_2026         (petProData, rabies vaccine attestation)
✅ VAX_DHPP_2026           (petProData, DHPP combo)
✅ COGGINS_TEST_2026       (equineProData, Coggins test for EIA)

✅ MEDICAL_RECORD          (DIDz.io, general clinical record)
✅ INSURANCE_COVERAGE      (DIDz.io, insurance policy attestation)
✅ EMPLOYMENT_VERIFIED     (DIDz.io, current employment)
✅ ACCREDITED_INVESTOR     (KYCz/equineProData, US Reg D 506(c) status)

❌ KYC1                    (too abbreviated)
❌ vaxRabies2026           (wrong case)
❌ med_record              (not ALL_CAPS)
```

Every Trusted Issuer MUST specify both `allowedCredentialTypes[]` AND `forbiddenCredentialTypes[]` at registration. The registry enforces this on `attestToDid` calls.

---

## 5. The Canonical Flow (TD Bank Philosophy Applied to DIDz.io)

Fi Standards mandate **"one perfect, then replicate"**. For DIDz.io:

```
Build Phase 1 (current):
  trusted_issuer_0   ──────────►  AgenticDID Foundation (canonical issuer)  [ACTIVE via AgenticDID]
                                         │
                                         ▼
  DIDz.io TrustedIssuerRegistry  ◄──── register didz_foundation_0  (DIDz.io dogfood issuer)
                                         │
                                         ▼
  First registered DID           ────►   John's human DID (did:midnight:human:<hash>)
                                         │
                                         ▼
  First attestation              ────►   KYC_TIER_2 from DMV-as-trusted-issuer
                                         │
                                         ▼
  First verification             ────►   Wine shop verifies age >= 21 without seeing DOB
```

**Don't activate ANY second issuer** until this Phase 1 loop works end-to-end on testnet, has docs, has E2E tests. After Phase 1 → replicate the pattern for Bank, DMV, Hospital, etc.

### Canonical flow checklist (Fi Standards, adapted for DIDz.io)

Before marking a DIDz.io issuer ACTIVE:
- [ ] Three-axis config complete (`issuerType`, `domains[]`, `assuranceLevel`)
- [ ] `allowedCredentialTypes[]` AND `forbiddenCredentialTypes[]` specified
- [ ] Corresponding DApp portal exists (or explicit note that issuer is CLI-only)
- [ ] First test credential successfully issued on TestNet
- [ ] First test verification succeeds against the credential
- [ ] Docs updated in `DIDz-io/docs/issuers/<issuer_id>.md`
- [ ] End-to-end test scripted (CLI or UI walkthrough)

---

## 6. Migration Items, What's NOT Yet Fi-Compliant

Current DIDz.io contracts are ~85% Fi-compliant. Remaining gaps:

| Item | Current | Fi Standards | Priority |
|------|---------|--------------|----------|
| `IssuerDomain[]` array support | Single domain per issuer | Multi-domain array | Phase 2 contract revision |
| `HistoricMerkleTree` for issuer registry | `Map<Bytes<32>, IssuerRecord>` | `HistoricMerkleTree<32, Bytes<32>>` per Brick Towers + Fi | Phase 3 (scale) |
| `SignedCredential<T>` generic verify | Ad-hoc per credential | Generic `verify<T>(cred, challenge)` circuit | Phase 3 (crypto unification) |
| Sealed ledger trust anchors | `sealed ledger deployerKey` only | + `systemIssuerPublicKey`, `networkIdentifier`, `minAssuranceLevel` | Phase 2 |
| Compound onboarding proof | Register + attest separately | Single circuit (identity + quiz + stake in one TX) | Phase 2 |
| TI-/RA- file naming | Not enforced yet | Required for all DApp service files | Starting with DIDz.io DApp scaffold |

These aren't blockers for MVP, they're Phase 2/3 refactors. The existing contracts ship correctly shaped data; the upgrades improve scale + cryptographic unification.

---

## 7. Hierarchical Privacy Wallet, The UI Implication

From PP_DIDZ_VISION_MANIFESTO.md: the DIDz.io UI should present credentials in a **folderized "Google Docs" model**:

```
My DIDz Wallet
├── 📁 Identity
│   ├── 📄 KYC_TIER_2 (DMV)          [rescindable]
│   └── 📄 CITIZENSHIP (US Gov)       [immutable]
├── 📁 Education
│   ├── 📄 PHD_MOLECULAR_BIO (Stanford) [immutable]
│   └── 📄 PROFESSIONAL_LICENSE_MD      [rescindable]
├── 📁 Financial
│   ├── 📄 ACCREDITED_INVESTOR          [rescindable]
│   └── 📄 BANK_ACCOUNT_VERIFIED        [rescindable]
├── 📁 Health
│   ├── 📄 VAX_COVID_2026               [immutable]
│   └── 📄 BLOOD_TYPE                   [immutable]
├── 📁 Pets
│   └── 🐾 RAXIS, petProData DID
└── 📁 Horses
    └── 🐎 SECRETARIAT, equineProData DID
```

**Rescindable** (can be revoked by issuer) vs **immutable** (permanent achievements) is shown visually, an icon or color distinction. This UX pattern is mandated by PP_DIDZ vision and should be baked into `didz-ui/` from day one.

---

## 8. Related Documentation

| Doc | Where | Purpose |
|-----|-------|---------|
| **Fi Standards (authoritative)** | `bytewizard42i/AgenticDID_io_me_MAIN/docs-nerds-only/Fi _Standards-AKA-FIST/` | Source of truth for DID + TI + RA rules |
| **PP DIDz Vision Manifesto** | `AgenticDID/PP_DIDZ_VISION_MANIFESTO.md` | The "why", trust triangle + adoption strategy |
| **KYCz Binding Stack** | `DIDz-io/docs/KYCZ_BINDING_STACK.md` | 6-layer human-to-KYC binding recipe |
| **DIDz DID Foundation Architecture** | `DIDz-io/docs/DIDZ_DID_FOUNDATION_ARCHITECTURE.md` | W3C DID Core + VC alignment |
| **Trusted Issuer / Agent Architecture** | `DIDz-io/docs/TRUSTED_ISSUER_AGENT_ARCHITECTURE.md` | Architectural detail on the TI/RA layer |
| **Edda Labs RWA Patterns for DIDz** | `DIDz-io/docs/EDDALABS_RWA_PATTERNS_FOR_DIDZ.md` | Line-by-line study of Brick Towers' ZK identity impl |
| **AgenticDID Edda Labs Patterns** | `AgenticDID/agentic-did/docs/PP_DID_AND_COMPLIANCE_EddaLabs_Patterns.md` | Same analysis, agent-focused |

---

## 9. How To Use This Doc

**If you're a sister / developer starting work on DIDz.io**:
1. Read this doc first (you're here ✅)
2. Read the authoritative Fi Standards (~12 pages) at the link above
3. Glance through `DIDZ_DID_FOUNDATION_ARCHITECTURE.md` for W3C alignment
4. Check `DIDzRegistry.compact` + `TrustedIssuerRegistry.compact` to see what's already implemented
5. When in doubt about DID format, credential naming, or issuer classification → Fi Standards wins

**If you're reviewing a PR**:
- New DID in a non-canonical format (not `did:midnight:<type>:<hash>`) → reject
- New Trusted Issuer without three-axis config → reject
- New credential type not in `SCREAMING_SNAKE_CASE` → reject
- New issuer activated without Phase 1 dogfood proof → reject

---

*Fi Standards are protocol law. Follow them rigorously.* 🏛️

*Compiled by Penny 🎀 for DIDzMonolith on Apr 17, 2026, reconciling AgenticDID Fi Standards with DIDz.io contracts shipped the same day.*
