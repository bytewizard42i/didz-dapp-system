![DIDzMonolith](docs/DIDzMonolith%20picture.png)

# DIDz.io — Anonymous Digital Identity on Midnight

**"Revolutionizing Identity Verification with Accuracy, Security, and Privacy"**

> Your DIDz gives you full control and privacy for your personal information and data, while allowing you to prove your credentials and other attributes to anyone you wish, and only with your permission.

| | |
|---|---|
| **Website** | [didz.io](https://didz.io) |
| **Company** | [EnterpriseZK Labs LLC](https://enterprisezk.com), Pennsylvania, USA |
| **Blockchain** | [Midnight Network](https://midnight.network) (Cardano ecosystem) |
| **Role in DIDzM** | Root identity engine of the four-engine DIDzM system |
| **Status** | Contracts verified & chain-deployed — TestWired (localnet), preprod in progress |
| **Stage** | TestWired via didz-kernel's `@didz/adapter-midnight` ([BUILD_STAGES](../DIDzMonolith-docs/standards/BUILD_STAGES.md)) |

> **Midnight technical rule:** In the DIDzMonolith checkout, follow the [DIDzM sources-of-truth policy](../DIDzMonolith-docs/midnight/MIDNIGHT_SOURCES_OF_TRUTH.md) for source routing and the [current Midnight schema](../DIDzMonolith-docs/midnight/MIDNIGHT_CURRENT_SCHEMA.md) for architecture, integration, and evidence labels.

---

## The Problem

Every day, billions of people are forced to hand over their most sensitive personal information just to prove simple facts about themselves.

- A 22-year-old shows her full driver's license, name, address, date of birth, license number, just to buy a bottle of wine.
- A voter reveals their entire identity to prove they're a citizen over 18.
- A hospital asks for a patient's full background just to check a single compliance question.
- A bank photocopies your passport and stores it in a database that will eventually be breached.

**The entire global identity verification system is built backwards.** It forces you to reveal everything to prove anything. And every time your data is copied, stored, and shared, you lose control of it forever.

---

## The DIDzM Premise

The world's digital verification system is on its head. You must submit large
amounts of personal information to prove a single thing — something that is
really just a yes-or-no question:

> *Does this person meet this minimum (or maximum) requirement?*

Midnight flips this by answering **only the necessary question** with
mathematical certainty of truthfulness for the asker:

- Are you old enough?
- Are you a non-felon?
- Do you have an XYZ degree?
- Do you have a valid driver's license?
- Do you live within X miles of the job you are applying for?
- Do you have allergies?
- Do you have medical insurance?
- Do you qualify for this loan?
- Do you have a reputation for XYZ?
- Do you rightfully own this asset?
- Do you have the authority to open this door?

Every question above is a **yes or no**. Today, answering any one of them
requires surrendering your full identity, your documents, your history, and your
privacy to a stranger who will store it in a database that will eventually be
breached. DIDz answers each with a zero-knowledge proof — mathematically
certain, cryptographically verifiable, and revealing **nothing** beyond the
answer itself.

---

## The Breakthrough

**What if you could prove facts about yourself without revealing who you are?**

The **DIDz DApp System** is a privacy-preserving digital identity platform where:

- A liquor store asks: *"Is this person old enough?"* → **Yes.** No name, no birthday, no address.
- An election poll asks: *"Is this person a legal citizen, over 18, and not a felon?"* → **Yes.** Three facts confirmed. Zero data exposed.
- A hospital asks: *"Has this person passed a background check?"* → **Yes.** No records, no paperwork, no liability.

The answer is **mathematically guaranteed to be correct**, not "probably correct," not "we checked a database." Cryptographically, provably, irrevocably correct via zero-knowledge proofs.

> That "is this person old enough?" example is the **canonical bartender scenario** John introduced at the inaugural Midnight hackathon to explain privacy preserving digital identity. For the story behind it (and the founder's full origin story in his own words), see [`docs/FOUNDER_STORY.md`](docs/FOUNDER_STORY.md).

---

## Current Status (August 2026)

`DIDzRegistry` (17 circuits) and `TrustedIssuerRegistry` (11 circuits) compile
clean on the current toolchain (compactc 0.31.1, 18/18 structural tests) with
full ZK key generation. DIDzRegistry is **deployed and exercised on a local
Midnight network with real ZK proofs** — register → suspend → reactivate →
attest → prove, all chain-confirmed — via the didz-kernel Midnight adapter
(chunked deploy: lean deploy + verifier-key maintenance inserts, since
17-circuit single-tx deploys exceed per-block write budgets). Preprod
deployment is in flight. The SDK packages (didz-api / didz-ui /
identity-provider-api) remain early scaffolds.

**Issuer admission (the security-critical ceremony):** prospective trusted
issuers exist FIRST in [`TestTownDIDz`](../TestTownDIDz/) — the
world-before-the-trust-system test population — carrying dossiers of
independently confirmable evidence (EIN, incorporation, licenses). DIDz.io's
onboarding gate cross-checks them against TestTown's authorities of record
before TrustedIssuerRegistry enrollment, and TestTown's `VILLAIN--*` impostors
must be REFUSED (see `TestTownDIDz/docs/THREAT_MODEL.md`).

---

## Subjects of DIDz — Who (or What) Can Have an Identity

DIDz is a **polymorphic identity substrate**. The same core registry and trusted-issuer machinery serves any entity that needs verifiable, privacy-preserving identity. Each subject type is a tier built on the same foundation, not a separate system — the seven on-chain EntityType tiers of DIDzRegistry v2, mirrored by the didz-kernel's seven-tier `@didz/wallet`:

| Tier | Subject | Real-world examples | DIDzMonolith vertical |
|------|---------|--------------------|-----------------------|
| **Human** | Individual people | Citizens, customers, patients, voters, employees | DIDz.io (this repo), KYCz |
| **Agent** | Autonomous Ai agents | LLM agents, automated services, delegated workers | [AgenticDID](https://github.com/bytewizard42i/AgenticDID_io_me) |
| **Organization** | Businesses, institutions, governments | Companies, universities, hospitals, agencies, NGOs | DIDz.io org tier, EnterpriseZK Labs |
| **Animal** | Living non-human subjects | Companion animals, equine athletes, livestock, exotics | [PetProData](https://github.com/bytewizard42i/petProData), [EquinePro](https://github.com/bytewizard42i/equineProData) |
| **Device** | IoT devices and instruments | Sensors, hardware anchors, scientific instruments | (cross-cutting; kernel device tier) |
| **Object / RWA** | Real-world assets and instruments | Artworks, deeds, vehicles, equipment, supply-chain SKUs | [RWAz](https://github.com/bytewizard42i/RWAz); see [Edda Labs RWA Patterns](docs/EDDALABS_RWA_PATTERNS_FOR_DIDZ.md) |
| **Location** | Geographic anchors | Jurisdiction proofs, privacy-preserving location attestation | [GeoZ](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle) |

For non-human subjects, the **Holder role is fulfilled by a custodian or owner** — a human or organization that controls the subject's DIDz wallet on its behalf. The Trust Triangle below applies identically; only the binding mechanism differs (microchip, RFID, serial number, geolocation, or biometric for the custodian).

---

## How It Works — The Trust Triangle

### 1. The Holder (You, or a Subject You Custody)
You create a pseudonymous digital identity, a **DIDz**, bound to a subject through an appropriate primitive: biometrics (fingerprint, face scan, pulse/ox) for humans, microchip or RFID for animals, serial number or cryptographic anchor for objects and RWAs. Private data is stored in **encrypted private state** on the Midnight blockchain. No one can see it. Not even us. For non-human subjects, a custodian (human or organization) holds the wallet on the subject's behalf.

### 2. The Trusted Issuer (DMV, Bank, Hospital, Government...)
Trusted institutions verify your identity traditionally, scan your license, check your passport, and then **attest** to those facts on-chain. They don't store your data. They cryptographically sign that they verified it, and that signature lives in your private state.

### 3. The Verifier (Liquor Store, Employer, Voting Booth, Exchange...)
Verifiers ask **ZKQueries**, zero-knowledge questions that return only yes or no. They never see the underlying data. They get a mathematically certain answer in seconds.

---

## Compiler-Verified ZK Circuits

This isn't a whitepaper concept. The KYCz Anchor contract compiled to **7 real ZK circuits** back on Compact v0.29.0, and the current registries compile to **28 circuits** (17 + 11) on compactc 0.31.1 — always verify the live toolchain against the [support matrix](https://docs.midnight.network/relnotes/support-matrix):

| Circuit | What It Proves |
|---------|---------------|
| `enrollAnchor` | Trusted Issuer stores verified KYC data in private state |
| `proveAgeAtLeast` | Person is at least N years old (without revealing DOB) |
| `proveKycPassed` | Person has passed KYC at a given assurance level |
| `proveResidency` | Person resides in a specific country (without revealing address) |
| `proveSanctionsClear` | Person is not on sanctions lists (without revealing identity) |
| `proveComposite` | Multiple assertions combined (age + residency + sanctions) |
| `revokeAnchor` | Admin revokes a compromised credential |

---

## Hierarchical Privacy Wallet

DIDz organizes credentials in a folderized smart contract structure:

```
📁 My DIDz Wallet
├── 📁 Government IDs
│   ├── 📄 Driver's License (rescindable)
│   ├── 📄 Passport (rescindable)
│   └── 📄 Voter Registration (rescindable)
├── 📁 Education
│   ├── 📄 PhD - MIT (immutable)
│   └── 📄 Professional Cert (rescindable)
├── 📁 Employment
│   ├── 📄 Current Job (rescindable)
│   └── 📄 Background Check (rescindable)
├── 📁 Financial
│   └── 📄 Credit Score Range (rescindable)
└── 📁 Healthcare
    ├── 📄 Insurance (rescindable)
    └── 📄 Vaccination Record (rescindable)
```

**Immutable** credentials (PhD, citizenship) are permanent. **Rescindable** credentials (licenses, employment) can be revoked by issuers. Non-human tiers provision their own folder sets (title, provenance, encumbrances for assets; health, lineage for animals) — see the didz-kernel `@didz/wallet` tier catalog.

---

## Why This Is Powerful

### For Individuals
- **You own your identity.** Not Facebook. Not Google. Not your government. You.
- **You choose what to reveal.** Prove you're over 21 without showing your birthday.
- **Your data can't be breached** because it isn't stored anywhere except your own encrypted private state.

### For Businesses
- **Instant verification.** No manual ID checks, no background check delays.
- **Zero liability.** You never touch, store, or process personal data, so you can't leak it.
- **Revenue generation.** Trusted Issuers and Verifiers earn revenue per verification call.

### For Governments
- **Eliminate fraud.** Biometric binding makes Sybil attacks mathematically impossible.
- **Modernize services.** Voting, benefits, licensing, all verifiable in seconds.
- **Protect citizens.** No more centralized databases that become targets.

---

## Target Sectors

DIDz transforms identity across **12+ sectors**:

DeFi · Government · Education · Enterprise · Commerce · Supply Chain · Medical · Passports & Travel · Military & Security · Law Enforcement · Intelligence Systems · Polling & Voting · Real-World Assets (art, deeds, vehicles, equipment) · Animal Health & Provenance (companion, equine, livestock) · Autonomous Agents

---

## DIDz Within the DIDzM System

DIDz is the root identity engine in the four-engine DIDzM system. It defines
identity, issuer trust, credentials, lifecycle, and privacy-preserving
presentation primitives. Agent authority is owned by AgenticDID, asset
ownership and provenance by RWAz, and private data orchestration by HelixCTW,
the data-layer engine. DIDz supplies identity primitives to the other three
engines and to conforming applications, but it does not absorb their domain
responsibilities:

| Product | Purpose | How It Uses DIDz |
|---------|---------|-----------------|
| **[KYCz](https://github.com/bytewizard42i/KYCz_us_app)** | Identityless KYC verification | The no-frills base layer, proves KYC compliance without revealing identity |
| **[AgenticDID.io](https://github.com/bytewizard42i/AgenticDID_io_me)** | AI Agent identities | Extends DIDz for autonomous AI agents with delegation and trust chains |
| **[HuddleBridge](https://github.com/bytewizard42i/huddlebridge_app_me_us)** | Semi-decentralized video spaces | DIDz-powered proof of authority, soulbound participation, portable reputation |
| **[ProMingle.net](https://github.com/bytewizard42i/ProMingle_net)** | Decentralized professional networking | DIDz-verified professional credentials |
| **[SouLink.me](https://github.com/bytewizard42i/SouLink_me)** | Social identity linking | DIDz-powered cross-platform verification |
| **[PopCork](https://github.com/bytewizard42i/PopCork)** | Social media platform | DIDz-verified speakers and participants |
| **LegacyKey** | Loose recovery and estate-planning ideation | Explores possible DIDz-authenticated recovery patterns; it is not an established DIDzM recovery subsystem |
| **[safeHealthData.me](https://github.com/bytewizard42i/safeHealthData_me)** | Private health records | DIDz-protected medical data with selective disclosure |
| **[PetProData](https://github.com/bytewizard42i/petProData)** | Companion animal records & identity | DIDz Animal-tier subject, persistent identity across ownership transfers |
| **[EquinePro](https://github.com/bytewizard42i/equineProData)** | Equine identity, provenance, RWA | DIDz Animal-tier + RWA, lineage, breeding rights, tokenized economic interests |
| **[GeoZ](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle)** | Geolocation oracle | Privacy-preserving location proofs for DIDz (jurisdiction, residency) |
| **[MidnightVitals](https://github.com/bytewizard42i/MidnightVitals)** | Real-time diagnostics | Cross-cutting debugging/monitoring for all DIDz-powered apps |
| **NIGHTGATE / NIGHTGATE-MCP** | Planned service adapter and Ai tool bridge | Transports approved DIDz operations and evidence through CAP/OData without replacing DIDz identity, issuer, lifecycle, rotation, or recovery authority |

NIGHTGATE is a planned edge adapter, not a fifth DIDzM engine or a source of
identity or authority. NIGHTGATE-MCP bearer grants authorize transport calls
only; they are not AgenticDID scoped grants or ZK delegation proofs. See the
[NIGHTGATE integration boundary](docs/NIGHTGATE_INTEGRATION.md).

---

## Technology Stack

- **Blockchain**: Midnight Network (privacy-first, ZK-native)
- **Smart Contracts**: Compact language (pragma tracks the current language range — verify against the [support matrix](https://docs.midnight.network/relnotes/support-matrix))
- **Kernel & Adapters**: [didz-kernel](../didz-kernel/) — protocol types, provider seams, conformance suite, `@didz/adapter-midnight`
- **Identity Framework**: Hyperledger Identus (W3C DID standards + anon-creds)
- **Biometrics**: 8-factor weighted liveness score (face, pulse, voice, depth)
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Bun 1.2+ / TypeScript
- **Oracle Integration**: GeoZ for privacy-preserving geolocation

---

## Documentation

| Document | Description |
|----------|-------------|
| [DIDz Synopsis](docs/DIDZ_SYNOPSIS.md) | Full narrative: what we're building and why it matters |
| [PP DIDz Ecosystem Vision](docs/PP_DIDZ_ECOSYSTEM_VISION.md) | Privacy-preserving DID standards for Midnight |
| [DIDz Miro Architecture](docs/DIDZ_MIRO_ARCHITECTURE.md) | Visual architecture diagrams |
| [KYCz Binding Stack](docs/KYCZ_BINDING_STACK.md) | 6-layer binding: DL barcode + face match + biometric liveness |
| [KYCz Biometric Verification](docs/KYCZ_BIOMETRIC_VERIFICATION.md) | 8-factor liveness detection approach |
| [KYCz Deep Dive Reference](docs/KYCZ_DEEP_DIVE_REFERENCE.md) | Full architecture reference |
| [Website Content](docs/DIDZ_WEBSITE_CONTENT.md) | Captured website copy and value propositions |
| [NIGHTGATE Integration](docs/NIGHTGATE_INTEGRATION.md) | Planned CAP/OData service edge and Ai tool boundary |

---

## Build Pipeline

DIDz follows the DIDzM house convention — **DemoLand → TestWired → RealDeal**
([BUILD_STAGES](../DIDzMonolith-docs/standards/BUILD_STAGES.md)):

```
DemoLand → TestWired → RealDeal
              ▲
          WE ARE HERE
```

**Current Phase**: TestWired. Registries deployed and exercised on a local
Midnight network with real ZK proofs via the didz-kernel Midnight adapter;
preprod deployment in flight. DemoLand remains available for offline demos
(`frontend-demoland`, portal on port 3010).

---

## The Bottom Line

> **We are building the identity layer for a world that no longer trusts the systems it was given.**

DIDz doesn't fix the old model. **It replaces it.** With zero-knowledge proofs, a person can prove any fact about themselves without revealing who they are. The math guarantees the answer is correct. The blockchain guarantees it can't be tampered with.

*The Foundation For Reimagining the World's Digital Systems.*

---

## The Existential Threat

![The Existential Threat](docs/media/existential-threat.jpg)

The convergence of autonomous Ai, mass surveillance, and centralized identity databases creates an existential threat to human autonomy. Every digital interaction becomes a data point in someone else's database. Every Ai agent operates without verifiable accountability. Every centralized identity system is a breach waiting to happen.

**DIDzMonolith is the architectural answer.** Four engines, one ecosystem, zero-knowledge proofs on Midnight Network:

| Engine | Role | What It Proves |
|--------|------|----------------|
| **DIDz** | Root identity layer | Who you are, without revealing who you are |
| **AgenticDID** | Agent authority layer | That an Ai agent is authorized, without revealing by whom |
| **RWAz** | Object/asset identity layer | What an asset is and who owns it, without exposing ownership data |
| **HelixCTW** | Data-layer engine | Query and manage private data, without exposing raw facts |

**This project** is part of the DIDzMonolith ecosystem, built on these four engines. The existential threat is real. The architecture is ready.

---

## Regulatory Compliance

This project is part of the DIDzMonolith ecosystem and inherits the four-engine ZK architecture (DIDz + AgenticDID + RWAz + HelixCTW) that provides privacy-by-design advantages for regulatory compliance.

**Applicable frameworks**: SOC 2, ISO 27001, PCI DSS, HIPAA, MiCA — depending on product function and jurisdiction.

**Full compliance deep dive**: [`DIDzMonolith-docs/compliance/REGULATORY_COMPLIANCE_DEEP_DIVE.md`](../DIDzMonolith-docs/compliance/REGULATORY_COMPLIANCE_DEEP_DIVE.md) — engine-by-engine control mappings, product compliance matrix, and implementation roadmap.

**MiCA regulatory notes**: [`DIDzMonolith-docs/compliance/MICA_REGULATORY_NOTES.md`](../DIDzMonolith-docs/compliance/MICA_REGULATORY_NOTES.md) — EU crypto-asset regulation product-by-product matrix.

---

*EnterpriseZK Labs LLC, [didz.io](https://didz.io), [enterprisezk.com](https://enterprisezk.com)*  
*Built on Midnight. Powered by Cardano. Protected by zero-knowledge cryptography.*  
*4x Midnight Hackathon Winner*
