# DIDZ + AgenticDID Implementation Plan

> **Status**: Draft v0.1, July 5, 2026
> **Owners**: John M.P. Santi (architecture), Penny (drafting)
> **Companion documents**:
> - `didz-agenticdid-full-architecture.md` (the master architecture, from Alice)
> - `didz-agenticdid-plain-english-overview.md` (layman companion)
> - `docs/dynamic-intent-scoped-permissions.md` (runtime intent model)
> - `docs/agenticdid-investor-overview.md` (investor pitch, AgenticDID repo)
> - `docs/ALICE_DIDZ_AGENTICDID_MASTERPLAN_VERBATIM_2026-07-05.md` (verbatim source, DIDz repo)
> - Existing specs this must reconcile with: `spec/AGENTICDID_SPEC.md` (AgenticDID
>   repo) and `docs/DIDZ_DID_FOUNDATION_ARCHITECTURE.md` (DIDz repo)
>
> **This exact file lives in the DIDz-io, AgenticDID, and RWAz repos.**
> Keep the copies in sync.

---

## 1. What changed

Alice's July 2026 session promoted **DIDZ from "the identity product for people,
orgs, and objects" to the universal root identity layer** that explicitly
encompasses everything recognizable, with **AgenticDID as one specialized branch
underneath it** for autonomous agents.

The single governing principle for the whole stack is now:

```text
Permanent identity.
Temporary eligibility.
Revocable authority.
Auditable history.
Scoped trust.
```

The one rule that everything else follows from:

> **Do not confuse identity with authority.**
> A DIDZ proves an entity exists or existed. Credentials prove claims. Grants
> give bounded, revocable authority. Lifecycle status says what is true right now.

## 2. Layer model

```text
DIDZ Root Protocol  ........  universal identity + lifecycle status
├── Entity Registry .........  HumanDIDZ, AgenticDID, OrganizationDIDZ,
│                              GovernmentDIDZ, GovernmentAgencyDIDZ,
│                              ObjectDIDZ, RWADIDZ, TrustedIssuerDIDZ
├── Issuer Registry .........  who may issue what, scoped + revocable
├── Credential Registry .....  claims (proof-of-life, citizenship, ownership...)
├── Grant Registry ..........  scoped/attenuated/one-time/counterparty grants
└── Status Registry .........  active, deceased, dissolved, destroyed,
                               suspended, retired, revoked_authority,
                               fraudulent, burned, superseded, archived

AgenticDID (branch) .........  agent identity + delegated authority + ZK proof of
                               authority (the "two machines": ID machine +
                               permission machine)
RWAz (branch) ...............  object + real-world-asset identity; ownership as a
                               transferable credential (VIN stays / title changes),
                               provenance, encumbrances, fractionalization
```

> **Three-branch model (decided July 5, 2026).** RWA/object identity is large
> enough to be its own peer branch, so it lives in the dedicated `RWAz` repo
> (`bytewizard42i/RWAz`), matching how `AgenticDID` is the agent branch. DIDz root
> defines only the `ObjectDIDz`/`RWADIDz` entity types + lifecycle; RWAz builds the
> ownership/provenance machinery on top. See `RWAz/docs/DIVISION_OF_LABOR.md`.

## 3. How this reconciles with the existing specs (good news)

The new master plan is largely a **plain-English superset of what we already
committed**, not a rewrite. Concretely:

- `AGENTICDID_SPEC.md` already defines scoped grants, attenuation
  (scope ⊆, amount ≤, expiry ≤), cascade revocation, and a single-bit ZK proof of
  authority. Alice's "Machine 2 / scoped grant / debit-card" language maps 1:1.
- `DIDZ_DID_FOUNDATION_ARCHITECTURE.md` already cites W3C DID Core supporting
  persons, orgs, things, and autonomous software as DID subjects, and already
  lists Capability Delegation for AgenticDID. The new "universal top layer" is the
  natural articulation of that.
- The reference implementation (`midnight-modules/modules/scoped-grant/` plus
  `access-control`, `commitment-nullifier`, `merkle-membership`, `recovery-core`)
  already covers most primitives the master plan needs.

So the work is mostly **additive**: add the entity-type + lifecycle-status layer,
add the human credential set (proof-of-life, voting stack), and formalize the
issuer registry.

## 4. Tensions to resolve (flagged, with proposed resolutions)

