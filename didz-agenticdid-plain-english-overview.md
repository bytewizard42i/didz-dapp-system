# DIDZ and AgenticDID Explained in Plain English

## The Simple Idea

DIDZ is a way to give a permanent digital identity to anything that needs to be recognized.

That could be:

```text
a person
an AI agent
a company
a government
a government office
a car
a house
a painting
a robot
a real-world asset
```

AgenticDID is the part of DIDZ made especially for AI agents.

Think of DIDZ as the master identity system.

Think of AgenticDID as the identity and permission system for AI agents.

## The Best Analogy

DIDZ is like a giant record office for the world.

It gives every important thing an official record.

But that record does not automatically mean the thing can do everything.

A person may have a birth certificate, but that does not mean they can drive.

A car may have a VIN number, but that does not say who owns it today.

A company may exist, but that does not mean it is licensed to issue official IDs.

An AI agent may have an identity, but that does not mean it can spend money.

So DIDZ separates identity from permission.

## Identity vs Permission

The identity says:

```text
This thing exists or existed.
```

The permission says:

```text
This thing is allowed to do something right now.
```

That is the heart of the system.

## Human Example

A human gets a HumanDIDZ.

That HumanDIDZ is like a permanent birth certificate.

It says:

```text
This human exists or existed.
```

But the HumanDIDZ alone should not let the person vote, receive benefits, sign legal documents, or perform sensitive actions.

For those things, the person needs current credentials.

Examples:

```text
proof of life
citizenship
residency
voting eligibility
age proof
legal authority
```

## What Happens When a Human Dies?

The HumanDIDZ does not vanish.

The identity stays in the record.

But the person's living powers stop.

That means:

```text
they cannot vote
they cannot create new legal authority
they cannot receive living-person benefits
they cannot sign new agreements
```

The system marks the person as deceased and disables living-person credentials.

Analogy:

A birth certificate does not disappear when someone dies.

But the person cannot vote after death.

## Proof of Life Before Voting

For DIDZ voting, proof of life should be required.

The voting system should not merely ask:

```text
Does this DIDZ exist?
```

It should ask:

```text
Is this DIDZ a human?
Is this human alive?
Is there recent proof of life?
Is this human eligible to vote?
Is this human in the correct jurisdiction?
Is this vote for the correct election?
Has this human already voted in this election?
```

That means voting requires several checks.

## Voting Analogy

Imagine voting is like entering a secure building.

The DIDZ is your identity record.

The proof of life is someone confirming you are actually alive now.

The voting eligibility credential is your voter registration.

The election-specific voting grant is a one-time ticket.

Once you use the ticket, it cannot be used again.

So the vote system checks:

```text
You are real.
You are alive.
You are eligible.
You are in the right place.
You have not already used your voting ticket.
```

## AgenticDID Example

Now imagine an AI shopping agent.

Amazon, Google, a bank, a DMV, or another trusted organization may issue official IDs to agents.

That ID says:

```text
This is an official agent.
This agent was issued by this trusted organization.
```

But the agent still cannot do anything just because it has an ID.

It needs a permission.

## Two Machines

AgenticDID can be explained with two machines.

## Machine 1: The ID Card Machine

Machine 1 creates official IDs.

Example:

```text
Amazon creates an official Amazon shopping agent.
The DMV creates an official DMV scheduling agent.
A bank creates an official banking assistant agent.
```

This is like giving the agent a passport or ID card.

The ID should remain as a historical record.

## Machine 2: The Keycard and Debit Card Machine

Machine 2 gives the agent permission to act.

This is like giving the agent:

```text
a keycard for access
a debit card for spending
a timer for expiration
a rulebook for limits
```

Example:

```text
You may buy groceries.
You may spend up to $50.
This permission expires in two hours.
You may only buy from trusted grocery merchants.
```

That is much safer than giving an agent unlimited power.

## Dynamic Intent

Dynamic intent means the user's instruction shapes the agent's permission.

If you tell your local agent:

```text
Buy groceries for dinner, but spend no more than $50.
```

The agent receives a limited permission:

```text
buy groceries only
spend $50 or less
expire soon
use only with approved merchants
```

The agent cannot use that permission to buy a TV.

It cannot spend $500.

