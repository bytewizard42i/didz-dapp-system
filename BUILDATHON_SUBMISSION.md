# DIDz - Privacy-Preserving Digital Identity for the World

> **Motto:** *Privacy Preserving Digital Identity for the World. DIDz, AgenticDID, RWAz.*

> **First-principles ethos:**
>
> *We are not trying to make 100 billion perfect identities. We want to make 1 perfect, soul-bound, privacy-preserving digital identity - for a human, an agent, a company, an animal, and an object - then scale that to necessity, infinitely.*

DIDz is an ambitious, nation-state-level project. We are building the privacy-preserving architecture for the world's identity - the identity substrate that governments, institutions, enterprises, and individuals will rely on when the old model of "hand over everything to prove anything" finally collapses under its own weight. Think of it as what Commerce Bank did for branch banking - a single, radical bet on a better architecture that eventually became Toronto-Dominion. We're making that bet for digital identity: one perfect identity primitive, proven with zero-knowledge proofs, deployed on the Midnight Network.

This submission covers the **DIDz DApp System** - the root identity engine of the DIDzMonolith ecosystem. It is one of three companion projects we are submitting: **DIDz** (root identity), **AgenticDID** (agent authority), and **RWAz** (real-world-asset identity). Together they form a three-pillar model for proving without revealing.

---

## What It Does

DIDz lets any entity - a human, an AI agent, a company, an animal, or a physical object - hold a **soul-bound, privacy-preserving digital identity** on the Midnight Network, and prove facts about themselves with zero-knowledge proofs that reveal **nothing** beyond the answer itself.

### The canonical scenario

A liquor store asks: *"Is this person old enough?"*

Today, the customer hands over a driver's license - name, address, date of birth, license number, organ-donor status - to answer a yes-or-no question. Every piece of that data gets photocopied into a database that will eventually be breached.

With DIDz, the store submits a **ZKQuery**. The answer comes back: **Yes.** Cryptographically guaranteed. No name. No birthday. No address. No data stored. No data breached. The math proves the answer is correct; the blockchain proves it can't be tampered with.

### Beyond the bartender

That same primitive scales to every verification interaction in the economy:

| Verifier asks | DIDz proves | What's exposed |
|---|---|---|
| "Is this person old enough?" | Age ≥ 21 | Nothing else |
| "Is this person a citizen, over 18, and not a felon?" | Three facts, one proof | Nothing else |
| "Does this person have a valid driver's license?" | License is valid | No license number |
| "Does this person qualify for this loan?" | Credit score in range | No exact score |
| "Does this company have EIN 12-3456789?" | EIN matches | No other filings |
| "Does this agent have authority to act for this human?" | Delegation proof | No identity of the human |
| "Does this person rightfully own this asset?" | Title chain verified | No purchase history |

### Seven identity tiers - one engine

DIDz is a **polymorphic identity substrate**. The same registry, the same trusted-issuer machinery, the same ZK proof system serves seven entity tiers - not seven separate systems, but seven configurations of one foundation:

| Tier | Who/What | Example |
|---|---|---|
| **Human** | Individual people | Citizens, voters, patients |
| **Agent** | Autonomous AI agents | LLM workers, delegated services |
| **Organization** | Businesses, governments | Companies, universities, agencies |
| **Animal** | Living non-human subjects | Companion animals, equine athletes, livestock |
| **Device** | IoT and instruments | Sensors, hardware anchors |
| **Object / RWA** | Real-world assets | Artworks, deeds, vehicles, equipment |
| **Location** | Geographic anchors | Jurisdiction proofs, location attestations |

Non-human tiers are custodied by a human or organization that holds the wallet on the subject's behalf - but the identity belongs to the subject, not the custodian.

### Soul-bound by design - and deliberately not an NFT

A DIDz identity is **not an NFT**. It has no transfer operation. Keys can rotate; identity never moves. This makes the soul-binding stronger than typical NFT standards - it's not a convention, it's an architectural absence. Your identity is yours for life (or for the life of the asset).

