# DIDZ and AgenticDID Full Architecture

## Purpose

DIDZ is a proposed universal identity layer for humans, AI agents, organizations, governments, government agencies, objects, and real-world assets.

AgenticDID is a specialized branch of DIDZ focused on autonomous agents.

The purpose of DIDZ is to answer:

```text
What entity exists or existed?
What type of entity is it?
Who issued or recognized it?
What credentials are attached to it?
What permissions does it currently have?
What lifecycle status does it currently hold?
```

The purpose of AgenticDID is to answer:

```text
Which autonomous agent is this?
Who issued it?
Who controls it?
What is it allowed to do?
Has it obeyed the constitution?
Can its authority be revoked?
Can it safely delegate limited authority to other agents?
```

## Core Principle

DIDZ should follow this principle:

```text
Permanent identity.
Temporary eligibility.
Revocable authority.
Auditable history.
Scoped trust.
```

This means:

```text
A DIDZ identity record should remain permanent.
Credentials attached to that DIDZ may expire.
Permissions attached to that DIDZ may be revoked.
Trust status may change.
The historical record should remain auditable.
```

## Identity Is Not Authority

A major design rule of DIDZ is that identity and authority must be separated.

A DIDZ proves that an entity exists or existed.

A credential proves a claim about that entity.

A grant gives that entity limited permission to act.

A lifecycle status tells the network whether the entity is active, deceased, dissolved, destroyed, suspended, retired, or otherwise restricted.

For example:

```text
HumanDIDZ = this human exists or existed
ProofOfLifeCredential = this human is currently alive
VotingEligibilityCredential = this human may vote in this jurisdiction/election
VotingGrant = this human may cast one vote in this specific election
DeathCredential = this human has been verified as deceased
```

The existence of a DIDZ alone should not authorize sensitive actions.

## Universal DIDZ Layer

The DIDZ root layer should be able to identify multiple types of entities.

Examples:

```text
HumanDIDZ
AgenticDID
OrganizationDIDZ
GovernmentDIDZ
GovernmentAgencyDIDZ
ObjectDIDZ
RWADIDZ
TrustedIssuerDIDZ
```

Each type of entity has different lifecycle rules.

A human may die.

An agent may be suspended or retired.

An organization may dissolve or merge.

A government agency may be created, renamed, merged, or abolished.

An object may be destroyed, sold, lost, seized, repaired, or retired.

A real-world asset may transfer ownership.

A trusted issuer may lose issuing authority.

The DIDZ should remain as the permanent identity record, while status, credentials, and authority change over time.

## DIDZ Root Architecture

A clean DIDZ architecture may look like this:

```text
DIDZ Root Protocol
│
├── Entity Registry
│   ├── HumanDIDZ
│   ├── AgenticDID
│   ├── OrganizationDIDZ
│   ├── GovernmentDIDZ
│   ├── GovernmentAgencyDIDZ
│   ├── ObjectDIDZ
│   └── RWADIDZ
│
├── Issuer Registry
│   ├── TrustedIssuerCredential
│   ├── IssuerScope
│   ├── IssuerJurisdiction
│   ├── IssuerStatus
│   └── IssuerRevocation
│
├── Credential Registry
│   ├── ProofOfLifeCredential
│   ├── DeathCredential
│   ├── VotingEligibilityCredential
│   ├── CitizenshipCredential
│   ├── ResidencyCredential
│   ├── OwnershipCredential
│   ├── AgentCredential
│   ├── ComplianceCredential
│   └── IssuerCredential
│
├── Permission / Grant Registry
│   ├── ScopedGrant
│   ├── AccessGrant
│   ├── SpendingGrant
│   ├── DelegationGrant
│   ├── OneTimeUseGrant
│   └── CounterpartyBoundGrant
│
└── Status Registry
    ├── active
    ├── inactive
    ├── deceased
    ├── dissolved
    ├── destroyed
    ├── suspended
    ├── retired
    ├── revoked_authority
    ├── fraudulent
    ├── burned
    ├── superseded
    └── archived
```

