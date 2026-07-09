# DIDz Constitution

> **Status**: Draft v0.1, July 5, 2026
> **Author**: John M.P. Santi (EnterpriseZK Labs LLC)
> **Drafted by**: Penny 🎀
> **Canonical location**: `DIDz-io/docs/DIDZ_CONSTITUTION.md`
> **Distribution**: Identical copy kept in DIDz-io, AgenticDID, RWAz, and
> SelectConnect. Pointer docs in all other DIDz-ecosystem repos reference
> this file. Keep copies in sync.

---

## Preamble

This constitution governs the DIDz protocol ecosystem, a privacy-first
identity, credential, and authority layer built on Midnight's selective-
privacy blockchain. It establishes the invariants that every DIDz-conforming
contract, service, and consumer product must uphold.

The constitution is **one document with appendices**. The root articles bind
all branches. Appendix A adds AgenticDID-specific rules. Appendix B adds
RWAz-specific rules. Consumer products (SelectConnect, KYCz, LegacyKey, etc.)
inherit the root articles without modification.

The guiding principle of this constitution is:

```text
Permanent identity.
Temporary eligibility.
Revocable authority.
Auditable history.
Scoped trust.
```

The one rule from which everything else follows:

> **Do not confuse identity with authority.**
> A DIDz proves an entity exists or existed. Credentials prove claims.
> Grants give bounded, revocable authority. Lifecycle status says what is
> true right now.

---

## Article I, Foundational Principles

### §1. Privacy by Default

Everything is private by default, with the ability to prove and share
selectively if the holder wishes. On-chain state consists of commitments
and status bits only. Raw facts, entity types, owner keys, timestamps,
attestation contents, stay off-chain or committed and are revealed one bit
at a time via zero-knowledge circuits.

This applies to every contract in the ecosystem without exception.

### §2. Identities Are Not Tokens

DIDz identities are registry entries, not NFTs. They are non-transferable
by construction, no transfer circuit exists. Keys may rotate and recover;
the identity itself never moves. Tokens are used only where value actually
moves (RWAz settlement, escrow custody, abuse bonds).

### §3. Spelling

"DIDz" is the canonical spelling in all new writing. Earlier "DIDZ" appears
in imported historical documents and is left untouched as an archive
artifact.

### §4. Three-Pillar Model

The ecosystem is organized as three foundational pillars, with consumer products built on top:

| Pillar | Role | Repo |
|--------|------|------|
| **DIDz** | Universal root identity layer | `DIDz-io` |
| **AgenticDID** | Agent identity + delegated authority branch | `AgenticDID` |
| **RWAz** | Object / real-world-asset identity branch | `RWAz` |

Consumer products built on the engine include: SelectConnect (first paying
product), LegacyKey, realVote, KYCz, EventRevolution, ProMingle, SouLink,
SmartCart, onlyHumans, and others.

The engine (`midnight-modules`) feeds all three pillars and consumer products.

---

## Article II, Identity Rights

### §5. Permanence of Identity

A DIDz is a permanent identity record. It does not expire. It is not
deleted. It may pass through lifecycle statuses (active, suspended,
deceased, dissolved, destroyed), but the registry entry persists forever
as an audit anchor.

Destroying an identity would destroy audit history, break estate and
inheritance claims, and create a reissue path that fraudsters could abuse
to escape reputation. Therefore: identity persists; only status changes.

### §6. Human Identity and Proof of Life

A HumanDIDz never expires. Liveness is a renewable **Proof of Life (POL)**
credential, not a property of the identity itself.

- **zVoting** requires POL within approximately one year (verifier-side
  freshness window), plus eligibility credentials and a one-time election
  grant.
- **Age-tier cadence** is issuer policy, not chain logic: routine renewal
  when young, yearly attestation expected past approximately 70–80 years
  old, and claims past approximately 120 are red-flag enhanced review
  (in-person or multi-issuer biometric).
- **`mark_deceased` is irreversible** on-chain. Dead people cannot vote,
  sign, or authorize, ever.

### §7. Canonical and Pairwise DIDs

Every entity has exactly **one canonical DIDz**, the accountability anchor.
It is permanent, unique, and never appears on the wire.

