# Lumera Cascade — storage evaluation for the DIDz engine

**Date:** October 12, 2026 · **Status:** Exploratory evaluation — `PLANNED`, no
code, no dependency
**Companion:** `DIDzMonolith-docs/DEEP_DIVE_Lumera_Protocol_2026-10-12.md` (full
protocol deep dive), `HelixCTW/docs/LUMERA_CASCADE_INTEGRATION.md` (adapter
design)

---

## 1. Why DIDz cares about a storage layer at all

The DIDz constitution is explicit: **raw facts never go on-chain.** Midnight
holds commitments and status bits; the underlying personal data lives off-chain
under holder control (`DIDZ_CONSTITUTION.md`). That principle is sound — but it
leaves a real question unanswered:

> *Where does the off-chain data actually live?*

Today the honest answer is "nowhere decentralized yet." A holder's credential
evidence, an issuer's attestation documents, a revocation trail — if those live
in a cloud bucket or an app server, we have re-created exactly the centralized
data custodian DIDz exists to replace. The identity is sovereign; the data
would not be.

Lumera Cascade is a candidate answer: permanent, client-encrypted storage on an
economically bonded SuperNode mesh, where the network proves on-chain that it
still holds ciphertext it cannot read. In John's words — a decentralized
"off-shore" memory: fragments across independent operators in multiple
jurisdictions, so no single company or legal order can produce the plaintext.

## 2. What could ride Cascade from the DIDz side

All of these are **encrypted capsules only** — ciphertext before any byte
leaves a trusted runtime, exactly per our established cold-strand discipline:

| Artifact | Why Cascade fits |
| --- | --- |
| Credential-evidence capsules (supporting docs behind an attestation) | Immutable once issued; must still exist years later to answer "on what basis was this issued?" |
| Holder backup / recovery bundles | Holder-controlled encrypted export; permanent without depending on our uptime |
| Issuer onboarding + attestation records | Audit-grade permanence; content-addressed integrity |
| Revocation evidence bundles | A revoked credential's *reason evidence* should outlive the credential |
| Versioned audit / reconstruction packages | Alignment with HelixCTW's reconstructibility goal |

**Never on Cascade** (same bar as the Filecoin lane): plaintext PII, keys or
seed material, mutable consent/revocation state, active sessions, anything with
unreviewed deletion-law obligations as sole copy.

## 3. The identity question: whose signature gates the data?

Cascade private files require an **ADR-036 signature** (Cosmos offline signing)
over the `action_id` to download. That is Lumera-side access control keyed to
a Lumera address — *not* a DIDz DID and *not* a Midnight key. Three honest
options:

1. **Worker-custodied service signer** — a HelixCTW archival worker holds a
   least-privilege Lumera key; uploads are `isPublic: false`, and every read
   still passes DIDzM authorization first. The Lumera signature is plumbing,
   not policy. *Cleanest for the first lane.*
2. **Holder-held Lumera key** — each holder controls a Lumera address and signs
   their own retrievals. Truest to self-custody, but adds a second key
   ecosystem to the holder UX; defer.
3. **Client-encrypted + `isPublic: true`** — rely on encryption alone (Lumera's
   own documented pattern for shared artifacts), letting DIDzM authorization
   decide who *gets the key*. Useful for deliberately shareable artifacts only.

DIDz's role is unchanged either way: **possession of an `action_id` is never
authorization.** Disclosure still goes through identity → grant → purpose →
scope → retention checks before a key or capsule is touched.

## 4. The ZK braid, end to end

This is where it gets elegant — three layers, each doing one job:

1. **Midnight (truth):** the credential commitment and its status live in the
   ledger — private, provable, revocable.
2. **Lumera (permanence):** the encrypted evidence capsule behind that
   commitment lives as a Cascade action — permanent, provably retained,
   unreadable to the storage network.
3. **DIDz/HelixCTW (authorization + index):** decides who may see what and maps
   `credential_commitment ↔ action_id ↔ key custody` — the only place all three
   meet.

A verifier gets a yes/no from Midnight. An auditor gets BLAKE3-verified
ciphertext plus on-chain retention proofs from Lumera. The holder alone holds
what makes it readable. That is privacy-preserving identity with actual data
sovereignty underneath it.

## 5. Honest caveats specific to DIDz

- **Permanence vs. right-to-erasure.** Cascade has no delete — not even deal
  expiry. Crypto-shredding (key destruction) is the only erasure semantic.
  Never upload anything where physical deletion is a legal requirement.
- **Metadata is public.** `action_id`s, sizes, timing, and the Lumera wallet's
  activity are on a public chain. A credential's *existence* can leak through
  timing even if its contents cannot. Privacy review must treat the metadata
  layer as a disclosure surface of its own.
- **Second key ecosystem.** CosmJS signers and `lumera1…` addresses are Cosmos
  tech — operationally separate from Midnight. Keep them behind the worker
  boundary; do not let `@lumera-protocol` types leak into DIDz identity code.
- **Maturity.** ~28–36 bonded SuperNodes today. Appropriate as a redundant or
  secondary strand first; not sole custodian of anything load-bearing until
  evidence supports it.

## 6. Posture

`PLANNED`. The evaluation recommendation: prototype Cascade as a **second cold
strand behind the existing HelixCTW storage-adapter contract** (same
`uploadEncryptedArtifact / retrieveEncryptedArtifact / readStorageProofStatus`
surface as the Filecoin lane), starting on `lumera-testnet-2` with synthetic
data only. DIDz itself needs no changes until a live adapter exists; when it
does, the only DIDz-side artifact is the `action_id ↔ commitment` mapping in
the HelixCTW index — never the ciphertext, never the keys.
