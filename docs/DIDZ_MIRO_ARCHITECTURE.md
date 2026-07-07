# DIDz.io, Miro Board Architecture (Captured)

**Source**: Miro board exported as `DIDz-Miro-PDF.pdf`
**Captured by**: Penny 🎀
**Date**: March 2, 2026
**Status**: Architecture / Reference

---

## Header

**The EnterpriseZK Dapp system™**
*"The Foundation For Re-imagining the World's Digital Systems"*

### Target Sectors

- DeFi
- Government Systems
- Educational Institutions
- Enterprise Corporations
- Commerce
- Supply Chain
- Medical
- Passports & Travel
- Military & Security
- Law Enforcement
- Intelligence Systems

---

## Color Legend (from Miro board)

| Color | Meaning |
|-------|---------|
| **Red** | Stored, private information which cannot be readily accessed nor shared |
| **Yellow** | A "ZKQuery" or "Proof Challenge", a ZKProof-invoking question which returns a binary (yes/no) |
| **Green** | Verification result / data flow |
| **Dark Blue** | Core DApp components (Integration DApps, Proof Server) |
| **Gray dashed** | Expandable / placeholder (future trusted issuers, etc.) |

---

## Three Roles

1. **Holder**, The user (e.g., "Alice") who owns their private data and controls their DIDz
2. **Trusted Issuer**, An authoritative entity that verifies and attests to claims (e.g., DMV, bank, hospital)
3. **Verifier**, An entity that needs to check a claim about the Holder without seeing their private data

---

## The Flow (Step by Step)

### Step 1: DIDz Setup, "Start Here" (Holder)

**Alice's story** (from her speech bubble):

> "I'm a smart Executive, and a private gal, so I never want to give my private information or data out unless it is mandatory by law. In order to comply with Federal and State laws, I have set up this Digital, Pseudonymous Identity (DID or DIDz) (DIDz by Hyperledger Identus)"

**Alice's private data** (stored in red = private, never exposed):
- BirthDate: 5-1-1993
- Name: Alice Lovelace
- DL#: FA104/350A
- Blood Donor: Yes
- Hair color: Blonde
- Address: 123 Anywhere Street, MyTown, PA 19213
- Cell Phone: #215-484-6178
- Mother: Ada Lovelace
- Father: Charles Lovelace Sr.

**Result**: Alice becomes a **"Holder"**, she owns and controls her DIDz.

### Steps 2 & 3: Biometric Binding + QR Code Exchange

**Biometric binding note** (from Miro):

> "Digital fingerprint, face scan, bio pulse/ox attached to the DIDz. Each DIDz can have only one of each finger. This verifies that the person is associated with that DIDz without revealing who they are. If the person changes their fingerprint, they must use face or pulse/ox for a period of time to prevent spoofing (using someone else's fingerprint to verify their DIDz.)"