These are the only places the new material rubs against existing decisions. None
are fatal. Each has a proposed default; John's ruling is requested in §8.

1. **Naming: `DIDZ` vs `DIDz`.** Alice's docs use all-caps `DIDZ`. The brand and
   existing repos use `DIDz` / `DIDz.io`. Proposed default: keep the brand spelling
   `DIDz` in prose and titles; treat `DIDZ` in Alice's imported docs as a verbatim
   artifact we leave untouched but normalize in all NEW writing.

2. **Human DID "expiry".** John's opening premise was "a human DIDz must expire
   after X years (death)." Alice's architecture deliberately reverses this: the
   HumanDIDZ is permanent; the **proof-of-life credential** expires instead.
   Proposed default: adopt Alice's model (permanent identity + expiring
   proof-of-life). This is the cleaner, W3C-aligned choice and solves the "dead
   people voting" problem without destroying history.

3. **One canonical DID vs pairwise per-counterparty DIDs.** `AGENTICDID_SPEC.md`
   says agents SHOULD use pairwise `did:peer` DIDs per counterparty for
   unlinkability. Alice says "one entity, one canonical DID." These are compatible
   but must be stated together: **one canonical AgenticDID identity, presented as
   pairwise DIDs per counterparty.** Proposed default: document exactly that so it
   never reads as a contradiction.

4. **Spend limit semantics: per-action cap vs cumulative budget.** The spec calls
   `max_amount` a per-action cap. Alice's grocery example ("spend no more than
   $50") reads like a total budget for the intent. These differ: a per-action cap
   would let an agent perform several $50 actions. See §7 (context) for why this
   matters. Proposed default: support both, with an explicit grant field
   (`limit_kind: per_action | cumulative`), defaulting cumulative for
   intent-scoped grants.

5. **Constitution: shared or per-branch?** Both the DIDz root and AgenticDID
   reference "a constitution." Proposed default: one DIDz root constitution with an
   AgenticDID-specific appendix, rather than two independent constitutions.

## 5. Implementation plan, DIDz root layer

- **Phase R0, formalize the model (docs only).** Land the architecture, plain
  English, verbatim, and this plan. (This PR.)
- **Phase R1, entity-type + lifecycle status.** Extend the identity contract
  (evolving `KYCzAnchor` → `DIDzIdentity` per the foundation doc) to carry
  `entity_type` and `lifecycle_status` with a governed status-transition circuit.
  Status transitions are the audit backbone.
- **Phase R2, issuer registry.** Trusted-issuer credential with
  `allowed_credential_types`, `allowed_entity_types`, `jurisdiction`, `expiry`,
  `revocation_status`. Reuse `access-control` module.
- **Phase R3, human credential set.** ProofOfLife, Death, Citizenship, Residency,
  Jurisdiction, VotingEligibility credentials as VC schemas + on-chain status.
- **Phase R4, DIDz voting.** Implement the proof-of-life-gated voting stack
  (HumanDIDZ → ProofOfLife → Citizenship/Residency → Jurisdiction →
  VotingEligibility → ElectionSpecificVotingGrant → OneTimeVoteCastReceipt) as a
  Compact circuit set. Nullifier = one-vote-per-election. Ties to the `realVote`
  repo (see cross-pollination §9).
- **Phase R5, RWA/object branch (now the `RWAz` repo).** DIDz root exposes the
  `ObjectDIDz`/`RWADIDz` entity types + lifecycle only; the ownership-as-
  transferable-credential machinery (VIN-stays / title-changes), encumbrances,
  provenance, and fractionalization live in `bytewizard42i/RWAz`. Consumers:
  `SilentLedger`, `DownMan`, `equineProData`, `petProData`, `safeHealthData`.

## 6. Implementation plan, AgenticDID branch

- **Phase A0, doc alignment.** Cross-link the imported docs to `AGENTICDID_SPEC.md`
  so the spec is the normative source and the new docs are the explainers. (This
  PR.)
- **Phase A1, grant fields.** Add `limit_kind` (per-action vs cumulative) and
  `allowed_counterparty` to the scoped-grant data model in the spec and the
  `scoped-grant` Compact module.
- **Phase A2, dynamic intent → grant.** Off-chain: a local-agent component that
  compiles a natural-language intent into a minimal scoped grant request
  (`scope`, `max_amount`, `limit_kind`, `expiry`, `allowed_counterparty`). This is
  "Machine 2" at runtime.
