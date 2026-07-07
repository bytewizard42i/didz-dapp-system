# 🧠 KYCz Deep Dive Reference, Dual Binding Model & Assertion Schema

**Date**: February 20, 2026  
**Contributors**: Alice 🌟 (The Architect) + Penny 🎀 + John  
**Full Docs**: [KYCz Repo](https://github.com/bytewizard42i/KYCz_us_app/tree/main/docs)

---

## What's New

Alice contributed a major architecture upgrade to KYCz, the **dual binding model** that combines biometric AND cryptographic binding.

### The Two Bindings

| Binding | Proves | When Used |
|---------|--------|-----------|
| **Biometric** (human ↔ proof) | Same face/body as original KYC subject | Enrollment + re-checks + step-up |
| **Cryptographic** (device ↔ proof) | Controller of this key = KYC subject | Day-to-day transactions |

**Best practice**: Biometrics bootstrap + re-check. Keys transact day-to-day.

### Private Identity Anchor

KYCz creates a **Private Identity Anchor** in Midnight private state:
- KYC attributes + biometric commitment + device key commitment
- Issuer attestation + assurance level + revocation handle
- Never leaves private state, only ZK assertions emerge

### 3-Step Protocol
1. **Enrollment**, Scan doc + liveness + face match + generate device key → create anchor
2. **Issuance**, Private-state claims, no public VCs that can be correlated
3. **Presentation**, Verifier nonce + ZK proof of attribute + ZK proof of binding

### Presentation Binding Options
- **Key-based**, Fast, scalable. Sign nonce with device key.
- **Biometric live**, Highest assurance. On-demand liveness check.
- **Dual** ⭐, Both. Crushes stolen phone + key resale.

### Anti-Correlation
- Pairwise keys: `pk_v = HKDF(master_key, verifier_domain)`
- Each verifier sees a unique key → no cross-site tracking
- Proofs are nonce-bound and session-bound

### Assurance Levels
| Level | Enrollment | Presentation | Use Cases |
|-------|-----------|-------------|----------|
| **KYCz-A** | NFC passport/strong doc | Dual binding | Financial, regulated |
| **KYCz-B** | DL barcode + liveness | Key + step-up liveness | Most apps, social |
| **KYCz-C** | Basic doc + selfie | Key binding | Low-risk, age-gating |

### How This Connects to DIDz

The DIDz Trust Triangle depends on verified identity. KYCz provides:
- **Trusted issuers** → DMV (DL barcode), passport authority (NFC), banks (Plaid)
- **Binding** → Face match + device key
- **Progressive disclosure** → Midnight private state + selective ZK assertions
- **Anti-sybil** → Private duplicate detection

---

### Full Architecture Docs
- [🧠 Binding Model Deep Dive](https://github.com/bytewizard42i/KYCz_us_app/blob/main/docs/KYCZ_BINDING_MODEL_DEEP_DIVE.md), Threat model, flow diagrams, revocation
- [📋 Assertion Schema](https://github.com/bytewizard42i/KYCz_us_app/blob/main/docs/KYCZ_ASSERTION_SCHEMA.md), Predicate catalog, verifier integration
- [🔗 Binding Stack](https://github.com/bytewizard42i/KYCz_us_app/blob/main/docs/KYCZ_BINDING_STACK.md), 6-layer overview
- [🫀 Biometric Verification](https://github.com/bytewizard42i/KYCz_us_app/blob/main/docs/KYCZ_BIOMETRIC_VERIFICATION.md), 8-factor liveness

*Alice 🌟 + Penny 🎀 + John (bytewizard42i)*