For every counterparty relationship, the entity derives a **pairwise
presentation DID**. This prevents cross-context correlation: two merchants
cannot collude to reconstruct your activity. Every pairwise DID provably
belongs to the canonical one in zero knowledge.

Both exist together. Implementers must not "pick one."

### §8. Non-Transferability

No DIDz identity may be transferred to another entity. There is no transfer
circuit, and no conforming contract may implement one. Keys rotate; identity
does not move.

---

## Article III, Entity Types and Lifecycle

### §9. Entity Types

The DIDz root registry recognizes the following entity types:

```text
HumanDIDz         , a living or deceased person
OrganizationDIDz  , a company, institution, or collective
GovernmentDIDz    , a sovereign state or government body
GovernmentAgencyDIDz, a department or agency of a government
ObjectDIDz        , a physical object (vehicle, device, animal)
RWADIDz           , a real-world asset (real estate, commodity)
TrustedIssuerDIDz , an entity authorized to issue credentials
AgentDIDz         , an autonomous software agent (AgenticDID branch)
```

### §10. Lifecycle Statuses

Every DIDz carries a lifecycle status:

| Code | Status | Reversible? |
|------|--------|-------------|
| 0 | Active | Yes |
| 1 | Suspended | Yes |
| 2 | Deceased | No (terminal) |
| 3 | Dissolved | No (terminal) |
| 4 | Destroyed | No (terminal) |

Terminal states are irreversible. Identity is never deleted, it enters a
terminal state and remains auditable.

### §11. Status Transitions

Status transitions are governed by on-chain circuits and are the audit
backbone of the protocol. Only authorized parties may trigger transitions:

- **Active → Suspended**: the identity owner, a recovery controller, or a
  governance action.
- **Suspended → Active**: the identity owner or a recovery controller.
- **Active/Suspended → Deceased**: a trusted issuer with death-attestation
  authority, after irreversible on-chain recording.
- **Active/Suspended → Dissolved**: the identity owner or governance, for
  organizations.
- **Any → Destroyed**: governance only, under strict fraud-burn procedures
  (Article VII).

---

## Article IV, Credentials

### §12. Credentials Prove Claims

A credential is a claim about a DIDz, issued by a Trusted Issuer, held by
the DIDz owner, and verifiable by any third party. Credentials prove
*claims*, they do not confer authority (that is the role of grants,
Article V).

### §13. Credential Lifecycle

Credentials may expire and may be revoked. Expiry is time-based and
automatic. Revocation is issuer-initiated and takes effect for all
subsequent verifications.

### §14. Selective Disclosure

Every credential must support selective disclosure via zero-knowledge
proofs. A holder may prove a derived fact ("I am over 18") without
revealing the underlying attribute ("my birthdate is 1990-03-15").

### §15. Trusted Issuer Registry

Trusted issuers are entities with scoped issuer credentials. An issuer
credential specifies:

- `allowed_credential_types`, what claims this issuer may attest
- `allowed_entity_types`, what entity types it may issue for
- `jurisdiction`, legal jurisdiction (if applicable)
- `expiry`, credential validity window
- `revocation_status`, live or revoked

Issuer credentials may be revoked by governance or by the issuer's own
issuer (recursive trust).

---

## Article V, Authority and Grants

### §16. Grants Give Bounded Authority

A grant is a scoped, capped, expiring, revocable capability issued by a
principal to an agent or counterparty. Grants are the *only* mechanism for
delegated authority in the ecosystem.

### §17. Spend Limits

Every grant may carry two independent spend-limit properties:

- **`per_action_cap`**, maximum value per single authorization
- **`cumulative_cap`**, maximum total value across all authorizations

Both are optional. Both are enforced when set. The sentinel value
`max_Uint64` means unlimited; `0` means no-spend (valid). Delegation
reserves the child's cumulative budget out of the parent's remaining
budget.

### §18. Counterparty Binding

A grant may be counterparty-locked: only the specified counterparty may
consume it. This prevents grant sharing and enables per-relationship
revocation.

### §19. Attenuation

A grant holder may delegate a child grant whose authority is a strict
subset of the parent's:

