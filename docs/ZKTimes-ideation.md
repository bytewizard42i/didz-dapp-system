# ZK TimesZ — Deep Dive Ideation Document

> A Midnight-powered decentralized newspaper protocol where articles are backed by truthfulness bonds, challengeable for bounties, and curated by reputation — not algorithms.

**Authors:** NiGHT-C, johnny5i, and collaborators  
**Date:** March 30, 2026  
**Status:** Ideation / Whitepaper Draft  
**Blockchain:** Midnight Network (Compact smart contracts, ZK proofs, private + public state)

---

## Table of Contents

1. [Vision & Problem Statement](#1-vision--problem-statement)
2. [Core Concept: Staked Truth Protocol](#2-core-concept-staked-truth-protocol)
3. [System Architecture](#3-system-architecture)
4. [Smart Contract Design (Midnight/Compact)](#4-smart-contract-design-midnightcompact)
5. [Participant Roles & Incentives](#5-participant-roles--incentives)
6. [The Veracity Bond Mechanism](#6-the-veracity-bond-mechanism)
7. [The Challenge & Bounty System](#7-the-challenge--bounty-system)
8. [Reputation Engine](#8-reputation-engine)
9. [Privacy Architecture (ZK Proofs on Midnight)](#9-privacy-architecture-zk-proofs-on-midnight)
10. [Anti-AI & Anti-Bot Controls](#10-anti-ai--anti-bot-controls)
11. [Governance & Appeals](#11-governance--appeals)
12. [Business Models for Modern Periodicals](#12-business-models-for-modern-periodicals)
13. [Subscription Business Structures](#13-subscription-business-structures)
14. [Advertising Models for Periodicals](#14-advertising-models-for-periodicals)
15. [ZK TimesZ Specific Revenue Model](#15-zk-timesz-specific-revenue-model)
16. [Competitive Landscape](#16-competitive-landscape)
17. [Technical Roadmap](#17-technical-roadmap)
18. [Open Questions](#18-open-questions)
19. [References & Inspiration](#19-references--inspiration)

---

## 1. Vision & Problem Statement

### The Problem

Modern digital media is broken. The advertising-revenue model incentivizes engagement over accuracy, outrage over nuance, and clickbait over depth. Social media algorithms are optimized to:

- **Maximize time-on-platform** — not truth
- **Maximize ad impressions** — not reader benefit
- **Maximize contagion** (virality) — not quality
- **Micro-target users** — making them the product, not the customer

The result: declining trust in journalism, rampant misinformation, polarization, and a race to the bottom on content quality. Fact-checking is centralized, opaque, and politically contested. Writers are underpaid. Readers are overwhelmed. Advertisers fund the chaos.

### The Vision

**ZK TimesZ** is a decentralized information marketplace — a newspaper protocol where:

- **Writers earn money** for publishing articles backed by truthfulness stakes
- **Readers earn money** for valuable curation, fact-checking, and engagement
- **Fact checkers earn bounties** for successfully challenging false claims
- **Advertisers reach real, verified people** — not bots
- **Truth has a score** — backed by money, not opinion
- **Reputation is on-chain** — immutable, auditable, portable
- **Bots are controlled** — through proof-of-human and ZK identity
- **No central company or country controls it** — governance is decentralized

This is not just a newspaper. It's a **protocol for staked truth** that can power any publication, any journalist, any citizen reporter — anywhere in the world.

---

## 2. Core Concept: Staked Truth Protocol

The central innovation is the **Veracity Bond** — an economic mechanism where publishers stake cryptocurrency on the truthfulness of their articles. Anyone can challenge an article's claims for a bounty. The protocol resolves disputes through a combination of:

1. **Economic incentives** (skin in the game)
2. **Decentralized adjudication** (jury pools, prediction markets)
3. **Zero-knowledge proofs** (privacy-preserving identity and reputation)
4. **On-chain reputation** (track records that can't be faked or erased)

### How It Works (Simple Flow)

```
Writer publishes article
    → Stakes veracity bond (e.g., 50 tDUST or stablecoins)
    → Article goes live with "BONDED" status
    → Bond amount and writer reputation are visible

Challenger spots a false claim
    → Stakes a challenge bond (e.g., 25 tDUST)
    → Specifies which claim is false and provides counter-evidence
    → Challenge is visible to all readers

Resolution
    → Option A: Writer corrects within grace period → reduced penalty, partial bond returned
    → Option B: Jury pool votes on the dispute → winner gets loser's bond (minus protocol fee)
    → Option C: Prediction market resolves the claim → market consensus determines truth
    → Reputation scores update for all participants
```

---

## 3. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ZK TimesZ Frontend                        │
│  (React/Next.js Web App + Mobile)                           │
│  - Article reader / writer interface                         │
│  - Wallet connection (Midnight Lace wallet)                  │
│  - Reputation dashboards                                     │
│  - Challenge / bounty interfaces                             │
│  - Subscription management                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API / Middleware Layer                     │
│  - Article indexing and search (off-chain, IPFS/Arweave)     │
│  - Content delivery network                                  │
│  - Notification service                                      │
│  - AI fact-check assistance (optional, flagged as AI)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Midnight Network (Layer 1)                       │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  Article Registry│  │ Veracity Bond   │                   │
│  │  Contract        │  │ Contract        │                   │
│  │  (Compact)       │  │ (Compact)       │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  Challenge &     │  │ Reputation      │                   │
│  │  Bounty Contract │  │ Contract        │                   │
│  │  (Compact)       │  │ (Compact)       │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  Governance /    │  │ Subscription &  │                   │
│  │  Jury Contract   │  │ Payment Contract│                   │
│  │  (Compact)       │  │ (Compact)       │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  Private State: writer identities, jury votes, reader prefs  │
│  Public State: article hashes, bond amounts, reputation      │
│  Shielded Tokens: payments, tips, bond stakes                │
│  Unshielded Tokens: protocol fees, governance votes          │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Off-Chain Storage                                │
│  - IPFS / Arweave for full article content                   │
│  - Content hashes anchored on Midnight                       │
│  - Media files (images, video) on decentralized storage      │
└─────────────────────────────────────────────────────────────┘
```

### Why Midnight?

Midnight is uniquely suited for ZK TimesZ because it provides:

1. **Private + Public State in One Contract** — Writers can have private identity details (real name, credentials) while their reputation score is public. Jury votes are private during deliberation, public after resolution.

2. **Zero-Knowledge Proofs (ZKPs)** — A writer can prove "I am a credentialed journalist" without revealing which outlet they work for. A reader can prove "I am over 18" or "I am a US resident" without revealing personal details. Jurors can prove "I have no conflict of interest" without revealing their identity.

3. **Shielded + Unshielded Tokens** — Bond stakes can be shielded (private amounts) or unshielded (public amounts) depending on the article tier. Tips and micropayments can be private.

4. **Compact Smart Contracts** — Purpose-built language for ZK circuits. Every article registration, bond stake, challenge, and resolution is a provable on-chain transaction.

5. **UTXO Model** — Natural privacy isolation. Each bond is an independent UTXO that can be shielded or revealed as needed.

---

## 4. Smart Contract Design (Midnight/Compact)

### Contract 1: Article Registry

**Purpose:** Register articles on-chain with content hashes, metadata, and author identity.

**Public State:**
- `articles: Map<Bytes<32>, Article>` — article_id → article metadata
- `article_count: Counter` — total articles published
- `category_index: Map<Bytes<32>, Vector<N, Bytes<32>>>` — category → article IDs

**Private State (per user):**
- Writer's real identity (DID document details)
- Draft articles before publication
- Personal curation preferences

**Article Struct:**
```
struct Article {
    content_hash: Bytes<32>,        // IPFS/Arweave hash of full content
    author_id: Bytes<32>,           // public pseudonymous ID (DID)
    timestamp: Uint<64>,            // publication time
    category: Bytes<32>,            // topic category hash
    claim_count: Uint<8>,           // number of verifiable claims
    bond_amount: Uint<64>,          // veracity bond staked
    status: Uint<8>,                // 0=draft, 1=bonded, 2=challenged, 3=resolved, 4=retracted
    reputation_at_publish: Uint<32>,// author's rep score at time of publication
    challenge_count: Uint<8>,       // number of active challenges
    truth_score: Uint<32>           // aggregated truth score (0-10000 basis points)
}
```

**Key Circuits:**
- `publish_article(content_hash, category, claim_count, bond_amount)` — registers article, locks bond
- `retract_article(article_id, author_proof)` — author voluntarily retracts, partial bond penalty
- `update_truth_score(article_id, new_score)` — called by resolution contract after challenge

### Contract 2: Veracity Bond

**Purpose:** Manage the economic stakes behind articles.

**Public State:**
- `bonds: Map<Bytes<32>, Bond>` — article_id → bond details
- `total_bonded: Uint<64>` — total value locked in bonds
- `protocol_treasury: Uint<64>` — accumulated protocol fees

**Bond Struct:**
```
struct Bond {
    article_id: Bytes<32>,
    author_id: Bytes<32>,
    amount: Uint<64>,
    lock_time: Uint<64>,
    unlock_time: Uint<64>,        // bond locked for minimum period (e.g., 30 days)
    status: Uint<8>,              // 0=active, 1=challenged, 2=slashed, 3=released
    slash_amount: Uint<64>        // amount lost to challenges
}
```

**Key Circuits:**
- `stake_bond(article_id, amount)` — lock funds as veracity bond
- `release_bond(article_id)` — release after lock period if unchallenged
- `slash_bond(article_id, slash_amount, challenger_id)` — called by resolution contract
- `partial_release(article_id, correction_proof)` — reduced penalty for fast correction

### Contract 3: Challenge & Bounty

**Purpose:** Allow anyone to challenge article claims and earn bounties for proving falsehoods.

**Public State:**
- `challenges: Map<Bytes<32>, Challenge>` — challenge_id → challenge details
- `active_challenges: Uint<32>` — count of open challenges

**Challenge Struct:**
```
struct Challenge {
    challenge_id: Bytes<32>,
    article_id: Bytes<32>,
    challenger_id: Bytes<32>,
    claim_index: Uint<8>,           // which specific claim is challenged
    evidence_hash: Bytes<32>,       // hash of counter-evidence (stored off-chain)
    challenge_bond: Uint<64>,       // challenger's stake (skin in the game)
    status: Uint<8>,                // 0=open, 1=in_review, 2=upheld, 3=rejected, 4=settled
    timestamp: Uint<64>,
    resolution_deadline: Uint<64>
}
```

**Key Circuits:**
- `submit_challenge(article_id, claim_index, evidence_hash, bond_amount)` — file a challenge
- `respond_to_challenge(challenge_id, response_hash)` — writer responds with counter-evidence
- `settle_challenge(challenge_id)` — writer concedes, fast correction path
- `escalate_to_jury(challenge_id)` — neither party concedes, goes to jury

**Bounty Payouts:**
- If challenge upheld: challenger receives their bond back + portion of writer's veracity bond
- If challenge rejected: writer receives challenger's bond (minus protocol fee)
- Protocol always takes a small fee (e.g., 2-5%) to fund the treasury

### Contract 4: Reputation

**Purpose:** Track on-chain reputation for all participants.

**Public State:**
- `reputations: Map<Bytes<32>, ReputationScore>` — user_id → reputation
- `reputation_history: Map<Bytes<32>, Vector<N, ReputationEvent>>` — user_id → history

**ReputationScore Struct:**
```
struct ReputationScore {
    user_id: Bytes<32>,
    total_score: Uint<32>,          // 0-10000 basis points
    articles_published: Uint<32>,
    articles_challenged: Uint<32>,
    challenges_won: Uint<32>,
    challenges_lost: Uint<32>,
    challenges_filed: Uint<32>,
    successful_challenges: Uint<32>,
    jury_participations: Uint<32>,
    tips_received: Uint<64>,
    streak_days: Uint<16>,          // consecutive days with no failed challenge
    tier: Uint<8>                   // 0=unverified, 1=contributor, 2=journalist, 3=expert, 4=institution
}
```

**Key Circuits:**
- `update_reputation(user_id, event_type, delta)` — called by other contracts after events
- `get_reputation(user_id)` — read current reputation (public)
- `prove_reputation_threshold(user_id, min_score)` — ZK proof that rep is above threshold without revealing exact score

### Contract 5: Governance / Jury

**Purpose:** Decentralized dispute resolution through random jury selection.

**Key Mechanics:**
- Jury pool: users with reputation above a threshold can opt in
- Random selection: N jurors selected per dispute (e.g., 7)
- Private voting: jurors vote privately using Midnight's private state
- Reveal phase: votes revealed after all jurors submit
- Incentives: jurors who vote with the majority earn fees; minority voters lose a small stake

**Key Circuits:**
- `opt_into_jury_pool(user_id, stake)` — join the pool with a stake
- `select_jury(challenge_id)` — randomly select jurors (uses on-chain randomness)
- `cast_vote(challenge_id, vote, justification_hash)` — private vote
- `reveal_votes(challenge_id)` — tally and reveal after deadline
- `distribute_jury_rewards(challenge_id)` — pay majority jurors, slash minority

### Contract 6: Subscription & Payments

**Purpose:** Handle reader subscriptions, tips, micropayments, and ad payments.

**Key Circuits:**
- `subscribe(reader_id, tier, duration)` — lock payment for subscription
- `tip_writer(reader_id, writer_id, amount)` — direct tip (can be shielded)
- `micropayment(reader_id, article_id, amount)` — pay-per-article
- `ad_payment(advertiser_id, placement_id, amount)` — advertiser pays for placement

---

## 5. Participant Roles & Incentives

### Writers

**How they earn:**
- **Reader subscriptions** — share of subscription pool proportional to readership
- **Tips** — direct tips from readers who value their work
- **Pay-per-article** — micropayments from non-subscribers
- **Veracity bond returns** — get their bond back (+ small bonus from protocol) if article goes unchallenged
- **Reputation growth** — higher reputation = higher visibility, more readers, more earnings
- **NFT article sales** — articles can be minted as NFTs with embedded IP rights

**What they risk:**
- **Veracity bond** — lose some or all if challenged successfully
- **Reputation** — drops with each lost challenge
- **Visibility** — low-reputation writers appear lower in curation feeds

**Where the money comes from:** Reader payments (subscriptions, tips, micropayments), protocol treasury (funded by challenge fees), advertiser payments (if writer opts into ad-supported distribution).

### Readers

**How they earn:**
- **Curation rewards** — earn tokens for flagging content, rating articles, providing feedback
- **Challenge bounties** — earn by successfully challenging false claims
- **Prediction market gains** — profit from correct predictions on article veracity
- **Referral bonuses** — earn when referred readers subscribe
- **Data ownership** — opt into sharing anonymized preference data for ad targeting (like BAT model)

**What they risk:**
- **Challenge bonds** — lose stake if their challenge is rejected
- **Prediction market losses** — lose if they bet wrong on veracity

**Where the money comes from:** Protocol treasury (funded by fees), writer veracity bonds (when challenges succeed), advertiser payments (for data sharing), prediction market counterparties.

### Fact Checkers

**How they earn:**
- **Challenge bounties** — primary income: successfully prove claims false, earn from writer's slashed bond
- **Reputation staking** — high-reputation fact-checkers can earn passive income from jury pools
- **Institutional contracts** — news organizations can hire fact-checkers through the protocol
- **Verification marketplace** — offer fact-checking as a service, set own rates

**Subtle nuance corrections:**
- If a claim is partially incorrect (nuance, not outright falsehood):
  - **Grace period correction**: Writer has 48-72 hours to issue a correction after challenge
  - **Partial correction**: If writer corrects quickly, they lose only 10-25% of bond (not 100%)
  - **Graduated penalties**: Minor factual errors (dates, names, statistics) have lower penalties than fabricated claims or major falsehoods
  - **Nuance flag**: Challenger can file a "nuance challenge" vs. "falsehood challenge" — different penalty structures
  - **Split resolution**: Jury can rule "partially upheld" — bond split proportionally

**Where the money comes from:** Writer veracity bonds (slashed portions), protocol challenge fees, institutional contracts.

### Advertisers

**How they earn (value proposition):**
- **Reach real, verified humans** — not bots, not fake accounts
- **Contextual targeting** — place ads in specific curation domains aligned with brand values
- **Privacy-preserving targeting** — use ZK proofs to target demographics without seeing personal data
- **Reputation-gated placements** — only appear alongside high-reputation content

**How they pay:**
- Per-impression or per-click, paid in protocol token or stablecoins
- Bid for placement in specific curation circles / topic categories
- Premium for verified-audience placements

### Who Pays for Everything?

| Revenue Source | Funds What |
|---|---|
| **Veracity bonds (staked by writers)** | Challenge bounties, fact-checker rewards |
| **Challenge bonds (staked by challengers)** | Writer defense rewards (if challenge fails) |
| **Protocol fees (2-5% of all bond resolutions)** | Protocol treasury, development, juror payments |
| **Reader subscriptions** | Writer payments, platform operations |
| **Micropayments (pay-per-article)** | Direct to writers |
| **Tips** | Direct to writers |
| **Advertising payments** | Shared between protocol, writers (who opt in), and readers (who share data) |
| **Prediction market fees** | Protocol treasury, market makers |
| **NFT sales & royalties** | Writers (primary), protocol (secondary royalty) |
| **Governance token staking** | Jury rewards, governance participation incentives |

---

## 6. The Veracity Bond Mechanism

### Bond Tiers

Not all articles are equal. A tweet-length opinion piece doesn't need the same bond as an investigative exposé.

| Tier | Article Type | Minimum Bond | Lock Period | Max Penalty |
|------|-------------|-------------|------------|-------------|
| **Tier 0** | Opinion / Editorial | 0 (no bond) | N/A | Reputation only |
| **Tier 1** | News Brief (<500 words) | 10 tokens | 7 days | 50% of bond |
| **Tier 2** | Standard Article | 50 tokens | 30 days | 75% of bond |
| **Tier 3** | Investigative / Long-form | 200 tokens | 90 days | 100% of bond |
| **Tier 4** | Institutional / Breaking News | 1000+ tokens | 180 days | 100% + reputation |

### Bond Lifecycle

```
1. STAKING
   Writer deposits tokens into Veracity Bond Contract
   → Tokens locked for minimum lock period
   → Article published with "BONDED" badge and bond amount visible

2. QUIET PERIOD
   No challenges filed within first 24 hours (anti-frontrunning)
   → Allows article to be read and digested

3. CHALLENGE WINDOW
   Open for challenges during lock period
   → Multiple claims can be challenged independently
   → Each challenge requires challenger to also stake

4. RESOLUTION
   If no challenges: bond released after lock period + small protocol bonus
   If challenged and writer wins: bond released + challenger's stake (minus fee)
   If challenged and writer loses: bond slashed proportionally to severity

5. POST-RESOLUTION
   Reputation updated for all parties
   Article tagged with resolution outcome (immutable)
   NFT metadata updated if article is tokenized
```

### Dynamic Bond Pricing

Bond requirements can adjust dynamically based on:
- **Writer reputation**: Higher rep → lower minimum bond (earned trust)
- **Topic sensitivity**: Political, health, financial topics → higher bonds
- **Claim density**: More verifiable claims in article → higher bond
- **Current challenge rate**: If many articles are being challenged → market signals higher bonds

---

## 7. The Challenge & Bounty System

### Filing a Challenge

1. **Identify the claim**: Challenger selects a specific, verifiable claim from the article
2. **Provide evidence**: Upload counter-evidence to IPFS/Arweave, submit hash on-chain
3. **Stake a challenge bond**: Must be ≥ 25% of the writer's veracity bond for that claim
4. **Classify the challenge type**:
   - **Factual Error** — a specific fact is wrong (date, name, statistic, quote)
   - **Fabrication** — the claim is entirely made up
   - **Misleading Context** — facts are technically correct but presented in misleading way
   - **Nuance Deficiency** — important qualifiers or context are omitted

### Resolution Paths

#### Path A: Writer Self-Corrects (Fast Track)
- Writer acknowledges error within grace period (48-72 hours)
- Issues a correction (appended to original article, on-chain)
- Penalty: 10-25% of bond (based on severity)
- Challenger receives: their bond back + 50% of penalty
- Protocol receives: 50% of penalty
- **Reputation impact**: Minor negative for writer, minor positive for challenger

#### Path B: Jury Resolution
- Neither party concedes → escalated to jury
- 7 jurors randomly selected from opt-in pool
- Private voting period (72 hours)
- Reveal and tally
- Supermajority (5/7) required to uphold challenge
- **If upheld**: Challenger gets bond back + up to 75% of writer's slashed bond
- **If rejected**: Writer gets bond back + challenger's bond (minus fees)
- **Split decision**: If 4/7, partial resolution — bonds split proportionally

#### Path C: Prediction Market Resolution
- For high-stakes or contentious claims
- A prediction market is opened on the specific claim
- Market runs for a defined period (e.g., 7-30 days)
- Market price represents consensus probability of truth
- Resolution threshold: if market settles >75% one way, that's the outcome
- Remaining bond distributed based on market outcome

#### Path D: Expert Arbitration
- Either party can request expert arbitration (higher fee)
- Panel of 3 domain experts (credentialed through DID verification)
- Binding resolution
- Used for highly technical or specialized claims

### Bounty Distribution Formula

```
If challenge is UPHELD:
  challenger_reward = challenger_bond + (writer_bond × severity_multiplier × (1 - protocol_fee))
  protocol_fee_amount = writer_bond × severity_multiplier × protocol_fee
  writer_returned = writer_bond × (1 - severity_multiplier)

  where severity_multiplier:
    Factual Error:        0.25 - 0.50
    Fabrication:          0.75 - 1.00
    Misleading Context:   0.15 - 0.35
    Nuance Deficiency:    0.10 - 0.20

If challenge is REJECTED:
  writer_reward = writer_bond + (challenger_bond × (1 - protocol_fee))
  protocol_fee_amount = challenger_bond × protocol_fee
  challenger_returned = 0
```

---

## 8. Reputation Engine

### Reputation Score Components

The reputation score (0-10,000 basis points) is a weighted composite:

| Component | Weight | Description |
|-----------|--------|-------------|
| **Publication Record** | 25% | Articles published, challenge rate, correction rate |
| **Challenge Record** | 20% | Challenges filed, win rate, accuracy |
| **Community Feedback** | 15% | Reader ratings, engagement quality |
| **Verification Level** | 15% | Identity verification depth (DID credentials) |
| **Consistency** | 10% | Streak of unchallenged articles, regular publishing |
| **Jury Participation** | 10% | Jury service, alignment with majority |
| **Economic Activity** | 5% | Total bonds staked, tips given/received |

### Reputation Tiers

| Tier | Score Range | Label | Privileges |
|------|------------|-------|------------|
| 0 | 0-999 | Unverified | Can read, limited interactions |
| 1 | 1000-2999 | Contributor | Can publish (Tier 0-1 articles), challenge, tip |
| 2 | 3000-5999 | Journalist | Can publish all tiers, reduced bond requirements |
| 3 | 6000-7999 | Expert | Can serve on juries, expert arbitration |
| 4 | 8000-10000 | Institution | Institutional badge, premium ad placements, governance weight |

### Reputation Decay & Recovery

- Reputation decays slowly over inactivity (1% per month of inactivity)
- Major reputation hits from lost challenges take 6+ months of good behavior to recover
- "Reputation bankruptcy" option: reset to Tier 1, but history is preserved (transparent fresh start)

### ZK Reputation Proofs

Using Midnight's ZK capabilities, users can prove:
- "My reputation is above 5000" (without revealing exact score)
- "I have published >50 articles with <5% challenge rate" (without revealing which articles)
- "I am a credentialed journalist" (without revealing outlet or real name)
- "I have no conflicts of interest with this article's subject" (for jury selection)

---

## 9. Privacy Architecture (ZK Proofs on Midnight)

### What's Private (Midnight Private State)

| Data | Why Private |
|------|------------|
| Writer real identity | Protect from retaliation, doxxing |
| Jury votes (during deliberation) | Prevent vote buying, coercion |
| Reader preferences | User data ownership |
| Tip amounts (optional) | Financial privacy |
| Subscription details | Reader privacy |
| Challenge evidence (during review) | Prevent tampering, front-running |
| Advertiser targeting criteria | Competitive privacy |

### What's Public (Midnight Public State)

| Data | Why Public |
|------|-----------|
| Article content hashes | Immutability, censorship resistance |
| Bond amounts | Transparency of stakes |
| Reputation scores | Trust, accountability |
| Challenge outcomes | Auditable track record |
| Jury vote tallies (after reveal) | Verifiable justice |
| Protocol treasury balance | Financial transparency |
| Governance votes (tallies) | Democratic accountability |

### ZK Circuits Needed

1. **Proof of Authorship** — prove you wrote an article without revealing your identity
2. **Proof of Reputation** — prove your rep exceeds a threshold without revealing exact score
3. **Proof of Humanity** — prove you are human without revealing personal information
4. **Proof of Credential** — prove you hold a journalism credential without revealing which one
5. **Proof of No Conflict** — prove you have no relationship to an article's subject (for jurors)
6. **Proof of Correction** — prove an article was corrected at a specific time
7. **Private Vote** — cast a jury vote that is committed but not revealed until tally

---

## 10. Anti-AI & Anti-Bot Controls

### The AI Problem

Everyone is using AI to write. This undermines the value proposition of human journalism. ZK TimesZ needs to address this head-on.

### Approach: Transparency, Not Prohibition

Rather than banning AI entirely (unenforceable), the protocol requires **disclosure and differentiation**:

1. **AI Disclosure Tag**: Articles must declare their AI involvement level:
   - **Human-Written**: No AI assistance beyond spell-check
   - **AI-Assisted**: AI used for research, outlining, editing — human wrote the prose
   - **AI-Generated**: Primarily AI-written, human-edited
   - **AI-Only**: Fully AI-generated (lowest bond tier, lowest reputation impact)

2. **Proof of Human Authorship** (optional, earns higher reputation):
   - Integration with proof-of-human protocols (e.g., Worldcoin's iris scan, or less invasive alternatives)
   - Writing style analysis (on-chain commitment to writing fingerprint)
   - Time-stamped draft progression (prove the article was written over time, not generated in 5 seconds)

3. **Economic Differentiation**:
   - Human-written articles can command higher bond tiers → more credibility
   - AI-generated content has reduced earning potential from subscriptions
   - Readers can filter their feed by AI involvement level

### Bot Controls

1. **Proof of Human at Registration** — required for all accounts (CAPTCHA + DID verification)
2. **Staking Requirements** — bots can't easily scale because each account needs staked tokens
3. **Rate Limiting** — publishing rate limits based on reputation tier
4. **Behavioral Analysis** — on-chain patterns flagged by community (challenge mechanism)
5. **Sybil Resistance** — DID uniqueness checks, social graph analysis

---

## 11. Governance & Appeals

### Governance Token

A governance token (could be the same as the utility token, or separate) enables:

- **Proposal submission** — anyone with minimum stake can propose protocol changes
- **Voting** — token-weighted voting on proposals (with quadratic voting option)
- **Treasury allocation** — decide how protocol fees are spent
- **Parameter adjustment** — bond amounts, fee percentages, jury sizes, etc.

### Appeal Process

When a party disagrees with a jury ruling:

1. **File appeal** within 7 days of ruling
2. **Stake appeal bond** (2x the original challenge bond)
3. **Expanded jury** — 15 jurors instead of 7
4. **New evidence** can be submitted
5. **Supermajority required** — 10/15 to overturn original ruling
6. **Final and binding** — no further appeals
7. **If appeal fails**: appellant loses appeal bond
8. **If appeal succeeds**: original ruling overturned, new distribution

### Who Votes on Governance?

- Token holders (1 token = 1 vote, or quadratic: √tokens = votes)
- Reputation-weighted voting option (higher rep = more weight, prevents plutocracy)
- Delegation: users can delegate votes to trusted representatives
- Time-lock: longer lock periods = more voting weight (conviction voting)

---

## 12. Business Models for Modern Periodicals

### Traditional Models (Still Relevant)

| Model | Description | Revenue Source | Examples |
|-------|------------|---------------|----------|
| **Advertising-Supported** | Free content, funded by ads | Display ads, native ads, sponsored content | Most news websites, BuzzFeed |
| **Subscription/Paywall** | Paid access to content | Monthly/annual subscriptions | NYT ($11.6M+ subscribers), WSJ, The Athletic |
| **Freemium/Metered** | Some free articles, paywall after limit | Subscriptions + limited ads | WaPo (limited free), Financial Times |
| **Membership/Donations** | Supported by reader contributions | Donations, memberships | The Guardian, Wikipedia, ProPublica |
| **Syndication/Licensing** | License content to other outlets | Licensing fees | AP, Reuters, Bloomberg Terminal |

### Emerging Digital Models

| Model | Description | Revenue Source |
|-------|------------|---------------|
| **Newsletter Economy** | Individual writers with paid newsletters | Subscriptions (Substack, Ghost, Beehiiv) |
| **Bundled Subscriptions** | Apple News+, Google News Showcase | Platform payments, rev share |
| **Events & Conferences** | Premium events for subscribers | Ticket sales, sponsorships |
| **E-commerce & Affiliate** | Product recommendations within content | Affiliate commissions, direct sales |
| **Data & Research** | Premium data products, market research | Enterprise subscriptions |
| **Contract Publishing** | Produce content for brands | B2B contracts |
| **Podcast & Audio** | Audio content monetization | Ads, premium subscriptions |

### Crypto-Native Models (Emerging)

| Model | Description | Revenue Source |
|-------|------------|---------------|
| **Token-Gated Access** | Hold tokens to access content | Token purchases, appreciation |
| **NFT Articles** | Articles as tradeable digital assets | Primary sales, secondary royalties |
| **Micropayments** | Pay fractions of a cent per article | Lightning Network, L2 payments |
| **DAO-Owned Media** | Community-owned publication | Token sales, treasury yield |
| **Staked Truth (ZK TimesZ)** | Bond-backed journalism | Bonds, challenges, subscriptions, ads |
| **Read-to-Earn** | Readers earn for engagement | Advertiser-funded, protocol treasury |
| **Write-to-Earn** | Writers earn from protocol directly | Subscription pools, tips, bond returns |

### Key Industry Trends (2024-2026)

- **Digital subscriptions** are now the #1 revenue focus (80% of publishers), surpassing display advertising (72%)
- **Print circulation + advertising < 50%** of total revenue for first time ever
- **"Other" revenue streams** (events, e-commerce, data) growing to ~22% of total revenue
- **AI disruption** is simultaneously threatening (content generation) and enabling (personalization, summarization)
- **Trust premium** — publications with high trust scores command higher subscription prices
- Only **17% of people globally** pay for online news — massive untapped market

---

## 13. Subscription Business Structures

### Structure 1: Individual Publication Subscription

```
ZK TimesZ Subscription Tiers:

FREE TIER
├── Access to Tier 0 (opinion) articles
├── Limited Tier 1 articles (5/month)
├── Basic curation (algorithmic feed)
├── Can tip writers
└── Ad-supported

READER TIER ($5-10/month or equivalent in tokens)
├── Unlimited access to all article tiers
├── Ad-free experience
├── Custom curation circles
├── Priority access to prediction markets
├── Earn curation rewards
└── 1 free challenge per month (no bond required)

PREMIUM TIER ($15-25/month)
├── Everything in Reader tier
├── Early access to articles
├── Exclusive long-form / investigative content
├── Direct messaging with writers
├── Access to expert analysis feeds
├── Enhanced prediction market features
└── Governance voting rights

INSTITUTIONAL TIER ($100-500/month)
├── Everything in Premium
├── API access for content syndication
├── Analytics dashboard
├── Custom curation algorithms
├── White-label embedding
├── Priority support
└── Multi-seat access
```

### Structure 2: Protocol-Level Subscription (Multi-Publication)

Like Apple News+ but decentralized:

```
PROTOCOL SUBSCRIPTION ($20/month)
├── Access to ALL publications built on ZK TimesZ protocol
├── Revenue shared across publications based on reader time/engagement
├── Cross-publication reputation (your rep follows you everywhere)
├── Unified wallet for tips, challenges, predictions across all pubs
└── Single sign-on via DID
```

### Structure 3: Token-Based Access

```
TOKEN STAKING MODEL
├── Stake 1000 tokens → Free access for as long as staked
├── Stake 5000 tokens → Premium access + governance
├── Unstake anytime (with 7-day cooldown)
├── Staked tokens earn yield from protocol fees
└── No recurring payment — capital-efficient for long-term readers
```

### Structure 4: Pay-Per-Article (Micropayments)

```
MICROPAYMENT MODEL
├── Each article has a price set by the writer (e.g., $0.10 - $5.00)
├── Readers pay only for what they read
├── "Open a tab" model — small payments accumulate, settle weekly
├── Lightning-fast via Midnight's shielded token transfers
└── Writers keep 85-90%, protocol takes 10-15%
```

### Structure 5: Patron / Sponsorship Model

```
PATRON MODEL
├── Readers can become "Patrons" of specific writers
├── Monthly commitment (e.g., $10/month to Writer X)
├── Patron badge visible on profile (reputation boost)
├── Exclusive patron-only content from supported writers
├── Patron NFTs with perks (early access, AMAs, etc.)
└── Tax-deductible in some jurisdictions (journalism support)
```

---

## 14. Advertising Models for Periodicals

### Model 1: Privacy-Preserving Display Ads (BAT-Style)

Inspired by Brave's Basic Attention Token:

```
HOW IT WORKS:
1. Reader opts into seeing ads (explicit consent)
2. Reader's preferences are stored in their private state (Midnight)
3. Ad matching happens CLIENT-SIDE (reader's device), not server-side
4. No personal data ever leaves the reader's device
5. Reader earns 70% of ad revenue, protocol 15%, writer 15%
6. Advertiser pays per verified impression/click

ADVANTAGES:
- No surveillance capitalism
- Reader is compensated for attention
- Advertisers get verified human eyeballs
- ZK proofs confirm ad was displayed without revealing who saw it
```

### Model 2: Contextual Advertising

```
HOW IT WORKS:
1. Ads are matched to ARTICLE CONTENT, not reader profiles
2. Article categories and topics are public metadata
3. Advertisers bid on categories (e.g., "technology", "health", "finance")
4. No personal data needed
5. Higher bond articles → premium ad rates (quality association)

ADVANTAGES:
- Zero privacy concerns
- Brand safety through reputation-gated content
- Advertisers choose which curation circles to appear in
```

### Model 3: Sponsored Content Marketplace

```
HOW IT WORKS:
1. Brands post "content briefs" to the marketplace
2. Writers bid to create sponsored content
3. Content clearly labeled as "SPONSORED" (on-chain tag, cannot be hidden)
4. Sponsored content CAN have veracity bonds (brand stands behind claims)
5. Reader reputation system rates sponsored content quality

SPONSORED BOND:
- Brand stakes a "Sponsor Veracity Bond" on sponsored content
- If sponsored claims are false → brand loses bond
- Creates accountability for advertising claims
- First-of-its-kind: on-chain truth accountability for ads
```

### Model 4: Classified & Marketplace Ads

```
HOW IT WORKS:
1. Traditional classifieds but with ZK identity verification
2. Buyers/sellers verified as real humans
3. Escrow via smart contract
4. Reputation from marketplace activity feeds into overall score
```

### Model 5: Premium Placement Auctions

```
HOW IT WORKS:
1. Homepage, "featured", and category-top placements auctioned
2. Real-time bidding using protocol tokens
3. Placement duration: 1 hour to 7 days
4. Advertisers must meet minimum reputation score
5. Community can vote to remove offensive ads (governance)
```

### Ad Revenue Distribution

```
Total Ad Revenue → Split:
├── 60-70% to Readers (who opt in to see ads)
├── 15-20% to Writers (whose articles host the ads)
├── 10-15% to Protocol Treasury
└── 5% to Fact-Checkers Fund (incentivize quality ecosystem)
```

---

## 15. ZK TimesZ Specific Revenue Model

### Revenue Streams Summary

```
ZK TimesZ Protocol Revenue

PRIMARY REVENUE:
├── Protocol fees on bond resolutions (2-5% of all bonds)
├── Subscription revenue share (10-15% of subscription payments)
├── Micropayment processing fees (10-15%)
├── Advertising marketplace fees (15-20% of ad spend)
└── NFT minting fees (2.5% primary, 1% secondary royalty)

SECONDARY REVENUE:
├── Prediction market fees (1-2% of market volume)
├── Premium API access (institutional tier subscriptions)
├── Governance token appreciation
├── Treasury yield (DeFi strategies on idle treasury funds)
├── Data products (aggregated, anonymized trend data)
└── White-label licensing (other publications using the protocol)

ECOSYSTEM FLYWHEEL:
1. Writers publish bonded articles → attracts readers
2. Readers subscribe and engage → generates revenue
3. Revenue funds bounties → attracts fact-checkers
4. Fact-checkers improve quality → increases trust
5. Trust attracts advertisers → more revenue
6. Advertisers fund reader rewards → more readers
7. More readers → more writers → cycle repeats
```

### Token Economics (Conceptual)

```
ZKTIMES Token (or use existing token like tDUST on Midnight)

UTILITY:
- Stake veracity bonds
- Stake challenge bonds
- Pay for subscriptions
- Tips and micropayments
- Governance voting
- Jury participation stakes
- Advertising payments
- Prediction market collateral

DISTRIBUTION (if launching new token):
- 30% Community / Ecosystem rewards
- 20% Protocol treasury
- 15% Team (4-year vest, 1-year cliff)
- 15% Early contributors / investors
- 10% Writer incentive pool (bootstrap early content)
- 10% Fact-checker incentive pool (bootstrap early quality)

DEFLATIONARY MECHANICS:
- Portion of protocol fees burned
- Slashed bonds partially burned (not 100% to challengers)
- NFT minting burns small amount
```

---

## 16. Competitive Landscape

| Project | What It Does | How ZK TimesZ Differs |
|---------|-------------|----------------------|
| **Substack** | Newsletter platform, subscription model | No truth accountability, centralized, no ZK privacy |
| **Mirror.xyz** | Web3 writing platform, NFT articles | No veracity bonds, no challenge system, no reputation engine |
| **Paragraph** | Web3 publishing, token-gated | No truth staking, no fact-checking bounties |
| **Polymarket** | Prediction markets | Markets only, not a publishing platform |
| **Augur** | Decentralized prediction markets | No journalism focus, no article bonds |
| **Civil** | Blockchain journalism (defunct) | Failed due to complexity; ZK TimesZ simpler onboarding |
| **Steemit/Hive** | Social media with crypto rewards | No truth accountability, gameable, quality issues |
| **Medium** | Writing platform with partner program | Centralized, algorithm-driven, no truth bonds |
| **The Guardian** | Donation-funded journalism | Centralized, no on-chain accountability |
| **Mastodon/Nostr** | Decentralized social media | No truth staking, no economic accountability |

### ZK TimesZ Unique Value Propositions

1. **Veracity bonds** — no one else has economic skin-in-the-game for truth
2. **ZK privacy on Midnight** — writer protection + reader privacy + transparent accountability
3. **Challenge bounty system** — financial incentive to improve information quality
4. **On-chain reputation** — portable, immutable, auditable track records
5. **Programmable curation** — users control their own information diet
6. **Sponsored content accountability** — even ads have truth bonds

---

## 17. Technical Roadmap

### Phase 1: Foundation (Months 1-6)

- [ ] Define Compact contract interfaces for Article Registry + Veracity Bond
- [ ] Build proof-of-concept on Midnight testnet
- [ ] Implement basic article publishing with bond staking
- [ ] Simple challenge submission and resolution (writer-concedes only)
- [ ] Basic reputation tracking (articles published, challenges won/lost)
- [ ] Minimal frontend (React + Midnight Lace wallet integration)
- [ ] Content storage on IPFS with hash anchoring on Midnight

### Phase 2: Core Protocol (Months 6-12)

- [ ] Jury selection and private voting system
- [ ] Full challenge resolution (all 4 paths)
- [ ] Graduated penalty system for nuance vs. fabrication
- [ ] Reader subscription smart contracts
- [ ] Micropayment infrastructure
- [ ] Enhanced reputation engine with ZK proofs
- [ ] DID integration for writer verification
- [ ] Mobile-responsive frontend

### Phase 3: Marketplace (Months 12-18)

- [ ] Prediction markets for article veracity
- [ ] Advertising marketplace (BAT-style privacy-preserving ads)
- [ ] NFT article minting and trading
- [ ] Sponsored content with sponsor bonds
- [ ] Custom curation circles / playlist-style views
- [ ] API for third-party integrations
- [ ] Writer analytics dashboard

### Phase 4: Scale & Governance (Months 18-24)

- [ ] Full DAO governance launch
- [ ] Appeal system
- [ ] Cross-publication protocol (multi-newspaper federation)
- [ ] AI disclosure and proof-of-human integration
- [ ] Expert arbitration panels
- [ ] White-label solution for existing media organizations
- [ ] Token launch (if applicable)

---

## 18. Open Questions

These are unresolved design questions that need further discussion:

1. **Bond denomination**: Should bonds be in stablecoins (predictable cost) or protocol tokens (aligned incentives)? Or both options?

2. **Jurisdiction**: How do you handle articles about events in different legal jurisdictions? Defamation laws vary wildly.

3. **Subjectivity boundary**: Some claims are inherently subjective ("the economy is doing well"). Where's the line between challengeable and opinion?

4. **Whale attacks**: Could a wealthy actor file frivolous challenges to drain a writer's bonds? (Mitigation: challenger bonds + reputation cost for failed challenges)

5. **Jury collusion**: How to prevent jurors from coordinating? (Mitigation: random selection, private voting, reputation stakes)

6. **Content permanence**: If an article is proven false, should it be removed or just tagged? (Recommendation: never remove, always tag — censorship resistance)

7. **AI fact-checking**: Should AI be used as a first-pass fact-checker before human challenge? If so, how to prevent AI bias from creeping in?

8. **Onboarding**: How to make this accessible to non-crypto users? (Fiat on-ramps, custodial wallet option for beginners)

9. **Media organization adoption**: How to incentivize NYT, Reuters, etc. to participate? (Reputation benefits, audience trust, ad premium)

10. **Regulatory compliance**: How to handle government demands for content removal while maintaining censorship resistance?

11. **Private state in Midnight**: What exactly should be kept private? Current thinking:
    - Writer real identities (private, revealable via ZK proof)
    - Jury deliberations (private until reveal)
    - Reader subscription status (private)
    - Individual ad targeting data (private, client-side only)
    - Tip amounts (optionally private via shielded tokens)

12. **Appeal voting**: Should appeals use the same jury mechanism or a different one? Should there be a "supreme court" of highest-reputation members?

---

## 19. References & Inspiration

### Academic & Protocol References

- **Charles Hoskinson's Decentralized Twitter Whiteboard** (Nov 2022) — foundational thinking on veracity bonds, prediction markets for truth, DIDs, pub/sub protocols, programmable curation, and advertising tokens. Direct inspiration for ZK TimesZ architecture.
- **Poltercast** (2011) — Decentralized pub/sub protocol, explored during Cardano's incentivized testnet. Basis for subscription/follow mechanics.
- **Robin Hanson** — Prediction markets pioneer. Concept of "futarchy" (governance by prediction markets) informs the truth-market mechanics.
- **Falcon (NIST Post-Quantum Signature)** — Algorand's work on post-quantum signatures. Relevant for long-term article integrity.
- **Kachina** — Private smart contracts framework (IOG/Cardano). Inspiration for privacy-preserving ad targeting.
- **Mithril** — Stake-based threshold multi-signatures (Cardano). Client-side verification of on-chain state without full node.
- **Basic Attention Token (BAT)** — Brave browser's advertising token model. Direct inspiration for privacy-preserving ad marketplace.
- **Santa Clara Principles** — Content moderation transparency standards. Could form basis for default curation rules.
- **Narwhal and Tusk** — BFT DAG-based mempool consensus protocol (George Genesis, UCL). High-throughput consensus for side-chain architecture.
- **Augur (REP)** — Decentralized prediction markets with staked outcome reporting. Inspiration for truth markets.
- **UMA Optimistic Oracle** — "Assumed true unless disputed" model. Direct parallel to veracity bond challenge mechanism.

### Industry References

- **Shoshana Zuboff, "The Age of Surveillance Capitalism"** — Deep analysis of how engagement algorithms monetize human behavior
- **WAN-IFRA World Press Trends Outlook 2024-2025** — Revenue trends showing digital subscriptions overtaking ads
- **Reuters Institute Digital News Report 2024** — Only 17% of people globally pay for online news
- **Midnight Network Documentation** — Private + public state, ZK proofs, Compact language, shielded tokens

### Existing Decentralized Media Projects (Lessons Learned)

- **Civil (failed)**: Too complex for users, token mechanics confusing, insufficient adoption incentives
- **Steemit/Hive**: Gameable reputation, whale dominance, quality issues — need better mechanism design
- **Mirror.xyz**: Good NFT integration, but no truth accountability layer
- **Nostr**: Good decentralization, but no economic accountability for content quality

---

## Appendix A: Medium — What Works and What Doesn't

Since the team has discussed Medium as a reference point:

### What Works on Medium
- **Clean reading experience** — focused, distraction-free design
- **Partner Program** — writers earn based on member reading time
- **Discoverability** — algorithmic curation helps surface good content
- **Low friction** — easy to start writing immediately
- **Publications** — curated collections within the platform

### What Doesn't Work on Medium
- **Paywall fatigue** — readers hit paywalls constantly, creates friction
- **Algorithm opacity** — no transparency in how articles are surfaced
- **Race to clickbait** — earning by reading time incentivizes sensationalism
- **No truth accountability** — no consequence for publishing false information
- **Centralized control** — Medium Inc. can change rules, demonetize, ban at will
- **No data ownership** — readers' data belongs to Medium
- **Writer lock-in** — content and audience tied to the platform

### How ZK TimesZ Improves on Medium
- **Truth bonds** replace algorithmic trust signals
- **Open protocol** means no platform lock-in
- **Reputation is portable** — follows you to any protocol-compatible publication
- **Reader data stays private** — owned by the reader, not the platform
- **Multiple revenue streams** — not just reading-time ad revenue
- **Community governance** — rules set by participants, not a corporation

---

## Appendix B: Quick-Start Mental Model

For anyone new to this concept, here's the simplest way to think about ZK TimesZ:

> **Imagine if every news article came with a money-back guarantee for truth.**
>
> Writers put money on the table when they publish. If they're wrong, they lose it. If they're right, they get it back with interest. Anyone can challenge a claim and earn a bounty for catching errors. Over time, the most accurate writers build the strongest reputations — and earn the most money.
>
> Now imagine all of this happens with cryptographic privacy. Writers can be pseudonymous but still accountable. Readers can verify without surveillance. And no single company controls the rules.
>
> That's ZK TimesZ.

---

---

## Appendix C: Reference Links — The Rabbit Hole

**Chris, Sawyer — this one's for you two.** Go deep. Every link below is something John, Penny, or the research turned up that's directly relevant to what you're building. Organized by topic so you can pick your lane and dive. Some of this is heavy academic stuff, some is practical tooling, some is pure inspiration. Enjoy the ride, brothers.

---

### Midnight Network (Your Blockchain — Learn It Cold)

- **Midnight Official Site** — https://midnight.network/
- **Midnight Documentation (latest)** — https://docs.midnight.network/
- **Midnight GitHub (examples, Compact compiler)** — https://github.com/midnightntwrk
- **Compact Language Releases** — https://github.com/midnightntwrk/compact
- **Compact Source & Bug Reports (Minokawa)** — https://github.com/LFDT-Minokawa/compact
- **Bulletin Board Example DApp (closest to what you're building)** — https://github.com/midnightntwrk/example-bboard
- **Midnight Counter Example (start here if new to Compact)** — https://github.com/midnightntwrk/example-counter
- **Midnight DEX Example (advanced token mechanics)** — https://github.com/midnightntwrk/example-dex
- **Midnight Bank (private balances, encrypted sharing)** — https://github.com/nel349/midnight-bank
- **Create Midnight App CLI** — `npx @aspect-sh/pnpm dlx @midnight-ntwrk/create-midnight-app@compact-v0.5.1`
- **Midnight Lace Wallet** — https://midnight.network/tools — you'll need this for testing
- **Midnight Discord** — join for dev support: https://discord.gg/midnight-network
- **Midnight Over Coffee (community calls)** — https://x.com/CardanoOvrCoffe

### Zero-Knowledge Proofs (The Magic Under the Hood)

- **ZK Proofs Explained (Midnight docs)** — https://docs.midnight.network/learn/understanding-midnights-technology/zero-knowledge-proofs
- **ZKP MOOC (Berkeley, free lectures)** — https://zk-learning.org/
- **Zero Knowledge Podcast** — https://zeroknowledge.fm/
- **ZK Whiteboard Sessions (a]0 Research)** — https://www.youtube.com/playlist?list=PLj80z0cJm8QErn3akRcqvxUsyXWC81OGq
- **Circom + snarkjs (ZK circuit tooling)** — https://docs.circom.io/
- **zkSNARKs vs zkSTARKs Explained** — https://consensys.io/blog/zero-knowledge-proofs-starks-vs-snarks
- **Zcash: How ZK Works in Practice** — https://z.cash/learn/what-are-zk-snarks/
- **Vitalik's ZK-SNARK Intro** — https://vitalik.eth.limo/general/2021/01/26/snarks.html
- **PLONK Paper (the proof system Midnight uses under the hood)** — https://eprint.iacr.org/2019/953
- **Halo2 (recursive proofs, no trusted setup)** — https://zcash.github.io/halo2/

### Decentralized Identity (DIDs, Verifiable Credentials)

- **W3C DID Specification** — https://www.w3.org/TR/did-core/
- **W3C Verifiable Credentials** — https://www.w3.org/TR/vc-data-model-2.0/
- **Atala PRISM (Cardano DID framework, now open)** — https://atalaprism.io/
- **IOG PRISM GitHub** — https://github.com/input-output-hk/atala-prism
- **DIF (Decentralized Identity Foundation)** — https://identity.foundation/
- **Spruce ID (DID tooling)** — https://spruceid.com/
- **Microsoft ION (DID on Bitcoin)** — https://identity.foundation/ion/
- **Ceramic Network (decentralized data for DIDs)** — https://ceramic.network/
- **ENS (Ethereum Name Service — identity primitive)** — https://ens.domains/
- **Proof of Humanity (sybil resistance)** — https://proofofhumanity.id/
- **Worldcoin (iris-based proof of human)** — https://worldcoin.org/ — controversial but worth understanding
- **Gitcoin Passport (sybil resistance scoring)** — https://passport.gitcoin.co/

### Prediction Markets & Truth Markets

- **Robin Hanson's Prediction Markets Page (the OG)** — https://mason.gmu.edu/~rhanson/ideafutures.html
- **Robin Hanson: "Shall We Vote on Values, But Bet on Beliefs?"** — https://mason.gmu.edu/~rhanson/futarchy.html
- **Polymarket (largest crypto prediction market)** — https://polymarket.com/
- **Augur (decentralized prediction market protocol)** — https://augur.net/
- **Augur Whitepaper** — https://augur.net/whitepaper.pdf
- **UMA Optimistic Oracle ("true unless disputed" — closest to your challenge model)** — https://uma.xyz/
- **UMA Docs on Optimistic Oracle** — https://docs.uma.xyz/protocol-overview/how-does-umas-oracle-work
- **Gnosis (prediction market infra, now Gnosis Chain)** — https://www.gnosis.io/
- **Metaculus (calibrated forecasting community)** — https://www.metaculus.com/
- **Manifold Markets (play-money prediction markets)** — https://manifold.markets/
- **a16z: Prediction Markets — Everything You Need to Know** — https://a16zcrypto.com/posts/podcast/prediction-markets-explained/
- **Firinne Capital: Prediction Markets and Disinformation** — https://www.firinnecapital.com/blog/prediction-markets-and-the-age-of-disinformation
- **Vitalik on Futarchy** — https://vitalik.eth.limo/general/2021/08/16/voting3.html

### Reputation Systems & Mechanism Design

- **Eigentrust (decentralized reputation algorithm)** — https://nlp.stanford.edu/pubs/kamvar03eigentrust.pdf
- **Karma3Labs (on-chain reputation, EigenTrust-based)** — https://karma3labs.com/
- **Lens Protocol (social graph + reputation)** — https://www.lens.xyz/
- **Farcaster (decentralized social, reputation via engagement)** — https://www.farcaster.xyz/
- **Coordinape (peer-based reputation + rewards)** — https://coordinape.com/
- **SourceCred (contribution tracking + reputation)** — https://sourcecred.io/
- **Token Engineering Academy (mechanism design courses)** — https://tokenengineering.net/
- **Vitalik: Credible Neutrality** — https://nakamoto.com/credible-neutrality/
- **Quadratic Voting Explained** — https://www.radicalxchange.org/concepts/plural-voting/
- **Conviction Voting (time-weighted governance)** — https://medium.com/giveth/conviction-voting-a-novel-continuous-decision-making-alternative-to-governance-aa746cfb9475

### Decentralized Storage (Where Articles Actually Live)

- **IPFS (InterPlanetary File System)** — https://ipfs.tech/
- **IPFS Documentation** — https://docs.ipfs.tech/
- **Arweave (permanent storage, pay once)** — https://www.arweave.org/
- **Arweave Docs** — https://docs.arweave.org/
- **Filecoin (incentivized storage network)** — https://filecoin.io/
- **Pinata (IPFS pinning service, easy API)** — https://www.pinata.cloud/
- **Web3.Storage (free IPFS + Filecoin pinning)** — https://web3.storage/
- **Ceramic Network (mutable data streams on IPFS)** — https://ceramic.network/
- **Bundlr/Irys (Arweave upload tooling)** — https://irys.xyz/

### Advertising & Attention Economics

- **Basic Attention Token (BAT) Whitepaper** — https://basicattentiontoken.org/static-assets/documents/BasicAttentionTokenWhitePaper-4.pdf
- **BAT / Brave Docs** — https://brave.com/brave-ads/
- **Brave Browser** — https://brave.com/ — Chris, Sawyer, use this if you don't already
- **Kachina: Private Smart Contracts (IOG paper)** — https://eprint.iacr.org/2020/543
- **AdEx Network (decentralized ad exchange)** — https://www.adex.network/
- **Permission.io (permissioned data sharing for ads)** — https://permission.io/
- **Shoshana Zuboff: Surveillance Capitalism** — https://www.hachettebookgroup.com/titles/shoshana-zuboff/the-age-of-surveillance-capitalism/9781610395694/
- **The Social Dilemma (Netflix doc)** — https://www.thesocialdilemma.com/
- **Tim Wu: The Attention Merchants** — https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/

### Content Moderation & Curation Principles

- **Santa Clara Principles (content moderation transparency)** — https://santaclaraprinciples.org/
- **EFF: Content Moderation** — https://www.eff.org/issues/content-moderation
- **Stanford Internet Observatory** — https://cyber.fsi.stanford.edu/io
- **Techdirt: Content Moderation is Impossible** — https://www.techdirt.com/2019/11/20/masnicks-impossibility-theorem-content-moderation-scale-is-impossible-to-do-well/
- **Mike Masnick: Protocols, Not Platforms** — https://knightcolumbia.org/content/protocols-not-platforms-a-technological-approach-to-free-speech — **read this one, it's foundational to what you're building**
- **Bluesky AT Protocol (decentralized social, modular moderation)** — https://atproto.com/
- **Nostr Protocol (censorship-resistant social)** — https://nostr.com/
- **Mastodon / ActivityPub (federated social)** — https://joinmastodon.org/

### Journalism & Media Business Models

- **WAN-IFRA World Press Trends 2024-2025** — https://wan-ifra.org/2025/01/world-press-trends-outlook-digital-growth-and-other-revenue-streams-steady-the-ship-for-publishers/
- **Reuters Institute Digital News Report 2024** — https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2024
- **Nieman Lab (future of journalism)** — https://www.niemanlab.org/
- **Columbia Journalism Review** — https://www.cjr.org/
- **Lenfest Institute (local news sustainability)** — https://www.lenfestinstitute.org/
- **News Revenue Hub** — https://fundjournalism.org/
- **Substack (newsletter economy case study)** — https://substack.com/
- **Ghost (open-source publishing + memberships)** — https://ghost.org/ — good model to study
- **Mirror.xyz (web3 publishing)** — https://mirror.xyz/
- **Paragraph (web3 newsletters)** — https://paragraph.xyz/
- **Civil (failed decentralized journalism — study why)** — https://joincivil.com/ (archived)
- **Steemit / Hive (crypto social — study the problems)** — https://hive.io/

### Consensus, Sidechains & Scalability

- **Narwhal and Tusk Paper (high-throughput BFT)** — https://arxiv.org/abs/2105.11827
- **Bullshark (improved DAG-based consensus)** — https://arxiv.org/abs/2201.05677
- **Mithril (Cardano stake-based threshold sigs)** — https://mithril.network/
- **Mithril Paper** — https://iohk.io/en/research/library/papers/mithril-stake-based-threshold-multisignatures/
- **Hydra (Cardano L2, isomorphic state channels)** — https://hydra.family/
- **Poltercast Paper (decentralized pub/sub)** — https://hal.science/hal-01555561/document
- **Ouroboros (Cardano PoS consensus family)** — https://cardano.org/ouroboros/
- **Logspace Mining / Non-Interactive Proofs of Work** — https://eprint.iacr.org/2021/623

### Post-Quantum Cryptography (Future-Proofing)

- **NIST Post-Quantum Standards (finalized 2024)** — https://www.nist.gov/pqcrypto
- **FALCON (fast lattice-based signatures — Algorand's work)** — https://falcon-sign.info/
- **CRYSTALS-Dilithium (NIST selected signature scheme)** — https://pq-crystals.org/dilithium/
- **CRYSTALS-Kyber (NIST selected key encapsulation)** — https://pq-crystals.org/kyber/
- **Signal Post-Quantum Protocol (PQXDH)** — https://signal.org/docs/specifications/pqxdh/

### Encrypted Messaging (DM Layer)

- **Signal Protocol Specification** — https://signal.org/docs/
- **Signal Double Ratchet Algorithm** — https://signal.org/docs/specifications/doubleratchet/
- **Matrix Protocol (decentralized encrypted messaging)** — https://matrix.org/
- **XMTP (web3 messaging protocol)** — https://xmtp.org/
- **Waku (decentralized messaging for web3, Status)** — https://waku.org/

### NFTs, Digital IP & Content Ownership

- **ERC-721 Standard (NFT spec)** — https://eips.ethereum.org/EIPS/eip-721
- **ERC-1155 (multi-token standard)** — https://eips.ethereum.org/EIPS/eip-1155
- **ERC-6551 (token-bound accounts — NFTs that own things)** — https://eips.ethereum.org/EIPS/eip-6551
- **Zora (NFT marketplace + minting protocol)** — https://zora.co/
- **Creative Commons Licenses** — https://creativecommons.org/licenses/ — important for article licensing models
- **Lit Protocol (decentralized access control + encryption)** — https://litprotocol.com/
- **Story Protocol (programmable IP on-chain)** — https://www.storyprotocol.xyz/

### DAO Governance & Organizational Design

- **Aragon (DAO framework)** — https://aragon.org/
- **Snapshot (off-chain governance voting)** — https://snapshot.org/
- **Tally (on-chain governance dashboard)** — https://www.tally.xyz/
- **Compound Governor (governance smart contract standard)** — https://docs.compound.finance/v2/governance/
- **Optimism Collective (bicameral governance model)** — https://community.optimism.io/docs/governance/
- **Gitcoin (quadratic funding for public goods)** — https://www.gitcoin.co/
- **MolochDAO (grant-giving DAO, simple design)** — https://molochdao.com/

### Charles Hoskinson's Whiteboard Video (The Direct Inspiration)

- **"How to Build a Decentralized Twitter" — Charles Hoskinson (Nov 2022)** — https://www.youtube.com/watch?v=rqxGMJSJYT0 — **Watch this first if you haven't. The entire veracity bond / prediction market / DID / pub-sub / programmable curation / BAT-style advertising token model in this doc traces back to this whiteboard session.**

### Books Worth Reading

- **"The Age of Surveillance Capitalism" — Shoshana Zuboff** — How engagement algorithms weaponize human behavior
- **"The Attention Merchants" — Tim Wu** — History of the attention economy
- **"Radical Markets" — Glen Weyl & Eric Posner** — Quadratic voting, mechanism design for public goods
- **"Cryptoeconomics" — Eric Voskuil** — Deep dive on crypto incentive structures
- **"The Sovereign Individual" — Davidson & Rees-Mogg** — Macro vision of decentralized futures
- **"Governing the Commons" — Elinor Ostrom** — Nobel-winning work on how communities manage shared resources without central authority — directly relevant to governance design
- **"Skin in the Game" — Nassim Nicholas Taleb** — The philosophical backbone of veracity bonds: people should have consequences for their claims

---

> **Chris & Sawyer** — this is a LOT of material. Don't try to eat the elephant whole. John's recommendation: start with the Hoskinson whiteboard video, the Midnight docs + bulletin board example, the UMA Optimistic Oracle docs, and "Protocols Not Platforms" by Mike Masnick. Those four things will give you the conceptual + technical foundation to start building. Everything else is for when you go deeper into a specific subsystem. We're here if you need us. Let's build something that matters. — John & Penny

---

*This document is a living ideation artifact. It will be updated as the protocol design evolves.*

*Built with love by The Winner's Circle with johnny5i* 🏆
