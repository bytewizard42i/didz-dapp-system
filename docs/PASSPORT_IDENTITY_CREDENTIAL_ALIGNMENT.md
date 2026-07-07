# Passport Identity & Credential Alignment

**Source:** Midnight Passport product presentation / whiteboard session (Charles Hoskinson
intro; Karmel product lead; Hector technical demo), 2026-07-04. Full transcript + distilled
takeaways in the Passport fork:
`midnight-Passport-johns_copy/DIDz-Passport-Collaboration/`.

## Why this matters to DIDz.io

Passport puts **Midnight DIDs + credentialing + selective disclosure** at the centre of a
billion-user product. DIDz.io has been building exactly these primitives. This is both
validation and an integration path: DIDz.io identities should ride on Passport accounts,
and DIDz.io's credential/selective-disclosure work should align to the Passport standard.

## What Passport said about identity

- **Midnight DID:** Passport ships a native **Midnight DID**.
- **Credentialing:** issue **verified credentials on-chain**, attest and get verified
  **without disclosing raw information** via zero-knowledge **selective disclosure**
  (examples: prove "accredited investor," prove "over 18"). Principle: **prove the minimum
  without revealing everything.** Credential is **stored securely on the device**.
- **Alias + names:** an **alias** hides the desk / unshielded / shielded addresses (and
  managed ETH/BTC addresses). Users **claim a name** like `hector.night`, `charles.night`
  instead of raw addresses.
- **No seed phrase:** onboarding via **Face ID / passkeys**; account creation **< 60s**,
  first transaction **< 2 min**.
- **Recovery:** device loss = **revoke and continue**; social recovery, secure cloud
  backup, **total-loss recovery without a seed phrase**.
- **Four personas:** Individual, Managed Persona, Enterprise, Agent.
- **Security:** CIA triad; phone biometrics + trusted execution hardware as building
  blocks; user in the driver's seat.

## Mapping to DIDz.io

| Passport concept | DIDz.io equivalent | Note |
|---|---|---|
| Midnight DID | DIDz DID surface (one-DIDz-per-item) | Align DIDz DIDs to the Passport/Midnight DID |
| Credentialing + selective disclosure | DIDz **binary ZKQuery** (yes/no, never raw) | Same "prove the minimum" principle |
| Credential stored on device | DIDz device-held credentials | Confirms our custody model |
| Alias hides addresses / claim a `.night` name | DIDz naming + C2 name service | Adopt the alias/name-claim UX |
| Passkeys, no seed, < 60s onboarding | DIDz QR + biometric onboarding | Align onboarding targets |
| Total-loss recovery (social/cloud) | John's m-of-n soulbound recovery vision | DIDz identities become recoverable the Passport way |
| Enterprise persona (roles, spend approvals) | DIDz org identities | Serve the enterprise persona |
| Biometrics + TEE building blocks | DIDz biometric binding (face + fingerprint + pulse/ox) | Same hardware trust roots |

## Concrete action items for DIDz.io

1. **Adopt the alias + `.night` name-claim UX** so a DIDz identity presents a human-readable
   name over its addresses.
2. **Align credential issuance/selective disclosure** to Passport's on-chain credential
   model (targets MIP-6 / C20) so a DIDz credential is a first-class Passport credential.
3. **Ride on Passport accounts:** hold the DIDz identity in the Passport account-custody
   contract (C1) with wrapped local storage (C16).
4. **Make DIDz identities recoverable** via the m-of-n soulbound recovery path (never
   locked out).
5. **Serve all four personas** (individual, managed, enterprise, agent), enterprise via
   DIDz org identities, agent via AgenticDID.

## Contacts

- Karmel ("Carmel"), Passport **product lead**, GitHub `Karmoola`.
- Hector Bulgarini, technical demo, GitHub `hbulgarini`, X `@hectorest06`.

_Last updated: 2026-07-04._
