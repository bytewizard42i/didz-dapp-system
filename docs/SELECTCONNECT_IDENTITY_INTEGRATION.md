# DIDz.io × SelectConnect, Identity-Powered Contact Sharing

*How DIDz.io's decentralized identity foundation transforms SelectConnect from a standalone contact sharing protocol into a universal privacy-preserving connection layer for the entire ecosystem.*

**Cross-pollination**: [DIDz.io](https://github.com/bytewizard42i/didz-dapp-system) ↔ [SelectConnect](https://github.com/bytewizard42i/selectConnect_app_pro)

---

## Why DIDz + SelectConnect Is a Force Multiplier

**DIDz.io** provides the *identity layer*, who you are, what you can prove about yourself, and who verified you.

**SelectConnect** provides the *connection layer*, how you share that identity with others, under what conditions, with what protections.

Separately, each is useful. Together, they create something neither can do alone: **privacy-preserving, economically-accountable, credential-verified contact sharing.**

---

## The Integration Model

### Current SelectConnect (Standalone)

```
User → Creates card → Sets bond requirement → Shares QR/link
Recipient → Posts bond → Progressive reveal → Gets contact info
```

**Limitation**: The card creator's identity is self-asserted. Anyone can claim to be "Sarah Chen, Software Engineer at Google." There's no verification layer.

### DIDz-Powered SelectConnect

```
User → DIDz verifies credentials → SelectConnect card auto-populates verified fields
Recipient → Posts bond → Progressive reveal includes ZK-VERIFIED credentials
                                                    ↑
                                          DIDz.io proves this is real
```

**Now the recipient knows**: The person they're connecting with has cryptographically verified credentials, not just a claim, but a ZK proof.

---

## Integration Architecture

### DIDz Credential Wallet → SelectConnect Card

A SelectConnect card becomes a **projection** of the DIDz wallet. The card creator selects which DIDz credentials to attach to each reveal level:

```
DIDz Wallet                          SelectConnect Card
┌────────────────────┐               ┌─────────────────────────────┐
│ 📁 Government IDs  │               │ Level 1 (Free):             │
│   📄 Driver's Lic. │──────────────→│   ✓ "Over 18" (ZK proof)   │
│   📄 Passport      │               │   ✓ First name only         │
│                    │               │                             │
│ 📁 Education       │               │ Level 2 (Bond: 3 ADA):     │
│   📄 PhD - MIT     │──────────────→│   ✓ "Has PhD" (ZK proof)   │
│   📄 Prof. Cert    │               │   ✓ LinkedIn handle         │
│                    │               │                             │
│ 📁 Employment      │               │ Level 3 (Bond: 5 ADA):     │
│   📄 Current Job   │──────────────→│   ✓ "Works at [Company]"   │
│                    │               │   ✓ Email address           │
│ 📁 Financial       │               │                             │
│   📄 Credit Score  │               │ Level 4 (Bond: 10 ADA):    │
│                    │──────────────→│   ✓ Phone number            │
│                    │               │   ✓ Full professional card  │
└────────────────────┘               └─────────────────────────────┘
```

**The recipient sees verified badges at each level**, not just raw text, but ZK-proven assertions from the DIDz Trust Triangle (Holder → Trusted Issuer → Verifier).

### Contract-Level Integration

SelectConnect's `createCard` circuit extends to accept DIDz credential commitments:

```
// Proposed extension to SelectConnectProtocol.compact

export circuit createVerifiedCard(
    aliasHash: Bytes<32>,
    requiresBond: Bool,
    minBondAmount: Uint<64>,
    defaultTTL: Uint<64>,
    phoneCommit: Bytes<32>,
    emailCommit: Bytes<32>,
    didzCredentialCommit: Bytes<32>    // NEW: commitment to DIDz credential bundle
): Bytes<32>
```

And `accessNextLevel` verifies that credential proofs match the DIDz anchor:

```
// At each reveal level, verify the credential is still valid
export circuit accessVerifiedLevel(
    linkId: Bytes<32>,
    currentTime: Uint<64>,
    levelData: Bytes<32>,
    didzProof: Bytes<32>              // NEW: ZK proof from DIDz.io
): Bytes<32>
```

---

## What DIDz Provides to SelectConnect

| DIDz Feature | SelectConnect Enhancement |
|-------------|--------------------------|
| **ZKQueries** (age, KYC, residency) | Verified badges on card, "Over 21 ✓", "KYC Passed ✓" |
| **Rescindable credentials** | If a credential is revoked, the card level auto-invalidates |
| **Trusted Issuer attestations** | Recipients know credentials were verified by real institutions |
| **Hierarchical wallet** | Card creator picks which folders/credentials to project into each level |
| **Composite proofs** | Prove multiple facts at once: "Over 21 AND US resident AND not sanctioned" |
| **Biometric binding (KYCz)** | Prove the card creator is a real human, not a bot or catfish |

## What SelectConnect Provides to DIDz

| SelectConnect Feature | DIDz Enhancement |
|----------------------|-----------------|
| **Progressive reveal** | DIDz credentials shared incrementally, not all-or-nothing |
| **Abuse bonds** | Economic cost to request someone's credentials, prevents mass harvesting |
| **Revocable access links** | Card creator can cut off a verifier's access to their DIDz credentials |
| **Pseudonymous tracking** | Track repeat credential requesters without revealing their identity |
| **Time-limited access** | Credentials shared for a conference expire when the event ends |
| **Privacy routing** | 5-digit codes for anonymous credential verification |
| **Safety pool** | Slashed bonds fund identity protection measures |

---

## Use Cases

### 1. Conference Networking (ProMingle Integration)

A professional at a tech conference creates a DIDz-powered SelectConnect card:

- **Level 1 (free)**: First name + "Software Engineer ✓" (DIDz-verified employment)
- **Level 2 (3 ADA bond)**: LinkedIn + "Has CS degree ✓" (DIDz-verified education)
- **Level 3 (5 ADA bond)**: Email + "Works at [FAANG] ✓" (DIDz-verified employer)
- **Level 4 (10 ADA bond)**: Phone + full verified professional profile

The recipient sees **cryptographic verification badges**, not just claims. And the bond ensures only serious contacts invest in reaching higher levels.

### 2. Dating (SouLink Integration)

A user on SouLink creates a DIDz-powered card for dating:

- **Level 1 (free)**: First name + "Over 21 ✓" + "KYC Passed ✓" (real human verified)
- **Level 2 (5 ADA bond)**: Interests + "Background Check Clear ✓"
- **Level 3 (10 ADA bond)**: Photo + "Residency: [City] ✓" (DIDz-verified)
- **Level 4 (15 ADA bond)**: Phone + Instagram

**The critical safety feature**: The recipient knows the person is a verified human (biometric liveness via KYCz), is who they say they are (DIDz identity), and hasn't been flagged for harassment (SelectConnect reputation). This is lightyears ahead of current dating apps.

### 3. Business Verification

A B2B sales professional proves their credentials without handing over business cards to everyone:

- **Level 1**: Company affiliation ✓ (DIDz-verified employer)
- **Level 2**: Role/title ✓ + NDA commitment
- **Level 3**: Direct contact + "Authorized signatory ✓" (DIDz-verified)

### 4. Healthcare Provider Contact (safeHealthData Integration)

A doctor shares their credentials with a new patient:

- **Level 1**: "Licensed MD ✓" (DIDz-verified medical license)
- **Level 2**: Specialty + hospital affiliation ✓
- **Level 3**: Direct contact for follow-up

Patient knows the doctor is real and currently licensed, not just someone who claims to be.

---

## Reputation Portability

With DIDz as the identity anchor, a person's SelectConnect reputation becomes **portable across all platforms**:

```
DIDz Identity (persistent)
├── SelectConnect reputation at conferences (ProMingle context)
├── SelectConnect reputation on dating (SouLink context)
├── SelectConnect reputation for business (Enterprise context)
└── SelectConnect reputation for healthcare (safeHealthData context)

Cross-context privacy preserved:
• Conference reputation ≠ visible on dating
• Dating reputation ≠ visible at work
• But DIDz can prove: "This person has a clean record across ALL contexts"
  (ZK proof, no details revealed, just the aggregate assertion)
```

---

## Proposed Shared Circuit Library

These circuits could live in a shared DIDz × SelectConnect library:

```
Shared Identity-Contact Circuits
├── verifyCredentialForLevel()    , Check DIDz credential is valid for this reveal level
├── bindCardToDID()               , Cryptographically link a SelectConnect card to a DIDz identity
├── proveCleanReputation()        , ZK proof of clean SelectConnect reputation across contexts
├── revokeCardOnCredentialRevoke(), Auto-invalidate card when DIDz credential is rescinded
├── portableReputationProof()     , Prove aggregate reputation without revealing per-context details
└── biometricCardBinding()        , Bind card to KYCz biometric liveness (anti-catfish)
```

---

## Related Documents

- SelectConnect Contract: `DIDzMonolith/selectConnect/contracts/SelectConnectProtocol.compact`
- DIDz Synopsis: `DIDzMonolith/DIDz-io/docs/DIDZ_SYNOPSIS.md`
- KYCz Binding Stack: `DIDzMonolith/DIDz-io/docs/KYCZ_BINDING_STACK.md`
- ProMingle Integration: `DIDzMonolith/ProMingle/docs/SELECTCONNECT_INTEGRATION.md`
- SouLink Integration: `DIDzMonolith/SouLink/docs/SELECTCONNECT_INTEGRATION.md`

---

*Last updated: March 22, 2026*
*Cross-pollination by: Penny 🎀*
