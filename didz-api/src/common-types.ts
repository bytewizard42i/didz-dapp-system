/**
 * DIDz.io — Shared Types
 *
 * Encodes the Fi Standards three-axis issuer model, DID format rules,
 * and credential-type conventions so the UI, CLI, and identity-provider
 * service all speak the same type language.
 *
 * Canonical source: docs/FI_STANDARDS_APPLIED_TO_DIDZ.md
 * Authoritative Fi Standards:
 *   bytewizard42i/AgenticDID_io_me_MAIN/docs-nerds-only/Fi _Standards-AKA-FIST/FI_STANDARDS_FOR_DIDS_TIS_AND_RAS.md
 *
 * Status: ACTIVE
 */

// ============================================================================
// DID SUBJECT CATEGORIES (EntityType) — from DIDzRegistry.compact
// ============================================================================

/**
 * The seven kinds of things a DID can represent. Matches the on-chain
 * `EntityType` enum in `DIDzRegistry.compact`. Every DID has exactly one
 * EntityType; it cannot be changed after registration.
 */
export enum EntityType {
  HUMAN = 0,
  AGENT = 1,          // Autonomous AI agents (cross-refs to AgenticDID)
  ANIMAL = 2,         // Pets (petProData), horses (equineProData)
  ORGANIZATION = 3,   // Corporations, governments, institutions
  DEVICE = 4,         // IoT devices, hardware wallets
  OBJECT = 5,         // Supply-chain objects, RWA assets
  LOCATION = 6,       // Geographic anchors (for GPS oracles)
}

/**
 * The string slug of an EntityType used in DID format.
 * `did:midnight:<slug>:<hash>`
 */
export const ENTITY_TYPE_SLUG: Record<EntityType, string> = {
  [EntityType.HUMAN]: 'human',
  [EntityType.AGENT]: 'agent',
  [EntityType.ANIMAL]: 'animal',
  [EntityType.ORGANIZATION]: 'org',
  [EntityType.DEVICE]: 'device',
  [EntityType.OBJECT]: 'object',
  [EntityType.LOCATION]: 'location',
};

// ============================================================================
// THREE-AXIS TRUSTED ISSUER MODEL (Fi Standards — MANDATORY)
// ============================================================================

/**
 * Axis 1 — Legal Form. The KIND of entity that issues credentials.
 * Matches the on-chain `IssuerType` enum in `TrustedIssuerRegistry.compact`.
 */
export enum IssuerType {
  SELF_SOVEREIGN = 0,     // Individual
  CORPORATION = 1,        // Business entity
  GOVERNMENT_ENTITY = 2,  // Government organization
  INSTITUTION = 3,        // Non-profit, educational, religious
}

/**
 * Axis 2 — Sector. What DOMAIN the issuer operates in.
 * An issuer MAY operate in MULTIPLE domains (Fi Standards — array required).
 *
 * Phase 1 contract stores a single domain per issuer as a short-term workaround;
 * Phase 2 contract revision migrates to on-chain multi-domain support.
 */
export enum IssuerDomain {
  GENERAL = 0,
  IDENTITY_INFRA = 1,  // Core identity (DIDz.io, KYCz itself)
  FINANCIAL = 2,       // Banking, payments, securities
  MEDICAL = 3,         // Healthcare, veterinary
  EDUCATION = 4,       // Schools, universities, certifications
  RESEARCH = 5,        // Research institutions, IRBs
  GOV_SERVICES = 6,    // Government-issued credentials (DL, passport)
  VOTING = 7,          // Elections, governance
  E_COMMERCE = 8,      // Online shopping, marketplaces
  TRAVEL = 9,          // Airlines, hotels, borders
  LEGAL = 10,          // Courts, notaries
  EMPLOYMENT = 11,     // Employment verification, payroll
  INSURANCE = 12,      // Insurance (separate from medical)
  AGRICULTURE = 13,    // Food, livestock, land
  REAL_ESTATE = 14,    // Property records
}

/**
 * Axis 3 — Trust Strength. How much ASSURANCE does this issuer's claim carry.
 * Matches the on-chain `AssuranceLevel` enum in `TrustedIssuerRegistry.compact`.
 *
 * A verifier gates credential acceptance by minAssuranceLevel: e.g., a bank
 * might require REGULATED_ENTITY or higher before accepting a KYC credential.
 */
export enum AssuranceLevel {
  UNVERIFIED = 0,         // Self-registered, no external verification
  BASIC_KYC = 1,          // Email + phone + optional doc upload
  REGULATED_ENTITY = 2,   // Licensed + regulated (banks, medical boards, etc.)
  SYSTEM_CRITICAL = 3,    // Government, critical infrastructure, foundational
}

