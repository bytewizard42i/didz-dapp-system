/**
 * TrustedIssuerRegistry — Structural contract tests
 *
 * Verifies the compiled contract has the expected circuits from the
 * multi-admin modernization (suspend/reactivate, multi-admin Set).
 *
 * Run: node --test tests/trusted_issuer_registry.test.js
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const DTS_PATH = path.join(__dirname, '..', 'build', 'trusted-issuer-registry', 'contract', 'index.d.ts');

function loadCircuitNames() {
  if (!fs.existsSync(DTS_PATH)) return null;
  const dts = fs.readFileSync(DTS_PATH, 'utf8');
  const matches = [...dts.matchAll(/^\s+(\w+)\(context/gm)];
  const names = matches.map(m => m[1]);
  const skip = new Set(['initialState', 'local_secret_key']);
  return [...new Set(names.filter(n => !skip.has(n)))].sort();
}

const CIRCUITS = loadCircuitNames();

const EXPECTED_CIRCUITS = [
  'addAdmin',
  'removeAdmin',
  'registerIssuer',
  'approveIssuer',
  'suspendIssuer',
  'reactivateIssuer',
  'revokeIssuer',
  'updateAssuranceLevel',
  'getIssuerProfile',
  'isIssuerApprovedForDomain',
  'meetsMinimumAssurance',
];

describe('TrustedIssuerRegistry — structural tests', () => {
  it('should have a compiled contract artifact', () => {
    assert.ok(fs.existsSync(DTS_PATH), `Expected compiled .d.ts at ${DTS_PATH}`);
  });

  it('should have all expected circuits', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled — run: compact compile'); return; }
    for (const name of EXPECTED_CIRCUITS) {
      assert.ok(CIRCUITS.includes(name), `Missing circuit: ${name}`);
    }
  });

  it('should have exactly 11 circuits (regression guard)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.strictEqual(CIRCUITS.length, EXPECTED_CIRCUITS.length,
      `Circuit count changed: expected ${EXPECTED_CIRCUITS.length}, got ${CIRCUITS.length}. ` +
      `New: ${(CIRCUITS.filter(c => !EXPECTED_CIRCUITS.includes(c))).join(', ') || 'none'}. ` +
      `Missing: ${(EXPECTED_CIRCUITS.filter(c => !CIRCUITS.includes(c))).join(', ') || 'none'}.`);
  });

  it('should have multi-admin circuits (addAdmin, removeAdmin — constructor captures deployer)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('addAdmin'), 'Missing addAdmin');
    assert.ok(CIRCUITS.includes('removeAdmin'), 'Missing removeAdmin');
  });

  it('should have suspend/reactivate circuits (modernization)', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('suspendIssuer'), 'Missing suspendIssuer');
    assert.ok(CIRCUITS.includes('reactivateIssuer'), 'Missing reactivateIssuer');
  });

  it('should have revokeIssuer circuit', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('revokeIssuer'), 'Missing revokeIssuer');
  });

  it('should have assurance level circuits', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('updateAssuranceLevel'), 'Missing updateAssuranceLevel');
    assert.ok(CIRCUITS.includes('meetsMinimumAssurance'), 'Missing meetsMinimumAssurance');
  });

  it('should have domain approval check circuit', () => {
    if (!CIRCUITS) { assert.skip('Contract not compiled'); return; }
    assert.ok(CIRCUITS.includes('isIssuerApprovedForDomain'), 'Missing isIssuerApprovedForDomain');
  });
});
