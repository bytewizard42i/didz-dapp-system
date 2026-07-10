# HelixCTW Integration (pointer)

**DIDz-io** integrates with **HelixCTW**, the ecosystem's privacy-preserving
data plane + AI agent (powered by **DIDz + AgenticDID + RWAz + HelixCTW**).

**This repo primarily writes:** `identities` — the DIDz root identity registry
(tID placeholder today, real Midnight DIDz later).

**Integration contract (summary):**
- every subject/owner/holder is a 32-byte **commitment**, never a name
- use the identity layer (DIDz ⇄ tID swappable at runtime) — never hard-code a provider
- store **coarse** data only (buckets/categories) + a `*_hash` anchor
- pick the right class: **DIDz** identity / **VC** credential / **RWAz** asset / **AgenticDID** grant

**Canonical integration schema:** `helixctw/docs/HELIXCTW_INTEGRATION.md`
**Alternate-ID (tDIDz) scheme:** `helixctw/docs/IDENTITY_PLACEHOLDER_SCHEME.md`
(local pointer: `docs/TEMP_ID_PLACEHOLDER.md`)