/**
 * Canonical TrustedIssuer configuration. Every Fi-compliant issuer MUST
 * fill EVERY field — there are NO optional properties here.
 *
 * Matches the on-chain `IssuerProfile` struct in `TrustedIssuerRegistry.compact`
 * plus the off-chain fields Fi Standards require at activation time.
 */
export interface TrustedIssuerConfig {
  /** did:midnight:org:<hash> OR did:agentic:<snake_case_name> */
  readonly issuerDid: string;

  /** Display name (e.g., "Stanford University") */
  readonly issuerHumanName: string;

  /** Legal name as registered with the relevant regulator */
  readonly legalName: string;

  // Three-axis model (all required)
  readonly issuerType: IssuerType;
  readonly domains: readonly IssuerDomain[];   // May be multi-valued
  readonly assuranceLevel: AssuranceLevel;

  /** Credential types this issuer is authorized to issue. SCREAMING_SNAKE_CASE. */
  readonly allowedCredentialTypes: readonly string[];

  /** Credential types this issuer is EXPLICITLY forbidden from issuing. */
  readonly forbiddenCredentialTypes: readonly string[];

  /** Active on-chain? Defaults to false; flip to true only after activation checklist passes. */
  readonly isActive: boolean;

  /** ISO-8601 timestamp of when this issuer was admitted to the registry. */
  readonly admittedAt?: string;
}

// ============================================================================
// REGISTERED AGENT MODEL (Fi Standards)
// ============================================================================

/**
 * Three agent types per Fi Standards hierarchy.
 */
export enum AgentRole {
  /** User's personal assistant (e.g., Comet). One per user. */
  LOCAL_AGENT = 0,
  /** Official agent for a Trusted Issuer (e.g., agent_0 for AgenticDID). One per issuer. */
  ISSUER_AGENT = 1,
  /** Specialized service agent (e.g., Bank Agent, Medical Records Agent). Many, each specialized. */
  TASK_AGENT = 2,
}

export interface RegisteredAgentConfig {
  readonly agentDid: string;
  readonly agentHumanName: string;
  readonly role: AgentRole;
  /** Required for ISSUER_AGENT and TASK_AGENT. Unset for LOCAL_AGENT. */
  readonly parentIssuerDid?: string;
  readonly capabilities: readonly string[];
  /** Credentials the USER needs to interact with this agent. */
  readonly requiredCredentials?: readonly string[];
  readonly isActive: boolean;
}

// ============================================================================
// DID RECORD (matches DIDzRegistry.compact on-chain shape)
// ============================================================================

export interface DidRecord {
  readonly did: string;                     // did:midnight:<type>:<hash>
  readonly entityType: EntityType;
  readonly subjectCommitment: string;       // hex — hash of off-chain subject data
  readonly ownerKey: string;                // hex — ZswapCoinPublicKey
  readonly createdAt: bigint;               // Uint<64>
  readonly isActive: boolean;
}

// ============================================================================
// ATTESTATION (on-chain claim by a Trusted Issuer about a DID)
// ============================================================================

export interface Attestation {
  readonly did: string;                     // subject DID
  readonly issuerDid: string;               // issuing Trusted Issuer
  readonly attestationType: string;         // SCREAMING_SNAKE_CASE, e.g. "KYC_TIER_2"
  readonly claimCommitment: string;         // hex — hash of off-chain claim data
  readonly issuedAt: bigint;
  readonly expiresAt: bigint;
  readonly isRevoked: boolean;
}

// ============================================================================
// CANONICAL FLOW STATE MACHINE (per Fi Standards)
// ============================================================================

/**
 * The canonical flow per Fi Standards:
 *   USER → LOCAL_AGENT → ISSUER_AGENT → TRUSTED_ISSUER → CREDENTIAL → USER uses TASK_AGENTS
 *
 * DIDz.io UIs should track which stage a user is in so the UX can guide them
 * through the sequence without skipping steps.
 */
export enum CanonicalFlowStage {
  NOT_STARTED = 0,
  WALLET_CONNECTED = 1,          // User has connected their Lace wallet
  LOCAL_AGENT_INITIALIZED = 2,   // Local signing key generated + registered
  IDP_SESSION_OPENED = 3,        // Conversation with ISSUER_AGENT started
  IDENTITY_SUBMITTED = 4,        // KYC docs sent to IDP
  CREDENTIAL_ISSUED = 5,         // Signed credential received
  CREDENTIAL_STORED = 6,         // Credential in user's private wallet
  READY_FOR_TASKS = 7,           // User can now invoke TASK_AGENTS
}

// ============================================================================
// NETWORK + CONFIG
// ============================================================================

export type NetworkId = 'Undeployed' | 'TestNet' | 'MainNet';

export interface DidzRuntimeConfig {
  readonly networkId: NetworkId;
  readonly proofServerUrl: string;
  readonly indexerUrl: string;
  readonly identityProviderUrl: string;
  readonly didzRegistryAddress: string;
  readonly trustedIssuerRegistryAddress: string;
}
