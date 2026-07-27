# Formal Specifications — where they live

DIDz-io does NOT carry its own `FORMAL_SPECS_W3C_DIF/` package, on
purpose. The normative specification for the DIDz identity model
(canonical DIDz, pairwise presentation DIDs, non-transferable identity,
lifecycle rules, credential commitments) is **§4 of the DIDz Protocol
specification**, which lives with the trust kernel:

> `didz-kernel/FORMAL_SPECS_W3C_DIF/didz-protocol-v0.1.md`

Two documents claiming the same invention would fragment John's
priority-of-invention story; one canonical spec is stronger.

## Related packages in the stack

| Concept | Package |
|---|---|
| DIDz Protocol (trust kernel, all five seams) | `didz-kernel/FORMAL_SPECS_W3C_DIF/` |
| AgenticDID (authority pillar, ZK delegation) | `AgenticDID/FORMAL_SPECS_W3C_DIF/` |
| RWAz (object pillar) | `RWAz/FORMAL_SPECS_W3C_DIF/` |
| HelixCTW (data plane, authority-tiered access) | `HelixCTW/FORMAL_SPECS_W3C_DIF/` |
| zVoting (governance application) | `realVote/FORMAL_SPECS_W3C_DIF/` |
| ZKClutch (privacy-preserving negotiation) | `ZKClutch/FORMAL_SPECS_W3C_DIF/` |

## The one future spec that WILL live here

When the `did:midnight:` DID method (the Fi Standards format) matures
on-chain, a **DID Method specification** is its own well-defined W3C/DIF
deliverable (DIF's DID Methods WG exists precisely to standardize
methods). That package will be created here as
`FORMAL_SPECS_W3C_DIF/did-midnight-method-v0.1.md` — not before the
method stabilizes.

House rule: see "Formal Specifications Standard (FORMAL_SPECS_W3C_DIF)"
in `myAlice/SISTERS_GLOBAL_RULES.md`.
