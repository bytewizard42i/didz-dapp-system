# DIDz-io — Engine Reference

> Pointer to the shared Compact modules that DIDz-io imports (or will import).

## Source

**Repo**: `midnight-modules` (`/home/js/DIDzMonolith/midnight-modules`)
**Catalog**: `midnight-modules/docs/MODULES_CATALOG.md`

## Modules DIDz-io uses (or plans to)

| Module | Status | How DIDz-io uses it |
|--------|--------|---------------------|
| `scoped-grant` | v2, compiled 0.31.1 | Identity authority grants (who may update a registry entry) |
| `pol-credential` | compiled 0.31.1 | Proof-of-Life credentials for human identities (renewable) |
| `commitment` | available | Identity commitments — raw facts stay off-chain (principle 0) |
| `nullifier` | available | Presentation nullifiers for anti-collusion |
| `merkle-membership` | available | Recovery m-of-n proof |

## Migration status

DIDz-io registries compile on 0.31.1. machine(1) upgrade in progress: lifecycle
statuses (0 active / 1 suspended / 2 deceased / 3 dissolved / 4 destroyed) +
privacy-first rework. See `PUNCHLIST.md`.

## Import pattern

```compact
import { scoped_grant_v2 } from "../midnight-modules/modules/scoped-grant/scoped_grant_v2";
```