**Key design decisions**:
- **One fingerprint per DIDz**, prevents Sybil attacks (can't register same finger to multiple DIDz)
- **Fallback chain**: If fingerprint changes → must use face or pulse/ox temporarily
- **Anti-spoofing**: Time-gated fallback prevents someone stealing a fingerprint to hijack a DIDz

**Implementation note** (from Miro):
> "Implemented with Hyperledger Identus 'Out of Band invitation' protocol."
> Reference: YouTube video, timestamp 31:07

**QR code exchange**: User prints a QR code from their DID DApp, takes it to the Trusted Issuer (e.g., DMV), who scans it and gives back a QR code that loads credentials into the user's DIDz.

### Step 4: Trusted Issuer Verification (e.g., DMV)

**Alice's DMV experience** (from speech bubble):

> "My local DMV has just instituted a fancy new program or 'DApp' (created by EnterpriseZK), which allows me to prove distinct credentials which are verified and stored on the DMV's data servers. These 'proofs' are returned as binary booleans or 'yes or no' answers, therefore they reveal no other information other than confirmation or denial of the ZKQuery posed, e.g., 'Am I over 21?', or 'Am I a legal US citizen?', or 'Am I a Felon?'. The way this works is that based on my DID, I printed a QR code. I went to the DMV, they scanned my QR code, and they gave me a QR code which I loaded to my DID in my DID DApp."

**Trusted Issuer**: DMV, Department of Motor Vehicles Data Server (red pentagon icon)

**Expandable**: The architecture supports multiple Trusted Issuers. DMV is the example; others could include banks, hospitals, government agencies, employers, etc.

> "Here we have several Trusted Issuers. The right and left [circles] are placeholders to demonstrate potential area flow, and we have identified one of the Trusted Issuers as the Department of Motor Vehicles (DMV) for example purposes."

### Step 5: ZKProof Credential-Issuer Integration DApp

The **ZKProof Credential-Issuer Integration DApp** is the middleware between Trusted Issuers and the Midnight blockchain.

> "The ZKProof Credential-Issuer Integration [DApp] allows DIDz (or just the 'Trusted Issuer') to issue verifiable, presentable proofs to the 'Holder' without giving away the Holder's actual information. Only 'ZKQueries formatted' or 'Proof Challenges' (AKA 'proofs') can be submitted."

**Data flows**:
- Trusted Issuer (DMV) → Credential-Issuer DApp → Midnight Network Proof Server → Public Ledger
- The Holder receives verifiable credentials back into their DIDz

---

## Presenting the Proof

Once Alice has her DIDz loaded with credentials, she can present proofs to Verifiers.

### Three Example Verifiers

| # | Verifier | ZKQuery / Proof Challenge |
|---|----------|--------------------------|
| 1 | **Liquor Store** | "Is Alice old enough to purchase alcohol?" |
| 2 | **Election Poll Agent** | "Is Alice a legal citizen AND over 18 years old AND a non-felon?" |
| 3 | **Hospital** | "Is Alice a Felon?" |

Each verifier has:
- A **ZKProof Verifier-Issuer Integration DApp** (handles the proof request)
- A connection to a **Midnight Network Proof Server** (verifies the ZK proof)

**Key point**: Verifiers learn ONLY the yes/no answer. They never see Alice's name, DOB, address, DL#, or any other private data.

---

## Verifying the Proof

The verification loop:
1. Verifier submits ZKQuery through their Integration DApp
2. Query reaches the Midnight Network Proof Server
3. Proof Server checks against the Public Ledger
4. Response: **"Is this presented proof correct?"** → **"Yes, this proof matches, and therefore is correct"**
5. Result returned to Verifier as a boolean

---

## Infrastructure

```
┌──────────────┐     ┌──────────────────────┐     ┌───────────────┐
│  Trusted      │────▶│  ZKProof Credential-  │────▶│  Midnight     │
│  Issuer (DMV) │     │  Issuer Integration   │     │  Network      │
└──────────────┘     │  DApp                 │     │  Proof Server │
                     └──────────────────────┘     └───────┬───────┘
                                                          │
                                                          ▼
                                                   ┌──────────────┐
                                                   │ Public Ledger │
                                                   └──────┬───────┘
                                                          │
                     ┌──────────────────────┐             │
┌──────────────┐     │  ZKProof Verifier-    │◀────────────┘
│  Verifier     │◀───│  Issuer Integration   │
│  (Liquor St.) │     │  DApp                 │
└──────────────┘     └──────────────────────┘
```

---

## Key Architectural Decisions

1. **Hyperledger Identus** for DID infrastructure (Out of Band invitation protocol)
2. **QR code exchange** between Holder and Trusted Issuer, physical or digital
3. **Biometric binding**: fingerprint + face scan + bio pulse/ox (one finger per DIDz)
4. **Binary-only responses**: All proof queries return yes/no, never raw data
5. **Two integration DApps**:
   - **Credential-Issuer Integration DApp** (between Trusted Issuers and Midnight)
   - **Verifier-Issuer Integration DApp** (between Verifiers and Midnight)
6. **Midnight Network Proof Server** handles all ZK proof generation and verification
7. **Public Ledger** records proof validity without any PII
8. **Expandable Trusted Issuers**, architecture supports unlimited issuers

---

## Alignment with KYCz Architecture

| Miro Board Concept | KYCz Equivalent |
|--------------------|-----------------| 
| Biometric binding (fingerprint, face, pulse/ox) | KYCz Binding Stack (8-factor liveness + face match) |
| Trusted Issuer (DMV) | KYCz Issuer attestation commitment |
| QR code exchange | KYCz enrollment flow (document scan + credential issuance) |
| ZKQuery returning binary | KYCz Predicate Catalog (age_gte, resident_in, sanctions_clear, etc.) |
| Holder's private data in red | KYCz Anchor in Midnight private state |
| Verifier gets yes/no only | KYCz Assertion Schema (ZK proof package) |

---

*Captured from John's Miro board architecture for the DIDz.io DApp system.*
*Original: `DIDz-Miro-PDF.pdf` in this repository.*