- **Phase A3, counterparty verification.** Verifier interface (DIF Presentation
  Exchange envelope) so a merchant-side agent verifies a single-bit proof of
  authority without learning the principal or the grant graph.
- **Phase A4, constitution enforcement + cascade revocation.** Wire constitution
  violations to grant/status changes; confirm cascade revocation invalidates the
  delegation subtree.
- **Phase A5, recovery + fraud path.** `recovery-core` for m-of-n key recovery;
  governed `fraud_burn` / `void_ab_initio` status with controlled (non-automatic)
  asset migration and no automatic authority migration.

## 7. Context for the complicated questions

**Why per-action vs cumulative spend limits actually matters (question 4).**
If "$50 grocery budget" is stored as a per-action cap, an agent that is allowed to
submit multiple authorizations could legitimately spend $50 + $50 + $50 and stay
"within limit" on every single action while blowing far past the user's intent. A
cumulative budget requires the contract (or verifier) to track spent-to-date
against the grant, which is more state and a harder ZK statement, but it is what a
human means by "don't spend more than $50." Recommendation: default intent-scoped
grants to cumulative, keep per-action available for standing/allowance-style
grants (e.g., "up to $20 per ride"). This needs an explicit field so it is never
ambiguous.

**Why "one canonical DID" and "pairwise DIDs" are not a contradiction
(question 3).** The canonical DID is the accountability anchor: one entity, one
permanent record, full history. Pairwise DIDs are *presentation* identifiers
derived per counterparty so that two merchants cannot collude to reconstruct your
agent fleet. The canonical identity never appears on the wire; the pairwise DID
does. We should write both into the spec together so implementers do not "pick
one."

**Why reversing the human-expiry premise is safer (question 2).** Expiring the
identity itself destroys audit history (estate, inheritance, genealogy,
posthumous claims) and creates a reissue path that fraudsters can abuse to escape
reputation. Expiring a renewable proof-of-life credential achieves the real goal
(dead people cannot vote or sign) while keeping the permanent record. This is also
how birth certificates and SSNs already work.

## 8. Open questions for John

See the chat message accompanying this PR. Summarized here for the record:

1. Cross-pollination scope: which repos, and pointer-doc vs full-copy? (§9)
2. Brand spelling: normalize new writing to `DIDz`, leave imported `DIDZ` docs
   verbatim? (§4.1)
3. Accept the reversal of "human DID expires" in favor of permanent identity +
   expiring proof-of-life? (§4.2)
4. Spend-limit default: cumulative for intent-scoped grants, per-action opt-in? (§4.4, §7)
5. One shared DIDz constitution with an AgenticDID appendix, or two? (§4.5)
6. Confirm push: submodule-first commit + push of DIDz-io and AgenticDID now, or
   hold for your review first?

## 9. Cross-pollination map (proposed, pending §8.1)

Repos that plausibly consume this architecture, and the *minimal* touch proposed
(a short pointer doc, e.g. `docs/DIDZ_ARCHITECTURE_ALIGNMENT.md`, referencing this
plan, not a full copy):

- **KYCz** — base issuer; ProofOfLife/Death/Citizenship are KYCz-class credentials.
- **realVote** — direct consumer of the proof-of-life voting stack.
- **SentinelDID, SentinelAI** — agent identity + `AgentAuthorization` credentials.
- **selectConnect, SCIFz** — scoped grants, progressive reveal, revocation already overlap.
- **DownMan** — recovery controllers / estate = death-status + asset migration.
- **RWAz** — the dedicated object/RWA branch repo; consumes DIDz root identity +
  lifecycle and owns ownership/provenance. Peer to AgenticDID.
- **SilentLedger, equineProData, petProData, safeHealthData** — RWA/object
  consumers that should build on `RWAz` rather than reinventing ownership.
- **ProMingle, SouLink, PopCork, HuddleBridge** — DIDz-consumer credentials
  (professional, social, participation).
- **EnterpriseZK PORTFOLIO, MidnightVitals** — ecosystem/portfolio references.

Books (`book-How_to_Code_with_Midnight`, `book-Midnight-G4-Network-Enterprise`)
may cite the architecture as a case study, but that is a separate editorial pass,
not part of this cross-pollination.

---

*Keep this file identical in both repos. Update §8/§9 as John rules on the open
questions.*
