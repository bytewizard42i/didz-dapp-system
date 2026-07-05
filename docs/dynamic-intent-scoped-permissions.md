# Dynamic Intent-Scoped Permissions in AgenticDID

## Overview

AgenticDID separates an agent's permanent identity from the temporary permissions that allow the agent to act.

In this model, an agent's identity is like an official ID card. It proves that the agent exists, who issued it, and which trusted principal it belongs to. That identity should be durable and historically permanent.

Permissions are different. Permissions are more like keycards, debit cards, work permits, or access badges. They tell the system what the agent is allowed to do, how much it is allowed to do, and how long that authority remains valid.

This document describes how a user's intent can dynamically shape those permissions at runtime.

## Core Idea

When a user gives an instruction to a local agent, the user's intent can be converted into a limited, machine-readable permission.

The user's intent becomes the boundary of what the agent is allowed to do.

For example, a user might say:

> Buy groceries for tonight, but do not spend more than $50.

The local agent can convert this intent into a scoped permission:

```text
scope: purchase:groceries
max_amount: 50
expiry: short-lived
principal: user
agent: local_agent
```

The agent is not given broad authority to spend money anywhere. It receives a narrow permission that matches the user's stated intent.

## Identity vs Permission

AgenticDID should treat identity and permission as separate layers.

### Identity Layer

The identity layer answers:

```text
Who is this agent?
Who issued this agent?
What trusted principal does this agent represent?
What public keys are associated with this agent?
What is the agent's current trust status?
```

This is the agent's permanent ID card.

Examples of trusted principals may include:

```text
Amazon
Google
DMV
Social Security office
Banks
Hospitals
Universities
Government agencies
Enterprise organizations
```

These principals may operate an identity-issuing mechanism that creates official identities for their agents.

### Permission Layer

The permission layer answers:

```text
What is this agent allowed to do right now?
How much authority does it have?
What amount limit applies?
When does the permission expire?
Can the permission be revoked?
Can the permission be delegated?
```

This is the agent's keycard, debit card, or temporary work permit.

The scoped grant contract belongs primarily to this permission layer.

## Machine 1 and Machine 2

AgenticDID can be understood as using two different types of machines.

### Machine 1: Agent ID Machine

Machine 1 creates official agent identities.

Analogy:

> A passport office issues a passport.

In AgenticDID:

> A trusted principal issues an official identity to one of its agents.

The identity may be permanent and non-revocable as a historical record. The system should not need to erase the fact that the agent once existed or was once issued by a principal.

However, the agent's trusted status can still change.

For example:

```text
Agent ID: agentdid:amazon:delivery-agent-4492
Issuer: Amazon
Status: active
```

Later, if the agent violates the rules:

```text
Agent ID: agentdid:amazon:delivery-agent-4492
Issuer: Amazon
Status: suspended
```

The identity still exists, but its trusted operating status has changed.

### Machine 2: Permission Machine

Machine 2 creates temporary, limited, revocable permissions.

Analogy:

> A building security office issues a keycard, or a company issues a debit card with a spending limit.

In AgenticDID:

> A trusted principal, user, protocol, or authorized agent issues a scoped grant.

The scoped grant may include:

```text
scope
max_amount
expiry
issuer
holder
parent grant
root grant
revocation status
```

This machine is dynamic because the permission can be created around a specific intent.

## Dynamic Intent-Scoped Authorization

Dynamic intent-scoped authorization means that the user's instruction shapes the permission itself.

The agent does not simply receive broad authority and then promise to behave. Instead, the authority is narrowed before the agent acts.

The flow is:

```text
1. User expresses intent.
2. Local agent interprets the intent.
3. Local agent requests or creates a scoped grant.
4. Scoped grant limits the agent's authority.
5. The agent presents proof of authorization to a counterparty.
6. The counterparty verifies that the action fits inside the grant.
7. The transaction is approved or rejected.
```

## Example: Grocery Purchase

A user tells their local agent:

> Buy groceries for dinner, but spend no more than $50.

The local agent receives or creates a permission:

```text
scope: purchase:groceries
max_amount: 50
expiry: 2 hours
```

The agent attempts to buy $35 of groceries.

The system checks:

```text
Is the grant active?
Is the agent the holder of the grant?
Is the scope purchase:groceries?
Is the amount less than or equal to $50?
Has the grant expired?
Has the grant or its parent been revoked?
```