- `scope` ⊆ parent scope
- `max_amount` ≤ parent `max_amount`
- `expiry` ≤ parent `expiry`

The delegation tree is the **grant graph**. It is stored in private state
and never disclosed to verifiers.

### §20. Cascade Revocation

Revoking a root grant invalidates the entire delegation subtree in one
action. Revocation takes effect for all subsequent proofs of authority.

### §21. Custom Constraints Extension Slot

Grants may carry a standardized custom-constraints extension: a hash-
committed off-chain descriptor plus an X.509-style critical flag.

- **Critical flag set**: the verifier must acknowledge the exact hash or
  reject the grant.
- **Critical flag unset**: the verifier may ignore the constraint with zero
  effect.

This provides one shared format for properties not yet invented, keeping
custom grants interoperable.

### §22. Proof of Authority

An agent requesting to perform an action must produce a zero-knowledge
proof that:

1. The agent knows the secret key behind the grant's holder commitment.
2. The grant is live (not revoked; lineage intact).
3. The scope matches the requested action.
4. The amount is within the grant's caps.
5. The current epoch is before the grant's expiry.

The verifier learns only the boolean outcome, nothing else.

---

## Article VI, Privacy and Zero-Knowledge

### §23. Privacy-First Invariant

Every conforming contract must encode the privacy-first invariant: on-chain
state reveals commitments and status bits only. Raw facts are off-chain
and revealed via ZK circuits, one bit at a time, at the holder's discretion.

### §24. Unlinkability

Pairwise agent DIDs and hashed scopes prevent verifier collusion from
reconstructing a principal's agent fleet or a person's relationship graph.

### §25. Replay Prevention

Proofs are bound to a transaction context by nullifiers. A proof cannot be
replayed across contexts. Nullifiers are round-scoped and one-time-use.

### §26. Key Recovery

Holder and issuer keys should be recoverable via m-of-n social recovery
(`recovery-core`). Compromised agents are contained by cascade revocation.
Key recovery does not transfer authority, only keys.

---

## Article VII, Constitutional Violations and Enforcement

### §27. Violations

The following are constitutional violations:

```text
Exceeding grant authority
Impersonating another entity
Bypassing revocation
Misusing private data
Delegating beyond allowed limits
Interacting with unauthorized counterparties
Hiding material behavior history
Falsifying proof-of-life
Voting after death
Transferring a DIDz identity
```

### §28. Enforcement Mechanisms

When a violation is confirmed, the system may:

```text
Revoke credentials
Revoke grants (cascade)
Suspend agent authority
Remove trusted-issuer status
Slash abuse bonds
Issue counterparty warnings
Burn or supersede the DIDz under strict governance
```

Enforcement removes authority; it does not delete identity. The permanent
record remains for audit.

### §29. Fraud Burn

Under strict governance (multi-party review), a DIDz may be marked
`destroyed` (fraud burn) or superseded by a new DIDz. In fraud burn:

- **Assets may transfer** after verification (owned assets, historical
  records, audit history, reputation history, approved credentials).
- **Authority does NOT automatically transfer** (active grants, spending
  permissions, delegated authority, high-risk access credentials,
  counterparty permissions, constitutional trust status).

Analogy: if a bank replaces a stolen card, the money remains yours, but
the old card number, PIN, and suspicious pending authorizations do not
automatically transfer.

---

## Article VIII, Governance

### §30. Constitution Amendment

This constitution may be amended by John M.P. Santi (protocol architect)
or by a governance process he designates. Amendments must be recorded in
this document with a date and rationale.

### §31. Repo Distribution

The canonical copy of this constitution lives in `DIDz-io/docs/`. Identical
copies are kept in `AgenticDID`, `RWAz`, and `selectConnect`. All other
DIDz-ecosystem repos keep a pointer doc (`docs/DIDZ_CONSTITUTION_ALIGNMENT.md`)
referencing this file.

When the constitution is amended, all copies must be updated in the same
commit cycle.

### §32. Conformance

A contract, service, or product conforms to the DIDz protocol if it
upholds all root articles (I–VIII) applicable to its scope. Branch-specific
conformance additionally requires the relevant appendix.

