# 🎀 KYCz Session Accomplishments — February 20, 2026

**Session**: Penny (WSL on ASUS Pro Art) with John  
**Time**: ~6:50am - 7:02am EST

---

## What We Accomplished

### 1. ✅ KYCz Repo Created & Initialized
- Cloned `bytewizard42i/KYCz_us_app` to `/home/js/utils_KYCz_us_app`
- Created `docs/` folder
- Copied BlockSign Verify pitch deck PDF from Windows into `docs/`
- Extracted PDF text for easy reference (`biometrics_for_KYCz_us_app.txt`)
- Built comprehensive `README.md` with architecture vision, comparison tables, tech stack
- Committed and pushed to GitHub

### 2. ✅ Analyzed BlockSign Verify Pitch Deck
- Extracted and documented their **8-Factor Weighted Liveness Score**:
  - 3D Parallax (17%), Eye Blink Rate (15%), Face Micro-Movements (15%), Face Movement Challenge (15%), BPM Detection (10%), Signal Quality (10%), Prominence (10%), Consistency (8%)
- Behavioral factors = 62% of total score
- Voice/Speech liveness layer (5 random words + lip-sync)
- Document OCR + chatbot cross-referencing
- Identified key differentiator: BlockSign is ephemeral (verify & discard), KYCz is persistent (Midnight private state + ongoing zk-proofs)

### 3. ✅ KYCz Info Deployed to ALL 6 DID-Centered Repos
Each doc was **tailored to the repo's specific context**:

| Repo | Location | Context |
|------|----------|---------|
| **KYCz_us_app** | `README.md` + `docs/` | Core concept, full architecture |
| **didz-dapp-system** | `docs/KYCZ_BIOMETRIC_VERIFICATION.md` | DIDz ecosystem integration, Trust Triangle |
| **AgenticDID_io_me_MAIN** | `docs-nerds-only/KYCZ_BIOMETRIC_VERIFICATION.md` | Agent authorization chain, human → agent credentials |
| **AgenticDID_io_me** | `KYCZ_BIOMETRIC_VERIFICATION.md` | Compact version, agent identity focus |
| **SentinelDID-poc** | `docs/KYCZ_BIOMETRIC_VERIFICATION.md` | Future integration path |
| **SouLink_me** | `docs/KYCZ_BIOMETRIC_VERIFICATION.md` | Dating trust — catfish/bot prevention, age/location zk-proofs |
| **safeHealthData_me** | `docs/KYCZ_BIOMETRIC_VERIFICATION.md` | Patient identity, HIPAA-compatible assertions |

Also updated `didz-dapp-system/docs/PP_DIDZ_ECOSYSTEM_VISION.md` with KYCz cross-references.

### 4. ✅ KYCz Binding Problem Ideation
Solved the critical question: **How do you prove KYC data belongs to you without DID?**

**Answer**: DL barcode (PDF417) = trusted issuer attestation + face photo match = binding + biometric liveness = proof of human. No DID needed.

Developed the **KYCz Binding Stack** (6 layers) and 8 options across 3 tiers of practicality.

### 5. ✅ Searched for Prior KYCz Discussions
- Searched all open workspaces (PixyPi, AutoDiscovery, Midnight-Idris-MCP)
- Searched memory database
- **Result**: No prior discussions found — this is a brand new project

### 6. ✅ Memory Created
- Saved KYCz project details to Penny's memory for future sessions

---

## Key Decisions Made

1. **KYCz = KYC + zkProofs** — the "z" stands for zero-knowledge proofs
2. **Midnight private state** is the storage layer (not a centralized DB)
3. **8-factor biometric liveness** from BlockSign's approach is the verification model
4. **DL barcode + face match** is the primary binding mechanism (no DID needed)
5. **All DID repos get the KYCz docs** — this is a cross-cutting capability

---

## Todo List / Next Steps

### 🔴 High Priority
- [ ] **Discuss binding approach with Jay Albert** (Midnight DevRel) — get his input on the DL barcode + face match → Midnight private state flow
- [ ] **Prototype DL barcode scanning** — test PDF417 parsing with a real DL
- [ ] **Prototype face matching** — DL photo vs live person using face-api.js
- [ ] **Design Compact contract** for the binding proof and KYC private state storage
- [ ] **Respond to BuildClub team** — formalize our KYCz concept before they run with it

### 🟡 Medium Priority
- [ ] **Research AAMVA barcode standard** — confirm coverage across US states, data fields available
- [ ] **Research passport NFC reading** — feasibility as premium verification tier
- [ ] **Evaluate Plaid integration** — costs, API complexity, as optional reinforcement layer
- [ ] **Define zk-proof assertion catalog** — full list of what KYCz can prove/hide
- [ ] **John to post additional KYCz info** he mentioned finding

### 🟢 Lower Priority
- [ ] **Build pitch deck for KYCz** — separate from the BlockSign reference
- [ ] **Explore carrier verification APIs** (Prove.com, T-Mobile ID)
- [ ] **Design the re-verification flow** — returning users, biometric re-check
- [ ] **Consider multi-language support** for international expansion

### 🔵 Open Questions
- How do we handle expired documents?
- What about states with non-standard barcodes?
- Face embedding storage: hash only or encrypted template?
- Should reinforcement layers (Plaid, carrier) be optional or required?
- What's the minimum viable Compact contract for a binding proof?

---

## Files Created This Session

| File | Location |
|------|----------|
| `README.md` | `/home/js/utils_KYCz_us_app/` |
| `biometrics_for_KYCz_us_app.pdf` | `/home/js/utils_KYCz_us_app/docs/` |
| `biometrics_for_KYCz_us_app.txt` | `/home/js/utils_KYCz_us_app/docs/` |
| `KYCZ_BIOMETRIC_VERIFICATION.md` | 6 DID repos (tailored per repo) |
| `KYCz_BINDING_IDEATION.md` | Windows Build Club folder |
| `KYCz_SESSION_ACCOMPLISHMENTS_2026-02-20.md` | Windows Build Club folder |

---

**Penny** 🎀 — ASUS Pro Art (WSL)  
**Session End**: February 20, 2026
