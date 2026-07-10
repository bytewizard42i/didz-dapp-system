# tDIDz — Temporary Identity Placeholder (dev only)

While real Midnight **DIDz** wiring is in progress, the DIDzMonolith data plane
(HelixCTW) uses a **temporary-ID authority** ("tDIDz" = temp DIDz) as a
swappable stand-in. This note exists so there is **no confusion** when you see
`TEMP-*` labels or `id_scheme = 'temp'` anywhere in the ecosystem.

- **What it is**: a traditional-registrar-style placeholder that issues labels
  like `TEMP-HUMAN-0001`, with `commitment = sha256("helix:temp:" + label)`.
- **Why**: lets us build identity/asset/credential flows now; swaps to real DIDz
  with **zero business-logic changes** (one-line provider swap).
- **Not production identity.** Real DIDz commitments are non-resolvable by
  design (privacy); the temp scheme's resolvable labels are a dev convenience.

## The four ecosystem classes (do NOT conflate)

Powered by **DIDz + AgenticDID + RWAz + HelixCTW**:

| Class | Engine | What it is | Transferable? |
|---|---|---|---|
| Identity | **DIDz** | who/what this is | no |
| Verifiable Credential (VC) | DIDz-branch | a claim ABOUT a holder (diploma, security pass, license) | no |
| Asset | **RWAz** | a thing a holder OWNS (car, house, watch, pet) | yes |
| Grant | **AgenticDID** | what an agent may DO for you | delegated |

**Canonical spec** (authoritative, with full detail + migration path):
`helixctw/docs/IDENTITY_PLACEHOLDER_SCHEME.md`
Reference implementation: `helixctw/hackathon/app/src/identity.ts`
