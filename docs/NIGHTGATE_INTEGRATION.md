# NIGHTGATE Integration Boundary

**Status:** `PLANNED`

NIGHTGATE and NIGHTGATE-MCP are pinned in DIDzMonolith so the integration can
be evaluated against exact revisions. Their presence in the monolith does not
mean that a DIDz end-to-end integration, deployment, security review, or
production configuration has been verified.

## Role in DIDzM

| Component | Planned role | Explicitly not |
|---|---|---|
| `DIDzRegistry` and DIDz services | Root identity, trusted issuer, credential lifecycle, key rotation, and recovery authority | A transport proxy |
| NIGHTGATE | CAP/OData service edge for selected Midnight reads, writes, attestations, disclosures, and ZK predicate requests | A fifth engine, identity authority, issuer authority, wallet, or policy engine |
| NIGHTGATE-MCP | Stdio Ai tool bridge that invokes a curated NIGHTGATE surface | An authentication system, AgenticDID authority provider, wallet lifecycle manager, or proof of DID control |
| `@didz/adapter-nightgate` | Planned kernel adapter that maps approved operations to NIGHTGATE through existing provider seams | A new kernel seam or source of protocol semantics |

The four engines remain DIDz, AgenticDID, RWAz, and HelixCTW. NIGHTGATE may
transport an operation and its evidence, but the applicable engine remains the
authority of record.

## Planned request flow

1. DIDz resolves the caller and applicable lifecycle state.
2. AgenticDID or another recognized authority source supplies any required
   scoped authorization.
3. The kernel decides whether the requested operation is eligible to proceed.
4. `@didz/adapter-nightgate` translates the approved operation to the pinned
   NIGHTGATE contract and OData surface.
5. DIDz verifies returned identifiers, status, and evidence before presenting
   the result as a DIDz outcome.

An `ngat_` bearer grant is a NIGHTGATE transport and budget credential. It does
not prove a principal controls a DIDz, does not create AgenticDID delegation or
attenuation lineage, and does not replace DIDzM revocation or exact-action
checks.

## Privacy and security requirements

- Use a trusted local connection during development and authenticated HTTPS in
  any remote environment. Plain HTTP Basic authentication is not an acceptable
  production boundary.
- Isolate wallet signing from the service edge and minimize the authority of
  every signing session.
- Enforce row-level authorization before any OData projection or disclosure.
- Never place wallet seeds, private keys, bearer tokens, private documents,
  private claims, or ZK witnesses in this repository, examples, fixtures,
  screenshots, logs, telemetry, or MCP prompts.
- Keep sensitive values holder-side whenever possible. If a future operation
  requires a private runtime input, it needs an explicit threat model, an
  approved ephemeral channel, redacted observability, and a documented
  retention policy before implementation.
- Treat contract keys, public arguments, disclosed fields, and transaction
  metadata as public ledger inputs unless the verified contract and proof path
  establish otherwise.

## Acceptance gates

The adapter remains `PLANNED` until all of the following are evidenced:

1. A versioned mapping exists between kernel operations and the pinned
   NIGHTGATE OData contract.
2. The adapter passes applicable kernel conformance tests without changing
   DIDz, AgenticDID, RWAz, or HelixCTW authority boundaries.
3. A current end-to-end test exercises the real DIDz contracts and verifies
   lifecycle, issuer, authorization, failure, and revocation behavior.
4. Transport authentication, row-level authorization, isolated signing,
   retry and idempotency behavior, and audit redaction are tested.
5. Evidence labels remain honest: cloning, compiling, or receiving a healthy
   service response is not proof of production security or DIDz correctness.