## Entity Registry

The Entity Registry records that an entity exists or existed.

It may include:

```text
didz_id
entity_type
issuer
created_at
public_keys
controller
metadata_hash
lifecycle_status
status_updated_at
```

The Entity Registry should not be treated as proof of all current rights.

It is the root identity record.

## HumanDIDZ

A HumanDIDZ represents a human identity.

A human DIDZ should be permanent as a historical identity record.

However, a human DIDZ should not automatically prove that the person is alive, eligible to vote, eligible for benefits, or authorized to sign new legal agreements.

Those abilities should require current credentials.

### HumanDIDZ Credentials

Possible human credentials include:

```text
ProofOfLifeCredential
DeathCredential
CitizenshipCredential
ResidencyCredential
VotingEligibilityCredential
AgeCredential
BenefitEligibilityCredential
LegalNameCredential
GuardianshipCredential
PowerOfAttorneyCredential
```

### Human Death Handling

When a human dies, the DIDZ does not disappear.

Instead:

```text
ProofOfLifeCredential expires or is revoked.
DeathCredential is issued by an authorized issuer.
Lifecycle status becomes deceased.
VotingEligibilityCredential becomes null.
Living-person grants become invalid.
New living-person authorizations are blocked.
Estate and inheritance processes may activate.
```

This is like a birth certificate or Social Security record.

The person does not vanish from history.

But the person can no longer vote, sign new agreements, or create new living-person authority.

## Proof of Life Before Voting

A DIDZ-based voting system should require proof of life before allowing a vote to be cast.

The system should not ask only:

```text
Does this HumanDIDZ exist?
```

It should ask:

```text
Does this HumanDIDZ belong to a human?
Is the DIDZ lifecycle status active, not deceased?
Does the human have a valid ProofOfLifeCredential?
Was the proof of life issued by an authorized issuer?
Is the ProofOfLifeCredential still within its validity period?
Does the human have a valid VotingEligibilityCredential?
Does the VotingEligibilityCredential apply to this jurisdiction?
Does the VotingEligibilityCredential apply to this election?
Has the voting grant already been used?
Has any relevant credential been revoked, expired, or nullified?
```

### Voting Credential Stack

A secure DIDZ voting model may require the following credential stack:

```text
HumanDIDZ
    ↓
ProofOfLifeCredential
    ↓
CitizenshipCredential or ResidencyCredential
    ↓
JurisdictionCredential
    ↓
VotingEligibilityCredential
    ↓
ElectionSpecificVotingGrant
    ↓
OneTimeVoteCastReceipt
```

### HumanDIDZ

The HumanDIDZ identifies the person.

It does not by itself prove current voting eligibility.

### ProofOfLifeCredential

The ProofOfLifeCredential proves that the person was recently verified as alive.

This credential should expire after a defined period.

The expiration period may depend on the jurisdiction or use case.

For voting, the proof-of-life window should be short enough to reduce the risk of deceased identities being used, while still being practical for real citizens.

### Citizenship or Residency Credential

This proves that the person is connected to the jurisdiction.

For example:

```text
citizen of country
resident of state
resident of county
resident of city
```

### Jurisdiction Credential

This credential binds the voter to a specific voting jurisdiction.

It prevents the same human identity from being used in the wrong election area.

### VotingEligibilityCredential

This credential proves the human is eligible to vote in a specific jurisdiction under the rules of that jurisdiction.

### ElectionSpecificVotingGrant

The voting grant should be specific to one election.

Example:

```text
scope: vote:election:2028-general:pennsylvania
max_uses: 1
expiry: election_deadline
holder: HumanDIDZ
status: unused
```

After the vote is cast:

```text
status: consumed
```

This prevents reuse.

### OneTimeVoteCastReceipt

The vote-cast receipt proves that the voting grant was consumed.

Depending on the voting design, the receipt may prove participation without revealing the voter's selection.

