/**
 * DIDz.io — Identity Provider (IDP) API entry point.
 *
 * Responsibilities:
 *   - Accept identity document submissions (KYC tier 1/2/3 per KYCz binding stack)
 *   - Schnorr-sign `SignedCredential<T>` for the submitting user's DID
 *   - Return the signed credential for the user to store privately
 *
 * This service is the first Fi-Standards ISSUER_AGENT in DIDzMonolith:
 *   trusted_issuer_0  =  didz_foundation_0 (we dogfood our own standards)
 *
 * Status: STUB — routes return 501 until Phase 1 implementation lands.
 */

import { createServer } from './server.js';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
});

const port = Number(process.env.PORT ?? 3000);
const server = createServer(logger);

server.listen(port, () => {
  logger.info({ port }, 'DIDz identity-provider-api listening');
});
