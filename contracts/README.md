# DIDz.io, On-Chain Contracts

**Status**: v2, machine (1) of the two-machine architecture, privacy-first.
**Compiler**: compactc v0.31.1 / compact toolchain v0.5.1
**Validated**: Jul 5, 2026 via local `compact compile`, `DIDzRegistry` v2 with
**full ZK key generation** (15 circuits); `TrustedIssuerRegistry` PASS unmodified.

**v2 rewrite (Jul 5, 2026), what changed and why**

- **Privacy default (John's ruling)**: public on-chain facts are now ONLY
  "this DIDz exists" + its lifecycle status. Entity type, subject binding,
  owner key, and every attestation's content + issuer are **commitments**,
  each with a selective ZK reveal circuit (`assert_i_control`,
  `prove_entity_type`, `prove_attestation`), prove one fact, only when the
  holder chooses.
- **Not an NFT**: a DIDz is a registry entry with NO transfer circuit ,
  non-transferable by construction. Keys rotate (`rotate_owner_key`); the
  identity never moves and is never deleted.
- **Full lifecycle statuses** (permanent identity, rule of the root layer):
  `0 active / 1 suspended (reversible) / 2 deceased / 3 dissolved /
  4 destroyed`, terminals are irreversible and filable by the owner or a
  registered **status authority** (death-certificate flow; human deaths
  authoritative in `midnight-modules/pol-credential`, bridged by the SDK).
- **Keeper epochs** replace caller-supplied timestamps.
- **Pairwise presentation DIDs (John's ruling 4)**: one canonical DIDz per
  entity (the accountability anchor, never on the wire) + a different
  pairwise DID per counterparty (anti-collusion). Pairwise DIDs are
  **derived, never registered**, an on-chain register would itself be a
  linkage trail. `derive_pairwise_did` is the shared derivation
  (`H("didz:pairwise:v1", canonical, counterparty_context, salt)`);
  `prove_pairwise_binding` is the opt-in accountability reveal (proves the
  holder controls the ACTIVE canonical behind a pairwise DID, disclosing the
  canonical to that one verifier by choice).
- The v1 MVP lives in `archive/DIDzRegistry_v1_mvp.compact` (compiles, but
  leaks entity types/owner keys/timestamps, reference only).

`TrustedIssuerRegistry` stays public BY DESIGN: issuers want to be publicly
discoverable and rated, that is the reasonable exception to privacy-default.

---

## What's In This Folder

| Contract | Purpose | Exported Circuits |
|----------|---------|-------------------|
| `DIDzRegistry.compact` | **Machine (1)**: mints permanent, non-transferable DIDz identities for every entity type (human, agent, animal, organization, device, object) with privacy-first attestations. | `register_did`, `assert_i_control`, `prove_entity_type`, `rotate_owner_key`, `suspend_did`, `reactivate_did`, `set_terminal_status`, `attest_to_did`, `revoke_attestation`, `prove_attestation`, `derive_pairwise_did`, `prove_pairwise_binding`, `claim_registry_admin`, `add/remove_status_authority`, `advance_epoch` |
| `TrustedIssuerRegistry.compact` | The on-chain registry of Trusted Issuers classified along three axes: **type** × **domain** × **assurance level**. Lets verifiers gate which attestations they trust. | `registerIssuer`, `approveIssuer`, `revokeIssuer`, `updateAssuranceLevel`, `isIssuerApprovedForDomain`, `getIssuerProfile`, `meetsMinimumAssurance` |

Both contracts are **independent**, neither imports the other. Consumers wire them together off-chain via the shared TypeScript SDK. True on-chain cross-contract composition is a future phase once that pattern is proven against the current compiler.

---

## How Consumers Integrate (MVP Pattern)

```text
Consumer DApp (SelectConnect / petProData / realVote / AgenticDID / …)
      │
      │   1. Mint or resolve a DID
      ├──────▶ DIDzRegistry.registerDid(entityType, subjectCommitment, now)
      │         or DIDzRegistry.isDidActive(didId)
      │
      │   2. (Trusted Issuer) Attest something about the DID
      ├──────▶ DIDzRegistry.attestToDid(didId, type, commit, expiresAt, now)
      │
      │   3. (Verifier) Check the attestation is real AND the issuer is trusted
      ├──────▶ DIDzRegistry.verifyAttestation(didId, type, claimedCommit, now)
      └──────▶ TrustedIssuerRegistry.meetsMinimumAssurance(issuerKey, domain, minLevel)
```

In MVP, consumer contracts accept a `didId: Bytes<32>` parameter and trust that the off-chain SDK has already called the relevant DIDz circuits. The SDK (package name TBD, probably `@didz/core`) is where the composition happens.

---

## Entity Types (DIDzRegistry.EntityType)

| Variant | Uint<8> value | Consumer Examples |
|---------|---------------|-------------------|
| `HUMAN` | 0 | safeHealthData, ProMingle, SouLink, realVote, selectConnect cards |
| `AGENT` | 1 | AgenticDID (AI agents), SentinelAI (DAO guardians) |
| `ANIMAL` | 2 | petProData (dogs, cats, exotics), equineProData (horses) |
| `ORGANIZATION` | 3 | EnterpriseZK, Foundations, DAOs, corporate issuers |
| `DEVICE` | 4 | GeoZ oracles, IoT sensors, future supply-chain items |
| `OBJECT` | 5 | SilentLedger assets, DownMan inheritance items, RWA tokens |
| `OTHER` | 6 | Anything else, subject-defined via `subjectCommitment` |

---

## Issuer Model (TrustedIssuerRegistry)

Three axes, as documented in `docs/TRUSTED_ISSUER_AGENT_ARCHITECTURE.md`:

**Axis 1, Type** (`IssuerType`):
`INDIVIDUAL` | `CORPORATION` | `GOVERNMENT_ENTITY` | `INSTITUTION` | `COOPERATIVE` | `DAO`

**Axis 2, Domain**: Any `Bytes<32>`, typically a padded string like `pad(32, "FINANCIAL")` or `pad(32, "MEDICAL")`. An issuer with multiple domains registers multiple profiles.

**Axis 3, Assurance Level** (`AssuranceLevel`):
| Level | Meaning | Appropriate for |
|-------|---------|-----------------|
| `SELF_DECLARED` (0) | Unverified; "I claim to be who I say" | Peer-issued attestations, community trust |
| `PEER_REVIEWED` (1) | Community-verified via web of trust | Mid-trust use cases |
| `REGULATED_ENTITY` (2) | Regulated institution (bank, hospital, gov) | Most commercial/medical use cases |
| `SYSTEM_CRITICAL` (3) | Foundational infrastructure | Root CAs, identity-critical gov agencies |

---

## Design Decisions Log (Apr 17, 2026)

These choices are documented so future contributors can evolve the contracts with full context.

### Q: Why are DIDzRegistry and TrustedIssuerRegistry separate contracts?

Keeping them split means consumers can **opt in** to issuer-gating rather than being forced through it. Many use cases (peer attestations, community signals, reputation systems) work better with permissionless issuance. Verifiers who need higher assurance check `TrustedIssuerRegistry` as a second step. This mirrors W3C VC's philosophy, the verifier decides whose attestations they trust, not the protocol.

### Q: Why are DID records fully public?

Because **DID documents are public by definition** (W3C DID Core, section 5). Any sensitive data about the subject lives off-chain (in their encrypted private state) or in a sibling contract (e.g., KYCz for human KYC data, petProData for medical records). A DID document is the subject's public identity metadata, name, verification keys, service endpoints, none of which is privacy-sensitive.

### Q: Why does the attestation mechanism allow anyone to issue?

At the protocol level, **attestation is permissionless**, any wallet can commit a claim about a DID to chain. Trust is enforced at the **verifier** layer via `TrustedIssuerRegistry`. This layered approach:
- Preserves the W3C VC model where verifiers independently choose issuers they trust
- Avoids a central gatekeeper deciding who gets to make statements
- Allows new issuer types (peer attestations, web-of-trust signals, reputation systems) to emerge without contract changes

### Q: How are attestations revoked?

Only the **original issuer** can revoke their own attestation (via `revokeAttestation`). This preserves non-repudiation. The DID owner can effectively nullify *all* attestations about themselves by deactivating their DID (`deactivateDid`). Historical attestations remain in storage for audit purposes but return `false` from `verifyAttestation` once revoked.

### Q: What about cross-contract calls between these contracts and consumers?

Deferred. The existing AgenticDID contracts have cross-contract call TODOs commented out (`// TODO: Enable when implementing cross-contract calls`), the pattern hasn't been validated on the current compiler yet. MVP deliberately avoids on-chain composition; the off-chain SDK does the wiring. When we're ready, the `sealed ledger` + imported-contract pattern will be tested on the playground first.

### Q: Why 248 max Uint width, not 254?

compactc v0.30.0 reduced the max Uint width from earlier versions. AgenticDID's original `Uint<254>` revocation bitmap was the one fix we had to make across all existing contracts; 248 bits is still plenty for bitmap use cases, and we can shard if we outgrow it.

### Q: What about W3C DID Core compliance (`did:midnight` method)?

The DID record structure here is designed so that a W3C DID Document can be reconstructed off-chain:
- `id` → `did:midnight:<didId>` (where `<didId>` is the Bytes<32> key, hex-encoded)
- `controller` → derived from `ownerKey`
- `authentication` → `ownerKey` with Ed25519/JubJub suite context
- `service` → from off-chain service registry (consumer-specific endpoints)
- `verificationMethod` → owner key + any attestation-derived verification methods

Actual DID Document serialization and the `did:midnight` method spec publication are later-phase work. The on-chain shape supports all of it.

---

## What's Missing (Known Gaps / Future Work)

1. **Recovery controllers**, W3C section 9.9 specifies recovery mechanisms. MVP has single-owner keys only. Multi-controller support (e.g., social recovery via Shamir shares, DownMan inheritance) is Phase 2.
2. **Service endpoints on-chain**, Currently services (API endpoints, messaging relays) are off-chain only. We may add a `serviceEndpoints` Map in Phase 2.
3. **Credential schemas**, Machine-readable schemas for attestation types (e.g., "KYC_TIER_2 has these required fields") are not enforced on-chain. The off-chain SDK handles schema validation.
4. **DIDComm / messaging**, The DIF encrypted messaging layer between DIDs is off-chain and not in scope here.
5. **DAO governance for admin**, `adminKey` is a single wallet in MVP. DAO/multi-sig admin is Phase 2.
6. **Anonymous pairwise control proof**, `prove_pairwise_binding` deliberately reveals the canonical (that IS the accountability reveal). A circuit proving "this pairwise DID belongs to SOME active DIDz" *without naming which* needs a Merkle accumulator over the registry (stdlib `MerkleTree` + private membership path). Planned; until then everyday pairwise use is off-chain signatures only.

---

## Compile & Deploy

Contracts validate syntactically via:
```bash
# Quick validation using the Midnight MCP compiler playground
# (does not require a local compactc install)
# See @/home/js/PixyPi/LEARNINGS_DIDZ_PHASE1_2026-04-17.md for details
```

For full zk-key generation and preprod deployment:
```bash
# With local compactc installed and configured for Midnight preprod
compactc DIDzRegistry.compact build/DIDzRegistry/
compactc TrustedIssuerRegistry.compact build/TrustedIssuerRegistry/
```

Deployment will use the standard Midnight preprod wallet configuration from `/home/js/utils_Midnight/preProd-Wallets/` (per John's environment).

---

## References

- **DIDz Foundation Architecture**: `../docs/DIDZ_DID_FOUNDATION_ARCHITECTURE.md`
- **Trusted Issuer × Agent Architecture**: `../docs/TRUSTED_ISSUER_AGENT_ARCHITECTURE.md`
- **DIDz Miro Architecture**: `../docs/DIDZ_MIRO_ARCHITECTURE.md`
- **DIDz Synopsis**: `../docs/DIDZ_SYNOPSIS.md`
- **SelectConnect Identity Integration**: `../docs/SELECTCONNECT_IDENTITY_INTEGRATION.md`
- **W3C DID Core 1.0**: https://www.w3.org/TR/did-core/
- **W3C VC Data Model 2.0**: https://www.w3.org/TR/vc-data-model-2.0/
- **Decentralized Identity Foundation**: https://identity.foundation/
- **Phase 1 Session Learnings**: `/home/js/PixyPi/LEARNINGS_DIDZ_PHASE1_2026-04-17.md`

---

*Built by Penny 🎀 on Apr 17, 2026, Phase 2 of the DIDz monolith mainnet-readiness push.*