## Privacy-Preserving Voting

DIDZ voting should separate voter eligibility from vote choice.

The system may verify:

```text
This voter is alive.
This voter is eligible.
This voter has not already voted in this election.
```

Without publicly revealing:

```text
the voter's full identity
the voter's private data
the voter's vote choice
unrelated credentials
```

A privacy-preserving proof may allow a voter to prove eligibility and one-time use without exposing unnecessary personal information.

## OrganizationDIDZ

An OrganizationDIDZ represents a company, nonprofit, institution, DAO, or other organization.

The OrganizationDIDZ should remain permanent as a historical identity record.

However, operational status can change.

Possible statuses include:

```text
active
suspended
dissolved
merged
acquired
bankrupt
revoked_authority
archived
```

An organization may hold credentials such as:

```text
IncorporationCredential
TaxCredential
AccreditationCredential
IssuerCredential
ComplianceCredential
AgentIssuanceCredential
```

If an organization dissolves, the OrganizationDIDZ remains, but its authority to issue new credentials or agents may be removed.

## GovernmentDIDZ and GovernmentAgencyDIDZ

Governments and government agencies can be represented by DIDZ identities.

Examples:

```text
United States
Commonwealth of Pennsylvania
City of Easton
Department of Motor Vehicles
Social Security office
Department of Health
County election office
Court system
Land registry
Tax authority
```

Government and agency DIDZ identities may become trusted issuers.

But their issuer authority should be scoped.

For example:

```text
DMV may issue driver and vehicle credentials.
Social Security office may issue social identity and death-status credentials.
Election office may issue voting eligibility credentials.
Land registry may issue property title credentials.
Court system may issue legal-status credentials.
```

This prevents one issuer from having unlimited authority over every type of identity or credential.

## Trusted Issuers

A trusted issuer is an entity with permission to issue certain credentials.

A trusted issuer is not merely an identity.

It is an identity plus an issuer credential.

For example:

```text
DMV = GovernmentAgencyDIDZ
DMV as trusted issuer = GovernmentAgencyDIDZ + TrustedIssuerCredential
```

```text
Amazon = OrganizationDIDZ
Amazon as trusted issuer = OrganizationDIDZ + TrustedIssuerCredential
```

```text
Social Security office = GovernmentAgencyDIDZ
Social Security office as trusted issuer = GovernmentAgencyDIDZ + TrustedIssuerCredential
```

Issuer authority should include:

```text
issuer_didz
allowed_credential_types
allowed_entity_types
jurisdiction
expiry
revocation_status
governance_authority
```

The issuer's DIDZ may remain permanent even if its issuer authority is revoked.

Analogy:

A university can still exist, but lose accreditation.

A hospital can still exist, but lose a license.

A company can still exist, but lose permission to issue official agents.

## ObjectDIDZ and RWADIDZ

ObjectDIDZ and RWADIDZ represent objects and real-world assets.

Examples:

```text
car
house
land parcel
diamond
painting
machine
server
robot
medical device
shipping container
gold bar
tokenized treasury
```

The object's DIDZ should represent the object itself.

Ownership should be a separate credential.

For example:

```text
CarDIDZ = this specific car exists
TitleCredential = current owner
InsuranceCredential = insurance status
InspectionCredential = inspection status
LienCredential = lender claim
```

If the car is sold, the CarDIDZ remains the same.

The ownership credential changes.

Analogy:

The VIN stays with the car.

The title changes when the car is sold.

## AgenticDID

AgenticDID is a specialized branch under DIDZ for autonomous agents.

An AgenticDID may include:

```text
agent identity
agent issuer
agent controller
agent public keys
agent purpose
agent model or runtime reference
agent constitutional compliance status
agent credentials
agent grants
delegation records
behavioral history
revocation status
```

AgenticDID should separate the agent's permanent identity from its temporary permissions.

An agent can have a permanent identity while losing permission to operate.

## Machine 1 and Machine 2