Concretely, the current architecture is: a DIDz is an **anchor - a cryptographic commitment (hash) in the on-chain registry** - that carries with it a **hierarchical, tiered smart-contract wallet** (the folderized credential structure below). The anchor never moves; the wallet it carries is where credentials, grants, and proofs live. Ownership semantics for transferable things (assets, titles) live in **RWAz**, not in the identity itself - an asset's own DIDz wallet gets *mounted* into the current titleholder's wallet, so the thing that transfers is custody of the wallet, never the identity.

**Open research paths** (we list these honestly - the anchor model is our working ruling, not dogma):

| Path | Idea | Trade-off |
|---|---|---|
| **Anchor hash + tiered wallet** (current) | Registry commitment carries a hierarchical smart-contract wallet | Maximum flexibility; soul-binding by architectural absence of transfer |
| Soul-bound token (SBT-style) | Non-transferable token standard | Interop with token tooling, but "non-transferable token" is a patch on a transfer-first design - can be wrapped or overridden |
| Pure off-chain DID + on-chain proofs only | Identity lives entirely in holder state; chain sees only proofs | Strongest privacy, but weakens registry-anchored lifecycle (suspend/reactivate/revoke) |
| Hybrid: anchor + per-context pairwise DIDs | One root anchor, unlinkable pairwise child DIDs per relationship | Best unlinkability; key-management complexity (our key-derivation ruling favors independent keys per DIDz for exactly this reason) |

### The hierarchical privacy wallet

Every DIDz carries a folderized credential wallet - think Google Drive for proofs:

```
📁 My DIDz Wallet
├── 📁 Government IDs
│   ├── 📄 Driver's License (rescindable)
│   ├── 📄 Passport (rescindable)
│   └── 📄 Voter Registration (rescindable)
├── 📁 Education
│   ├── 📄 PhD - MIT (immutable)
│   └── 📄 Professional Cert (rescindable)
├── 📁 Financial
│   └── 📄 Credit Score Range (rescindable)
└── 📁 Healthcare
    ├── 📄 Insurance (rescindable)
    └── 📄 Vaccination Record (rescindable)
```

**Immutable** credentials (degrees, citizenship) are permanent. **Rescindable** credentials (licenses, employment) can be revoked by issuers. Each tier provisions its own folder sets - assets get title, provenance, encumbrances; animals get health, lineage.

---

## The Problem It Solves

### The world's identity verification system is built backwards

Every day, billions of people are forced to surrender their most sensitive personal information to prove simple, binary facts about themselves:

- A 22-year-old shows her full driver's license - name, address, DOB, license number - to buy a bottle of wine.
- A voter reveals their entire identity to prove they're a citizen over 18.
- A hospital asks for a patient's full background to check one compliance question.
- A bank photocopies your passport and stores it in a database that **will** be breached.

Every question above is a **yes or no**. But today, answering any one of them requires surrendering your full identity, your documents, your history, and your privacy to a stranger who stores it in a database that becomes a target.

### The cost of the current model

| Harm | Scale |
|---|---|
| **Data breaches** | Billions of records exposed annually - Equifax, Marriott, Anthem, government databases |
| **Identity theft** | The fastest-growing crime in the digital economy |
| **Surveillance creep** | Every verification creates a permanent data trail in someone else's database |
| **AI agent accountability gap** | Autonomous agents act with no verifiable identity or authority chain |
| **Asset provenance fraud** | Art forgery, title fraud, supply-chain counterfeiting - no cryptographic chain of custody |
| **Exclusion** | Billions of people without government-issued ID cannot participate in the digital economy |

### The DIDz answer

DIDz doesn't fix the old model. **It replaces it.** Instead of copying data to verify it, DIDz stores encrypted private state on-chain and answers verification queries with zero-knowledge proofs - mathematically certain, cryptographically verifiable, revealing **nothing** beyond the answer.

The data can't be breached because it isn't stored anywhere except the holder's encrypted private state. The proof can't be forged because it's guaranteed by ZK cryptography. The answer can't be tampered with because it's anchored on the Midnight blockchain.

---

## How We Built It

### Architecture - the Trust Triangle

