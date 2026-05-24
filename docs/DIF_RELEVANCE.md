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

## Concrete next steps

1. Stand up Universal Resolver as a service on the DIDz infrastructure.
2. Evaluate did:webvh as the default method for new DIDz registrations.
3. Publish a Well-Known DID Configuration for the DIDz domain.

## Last refreshed

May 24, 2026 from DIF homepage and GitHub org listing.
