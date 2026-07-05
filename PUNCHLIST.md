# DIDz-io — Punch List

> Created: July 5, 2026 (Penny session)
> Status: gaps found during demoLand spin-up + gap analysis

## machine(1) upgrade (in progress)
- [ ] Complete lifecycle statuses: 0 active / 1 suspended / 2 deceased / 3 dissolved / 4 destroyed
- [ ] Terminal states must be irreversible
- [ ] Identity never deleted — verify enforcement in contract
- [ ] Privacy-first rework per principle 0: commitments + status bits only on-chain, raw facts off-chain

## Contracts
- [ ] Verify all registries compile on `compactc 0.31.1` (prior pass confirmed, re-verify after changes)
- [ ] Write/verify contract tests

## Demo UI
- [ ] Modernize demoLand UI to 2026 design (glassmorphism, 3D tilt, haptics, tooltips) — currently basic
- [ ] demoLand runs on port 3013 (good, follows convention)

## Architecture
- [ ] Constitution still open — proposed: one DIDz root constitution + AgenticDID appendix
- [ ] Cross-pollination docs not written (pointer docs to engine modules, consumer repos)

## House convention docs (missing)
- [ ] `docs/DEMOLAND_VS_REALDEAL.md`
- [ ] `docs/DIF_RELEVANCE.md`

## Cleanup
- [ ] `didz-agenticdid-plain-english-overview.md:Zone.Identifier` — Windows metadata artifact, remove
- [ ] `DIDz-Miro-PDF.pdf:Zone.Identifier` — Windows metadata artifact, remove