AgenticDID can be explained using two machines.

### Machine 1: Agent ID Machine

Machine 1 creates official agent identities.

Analogy:

```text
A passport office issues a passport.
```

In AgenticDID:

```text
A trusted principal issues an official identity to one of its agents.
```

Examples:

```text
Amazon issues an ID to an Amazon shopping agent.
Google issues an ID to a Google scheduling agent.
DMV issues an ID to a DMV service agent.
A bank issues an ID to a banking assistant agent.
```

The agent ID is permanent as a historical identity record.

### Machine 2: Permission Machine

Machine 2 creates revocable, temporary, limited permissions.

Analogy:

```text
A building security desk issues a keycard.
A company issues a debit card with a spending limit.
A manager issues a temporary work permit.
```

In AgenticDID:

```text
A scoped grant contract issues limited authority.
```

The grant may define:

```text
scope
max_amount
expiry
holder
issuer
parent grant
root grant
delegation rules
revocation status
```

Machine 2 is the scoped grant system.

It controls what an already-identified agent may do.

## Scoped Grants

A scoped grant is a permission slip.

It may say:

```text
This agent may do X.
This agent may spend or move up to Y.
This permission expires at Z.
This permission may or may not be delegated.
This permission can be revoked.
```

Example:

```text
scope: purchase:groceries
max_amount: 50
expiry: 2 hours
holder: local_shopping_agent
```

The agent can buy groceries up to $50 within the time window.

The agent cannot buy electronics.

The agent cannot spend $75.

The agent cannot use the grant after it expires.

## Dynamic Intent-Scoped Permissions

Dynamic intent-scoped authorization means the user's instruction shapes the permission itself.

A user may tell a local agent:

```text
Buy groceries for dinner, but spend no more than $50.
```

The local agent receives or creates a narrow scoped grant:

```text
scope: purchase:groceries
max_amount: 50
expiry: 2 hours
```

The agent is not given broad authority.

The agent is given enough authority to satisfy the user's intent and nothing more.

### Flow

```text
1. User expresses intent.
2. Local agent interprets the intent.
3. Local agent requests or creates a scoped grant.
4. Scoped grant limits the agent's authority.
5. Agent presents proof of authorization to a counterparty.
6. Counterparty verifies the scope, amount, expiry, and status.
7. Transaction is approved or rejected.
```

## Counterparty-Aware Permissions

A scoped grant may also restrict which counterparty the agent can interact with.

Example:

```text
scope: purchase:groceries
max_amount: 50
expiry: 2 hours
allowed_counterparty: trusted_grocery_merchant_agent
```

This prevents the agent from using grocery-buying authority with an unintended or untrusted counterparty.

## Trusted Issuer Agent on the Other Side

AgenticDID should support transactions between trusted agents.

Example:

```text
User's local agent wants to buy groceries.
Merchant's checkout agent is issued by a trusted merchant.
```

The local agent presents proof:

```text
I am an official agent.
I am authorized to buy groceries.
The amount is within my limit.
The permission is not expired.
The permission has not been revoked.
```

The merchant-side agent verifies the proof and accepts or rejects the transaction.

The merchant does not need to know everything about the user.

It only needs to know that the local agent is authorized for this specific transaction.

## Delegation and Attenuation

Agents may delegate authority to sub-agents.

However, delegated authority must be narrower than the parent authority.

This is called attenuation.

Example parent grant:

```text
scope: purchase:groceries
max_amount: 50
expiry: 1000
```

Example child grant:

```text
scope: purchase:groceries:produce
max_amount: 20
expiry: 900
```

The child grant is weaker.

It has:

```text
narrower scope
lower amount limit
earlier or equal expiry
dependence on the parent grant
```

If the parent grant is revoked, the child grant becomes invalid.

## Revocation

DIDZ should avoid deleting identities in normal cases.

Instead, it should revoke or suspend credentials, grants, trust status, or authority.

For example, if an agent violates the constitution:

