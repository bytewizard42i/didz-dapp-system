# What Midnight Passport Does Cleverly, and What DIDz Should Steal

**Date**: Jul 5, 2026 · **Reviewed by**: Penny 🎀
**Source**: `midnight-Passport-johns_copy` (docs/adrs, docs/plans/components,
experiments, machine-investigation reference docs)

Passport is IOG ARC's account/identity layer research. It overlaps our
three-pillar architecture heavily (they have a scoped-grant primitive, an
attestation layer, recovery flows). Below: what they do that we don't,
ranked by how much it benefits DIDz.

---

## 1. Contract upgradability is REAL, and it changes our deploy story ⭐⭐⭐

Their `experiments/contract-upgradability-feasibility/FINDINGS.md` is an
**executed experiment with on-chain tx hashes** (devnet, node 0.22.5,
compact 0.5.1, our toolchain):

- **U6 PASS**: a circuit's verifier key can be REPLACED at the same contract
  address (logic upgrade in place) via the **Contract Maintenance Authority**.
- **U7 PASS**: a **brand-new circuit slot can be added post-deploy**. The
  circuit set is extensible.
- **Hard limit 1**: the **ledger state schema is frozen at deploy time**.
  You can upgrade logic forever; you can never add a ledger map.
- **Hard limit 2 (scary one)**: if the maintenance-authority signing key is
  lost, the contract's circuit set is **permanently frozen**. The SDK
  auto-rotates the local key on `replaceAuthority`, export it or lose it.

**What DIDz should do:**
- DIDzRegistry mints PERMANENT identities, an un-upgradeable registry would
  be a disaster in year 3. This experiment says we're fine on logic, but the
  **ledger schema must be designed generously BEFORE mainnet deploy** (e.g.
  consider reserving a few generic `Map<Bytes<32>, Bytes<32>>` extension maps ,
  the custom-properties ruling pattern, applied to the ledger itself).
- Deployment runbook MUST include `exportSigningKeys` for the maintenance
  authority + custody plan (this is a real key-loss single-point-of-failure).
- We can ship selective-proof circuits incrementally (e.g. the Merkle
  accumulator proof below) WITHOUT redeploying or migrating identities.

## 2. Attestation Merkle trees, the exact shape of our missing anonymous proof ⭐⭐⭐

Their credential substrate (C18 + developer-guide §8):

```
leaf = persistentHash([domain_separator, user_secret_key])   // per credential type
root = on-chain ledger field                                  // one per tree
proof = user holds sibling path locally, proves membership in-circuit
```

- One circuit proves membership in MULTIPLE trees at once (age + residency
  in one proof).
- The verifier sees: a nullifier + pass/fail. Never which leaf.

**What DIDz should do:** this is precisely the **Merkle accumulator** we
flagged as the "honest limit" of pairwise DIDs (`prove_pairwise_binding`
reveals the canonical; an anonymous "I am SOME active DIDz" proof needs
this). Their pattern confirms it's buildable today with stdlib
`MerkleTree` + sibling-path witnesses. Design note: our tree leaves would be
`H(domain, did_id, owner_key_commitment)` with re-insertion on key rotation.

## 3. Per-context nullifiers (C21 alternative A) ⭐⭐

```
nullifier = persistentHash([nullf_domain, secret_key, verifier_id])
```

Including the VERIFIER's id in the nullifier means the same credential used
at two verifiers produces unlinkable nullifiers, replay-safe per verifier,
no cross-verifier correlation.

**What DIDz should do:** adopt per-context nullifiers in `pol_credential`
(prove-liveness-to-verifier-X) and `realVote` (per-election nullifiers ,
we already do per-proposal; formalize it) and any future one-per-person
flows. It composes perfectly with pairwise DIDs: same anti-collusion
philosophy, applied to proofs.

## 4. The domain-separation registry (ADR 0001 + their MPS) ⭐⭐

