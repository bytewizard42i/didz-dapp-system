# DIDz-io, Punch List

> Created: July 5, 2026 (Penny session)
> Last updated: July 5, 2026 evening, all items complete

## machine(1) upgrade (complete)
- [x] Complete lifecycle statuses: 0 active / 1 suspended / 2 deceased / 3 dissolved / 4 destroyed, implemented in DIDzRegistry.compact
- [x] Terminal states must be irreversible, enforced: `assert(current <= 1)` in set_terminal_status
- [x] Identity never deleted, no delete circuit exists; dids set is insert-only
- [x] Privacy-first rework per principle 0, did_profile_commitment + ZK prove_entity_type, prove_attestation circuits
- [x] Multi-admin governance, add_admin/remove_admin circuits (17 circuits total)

## Contracts
- [x] Verify all registries compile on `compactc 0.31.1`, DIDzRegistry (17 circuits) + TrustedIssuerRegistry (11 circuits) both clean
- [x] Write structural contract tests, tests/didz_registry.test.cjs + trusted_issuer_registry.test.cjs (circuit presence + regression guards, all pass)

## Demo UI
- [x] Modernize demoLand UI to 2026 design, glassmorphism, 3D tilt, haptics, tooltips, aurora, JetBrains Mono
- [x] demoLand runs on port 3013 (follows 30xx convention)
- [x] DemoLand portal at :3010 with live health-check status dots for all 10 demo servers

## Architecture
- [x] Constitution drafted, DIDZ_CONSTITUTION.md (8 articles + AgenticDID appendix + RWAz appendix + 15 repo pointer docs)
- [x] Cross-pollination docs, `docs/ENGINE_REFERENCE.md` created
- [x] Three-pillar model refactored (was four-pillar), SelectConnect is a product, not a pillar

## House convention docs
- [x] `docs/DEMOLAND_VS_REALDEAL.md`, created
- [x] `docs/DIF_RELEVANCE.md`, already existed

## Cleanup
- [x] `didz-agenticdid-plain-english-overview.md:Zone.Identifier`, removed
- [x] `DIDz-Miro-PDF.pdf:Zone.Identifier`, removed
