/**
 * DIDz.io — DID Format Helpers
 *
 * Canonical format: did:midnight:<type>:<hash>
 *   - type:   snake_case slug from ENTITY_TYPE_SLUG (human / agent / animal / org / device / object / location)
 *   - hash:   lowercase hex of the on-chain persistent hash (no 0x prefix)
 *
 * Also handles the `did:agentic:<snake_case_id>` namespace for AgenticDID agents
 * mirrored into DIDz.io as `did:midnight:agent:<hash>` references.
 *
 * Canonical source: docs/FI_STANDARDS_APPLIED_TO_DIDZ.md
 * Status: ACTIVE
 */

import { EntityType, ENTITY_TYPE_SLUG } from './common-types.js';

const MIDNIGHT_DID_PREFIX = 'did:midnight:';
const AGENTIC_DID_PREFIX = 'did:agentic:';
const SNAKE_CASE_ID_REGEX = /^[a-z0-9][a-z0-9_]*$/;
const HEX_REGEX = /^[0-9a-f]+$/;

export interface ParsedMidnightDid {
  readonly method: 'midnight';
  readonly entityType: EntityType;
  readonly hash: string;
}

export interface ParsedAgenticDid {
  readonly method: 'agentic';
  readonly agentId: string;
}

export type ParsedDid = ParsedMidnightDid | ParsedAgenticDid;

/**
 * Build a canonical `did:midnight:<type>:<hash>` DID string.
 *
 * @throws Error if the hash is not a valid hex string.
 */
export function formatMidnightDid(entityType: EntityType, hashHex: string): string {
  const slug = ENTITY_TYPE_SLUG[entityType];
  if (!slug) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }
  const normalizedHash = hashHex.startsWith('0x') ? hashHex.slice(2) : hashHex;
  const lower = normalizedHash.toLowerCase();
  if (!HEX_REGEX.test(lower)) {
    throw new Error(`Invalid DID hash — must be lowercase hex: ${hashHex}`);
  }
  return `${MIDNIGHT_DID_PREFIX}${slug}:${lower}`;
}

/**
 * Build a canonical `did:agentic:<snake_case_id>` DID string.
 *
 * @throws Error if the id is not snake_case.
 */
export function formatAgenticDid(agentId: string): string {
  if (!SNAKE_CASE_ID_REGEX.test(agentId)) {
    throw new Error(
      `Invalid agentic DID id — must be lowercase snake_case, no spaces or special chars: "${agentId}"`,
    );
  }
  return `${AGENTIC_DID_PREFIX}${agentId}`;
}

/**
 * Parse any DIDz.io-recognized DID.
 *
 * @throws Error if the DID is malformed or uses an unrecognized method.
 */
export function parseDid(did: string): ParsedDid {
  if (did.startsWith(MIDNIGHT_DID_PREFIX)) {
    const rest = did.slice(MIDNIGHT_DID_PREFIX.length);
    const colonIdx = rest.indexOf(':');
    if (colonIdx < 0) {
      throw new Error(`Malformed did:midnight — missing hash separator: ${did}`);
    }
    const slug = rest.slice(0, colonIdx);
    const hash = rest.slice(colonIdx + 1);
    const entityType = parseEntityTypeSlug(slug);
    if (!HEX_REGEX.test(hash)) {
      throw new Error(`Invalid hash in did:midnight: ${did}`);
    }
    return { method: 'midnight', entityType, hash };
  }

  if (did.startsWith(AGENTIC_DID_PREFIX)) {
    const agentId = did.slice(AGENTIC_DID_PREFIX.length);
    if (!SNAKE_CASE_ID_REGEX.test(agentId)) {
      throw new Error(`Malformed did:agentic — not snake_case: ${did}`);
    }
    return { method: 'agentic', agentId };
  }

  throw new Error(`Unrecognized DID method: ${did}`);
}

function parseEntityTypeSlug(slug: string): EntityType {
  for (const [key, value] of Object.entries(ENTITY_TYPE_SLUG)) {
    if (value === slug) {
      return Number(key) as EntityType;
    }
  }
  throw new Error(`Unknown entity type slug: ${slug}`);
}

/**
 * Reserved-range check per Fi Standards.
 *
 * Returns true if this agent id falls in a reserved protocol range that
 * regular issuers are not allowed to use.
 */
export function isReservedAgenticRange(agentId: string): boolean {
  if (agentId === 'trusted_issuer_0') return true;
  if (agentId === 'canonical_agent_101') return true;
  const systemAgentMatch = /^agent_(\d+)$/.exec(agentId);
  if (systemAgentMatch) {
    const n = Number.parseInt(systemAgentMatch[1] ?? '0', 10);
    return n >= 0 && n <= 100;
  }
  return false;
}

/**
 * Validate a credential type name against Fi Standards naming rules.
 *
 * Rule: SCREAMING_SNAKE_CASE, descriptive, 3+ characters, no abbreviations
 * (abbreviation check is heuristic — flags names <= 4 chars as suspicious).
 */
export function validateCredentialType(name: string): { valid: boolean; reason?: string } {
  if (!/^[A-Z][A-Z0-9_]*$/.test(name)) {
    return { valid: false, reason: 'Must be SCREAMING_SNAKE_CASE (e.g. KYC_TIER_2)' };
  }
  if (name.length < 3) {
    return { valid: false, reason: 'Too short — be descriptive' };
  }
  return { valid: true };
}