```
         ┌──────────────────────┐
         │   TRUSTED ISSUER     │
         │  (DMV, Bank, Hospital,│
         │   Government, Univ.)  │
         └─────────┬────────────┘
                   │ attests to facts on-chain
                   ▼
    ┌──────────────────────────────┐
    │       THE HOLDER (DIDz)       │
    │  encrypted private state on   │
    │   Midnight - no one can see   │
    │   it, not even us             │
    └──────────────┬───────────────┘
                   │ submits ZK proof
                   ▼
    ┌──────────────────────────────┐
    │      THE VERIFIER            │
    │  (Store, Employer, Exchange, │
    │   Voting Booth, Agent)       │
    │  gets YES/NO - nothing else  │
    └──────────────────────────────┘
```

1. **The Holder** creates a pseudonymous DIDz, bound to a subject through an appropriate primitive (biometrics for humans, microchip for animals, serial number for objects). Private data lives in encrypted on-chain state.
2. **The Trusted Issuer** verifies identity traditionally, then attests to facts on-chain with a cryptographic signature. They don't store the data - they sign that they verified it.
3. **The Verifier** submits a ZKQuery and receives a mathematically certain yes/no answer. They never see the underlying data.

### Smart contracts - 28 compiled ZK circuits

This isn't a whitepaper concept. The contracts compile to real zero-knowledge circuits on Midnight's Compact language:

| Contract | Circuits | What They Prove |
|---|---|---|
| **DIDzRegistry** | 17 | Identity enrollment, suspension, reactivation, attestation, and composite proofs (age + residency + sanctions in one query) |
| **TrustedIssuerRegistry** | 11 | Issuer admission, credential revocation, authority delegation, and issuer-status proofs |

Key circuits include:

- `enrollAnchor` - Trusted Issuer stores verified KYC data in private state
- `proveAgeAtLeast` - Person is at least N years old (without revealing DOB)
- `proveKycPassed` - Person has passed KYC at a given assurance level
- `proveResidency` - Person resides in a specific country (without revealing address)
- `proveSanctionsClear` - Person is not on sanctions lists (without revealing identity)
- `proveComposite` - Multiple assertions combined into a single proof
- `revokeAnchor` - Admin revokes a compromised credential

### The didz-kernel - protocol operating system

The contracts are wrapped by the **didz-kernel** - the "operating system for trust in the agentic economy." It defines protocol types, **five provider seams**, a conformance test suite, and the adapter layer that connects DIDz to Midnight (and future chains). The five seams separate the questions existing systems conflate:

| Question | Engine | Kernel seam |
|---|---|---|
| WHO exists? | DIDz | `IdentityProvider` |
| WHAT may act, within what bounds? | AgenticDID | `AuthorityProvider` |
| WHAT objects exist, who holds them? | RWAz | `ObjectProvider` |
| WHAT data, at what visibility tier? | HelixCTW | `DataGateway` |
| Is THIS exact action allowed right now? | Enforcement (concept) | `EnforcementGate` |

Ten packages plus two narrated example demos:

```
didz-kernel/packages/
├── kernel-types          ← protocol vocabulary & shared types
├── kernel-core           ← the five provider seams + Kernel orchestrator
├── kernel-conformance    ← the executable meaning of "conforms to the DIDz Protocol"
├── kernel-demoland       ← deterministic in-memory reference providers
├── wallet                ← 7-tier hierarchical privacy wallet
├── adapter-midnight      ← identity + object + AUTHORITY seams on real compiled circuits
├── adapter-midnight-localnet ← real ZK transactions on a live local Midnight network
├── adapter-helixctw      ← data plane: tiered queries, commitment storage, cold docs
├── adapter-nightgate     ← read-only service edge (locally verified)
├── admission-gate        ← trusted-issuer admission ceremony (villain-tested)
└── examples/             ← agent-shopping + "A Day in TestTown" narrated demos
```

**~114 tests green** across the workspace, and every externally visible output carries an honest **evidence label** - `MOCK`, `REALDEAL_TEST`, `REALDEAL`, or `PLANNED` - so no demo ever masquerades as a deployment.

**The authority seam is already real.** The Midnight adapter backs `AuthorityProvider` with compiled scoped-grant v2 circuits: two-cap spend budgets, attenuation-only delegation (a delegate can never hold more authority than its delegator), on-chain budget reservation, and cascade revocation. This is the AgenticDID pillar running through the same kernel that runs identity.

