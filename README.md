# DIDz.io, Anonymous Digital Identity on Midnight

**"Revolutionizing Identity Verification with Accuracy, Security, and Privacy"**

> Your DIDz gives you full control and privacy for your personal information and data, while allowing you to prove your credentials and other attributes to anyone you wish, and only with your permission.

**Website**: [didz.io](https://didz.io)  
**Company**: [EnterpriseZK Labs LLC](https://enterprisezk.com), Pennsylvania, USA  
**Blockchain**: [Midnight Network](https://midnight.network) (Cardano ecosystem)  
**Status**: Architecture + Prototyping

---

![DIDzMonolith](docs/DIDzMonolith%20picture.png)

---

## The Problem

Every day, billions of people are forced to hand over their most sensitive personal information just to prove simple facts about themselves.

- A 22-year-old shows her full driver's license, name, address, date of birth, license number, just to buy a bottle of wine.
- A voter reveals their entire identity to prove they're a citizen over 18.
- A hospital asks for a patient's full background just to check a single compliance question.
- A bank photocopies your passport and stores it in a database that will eventually be breached.

**The entire global identity verification system is built backwards.** It forces you to reveal everything to prove anything. And every time your data is copied, stored, and shared, you lose control of it forever.

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

## Subjects of DIDz, Who (or What) Can Have an Identity

DIDz is a **polymorphic identity substrate**. The same core registry and trusted-issuer machinery serves any entity that needs verifiable, privacy-preserving identity. Each subject type is a tier built on the same foundation, not a separate system.

| Tier | Subject | Real-world examples | DIDzMonolith vertical |
|------|---------|--------------------|-----------------------|
| **Human** | Individual people | Citizens, customers, patients, voters, employees | DIDz.io (this repo), KYCz |
| **Organization** | Businesses, institutions, governments | Companies, universities, hospitals, agencies, NGOs | DIDz.io org tier, EnterpriseZK Labs |
| **Agent** | Autonomous Ai agents | LLM agents, automated services, delegated workers | [AgenticDID](https://github.com/bytewizard42i/AgenticDID_io_me) |
| **Animal** | Living non-human subjects | Companion animals, equine athletes, livestock, exotics | [PetProData](https://github.com/bytewizard42i/petProData), [EquinePro](https://github.com/bytewizard42i/equineProData) |
| **Object / RWA** | Real-world assets and instruments | Artworks, deeds, vehicles, equipment, supply-chain SKUs, scientific instruments | (cross-cutting; see [Edda Labs RWA Patterns](docs/EDDALABS_RWA_PATTERNS_FOR_DIDZ.md)) |

For non-human subjects (animals, objects, RWAs), the **Holder role is fulfilled by a custodian or owner**, a human or organization that controls the subject's DIDz wallet on its behalf. The Trust Triangle below applies identically; only the binding mechanism differs (microchip, RFID, serial number, geolocation, or biometric for the custodian).

---

## How It Works, The Trust Triangle

### 1. The Holder (You, or a Subject You Custody)
You create a pseudonymous digital identity, a **DIDz**, bound to a subject through an appropriate primitive: biometrics (fingerprint, face scan, pulse/ox) for humans, microchip or RFID for animals, serial number or cryptographic anchor for objects and RWAs. Private data is stored in **encrypted private state** on the Midnight blockchain. No one can see it. Not even us. For non-human subjects, a custodian (human or organization) holds the wallet on the subject's behalf.

### 2. The Trusted Issuer (DMV, Bank, Hospital, Government...)
Trusted institutions verify your identity traditionally, scan your license, check your passport, and then **attest** to those facts on-chain. They don't store your data. They cryptographically sign that they verified it, and that signature lives in your private state.

### 3. The Verifier (Liquor Store, Employer, Voting Booth, Exchange...)
Verifiers ask **ZKQueries**, zero-knowledge questions that return only yes or no. They never see the underlying data. They get a mathematically certain answer in seconds.

---

## Compiler-Verified ZK Circuits

This isn't a whitepaper concept. The KYCz Anchor contract compiles to **7 real ZK circuits** on Compact v0.29.0:

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

**Immutable** credentials (PhD, citizenship) are permanent. **Rescindable** credentials (licenses, employment) can be revoked by issuers.

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

## The DIDz Ecosystem

DIDz.io is the **foundation layer**, everything else builds on top:

| Product | Purpose | How It Uses DIDz |
|---------|---------|-----------------|
| **[KYCz](https://github.com/bytewizard42i/KYCz_us_app)** | Identityless KYC verification | The no-frills base layer, proves KYC compliance without revealing identity |
| **[AgenticDID.io](https://github.com/bytewizard42i/AgenticDID_io_me)** | AI Agent identities | Extends DIDz for autonomous AI agents with delegation and trust chains |
| **[HuddleBridge](https://github.com/bytewizard42i/huddlebridge_app_me_us)** | Semi-decentralized video spaces | DIDz-powered proof of authority, soulbound participation, portable reputation |
| **[ProMingle.net](https://github.com/bytewizard42i/ProMingle_net)** | Decentralized professional networking | DIDz-verified professional credentials |
| **[SouLink.me](https://github.com/bytewizard42i/SouLink_me)** | Social identity linking | DIDz-powered cross-platform verification |
| **[PopCork](https://github.com/bytewizard42i/PopCork)** | Social media platform | DIDz-verified speakers and participants |
| **LegacyKey** | Crypto estate planning | DIDz-authenticated Shamir secret sharing |
| **[safeHealthData.me](https://github.com/bytewizard42i/safeHealthData_me)** | Private health records | DIDz-protected medical data with selective disclosure |
| **[PetProData](https://github.com/bytewizard42i/petProData)** | Companion animal records & identity | DIDz Animal-tier subject, persistent identity across ownership transfers |
| **[EquinePro](https://github.com/bytewizard42i/equineProData)** | Equine identity, provenance, RWA | DIDz Animal-tier + RWA, lineage, breeding rights, tokenized economic interests |
| **[GeoZ](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle)** | Geolocation oracle | Privacy-preserving location proofs for DIDz (jurisdiction, residency) |
| **[MidnightVitals](https://github.com/bytewizard42i/MidnightVitals)** | Real-time diagnostics | Cross-cutting debugging/monitoring for all DIDz-powered apps |

---

## Technology Stack

- **Blockchain**: Midnight Network (privacy-first, ZK-native)
- **Smart Contracts**: Compact language (pragma >= 0.20)
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

---

## Build Pipeline

```
Ideation → Architecture → DemoLand → Backend Skeleton → RealDeal
                ▲
            WE ARE HERE
```

**Current Phase**: Architecture, Binding model, assertion schema, biometric approach, and ZK circuits defined. KYCz anchor contract compiles. DemoLand prototyping next.

---

## The Bottom Line

> **We are building the identity layer for a world that no longer trusts the systems it was given.**

DIDz doesn't fix the old model. **It replaces it.** With zero-knowledge proofs, a person can prove any fact about themselves without revealing who they are. The math guarantees the answer is correct. The blockchain guarantees it can't be tampered with.

*The Foundation For Reimagining the World's Digital Systems.*

---

*EnterpriseZK Labs LLC, [didz.io](https://didz.io), [enterprisezk.com](https://enterprisezk.com)*  
*Built on Midnight. Powered by Cardano. Protected by zero-knowledge cryptography.*  
*4x Midnight Hackathon Winner*
