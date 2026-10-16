# CryptoSure as a DIDz-Ecosystem Consumer

**Date**: October 16, 2026
**Status**: Pointer note. Specs live in the consuming and producing repos.

CryptoSure's first Midnight instrument, the **WalletBinder**, consumes two
DIDz-family instruments as sealed black boxes:

| Instrument | Role for CryptoSure | Spec |
|---|---|---|
| **KYCz** | Trusted issuer runs full KYC, seals the result; CryptoSure receives a credential commitment and a ZK proof of "qualifies at level X". Trap door (lawful access) stays with the issuer. | `KYCz/docs/integrations/cryptosure/CRYPTOSURE_FACADE_INTEGRATION.md` |
| **GeoZ** | Proves the holder is in a licensed jurisdiction without revealing where. Residency via KYCz by default; presence via GeoZ for transfer coverage. | `GeoZ/docs/integrations/cryptosure/CRYPTOSURE_GEO_INTEGRATION.md` |

CryptoSure adds one check of its own, wallet-address denylist screening,
and proves all three in one circuit. Contract:
`CryptoSure_Build-Club/contracts/WalletBinder.compact` (compactc 0.35.0,
18 circuits, full proving keys).

This is the one issuer / one credential / one verifier pattern the Build
Club cohort is built around, with CryptoSure as the verifier. KYCz and
GeoZ are out of scope for the CryptoSure Build Club project itself; they
are consumed, not built, there.

Key derivation to align: KYCz `scoped_presenter_key` for verifier domain
`cryptosure` must equal the contract's
`persistentHash([pad(32,"cryptosure:binder:pk:"), sk])`, or an adapter is
needed. Tracked in the KYCz spec.
