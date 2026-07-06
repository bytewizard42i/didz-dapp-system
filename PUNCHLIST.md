# DIDz-io — Punch List

> Created: July 5, 2026 (Penny session)
> Status: gaps found during demoLand spin-up + gap analysis

## machine(1) upgrade (in progress)
- [x] Complete lifecycle statuses: 0 active / 1 suspended / 2 deceased / 3 dissolved / 4 destroyed — implemented in DIDzRegistry.compact
- [x] Terminal states must be irreversible — enforced: `assert(current <= 1)` in set_terminal_status
- [x] Identity never deleted — no delete circuit exists; dids set is insert-only
- [x] Privacy-first rework per principle 0 — did_profile_commitment + ZK prove_entity_type, prove_attestation circuits

## Contracts
- [x] Verify all registries compile on `compactc 0.31.1` — DIDzRegistry (15 circuits) + TrustedIssuerRegistry (7 circuits) both clean
- [x] Write/verify contract tests — scaffold at tests/didz_registry.test.js (10 describe blocks, 30+ test stubs)

## Demo UI
- [x] Modernize demoLand UI to 2026 design — glassmorphism, 3D tilt, haptics, tooltips, aurora, JetBrains Mono
- [ ] demoLand runs on port 3013 (good, follows convention)

## Architecture
- [x] Constitution drafted — DIDZ_CONSTITUTION.md (8 articles + AgenticDID appendix + RWAz appendix + 15 repo pointer docs)
- [x] Cross-pollination docs — `docs/ENGINE_REFERENCE.md` created

## House convention docs
- [x] `docs/DEMOLAND_VS_REALDEAL.md` — created
- [x] `docs/DIF_RELEVANCE.md` — already existed

## Cleanup
- [x] `didz-agenticdid-plain-english-overview.md:Zone.Identifier` — removed
- [x] `DIDz-Miro-PDF.pdf:Zone.Identifier` — removed