If all checks pass, the transaction is authorized.

If the agent attempts to spend $75, the transaction fails.

If the agent attempts to buy electronics, the transaction fails.

## Example: Interaction With a Trusted Issuer's Agent

Dynamic intent-scoped authorization can also affect the agent on the other side of a transaction.

Imagine a user has a local shopping agent. The user wants to buy groceries from a merchant whose checkout system is operated by a trusted issuer's agent.

The user's local agent presents a limited proof:

```text
This agent is authorized to purchase groceries.
The purchase amount must not exceed $50.
The authorization is still valid.
The authorization has not been revoked.
```

The merchant-side agent does not need unlimited information about the user. It only needs to verify that the requested transaction is allowed.

This creates a trust boundary between the two agents.

The user's local agent is limited by the user's intent.

The merchant-side trusted agent is limited by what it is allowed to accept and process.

The transaction succeeds only if both sides operate within their valid scopes.

## Counterparty-Aware Permissions

A grant may optionally include counterparty constraints.

For example:

```text
scope: purchase:groceries
max_amount: 50
expiry: 2 hours
allowed_counterparty: trusted_grocery_merchant_agent
```

This would mean the local agent can only use the permission with a specific trusted counterparty or category of counterparties.

This prevents the agent from using a grocery permission somewhere unintended.

## Delegation

An agent may delegate part of its authority to another agent, but only in a narrower form.

Example parent grant:

```text
scope: purchase:groceries
max_amount: 50
expiry: 1000
```

Example delegated child grant:

```text
scope: purchase:groceries:produce
max_amount: 20
expiry: 900
```

The child grant is weaker than the parent grant.

It has:

```text
a narrower scope
a smaller amount limit
an earlier or equal expiry
dependence on the parent grant
```

If the parent grant is revoked, the child grant should also become invalid.

## Revocation

Revocation should apply to permissions without necessarily deleting identity.

If an agent breaks a rule, the system can:

```text
revoke a specific grant
suspend the agent's trusted status
revoke an issuer credential
block future grant issuance
mark the agent as non-compliant
```

The agent's ID can remain as a permanent record, while its authority to act is removed.

Analogy:

> A driver's license number can remain in government records even if the license is suspended.

In AgenticDID:

> The agent's DID can remain permanently recorded while its ability to use grants is revoked.

## Constitutional Enforcement

AgenticDID may include a constitution that defines the rules agents must follow.

A constitutional violation may trigger:

```text
grant revocation
agent suspension
issuer review
slashing or penalty mechanisms
counterparty warnings
loss of trusted status
```

The scoped grant system supports constitutional enforcement because it gives the protocol a clean place to remove authority without erasing identity.

## Zero-Knowledge Authorization

The permission system may support zero-knowledge proofs.

This allows an agent to prove:

```text
I have a valid permission.
The permission covers this action.
The amount is within the allowed limit.
The permission has not expired.
The permission has not been revoked.
```

Without revealing unnecessary private information such as:

```text
the user's full identity
the user's complete DID history
other unrelated permissions
private account details
unrelated agent relationships
```

This is useful because counterparties often need proof of authority, not full personal information.

## Why This Matters

Dynamic intent-scoped permissions make AgenticDID safer and more practical.

Instead of giving agents broad power, AgenticDID can give agents narrow power based on the user's current intent.

This creates a safer model for autonomous agents.

The agent gets enough authority to complete the task, but not enough authority to cause unlimited damage.

## Simple Analogy

AgenticDID is like a city.

The identity system is the passport office.

The trusted issuer is the government office or company that creates official agents.

The constitution is the law.

The scoped grant system is the keycard and debit-card office.

The user's intent is the instruction written on the work order.

The agent can only use the keycard for the job described in the work order.

If the agent breaks the rules, the city does not need to erase the agent's birth certificate. It can simply deactivate the keycard, suspend the license, or revoke the work permit.

## Summary

The scoped grant contract is best understood as Machine 2 in AgenticDID.

It does not create permanent agent identity.

It creates dynamic, limited, revocable authority.

User intent can shape this authority by narrowing:

```text
what the agent may do
how much the agent may spend
who the agent may interact with
how long the permission lasts
whether the permission may be delegated
```

This makes the permission system responsive to the user's intent and enforceable across trusted agents participating in the transaction.