It cannot use the permission next week.

The user's intent becomes the agent's fence.

## The Other Agent in the Transaction

AgenticDID also helps the agent on the other side.

For example, the grocery store may have its own trusted checkout agent.

Your agent shows proof:

```text
I am authorized to buy groceries.
The amount is within the limit.
The permission has not expired.
The permission has not been revoked.
```

The store's agent can verify the proof without needing to know everything about you.

This creates trust between agents without exposing unnecessary private information.

## Delegation

Sometimes one agent may need help from another agent.

A main shopping agent may give a helper agent a smaller permission.

Example:

```text
Main agent can spend $50 on groceries.
Helper agent can spend $20 on produce.
```

The helper cannot spend $50.

The helper cannot buy electronics.

The helper cannot act after the permission expires.

Every child permission must be smaller than the parent permission.

## Revocation

If an agent breaks the rules, the system does not need to erase its identity.

Instead, the system removes its permissions.

Analogy:

A person does not stop existing when their driver's license is suspended.

The person still exists.

The driving permission is gone.

For agents:

```text
the agent identity remains
the agent's permissions are revoked
the agent's trusted status can be suspended
the agent's behavior history remains visible
```

This protects accountability.

## Fraud

Most DIDZ identities should not be deleted.

But if an identity was fake from the beginning, the system may need to mark it as fraudulent or burned.

Example:

```text
an issuer created a fake identity
someone used stolen keys to create an identity
a duplicate identity was created by mistake
a bug created an invalid identity
```

In those cases, the system may issue a corrected DIDZ.

But it should not automatically move every permission to the new DIDZ.

Assets may move after verification.

Dangerous permissions should not automatically move.

## Real-World Assets

DIDZ can also identify objects and real-world assets.

Example: a car.

The car has a DIDZ, like a VIN.

The ownership credential says who owns it.

If the car is sold, the car's DIDZ stays the same.

Only the ownership credential changes.

Example:

```text
CarDIDZ = this specific car
TitleCredential = who owns it today
InsuranceCredential = whether it is insured
InspectionCredential = whether it passed inspection
```

This also works for houses, art, machines, land, gold, and other real-world assets.

## Trusted Issuers

A trusted issuer is an entity that is allowed to issue official credentials.

Examples:

```text
DMV
Social Security office
county election office
land registry
hospital
bank
Amazon
Google
university
```

But each trusted issuer should only be allowed to issue certain things.

Example:

```text
DMV can issue driver and vehicle credentials.
Election office can issue voting credentials.
Land registry can issue property title credentials.
Amazon can issue Amazon agent identities.
```

This prevents one issuer from controlling everything.

## Constitution

DIDZ and AgenticDID can have a constitution.

The constitution is the rulebook.

It can say:

```text
Agents cannot exceed their permissions.
Issuers must follow issuance rules.
Votes require proof of life.
Objects must separate identity from ownership.
Agents cannot impersonate other agents.
Permissions can be revoked when rules are broken.
```

If the constitution is broken, the protocol can remove authority without deleting the historical identity.

## Why This Matters

AI agents are going to do more than chat.

They will shop, schedule, negotiate, manage accounts, interact with businesses, and eventually transact with other agents.

To make that safe, the world needs to know:

```text
Who is this agent?
Who issued it?
What is it allowed to do?
How much can it spend?
Can it prove permission?
Can permission be revoked?
Can it act without exposing private data?
```

AgenticDID answers those questions for agents.

DIDZ answers those questions for the larger world of people, organizations, governments, objects, and assets.

## Final Plain-English Summary

DIDZ is a permanent identity system.

Credentials say what is true about that identity.

Grants say what that identity is allowed to do.

Statuses say whether the identity is active, deceased, suspended, dissolved, destroyed, or retired.

AgenticDID is the agent branch of DIDZ.

Proof of life should be required before voting.

Agents should only receive limited permissions based on the user's intent.

Permissions can expire or be revoked.

Identities remain as permanent records.

In the simplest terms:

```text
DIDZ is the ID.
Credentials are the facts.
Grants are the permissions.
Status is the current condition.
The constitution is the rulebook.
```

And the most important rule is:

```text
Do not confuse identity with authority.
```
