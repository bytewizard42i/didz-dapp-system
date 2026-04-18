/**
 * DIDz.io — Witness functions
 *
 * DIDz.io's contracts are overwhelmingly PUBLIC (DID documents are public
 * by design per W3C DID Core). Witness functions in this package are limited
 * to the private-state needs of the caller's local wallet, NOT the DID records
 * themselves.
 *
 * Per Fi Standards + Brick Towers' midnight-rwa pattern, the recommended
 * private state is MINIMAL — just the user's local signing key.
 *
 * Status: STUB — populate once the Compact-generated bindings are in place.
 */

export interface DidzPrivateState {
  /** User's local signing key (Schnorr / Jubjub) — NOT the Midnight wallet key. */
  readonly localSigningKey: Uint8Array;
}

export type DidzWitnessContext<P extends DidzPrivateState = DidzPrivateState> = {
  readonly privateState: P;
};

/**
 * Placeholder witnesses object. Once the Compact-generated bindings exist,
 * this will provide functions such as `findAuthorizationPath`, `localSigningKey`,
 * etc. For now it's an empty object so the workspace compiles.
 */
export const witnesses = {} as const;