---

## Appendix A, AgenticDID Rules

These rules apply in addition to the root articles for the AgenticDID
branch (agent identity, delegated authority, autonomous agents).

### A1. Agent Identity

An AgentDIDz is a DIDz with entity type `AgentDIDz`. It is permanent and
non-transferable, like all DIDz. The agent's DID may remain permanently
recorded while its ability to use grants is revoked.

### A2. Two Machines

AgenticDID operates as two logical machines:

- **Machine 1 (Identity)**: the agent's DIDz, lifecycle status, and
  credential set.
- **Machine 2 (Permission)**: the scoped-grant system that gives the agent
  bounded, revocable authority to act.

### A3. Dynamic Intent → Grant

At runtime, a local-agent component compiles a natural-language intent into
a minimal scoped grant request (`scope`, `max_amount`, `limit_kind`,
`expiry`, `allowed_counterparty`). This is Machine 2 in action.

### A4. Attenuation-Only Delegation

Agents may delegate only narrower authority. A child grant is always a
strict subset of its parent. Broadening is impossible by construction.

### A5. Constitutional Violations (Agent-Specific)

In addition to Article VII, the following are AgenticDID-specific
violations:

```text
Exceeding grant authority
Impersonating another agent
Bypassing revocation
Misusing private data
Delegating beyond allowed limits
Interacting with unauthorized counterparties
Hiding material behavior history
```

### A6. Enforcement

Violations may trigger: grant revocation, agent suspension, issuer review,
slashing or penalty mechanisms, counterparty warnings, loss of trusted
status. The scoped-grant system supports this because it gives a clean
place to remove authority without erasing identity.

---

## Appendix B, RWAz Rules

These rules apply in addition to the root articles for the RWAz branch
(object and real-world-asset identity).

### B1. Object Identity Is Permanent; Ownership Changes

An ObjectDIDz or RWADIDz is permanent. The physical object (e.g., a
vehicle) keeps the same identity throughout its lifetime. Ownership is a
transferable credential, the title changes hands; the VIN stays.

### B2. Encumbrances

An RWAz may carry an encumbrance (lien, mortgage, lease). Encumbrances are
credentials with a priority order. Encumbrances must be cleared or
transferred before ownership can change.

### B3. Provenance

Every ownership transfer appends to a provenance hash chain. The chain is
auditable but does not reveal owner identities, only commitments and
transfer timestamps.

### B4. Fractionalization

An RWAz may be fractionalized into shares. Each share is a credential, not
a token. The underlying asset identity remains singular.

---

## Appendix C, Affected Repos

The following repos are bound by this constitution:

**Core pillars (full copy):**
- `DIDz-io`, root identity layer (canonical location)
- `AgenticDID`, agent branch
- `RWAz`, object/RWA branch
- `selectConnect`, first consumer product

**Engine:**
- `midnight-modules`, shared Compact modules (scoped-grant, pol-credential,
  access-control, commitment-nullifier, merkle-membership, recovery-core)

**Consumer products (pointer doc):**
- `KYCz`, trusted-issuer credentials
- `realVote`, proof-of-life-gated voting
- `SentinelDID` / `SentinelAI`, agent identity + authorization
- `SCIFz`, nullifier + Merkle-membership + revocation
- `LegacyKey` (formerly DownMan), estate planning, death status, asset migration
- `SilentLedger`, RWA/object consumer
- `equineProData` / `petProData`, animal identity (ObjectDIDz)
- `safeHealthData`, health credentials
- `ProMingle` / `SouLink` / `PopCork` / `HuddleBridge`, DIDz consumer credentials
- `EventRevolution` / `SmartCart`, scoped-grant consumers
- `onlyHumans`, proof-of-personhood via ZK

---

## Amendment Log

| Date | Amendment | By |
|------|-----------|-----|
| 2026-07-05 | Initial draft (v0.1) | John M.P. Santi, drafted by Penny |

---

*This constitution is the governing document of the DIDz protocol ecosystem.
All conforming contracts, services, and products must uphold its articles.
When in doubt, the principle is: permanent identity, temporary eligibility,
revocable authority, auditable history, scoped trust.*
