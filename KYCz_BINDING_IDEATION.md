# 🧬 KYCz Binding Ideation — How Do We Prove KYC Belongs to Us?

**Date**: February 20, 2026  
**Context**: KYCz (KYC + zkProofs) on Midnight — solving the identity binding problem WITHOUT DID

---

## The Core Problem

We have three things that need to be **bound together**:

1. **A real human** (proved by biometric liveness)
2. **KYC data** (stored in Midnight private state)
3. **Proof that #2 belongs to #1** ← THE GAP

Biometrics prove a human is present. Private state holds the data. But **what connects them?**

We need a binding mechanism that doesn't require a full DID system and leverages things **already in place**.

---

## The Key Insight

> **"The face on the government-issued document matches the face of the person passing biometric liveness right now."**

That's what every bank teller, TSA agent, and bouncer does. We do it digitally and store the proof in Midnight's private state instead of a centralized database. **No DID required.**

---

## 🏆 Tier 1 — Strongest, Already Widely Used, Minimal Barriers

### Option A: DL Barcode Scan + Face Photo Match (Best Bet)

1. Scan **back of DL** — PDF417 barcode contains structured AAMVA data (name, DOB, address, DL#, height, weight, eye color, expiry)
2. Scan **front of DL** — extract the photo via camera
3. Run **biometric liveness** on the live person (8-factor)
4. **Face match**: Compare the DL photo to the live person's face
5. **Binding**: Face matches government-issued photo → you own that KYC data
6. All data → Midnight private state

**Why this works**: This is what TSA, banks, and bars already do. No government API needed. The physical document IS the trusted issuer's attestation. The face match is the binding. The barcode is machine-readable and standardized across all US states.

**Barriers**: Minimal. Camera + barcode scanner libraries are commodity tech. Face comparison via face-api.js is free and runs client-side.

---

### Option B: Passport/REAL ID NFC Chip (Cryptographic Gold)

Modern passports and some REAL ID-compliant licenses have **NFC chips** with cryptographically signed data:

1. Tap phone to passport/ID → read NFC chip
2. Chip contains: biometric photo, personal data, **all digitally signed by the issuing government**
3. Verify the signature chain (ICAO PKD → Country CA → Document Signer → Chip)
4. Compare chip photo to live biometric
5. Active Authentication proves the chip is genuine (not cloned)

**Why this is incredible**: The data is **cryptographically proven authentic by the government itself** — without calling any government server. The signing certificates are publicly available. Mathematical proof that "this passport was issued by [country] and has not been tampered with."

**Barriers**: Not all phones have NFC readers. Not all licenses have chips yet. But passports do, and REAL ID is rolling out.

---

### Option C: Bank Account Binding (Plaid / Open Banking)

Banks have already done KYC on their customers. Leverage that:

1. User connects bank account via Plaid (or similar)
2. Micro-deposits verify account ownership
3. Bank's KYC is the trusted issuer attestation
4. Name/address from bank matches scanned document
5. Combined with biometric liveness → triple binding

**Why this works**: The bank is the trusted issuer. They already verified this person's identity. "Chase/BofA vouches that this person is who they say they are."

**Barriers**: Plaid costs per verification, requires bank account. But it's industry-standard.

---

## 🥈 Tier 2 — Good, Some Friction

### Option D: Phone/SIM Carrier Verification

Telecom carriers verified your identity when they issued your SIM:
- Carrier APIs exist (T-Mobile ID, AT&T Verify, Prove.com)
- Phone possession + biometrics = binding
- Carrier confirms: "This phone number belongs to [name] at [address]"

**Barriers**: SIM swapping is a known vulnerability. API access costs money.

### Option E: Credit Bureau Knowledge-Based Authentication (KBA)

Experian/Equifax/TransUnion offer challenge questions:
- "Which of these addresses have you lived at?"
- "What's your monthly car payment?"
- Only the real person knows the answers
- Combined with biometric liveness = strong binding

**Barriers**: Data breaches weaken KBA over time. Costs per query.

### Option F: IRS Income Verification / Tax Transcript

- User authorizes IRS access
- IRS confirms identity + income data
- Government-backed trusted issuer
- Combined with biometrics

**Barriers**: Slow, IRS systems are clunky. But very high trust level.

---

## 🥉 Tier 3 — Creative, Niche But Interesting

### Option G: Notary Attestation Hash

1. User visits a notary public (UPS stores, banks — everywhere)
2. Notary verifies ID, creates a signed attestation
3. Hash of the attestation goes into Midnight private state
4. Biometrics bind the person to the hash
5. Notary is the trusted issuer

**Barriers**: Requires in-person step. But legally recognized and cheap (~$5-15).

### Option H: Multi-Source Cross-Reference (Convergence Approach)

No single trusted issuer — instead use **convergence of multiple weak signals**:
- DL barcode data
- Utility bill OCR (name + address match)
- Phone number carrier match
- Bank account name match
- Biometric liveness

Each independently weak, but **together statistically unique**. "5 independent sources all agree this is John at this address" → fraud probability drops exponentially.

---

## 🎯 Recommended: The KYCz Binding Stack

Combine Option A + elements of others into a layered approach:

```
┌─────────────────────────────────────────────────────────┐
│                   KYCz BINDING STACK                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: DOCUMENT POSSESSION                           │
│  ├── Scan DL barcode (PDF417) → structured KYC data     │
│  └── OR Passport NFC chip → cryptographically signed    │
│                                                         │
│  Layer 2: PHOTO-TO-FACE BINDING                         │
│  ├── Extract photo from front of DL / passport          │
│  └── Face match against live person (face-api.js)       │
│                                                         │
│  Layer 3: BIOMETRIC LIVENESS (8-factor)                 │
│  ├── Proves a real human is present NOW                 │
│  └── Not a photo, deepfake, or replay                   │
│                                                         │
│  Layer 4: OPTIONAL REINFORCEMENT                        │
│  ├── Bank account binding (Plaid)                       │
│  ├── Phone carrier verification                         │
│  └── KBA challenge questions                            │
│                                                         │
│  Layer 5: MIDNIGHT COMMITMENT                           │
│  ├── All verified data → private state                  │
│  ├── Face embedding hash → private state (for re-match) │
│  └── Binding proof → on-chain                           │
│                                                         │
│  Layer 6: RE-VERIFICATION                               │
│  ├── Returning user → biometric liveness                │
│  └── Face match against stored hash → same person       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### The Full Flow

```
Step 1: User scans back of DL (PDF417 barcode)
    → Structured KYC data extracted (name, DOB, address, DL#, etc.)

Step 2: User scans front of DL
    → Photo extracted from the document

Step 3: 8-factor biometric liveness check runs
    → Real human confirmed (not deepfake/photo/replay)

Step 4: Face match — DL photo vs live person
    → BINDING ESTABLISHED: This person IS the person on the DL

Step 5: All data committed to Midnight private state
    → Encrypted, shielded, only accessible via zk-proof circuits

Step 6: Future assertions via zk-proofs
    → "Over 18?" "Valid DL?" "Same person?" → Yes/No only

Step 7: Returning user → biometric re-check
    → Face match against stored embedding confirms same person
    → No need to re-scan documents
```

---

## Why This Works Without DID

- **The DL barcode IS the trusted issuer's attestation** (the DMV issued it)
- **The face match IS the binding** (your face = the face on the government doc)
- **The biometrics IS the proof of human** (you're alive and present)
- **Midnight IS the privacy layer** (data stays private, only assertions leave)

No DID infrastructure needed. No government API calls. No centralized database. Just a camera, a physical ID, and Midnight's private state.

---

## Open Questions

1. How do we handle expired documents? (Check expiry from barcode data)
2. What about states with non-standard barcodes? (AAMVA covers ~95% of US)
3. Can we add passport NFC as a premium verification tier?
4. Should reinforcement layers (Plaid, carrier) be optional or required?
5. How do we handle the face embedding storage — hash only, or encrypted template?
6. What Compact contract structure best supports this binding model?

---

**Next Steps**: Discuss with Jay Albert (Midnight DevRel), prototype the DL barcode scanning + face match flow, design the Compact contract for the binding proof.

**Author**: John (bytewizard42i) + Penny 🎀  
**Last Updated**: February 20, 2026
