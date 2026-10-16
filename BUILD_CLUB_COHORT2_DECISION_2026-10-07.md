# Build Club Cohort 2 — Project Decision

**Date:** October 7, 2026
**Status:** Decision made — cohort project is **DIDz** (privacy-preserving credentials on Midnight)
**Participants:** John + David (bpx.ai); GameChanger Wallet (Adriano) invited to the 4DeFi lane

## Context

John and David were accepted into Midnight's Build Club cohort 2 — an 8-week
starter program. John initially presented all four flagship projects
(DIDzMonolith, 4Defi, SafeHealthData, CryptoSure) with a funding/support ask.
The program director (Tom | Midnight) responded bluntly: **pick one project,
keep updates concise, full commit.** ~30 teams per cohort; prior cohorts
produced zero built-and-scaled projects; the program wants baby steps that
actually finish.

## The decision

**DIDz is the cohort project**, scoped to one complete credential workflow:

> One issuer, one credential, one verifier — issue a membership/eligibility
> credential, let the holder prove it privately, reject revoked/expired
> credentials. Demonstrated end-to-end.

## Why DIDz (the decision record)

1. **Conviction is the 8-week fuel.** John's own assessment: "DIDzM is really
   what I want to build." A starter program rewards momentum over spreadsheet
   optimization.
2. **Highest technical maturity in the monolith.** didz-kernel is the only
   TestWired Midnight codebase — real ZK proofs on localnet, conformance suite,
   attestation circuits, pp-sb-vault. The hard part already works; the cohort
   risk is scope, not implementation.
3. **It compounds.** DIDz is not "one of four projects" — it is the foundation
   the other three consume. Cohort work on issuer/credential/verifier flow is
   literally the plumbing CryptoSure's contracts already import
   (`prove_score_at_least`, `TrustedIssuerRegistry`, holder-signed activation).
4. **Maximally on-theme.** In a privacy accelerator, DIDz is the project where
   privacy is not a feature — it is the product.

## Sequencing, not abandonment

The other three projects become DIDz's first customers, not casualties:

- **4Defi** — consumes the `DIDzIdentityPort` predicate surface
  (kyc_passed, age_gte, resident_in_set, sanctions_clear, assurance_gte)
- **CryptoSure** — needs issuer trust + holder binding for private
  score-band proofs and private claims
- **SafeHealthData** — consent/eligibility proofs are credential workflows

## The risk and its control

John's honest fear: "I might not be able to guide my AIs to make DIDz viable.
I could fall flat on my face." The fear is real but misdiagnosed — the ZK
plumbing already works; the failure mode is **promising the whole ecosystem**.
Scope discipline ("one issuer, one credential, one verifier") is the control.
DIDz can contribute without carrying the weight of Midnight's entire future.

## Open action items

- [ ] Find one reachable pilot org (even nominal — a community group) so the
      week-8 demo has a real customer story, not just a tech demo
- [ ] Reply to Tom: picked DIDz; deliverable = one issuer/credential/verifier
      flow, end-to-end demo; concise updates
- [ ] Keep ZKClutch/BubbleDex/auction research outside the cohort deliverable

## Related: does CryptoSure privacy require digital identity?

(Design note — this question drove the decision framing.)

**Short answer: no for the demo, yes for the product.**

CryptoSure's privacy core does not need a *general* identity system:

- **Predicate proofs over signed attestations** — `prove_score_at_least`
  returns a boolean against a signed score attestation; the chain learns the
  bit, not the person. A single hardcoded trusted issuer key is enough for a
  prototype — no DID registry required.
- **Witness-derived pseudonyms** — domain-separated `persistentHash(secret)`
  yields an unlinkable per-app key (the SilentLedger v2 / Noctis pattern).
  "Whoever knows this secret" is all the binding a demo needs.
- **Commitments + nullifiers** — policies as commitments, claims
  anti-double-spend via SCIFz-style nullifiers, no identity revealed.

Where identity still sneaks in (the honest boundary):

- **Issuer trust at scale** — one hardcoded issuer works for a demo; real
  underwriting needs revocation, multiple issuers, and trust that survives
  key rotation — that *is* a DID problem (`TrustedIssuerRegistry`).
- **Holder lifecycle** — a raw witness secret has no recovery, rotation, or
  revocation story. Losing the key means losing the policy. DIDz's kernel
  lifecycle (rotation, recovery, cascade revocation) is the difference between
  a private demo and a private product.
- **Regulatory edges** — insurance legally requires knowing the customer at
  issuance (KYC/sanctions). Privacy on Midnight keeps the *chain* blind while
  the regulated counterparty still verifies off-chain. DIDz provides exactly
  that edge: identity at the boundary, proofs through the middle.

**Why privacy is necessary at all in CryptoSure:** the product's raw material
is the most sensitive data class that exists — health, wealth, risk factors,
claims history. On a public chain, "this wallet holds a cancer-screening
policy" is a leak. Insurers need fraud verification; claimants need
confidentiality. Selective disclosure resolves that paradox: verify the
predicate, hide the person. Without privacy, on-chain insurance cannot exist
legally or ethically — which is why CryptoSure belongs in a privacy
accelerator only with a credential backbone. That backbone is the cohort
project.

## Sources

- Tom | Midnight (Build Club director), cohort guidance, Oct 7 2026 — "one
  project, keep it concise, build and scale"
- Clara's analysis, Oct 7 2026 — provisional 4Defi → final DIDz with the
  one-issuer/one-credential/one-verifier scoping
- Penny's deep dive, Oct 7 2026 — repo maturity evidence (didz-kernel
  TestWired localnet; CryptoSure 4 compiled contracts on compactc 0.31.x)
