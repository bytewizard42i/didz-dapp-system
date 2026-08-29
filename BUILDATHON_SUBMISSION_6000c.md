# DIDz - Privacy-Preserving Digital Identity for the World

> *We are not trying to make 100 billion perfect identities. We want to make 1 perfect, soul-bound, privacy-preserving digital identity - for a human, an agent, a company, an animal, and an object - then scale that to necessity, infinitely.*

DIDz is an ambitious, nation-state-level project: the privacy-preserving architecture for the world's identity on Midnight Network. This is the root identity engine of the DIDzMonolith, one of three pillars we submit (DIDz, AgenticDID, RWAz).

## What It Does

DIDz lets any entity hold a soul-bound, privacy-preserving digital identity on Midnight and prove facts about itself with zero-knowledge proofs that reveal nothing beyond the answer.

We created two canonical scenarios. The **Bartender Scenario**: a store asks "is this person old enough?" and gets a guaranteed YES - no name, no birthday, no data stored. The **Job Application Scenario**: an applicant proves they are over 18, live within commuting jurisdiction, have no disqualifying felony, hold the required degree, and have a valid license - without revealing age, address, background, diploma, or license number. The employer learns what it needs, not everything it could collect.

The same primitive serves seven identity tiers with one engine: human, agent, organization, animal, device, object/RWA, location. Each DIDz is an anchor (a hash in the on-chain registry) carrying a hierarchical, tiered smart-contract wallet - folderized credentials like Google Drive for proofs. Identity is deliberately not an NFT; it has no transfer operation. Keys rotate; identity never moves.

## The Problem It Solves

The world's identity-based verification system is on its head. Billions surrender sensitive personal information to prove one binary fact. A 22-year-old shows her full license to buy wine. A voter reveals their entire identity to prove citizenship. A bank photocopies your passport into a database that will be breached.

Every question is a yes or no. DIDz replaces this: encrypted private state on-chain, ZK proofs as answers, nothing exposed beyond the bit. Data can't be breached - it isn't stored anywhere except the holder's encrypted state. Proofs can't be forged - guaranteed by ZK cryptography.

## How We Built It

The Trust Triangle: a Holder creates a pseudonymous DIDz with encrypted private state; a Trusted Issuer (DMV, bank, university) attests to facts on-chain without storing data; a Verifier submits a ZKQuery and gets a mathematically certain yes/no.

28 compiled ZK circuits across two contracts: DIDzRegistry (17 circuits - enrollment, suspension, reactivation, attestation, composite proofs) and TrustedIssuerRegistry (11 circuits - issuer admission, revocation, delegation). Deployed on a local Midnight network with real ZK proofs via the didz-kernel, a 10-package TypeScript SDK with five provider seams (identity, authority, objects, data, enforcement) and ~114 tests green. The authority seam already runs compiled scoped-grant v2 circuits (two-cap budgets, attenuation-only delegation, cascade revocation). The data plane is TestWired on CockroachDB Cloud (hot) and Filecoin/IPFS (cold), hash-verified end-to-end.

The protocol is specified as didz-protocol v0.1, an RFC-style formal spec targeting W3C/DIF. TestTownDIDz provides 35 organizations (3 villain impostors), 20 citizens, animals, and assets as adversarial tests - the admission gate must refuse villains. The whole stack runs as a one-command narrated demo.

Build stage: TestWired (localnet with real ZK proofs, preprod in flight with 17,000 tNIGHT funded). Not yet mainnet - we say so with evidence labels, not asterisks.

## Challenges I Ran Into

1. Per-block write budget: 17-circuit deploys exceed Midnight's limit. Solved with chunked deploys (lean proxy + per-circuit verifier-key inserts).
2. Compact language evolution: Uint width changes, reserved keywords, rejected module-level consts between v0.29 and v0.31. Learned pragma ranges, not hardcoded versions.
3. Soul-binding without NFTs: identity has no transfer operation - not disabled, omitted. Required rethinking the lifecycle.
4. Polymorphic identity without type explosion: seven tiers, one registry, one kernel. EntityType encoding and tiered wallet abstraction.
5. Issuer admission: TestTown villains as adversarial tests. The gate must reject them or the system isn't ready.
6. Vibe-coding skepticism: the founder is openly a vibe-coder who lost a hackathon for admitting it. Built a nation-state-level ZK architecture with AI and SoulSketch (open-sourced).

## Technologies I Used

Midnight Network - Compact (compactc 0.31.1) - 28 ZK circuits - didz-kernel (10 TS packages, five seams, ~114 tests) - didz-protocol v0.1 spec - Hyperledger Identus - CockroachDB Cloud (hot) - Filecoin + IPFS (cold) - Bun + TypeScript - React + TailwindCSS - 8-factor biometrics - GeoZ oracle - TestTownDIDz (Python, villains) - Docker + localnet node - SoulSketch.

## What We Learned

ZK proofs are foundational architecture, not a bolt-on. Every layer was rethought from first principles. One perfect identity, then scale, was the right instinct. The issuer is the attack surface, not the cryptography; villain tests made trust testable. Soul-bound by architectural absence beats convention. Compact is young and we help shape it. Vibe-coding a ZK identity system works - thinking determines quality, not the tool.

## What's Next for DIDz

Immediate: preprod deployment, SDK maturation, conformance across all seven tiers, resolve six lifecycle rulings. Near-term: mainnet with audited contracts, deepen AgenticDID delegation on preprod, productize RWAz asset-wallet "digital glovebox", promote protocol spec for W3C/DIF. Long-term: the identity layer for a world that no longer trusts the systems it was given. One perfect identity, scaled infinitely.

*Built on Midnight. Powered by Cardano. Protected by zero-knowledge cryptography. 4x Midnight Hackathon Winner.*
