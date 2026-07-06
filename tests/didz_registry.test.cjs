/**
 * DIDzRegistry — Structural contract tests
 *
 * These tests verify the compiled contract's structure (circuit names,
 * no transfer/delete circuits, expected circuit count) by reading the
 * TypeScript declarations emitted by the compact compiler.
 *
 * On-chain behavioral tests require the Midnight test harness (pending);
 * these structural tests catch regressions in the contract's public API
 * and enforce constitutional invariants (non-transferability, no deletion).
 *
 * Run: node --test tests/didz_registry.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const DTS_PATH = path.join(__dirname, '..', 'build', 'didz-registry', 'contract', 'index.d.ts');

function loadCircuitNames() {
  if (!fs.existsSync(DTS_PATH)) {
    return null;
  }
  const dts = fs.readFileSync(DTS_PATH, 'utf8');
  const matches = [...dts.matchAll(/^\s+(\w+)\(context/gm)];
  const names = matches.map(m => m[1]);
  const pureCircuits = new Set(['derive_public_key', 'derive_profile_commitment', 'derive_pairwise_did', 'initialState', 'local_secret_key']);
  return [...new Set(names.filter(n => !pureCircuits.has(n)))].sort();
}

const CIRCUITS = loadCircuitNames();

const EXPECTED_CIRCUITS = [
  'claim_registry_admin',
  'add_registry_admin',
  'remove_registry_admin',
  'add_status_authority',
  'remove_status_authority',
  'register_did',
  'assert_i_control',
  'prove_entity_type',
  'rotate_owner_key',
  'suspend_did',
  'reactivate_did',
  'set_terminal_status',
  'attest_to_did',
  'revoke_attestation',
  'prove_attestation',
  'prove_pairwise_binding',
  'advance_epoch',
];

const FORBIDDEN_CIRCUITS = [
  'transfer_did',
  'transfer',
  'delete_did',
  'remove_did',
  'burn_did',
  'transfer_ownership',
];

describe('DIDzRegistry — structural tests', () => {
  it('should have a compiled contract artifact', () => {
    assert.ok(fs.existsSync(DTS_PATH), `Expected compiled .d.ts at ${DTS_PATH}`);
  });

  it('should have all expected circuits', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled — run: compact compile'); return; }
    for (const name of EXPECTED_CIRCUITS) {
      assert.ok(CIRCUITS.includes(name), `Missing circuit: ${name}`);
    }
  });

  it('should NOT have any transfer or delete circuits (non-transferability)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    for (const forbidden of FORBIDDEN_CIRCUITS) {
      assert.ok(!CIRCUITS.includes(forbidden), `Forbidden circuit found: ${forbidden}`);
    }
  });

  it('should have exactly 17 impure circuits (regression guard)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.strictEqual(CIRCUITS.length, EXPECTED_CIRCUITS.length,
      `Circuit count changed: expected ${EXPECTED_CIRCUITS.length}, got ${CIRCUITS.length}. ` +
      `New circuits: ${(CIRCUITS.filter(c => !EXPECTED_CIRCUITS.includes(c))).join(', ') || 'none'}. ` +
      `Missing: ${(EXPECTED_CIRCUITS.filter(c => !CIRCUITS.includes(c))).join(', ') || 'none'}.`);
  });

  it('should have multi-admin circuits (add/remove_registry_admin)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('add_registry_admin'), 'Missing add_registry_admin');
    assert.ok(CIRCUITS.includes('remove_registry_admin'), 'Missing remove_registry_admin');
  });

  it('should have lifecycle circuits (suspend/reactivate/set_terminal_status)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('suspend_did'), 'Missing suspend_did');
    assert.ok(CIRCUITS.includes('reactivate_did'), 'Missing reactivate_did');
    assert.ok(CIRCUITS.includes('set_terminal_status'), 'Missing set_terminal_status');
  });

  it('should have selective disclosure circuits (prove_entity_type, prove_attestation, prove_pairwise_binding)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('prove_entity_type'), 'Missing prove_entity_type');
    assert.ok(CIRCUITS.includes('prove_attestation'), 'Missing prove_attestation');
    assert.ok(CIRCUITS.includes('prove_pairwise_binding'), 'Missing prove_pairwise_binding');
  });

  it('should have attestation circuits (attest_to_did, revoke_attestation)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('attest_to_did'), 'Missing attest_to_did');
    assert.ok(CIRCUITS.includes('revoke_attestation'), 'Missing revoke_attestation');
  });
});

describe('DIDzRegistry — non-transferability (constitutional invariant)', () => {
  it('should have NO transfer circuit by construction', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    const transferLike = CIRCUITS.filter(c => c.includes('transfer'));
    assert.strictEqual(transferLike.length, 0,
      `Found transfer-like circuits: ${transferLike.join(', ')}`);
  });

  it('should have NO delete circuit by construction', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    const deleteLike = CIRCUITS.filter(c => c.includes('delete') || c.includes('remove_did') || c.includes('burn_did'));
    assert.strictEqual(deleteLike.length, 0,
      `Found delete-like circuits: ${deleteLike.join(', ')}`);
  });
});