Their inventory found even Midnight CORE has ~25 domain tags in 3
inconsistent schemes (`midnight:`, `mdn:`, `ni`), spec/code/diagram
disagreements, and at least two UNTAGGED hash sites. Their fix: a central
markdown registry of every domain tag, audited, before any compile-time
enforcement.

**What DIDz should do:** we already tag well (`midnight:mm:pk:`,
`didz:profile:v2`, `didz:attest:v2`, `didz:pairwise:v1`,
`selectconnect:level:v2`, ...) but have NO registry, same failure mode at
smaller scale. Cheap win: `midnight-modules/DOMAIN_TAGS.md` listing every
tag across midnight-modules + DIDz-io + RWAz + selectConnect, with the rule
"new tag = new registry row, PR-reviewed". Also adopt their versioning
habit (`:v2` suffixes, we already do this) and their warning that tags are
FROZEN once hashes are on-chain.

## 5. Recovery: credentials survive because leaves derive from the seed ⭐⭐

Their DeRec flow (3-of-5 Shamir over the seed, ML-KEM-encrypted shares to
helpers, daily challenge-response liveness, 90-day reshares) ends with a
subtle win: attestation leaves = `H(domain, sk)` and sk derives from the
seed, so **recovering the seed restores every credential with zero on-chain
changes**, same leaves, same proofs, same nullifiers (no double-claim).

**What DIDz should do:**
- Our attestations bind to `did_id` (not the owner key), so they already
  survive `rotate_owner_key`, good, keep that invariant.
- But DIDzRegistry has NO lost-key path: if the owner key is gone, the
  identity is stuck (README gap #1). Passport's model (recovery circuit
  proves "I know the seed behind the owner commitment", then rotates the
  key) fits our engine's key-commitment pattern directly. LegacyKey
  (inheritance) and a social-recovery module belong on the roadmap sooner
  rather than later.

## 6. Function-call keys, independent confirmation of scoped-grant v2 ⭐

Their account model (NEAR-adapted): full-access keys + **function-call keys**
scoped to (contract, circuit list, DUST allowance, revocable). That is our
scoped-grant v2 with different names, and notably their C10 "alternatives"
list ends at "**C, ZK-attested grants (tightest privacy)**" which is what we
already built. We are AHEAD here; their open questions (grant schema,
chain-agnostic grants) are ones we already ruled on (custom-constraint slot,
per-action + cumulative caps).

## 7. Smaller gems

- **Wrong-key rejection is local and instant** (83ms vs 17s proof): failed
  asserts abort during local circuit execution BEFORE proof generation, no
  tx, no fee, no state. Good for relay UX: pre-flight checks are free.
- **Checkpoint-resume onboarding** (8 phases, AES-GCM checkpoints, expiring
  in 24h, tx-status reconciliation on resume): the pattern for
  SelectConnect's onboarding SDK when we get there.
- **Component canvases + ADRs + MPS/MIP pipeline**: every component doc has
  Outcome / Dependencies / Open questions / **Failure modes with detection
  methods** / Alternatives. The failure-modes-with-detection discipline is
  worth copying into our module READMEs.
- **Evidence-or-it-didn't-happen**: every claim in their investigation docs
  cites a JSON evidence file with tx hashes. Matches our compile-first rule;
  extend it to deploy-first claims.

---

## Action shortlist (proposed order)

1. **Deployment runbook**: maintenance-authority key export + custody
   (before ANY mainnet deploy)., cheap, existential
2. **DOMAIN_TAGS.md registry** in midnight-modules., cheap
3. **Ledger-schema review** of DIDzRegistry/scoped-grant with "frozen at
   deploy" eyes; consider reserved extension maps., before mainnet
4. **Per-context nullifiers** in pol-credential + realVote., small circuit change
5. **Merkle accumulator module** (`midnight-modules/anonymous-membership`):
   unlocks anonymous pairwise proofs + anonymous "active DIDz" checks., medium
6. **Social-recovery module** (DeRec-style, key-commitment recovery)., larger, Phase 2
