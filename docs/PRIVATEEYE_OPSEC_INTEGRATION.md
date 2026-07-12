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
