# Oracle Pattern & API Integration Guide — DIDz.io

> How external data gets into Midnight smart contracts, and which free APIs are relevant to DIDz.io (the root identity platform for the DIDz ecosystem).

---

## Why Smart Contracts Can't Call APIs Directly

Midnight smart contracts (Compact) run inside **zero-knowledge proof circuits**. Every node must get the exact same result. External API calls are non-deterministic, which breaks proofs. Instead, we use the **oracle pattern**: a trusted off-chain service feeds data into the chain.

```
┌──────────────┐      ┌──────────────────┐      ┌─────────────────────┐
│ External API │ ───> │  Oracle Service   │ ───> │  Midnight Contract  │
│ (Identity)   │      │  (Your Backend)   │      │  (Compact / ZK)     │
└──────────────┘      └──────────────────┘      └─────────────────────┘
                        Signs attestation         Verifies signature
                        Creates DID binding       Stores credential
                        Strips all PII            Never sees raw data
```

| Layer | Can call APIs? |
|-------|---------------|
| **Frontend / Express server** | ✅ Yes |
| **Midnight contract (Compact)** | ❌ No — oracle pattern required |

---

## Recommended Free APIs for DIDz.io

### Identity & Verification

| API | Description | Auth | URL |
|-----|-------------|------|-----|
| **HaveIBeenPwned** | Credential breach detection | apiKey | https://haveibeenpwned.com/API/v3 |
| **EmailRep** | Email address threat & reputation scoring | None | https://emailrep.io |
| **FingerprintJS Pro** | Browser fingerprinting / fraud detection | apiKey | https://dev.fingerprintjs.com |
| **LoginRadius** | Managed authentication service | apiKey | https://www.loginradius.com |
| **Numverify** | Phone number validation & carrier lookup | apiKey | https://numverify.com |
| **Mailboxlayer** | Email validation (disposable email detection) | apiKey | https://mailboxlayer.com |
| **Stytch** | Passwordless authentication platform | apiKey | https://stytch.com |
| **Warrant** | Authorization & access control APIs | apiKey | https://warrant.dev |

### Blockchain & Cross-Chain

| API | Description | Auth | URL |
|-----|-------------|------|-----|
| **Etherscan** | Ethereum explorer — ENS resolution, wallet data | apiKey | https://etherscan.io/apis |
| **Covalent** | Multi-chain data aggregator | apiKey | https://www.covalenthq.com |
| **The Graph** | Blockchain indexing via GraphQL | apiKey | https://thegraph.com |
| **Chainlink** | Hybrid smart contract infrastructure | None | https://chain.link/developer-resources |

### Geolocation (for jurisdiction-aware credentials)

| API | Description | Auth | URL |
|-----|-------------|------|-----|
| **ip-api** | IP → country/region/city | None | http://ip-api.com |
| **CountryStateCity** | World jurisdictions dataset | apiKey | https://countrystatecity.in |

---

## DIDz.io-Specific Oracle Use Cases

### 1. DID Credential Issuance
```
[Identity verification APIs] → [Oracle: "identity verified"] → [Contract: issues Verifiable Credential]
                                                                  The VC says: "this DID belongs to a verified human"
                                                                  Reveals: nothing about who they are
```

### 2. Cross-Chain DID Resolution
```
[Etherscan ENS + Cardano Identus] → [Oracle: "same owner"] → [Contract: "DIDs linked"]
                                                                 Proves: did:prism:X and did:ethr:Y are same person
                                                                 Reveals: nothing about the person
```

### 3. Credential Revocation Check
```
[Issuer's revocation list] → [Oracle: "credential still valid"] → [Contract: "VC active"]
                                                                     Proves: credential hasn't been revoked
                                                                     Reveals: nothing about why or by whom
```

### 4. Trust Score Computation
```
[Multiple ecosystem signals] → [Oracle: "trust score = 98"] → [Contract: "high trust"]
                                                                  Proves: composite reputation level
                                                                  Reveals: nothing about individual signals
```

---

## DIDz.io as the Identity Hub

DIDz.io sits at the center of the ecosystem. Other repos depend on it:

| Repo | What it gets from DIDz.io |
|------|---------------------------|
| **KYCz** | Issues KYC credentials back to the user's DID |
| **GeoZ** | Attaches location proofs to the user's DID |
| **safeHealthData** | Links health attestations to the user's DID |
| **ProMingle** | Professional credentials anchored to DID |
| **EncryptVault** | Wallet ownership proofs tied to DID |
| **AutoDiscovery.legal** | Case participant identity via DID |
| **SouLink** | Privacy-preserving dating profile anchored to DID |
| **PopCork** | Event attendance SBTs linked to DID |
| **HuddleBridge** | Speaker/host verification via DID |
| **DownMan** | Publisher verification via DID |

---

## demoLand vs realDeal

| Mode | How APIs are used |
|------|-------------------|
| **demoLand** | Mock DIDs, simulated credentials, fake trust scores. No real API calls. |
| **realDeal** | Oracle calls verification APIs, creates signed attestations, issues real Verifiable Credentials on Midnight via Identus/Prism. |

---

## Reference

- Public APIs catalog: https://github.com/public-apis/public-apis
- Midnight docs: https://docs.midnight.network
- W3C DID spec: https://www.w3.org/TR/did-core/
- W3C Verifiable Credentials: https://www.w3.org/TR/vc-data-model/
