/**
 * DIDz.io — Contract bindings entry point
 *
 * Re-exports the Compact-generated managed TypeScript bindings.
 * Running `yarn workspace @didz/didz-contract compact` generates files under
 * src/managed/didz-registry/ and src/managed/trusted-issuer-registry/.
 *
 * Compact contracts live at:
 *   ../contracts/DIDzRegistry.compact
 *   ../contracts/TrustedIssuerRegistry.compact
 *
 * Status: STUB — managed bindings are regenerated on each `compact` run.
 */

export * from './witnesses.js';
