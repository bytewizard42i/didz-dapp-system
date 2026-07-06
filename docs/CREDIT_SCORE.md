# DIDz Credit Score (source of truth)

**Date**: July 6, 2026
**Status**: Design (contract additions validate via Midnight MCP before coding)
**Canonical cross-repo spec**: `CryptoSure-me-app/docs/DIDZ_CREDIT_SCORE.md`

DIDz is the **source of truth** for the ecosystem-wide **credit score** — a
privacy-preserving reputation signal that other products (CryptoSure, AgenticDID, RWAz)
consume in zero knowledge. This formalizes the existing **Trust Score** oracle pattern
(`docs/ORACLE_AND_API_INTEGRATION.md` §4) into a reusable, attested score.

---

## 1. Model (privacy-first, DIDzM §0)

- Score is computed **off-chain** by a registered scoring oracle from ecosystem signals.
- Only a **commitment** lands on-chain, as a DIDz attestation. The raw score never appears.
- Consumers prove **bands / thresholds** in ZK ("score ≥ X"), learning one boolean.
- Scale proposal: **0–1000**; band cutoffs tuned during the CryptoSure demo.

## 2. On-chain additions (design)

1. **Attestation type**: `hash("DIDZ-CREDIT-SCORE")` for `DIDzRegistry.attest_to_did`.
2. **Scoring oracle as a Trusted Issuer**: registered in `TrustedIssuerRegistry` with
   `primaryDomain = hash("CREDIT-SCORE")` and a high `AssuranceLevel`
   (REGULATED_ENTITY / SYSTEM_CRITICAL). Prevents self-issued scores.
3. **Score commitment**:
   `scoreCommitment = persistentHash([pad(32,"didz:score:v1"), score, issuedAt, oracleId])`.
4. **Shared band-proof circuit** (lives here so every consumer reuses it, no duplication):

```compact
export circuit prove_score_at_least(
  did_id: Bytes<32>,
  threshold: Uint<16>,
  score: Uint<16>,        // witness-opened (private)
  issued_at: Uint<64>,
  oracle_id: Bytes<32>,
  salt: Bytes<32>
): [] {
  // 1. re-derive scoreCommitment and assert it matches the stored attestation
  // 2. assert oracle_id is an APPROVED CREDIT-SCORE issuer (TrustedIssuerRegistry)
  // 3. assert freshness: issued_at within verifier window (POL-style)
  // 4. disclose only the threshold boolean:
  assert(disclose(score >= threshold), "Below threshold");
}
```

## 3. Signals the oracle may weight (all off-chain, privacy-preserving)

- Account age & POL liveness/freshness.
- Attestation quality (count/assurance of APPROVED issuers vouching).
- Settlement/repayment conduct across ecosystem apps (CareToCoin reclaims, SplitNight IOU
  settlement, superSwap conduct).
- Absence from denylists (CareToCoin OFAC-style screening).
- CryptoSure-EDU certifications held (behavioral hygiene).
- RWAz asset-stewardship history (no fraud flags).

## 4. Consumers

| Consumer | Uses score for |
|----------|----------------|
| **CryptoSure** | Premium multiplier band + maximum coverage tier cap. |
| **AgenticDID** | Score-scaled delegated spend caps (`docs/CREDIT_SCORE_AND_INSURANCE.md`). |
| **RWAz** | Insurable cap = f(owner score band, asset appraised-value band). |

## 5. Anti-gaming

Registered high-assurance oracle only; freshness windows defeat stale-score replay; bands
(not raw values) limit grinding/leakage; denylist screening hard-blocks sanctioned wallets.

## 6. Freshness

`issuedAt` is committed and checked in ZK against a verifier-side window (mirrors DIDz POL
freshness). A stale score is rejected — conduct declines eventually lower coverage/raise
premiums when re-scored.
