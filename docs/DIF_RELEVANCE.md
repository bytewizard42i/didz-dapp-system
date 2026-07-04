# DIF Relevance for DIDz-io

> **Canonical source**: [`/home/js/DIDzMonolith/monolith-docs/DIF_KNOWLEDGE_BASE.md`](/home/js/DIDzMonolith/monolith-docs/DIF_KNOWLEDGE_BASE.md)
>
> This file is a short pointer. The deep content (specs, ecosystem, integration patterns, anti-patterns) lives in the canonical knowledge base. Refresh this file only when DIDz-io's DIF needs materially change.

## Why DIF matters for DIDz-io

DIDz-io is the core DID registry layer for the family. It should be a thin wrapper around DIF standards rather than inventing parallel mechanisms. Universal Resolver, Universal Registrar, and the DID Methods WG output are directly applicable.

## DIF specs to adopt

- **DID Methods WG**: track method specifications and lifecycle conventions
- **Universal Resolver** and **Universal Registrar**: run these as sidecars instead of building per-method logic into DIDz
- **did:webvh**: strong candidate for the default DIDz-anchored method (verifiable history plus self-hosted)
- **Presentation Exchange**: when DIDz-issued credentials are requested by counterparties
- **Well-Known DID Configuration**: link a DIDz-anchored DID to a domain

## Integration patterns from the canonical doc

- Pattern A (Universal Resolver and Registrar as shared infra)
- Pattern B (Presentation Exchange for credential proofs)

## New since May (July 4, 2026 deep dive)

- **KYA-OS** (Know Your Agent Operating System): Vouched's agentic identity framework,
  donated to DIF, v1 in WG approval. DIDs + VCs for agent identity, **delegation as
  scoped tamper-evident credentials**, 3 conformance levels. AgenticDID should be
  KYA-OS-conformant at the interface and differentiate with ZK proofs of delegated
  authority on Midnight private state. See canonical KB section 5a.
- **Credential Trust Establishment**: adopt for the DIDz Trusted Issuer registry
  instead of inventing one.
- **DID Traits**: publish a traits document if/when `did:midnight` ships.
- **Peer DID method**: align our pairwise per-context DIDz derivation with `did:peer`
  semantics rather than inventing a format.
- **Creator Assertions WG (C2PA)**: content provenance assertions; relevant to
  onlyHumans (anti-deepfake), PopCork/HuddleBridge media, and RWA provenance.

## Concrete next steps

1. Stand up Universal Resolver as a service on the DIDz infrastructure.
2. Evaluate did:webvh as the default method for new DIDz registrations.
3. Publish a Well-Known DID Configuration for the DIDz domain.
4. Make ZKQueries speak **Presentation Exchange** request/response at the interface.
5. Track TAAWG/KYA-OS weekly; consider joining via DIF membership (IOHK already a member).

## Last refreshed

July 4, 2026 deep dive (TAAWG/KYA-OS focus); previously May 24, 2026.
