# DIDz-io — Punch List

> Created: July 5, 2026 (Penny session)
> Status: gaps found during demoLand spin-up + gap analysis

## machine(1) upgrade (in progress)
- [ ] Complete lifecycle statuses: 0 active / 1 suspended / 2 deceased / 3 dissolved / 4 destroyed
- [ ] Terminal states must be irreversible
- [ ] Identity never deleted — verify enforcement in contract
- [ ] Privacy-first rework per principle 0: commitments + status bits only on-chain, raw facts off-chain

## Contracts
- [x] Verify all registries compile on `compactc 0.31.1` — DIDzRegistry (15 circuits) + TrustedIssuerRegistry (7 circuits) both clean
- [ ] Write/verify contract tests

## Demo UI
- [x] Modernize demoLand UI to 2026 design — glassmorphism, 3D tilt, haptics, tooltips, aurora, JetBrains Mono
- [ ] demoLand runs on port 3013 (good, follows convention)

## Architecture
- [ ] Constitution still open — proposed: one DIDz root constitution + AgenticDID appendix
- [x] Cross-pollination docs — `docs/ENGINE_REFERENCE.md` created

## House convention docs
- [x] `docs/DEMOLAND_VS_REALDEAL.md` — created
- [x] `docs/DIF_RELEVANCE.md` — already existed

## Cleanup
- [x] `didz-agenticdid-plain-english-overview.md:Zone.Identifier` — removed
- [x] `DIDz-Miro-PDF.pdf:Zone.Identifier` — removed