**The data plane is TestWired too.** The `adapter-helixctw` data plane runs its hot layer on a live CockroachDB Cloud cluster (seeded with 20 citizens, 4 assets, and 35 hash-indexed documents) and its cold layer on Filecoin - with retrieval + hash-verification proven end-to-end on a real IPFS node. Credentials are stored as **commitments, never raw claims**.

### The formal specification - didz-protocol v0.1

The protocol itself is written up as an RFC-style formal specification (`FORMAL_SPECS_W3C_DIF/didz-protocol-v0.1.md`) - RFC 2119 normative language with plain-English sidebars - targeting eventual W3C/DIF community submission. The conformance suite is the executable form of the spec: any adapter that passes it is a lawful implementation. We're not just building a product; we're specifying a protocol.

### TestTownDIDz - the world before the trust system

Before an institution can become a Trusted Issuer on DIDz, it must first exist in **TestTownDIDz** - our simulated world-before-the-trust-system. TestTown is a generated population of dossiers with independently confirmable evidence (EINs, incorporation records, licenses): **35 organizations, 20 citizens, plus animals and asset dossiers spanning every lifecycle stage**. DIDz's admission gate cross-checks prospective issuers against TestTown's authorities of record.

Critically, TestTown includes **villain impostors** (`VILLAIN--*` dossiers, 3 among the organizations) - fabricated entities with plausible-looking but fake credentials. The admission gate **must refuse them**. This is our security-critical ceremony: if the gate can't reject a villain, the system isn't ready. The whole stack runs as a narrated, one-command story - **"A Day in TestTown"** (`npm run demo`) - on real compiled circuits.

### Build stages - honest about where we are

DIDz follows the DIDzMonolith house convention: **DemoLand → TestWired → RealDeal**.

```
DemoLand → TestWired → RealDeal
              ▲
          WE ARE HERE
```

- **DemoLand**: Offline demos, portal on port 3010, narrated kernel demos - available now.
- **TestWired** (current): DIDzRegistry (all 17 circuits) **and** RWAz's `rwa_registry` deployed and exercised on a local Midnight network with **real ZK proofs** - register → suspend → reactivate → attest → prove, all chain-confirmed - via the didz-kernel Midnight adapters. The data plane is TestWired on CockroachDB Cloud + Filecoin. Preprod deployment is in flight, with a funded deployment wallet (17,000 tNIGHT) and dust registration already on-chain.
- **RealDeal**: Mainnet. Not yet - and we say so with evidence labels, not asterisks.

The deploy itself required a **chunked strategy**: 17-circuit single-transaction deploys exceed Midnight's per-block write budget, so we split into a lean deploy followed by verifier-key maintenance inserts. That was a hard-won lesson.

---

## Challenges I Ran Into

### 1. Per-block write budget vs. circuit count

A 17-circuit `DIDzRegistry` cannot be deployed in a single transaction - it exceeds Midnight's per-block write budget. We solved this with a **chunked deploy**: a lean initial transaction that puts the contract on-chain, followed by maintenance transactions that insert verifier keys circuit-by-circuit. This wasn't documented anywhere - we hit the wall and engineered around it.

### 2. Compact language evolution

Midnight's Compact language is evolving rapidly. Between v0.29 and v0.31, we saw `Uint<254>` shrink to `Uint<248>`, `let` become reserved (forcing all locals to `const`), module-level `const` declarations get rejected, and bitwise `|` on `Uint` types break. Each compiler bump required contract revisions. We learned to always check the support matrix before starting work and to use pragma ranges, not hardcoded versions.

### 3. Soul-binding without NFTs

The obvious approach to "identity you can't transfer" is an NFT with transfer disabled. But that's a convention, not an architecture - it can be patched, overridden, or wrapped. We chose a harder path: **identity has no transfer operation at all.** It's not that transfer is forbidden; it's that the concept doesn't exist in the contract. Keys rotate; identity doesn't move. This required rethinking the entire lifecycle model.

### 4. Polymorphic identity without type explosion