```text
AgenticDID remains as historical identity.
Constitution compliance status changes.
Trusted issuer credential may be revoked.
Active grants are revoked.
Delegated child grants become invalid.
Behavior history remains attached.
```

This preserves accountability.

Analogy:

A person does not stop existing when their driver's license is suspended.

The identity remains.

The authority is removed.

## DID Burning and Fraud

DIDZ identities should generally not be burned.

Normal misconduct should not erase the identity record.

However, in rare cases, a DIDZ may need to be marked fraudulent, invalid, or burned.

Examples:

```text
identity was created through issuer fraud
identity was created with stolen issuer keys
identity was duplicated improperly
identity was minted due to a registry bug
identity was proven invalid from origin
```

In these cases, the protocol may mark the DIDZ as:

```text
fraudulent
burned
void
superseded_due_to_fraud
```

A replacement DIDZ may be issued through governance or verified recovery.

However, automatic migration must be handled carefully.

## Asset and Authority Migration

If a DIDZ is replaced due to fraud, compromise, or recovery, the system should distinguish between assets and authority.

### May Transfer After Verification

```text
owned assets
historical records
audit history
reputation history
approved credentials
metadata references
```

### Should Not Automatically Transfer

```text
active grants
spending permissions
delegated authority
high-risk access credentials
counterparty permissions
constitutional trust status
```

Analogy:

If a bank replaces a stolen card, the money may remain yours, but the old card number, PIN, and suspicious pending authorizations should not automatically transfer.

## Constitution

DIDZ and AgenticDID may include a protocol constitution.

The constitution defines rules for:

```text
identity issuance
trusted issuer behavior
agent behavior
delegation
credential issuance
revocation
fraud handling
proof of life
voting eligibility
asset representation
privacy
appeals
governance
```

For AgenticDID, constitutional violations may include:

```text
exceeding grant authority
impersonating another agent
bypassing revocation
misusing private data
delegating beyond allowed limits
interacting with unauthorized counterparties
hiding material behavior history
```

When violations occur, the system can revoke credentials, grants, or trusted status without deleting the permanent identity record.

## Privacy and Zero-Knowledge Proofs

DIDZ should support privacy-preserving proofs where appropriate.

An agent, human, or entity may need to prove:

```text
I am authorized.
I am eligible.
I am alive.
I am within a limit.
I have not already used this grant.
My credential has not expired.
My credential has not been revoked.
```

Without revealing unnecessary private data.

For example, in voting, a voter may prove eligibility and one-time use without revealing the vote choice publicly.

For agent transactions, an agent may prove spending authority without exposing the user's full identity.

## Practical Rule Set

The following rules summarize the DIDZ architecture:

```text
1. A DIDZ is a permanent identity record.
2. A DIDZ does not automatically prove current authority.
3. Credentials prove claims about a DIDZ.
4. Grants give limited authority to act.
5. Credentials and grants may expire.
6. Credentials and grants may be revoked.
7. Lifecycle status may change.
8. Humans require proof of life for living-person actions.
9. Voting requires proof of life, eligibility, jurisdiction, election-specific authorization, and one-time use.
10. Objects and RWAs keep the same identity while ownership credentials change.
11. Trusted issuers are entities with scoped issuer credentials.
12. AgenticDID is a specialized branch for autonomous agents.
13. Agents may delegate only narrower authority.
14. Revocation removes authority, not historical identity.
15. Fraud may require burning or superseding a DIDZ under strict governance.
```

## Final Summary

DIDZ is the universal identity layer.

AgenticDID is the agent-specific identity and authority layer.

Scoped grants are the permission layer.

Credentials are the claim layer.

Lifecycle status is the current-state layer.

Proof of life is required for human living-person activities, especially voting.

The DIDZ identity persists, while authority, eligibility, and trust change over time.

The guiding principle is:

```text
Permanent identity.
Temporary eligibility.
Revocable authority.
Auditable history.
Scoped trust.
```
