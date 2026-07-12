# PrivateEye + ZKsplunk OPSEC Integration

> **Canonical spec:** [`PrivateEye/docs/PRIVATEEYE_ZKSPLUNK_OPSEC.md`](../PrivateEye/docs/PRIVATEEYE_ZKSPLUNK_OPSEC.md)

## DIDz's Role

DIDz establishes who the subject or requester is and which verified attributes
may be proven. PrivateEye ensures only the minimum identity information is
disclosed — e.g., "over 21" without revealing a birth date.

**DIDz answers:** "Who is involved, or what identity claim can be proven?"  
**PrivateEye answers:** "Which part of that identity may safely be disclosed?"  
**ZKsplunk answers:** "Does the pattern of identity activity indicate misuse?"

### What ZKsplunk Observes from DIDz

- Credential replay
- Repeated failed presentations
- Impossible or suspicious identity transitions
- Unusual verifier behavior
- Correlation attempts across pseudonymous identities
- Mass credential probing
- Revocation-status abuse
- Requests for unnecessary identity attributes

### Scoped Unlinkability

The hardest inference-defense problem is cross-pseudonym budget abuse: a
requester creates multiple DIDz identities to reset their per-identity privacy
budget. Solving this by globally linking pseudonyms would undermine DIDz's
privacy guarantees.

A proposed direction is **scoped unlinkability**: within a specific protected
query domain, a user proves in zero knowledge that they have not already
consumed their query allowance — without revealing their global identity. This
may involve nullifiers or context-specific pseudonyms aligned with Midnight's
commitment/nullifier patterns.

This is an active research area. The MVP scopes privacy budgets to a single
identity within a single query domain.