Seven entity tiers, each with different binding mechanisms, credential folders, and custodian requirements - but one registry, one proof system, one kernel. Avoiding a separate contract per tier while still enforcing tier-specific rules (e.g., animals need custodian binding, assets need title chains) required careful EntityType encoding and the tiered wallet abstraction in the kernel.

### 5. The issuer admission problem

A privacy-preserving identity system is only as trustworthy as its issuers. If anyone can become a Trusted Issuer, the whole thing is theater. We built the TestTownDIDz → admission-gate → TrustedIssuerRegistry pipeline as a security-critical ceremony, with villain impostors as a built-in adversarial test. Getting the gate to reliably reject villains while accepting legitimate institutions was a multi-iteration effort.

### 6. Vibe-coding skepticism

The founder is openly a vibe-coder - he uses AI to build, and he's transparent about it. He lost one early hackathon because he told the judges how he did it. By the next one, everyone was vibe-coding. Building a nation-state-level identity architecture as a vibe-coder, in a privacy-first language (Compact) that AI tools are still learning, required extraordinary persistence and a custom persistent-memory AI protocol (SoulSketch, open-sourced).

---

## Technologies I Used

| Layer | Technology | Why |
|---|---|---|
| **Blockchain** | [Midnight Network](https://midnight.network) | Privacy-first, ZK-native, Cardano ecosystem |
| **Smart Contracts** | [Compact](https://docs.midnight.network) language | Midnight's native ZK contract language |
| **Compiler** | compactc 0.31.1 (language pragma 0.23) | Current stable toolchain - verified against the [support matrix](https://docs.midnight.network/relnotes/support-matrix) |
| **ZK Proofs** | 28 compiled circuits (17 + 11) | Real, compiler-verified zero-knowledge circuits |
| **Identity Framework** | Hyperledger Identus | W3C DID standards + AnonCreds interop |
| **Kernel** | didz-kernel (10 TypeScript packages + 2 narrated demos) | Five provider seams, conformance suite, ~114 tests green |
| **Protocol Spec** | didz-protocol v0.1 (RFC-style) | Formal specification targeting W3C/DIF community submission |
| **Data Plane (hot)** | CockroachDB Cloud | TestWired hot layer - tiered queries, commitment storage |
| **Data Plane (cold)** | Filecoin + IPFS (Lighthouse) | Hash-verified cold-document retrieval, proven end-to-end |
| **Backend** | Bun 1.2+ / TypeScript | Fast runtime, first-class TS |
| **Frontend** | React + TypeScript + TailwindCSS | DemoLand portal + future dApp UI |
| **Biometrics** | 8-factor weighted liveness score | Face, pulse, voice, depth - for human binding |
| **Oracle** | GeoZ | Privacy-preserving geolocation proofs |
| **Test Population** | TestTownDIDz (Python generator) | Simulated world with authentic + villain dossiers |
| **DevOps** | Docker Compose, localnet Midnight node | TestWired deployment target |
| **AI Development** | SoulSketch (custom persistent-memory protocol) | Open-source vibe-coding framework |

---

## What We Learned

### 1. "Prove without revealing" is harder than it sounds - but it's the only honest architecture

Zero-knowledge proofs aren't a feature you bolt on. They're a foundational architecture that changes how every system decision gets made. Where does data live? (Encrypted private state, on-chain.) Who can see it? (No one, not even the platform.) How do you verify? (ZK queries, not database lookups.) How do you revoke? (Issuer-side revocation, holder-side claim deletion, immutable provenance.) Every layer had to be rethought from first principles.

### 2. One perfect identity, then scale - is the right instinct

We started trying to model every identity use case simultaneously. It was chaos. The breakthrough was the first-principles ethos: build **one** perfect identity primitive - soul-bound, privacy-preserving, ZK-proven - for one entity kind. Then parameterize it across seven tiers. Then let the ecosystem build applications on top. The kernel/wallet/adapter architecture emerged from that discipline.

### 3. The issuer is the attack surface, not the cryptography

The ZK math is sound. The weak link is always: who gets to be a Trusted Issuer? If the admission ceremony is weak, the proofs are theater. Building TestTownDIDz with villain impostors as a built-in adversarial test was one of the most important decisions we made - it turned issuer trust from an assumption into a testable property.

### 4. Soul-bound > NFT for identity

Every time we considered "should identity be an NFT?", we hit the same wall: NFTs are designed to be transferable. Making them non-transferable is a patch on a transfer-first design. Identity should be transfer-**impossible** by construction, not by convention. Removing the transfer operation entirely - not disabling it, *omitting* it - was a philosophical and architectural commitment that simplified everything downstream.

### 5. Compact is young, and that's an opportunity

The Compact language is evolving fast. Things break between versions. But that also means the language is being shaped by the people building on it right now - and we're one of them. Filing issues, hitting walls, and engineering around limitations is how a language matures. We'd rather build on a young language that's growing than a mature language that's frozen.

### 6. Vibe-coding a ZK identity system is possible - and it should be celebrated

The founder is a vibe-coder. He's transparent about it. He's won four hackathons this way. Building a nation-state-level privacy architecture with AI assistance, in a language that AI tools are still learning, required a custom persistent-memory protocol and extraordinary persistence. The lesson: the tool doesn't determine the quality of the architecture. The thinking does.

---

## What's Next for DIDz

### Immediate (this buildathon → Q4 2026)

- **Preprod deployment** - Move from localnet TestWired to Midnight preprod, exercise the full register → attest → prove lifecycle on a live network.
- **SDK maturation** - The `didz-api`, `didz-ui`, and `identity-provider-api` packages are early scaffolds. Bring them to functional parity with the contracts.
- **Conformance suite expansion** - Extend the kernel conformance tests to cover the full seven-tier matrix, not just the human tier.
- **TestTownDIDz lifecycle catalog** - Resolve the six open lifecycle rulings identified in `LIFECYCLE_CATALOG.md` (asset wallet mounting, key derivation, erasure permissions, and more).

### Near-term (2027)

- **RealDeal (mainnet)** - Graduate from TestWired to mainnet deployment with audited contracts.
- **AgenticDID deepening** - The agent-authority seam already runs on real compiled scoped-grant circuits (two-cap budgets, attenuation-only delegation, cascade revocation) through the kernel; next is taking the delegation chain end-to-end on preprod and productizing the agent wallet tier.
- **RWAz deepening** - The `rwa_registry` is already deployed alongside DIDzRegistry on localnet; next is the asset-wallet "digital glovebox" - real-world assets carrying their own soul-bound DIDz wallets, mounted into the current titleholder's wallet on title transfer.
- **Protocol spec submission** - Promote `didz-protocol v0.1` to a public tagged release and begin the W3C/DIF community submission process.
- **Trusted Issuer onboarding pipeline** - Productionize the TestTown → admission-gate → registry ceremony for real institutions.

### Long-term vision

- **The identity layer for a world that no longer trusts the systems it was given.**
- DIDz as the root identity substrate for governments, enterprises, and the agentic economy - the architecture that makes centralized identity databases obsolete, the same way the internet made the reference desk obsolete.
- One perfect identity, scaled to necessity, infinitely.

---

## Links

| Resource | URL |
|---|---|
| **DIDz.io repo** | [github.com/bytewizard42i/didz-dapp-system](https://github.com/bytewizard42i/didz-dapp-system) |
| **DIDzMonolith (umbrella)** | [github.com/bytewizard42i/DIDzMonolith](https://github.com/bytewizard42i/DIDzMonolith) |
| **AgenticDID (pillar project)** | [github.com/bytewizard42i/AgenticDID_io_me](https://github.com/bytewizard42i/AgenticDID_io_me) |
| **RWAz (pillar project)** | [github.com/bytewizard42i/RWAz](https://github.com/bytewizard42i/RWAz) |
| **didz-kernel** | `DIDzMonolith/didz-kernel` |
| **TestTownDIDz** | `DIDzMonolith/TestTownDIDz` |
| **Founder's story** | [youtu.be/yihfR4Zb70U](https://youtu.be/yihfR4Zb70U) |
| **Company** | [EnterpriseZK Labs LLC](https://enterprisezk.com) · [didz.io](https://didz.io) |

---

*Built on Midnight. Powered by Cardano. Protected by zero-knowledge cryptography.*
*4× Midnight Hackathon Winner. Privacy Preserving Digital Identity for the World.*
