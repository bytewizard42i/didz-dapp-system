/**
 * DIDz.io — Identity Provider server factory.
 *
 * Builds an Express app with the identity verification + credential signing
 * endpoints. Keeping the factory pattern lets tests construct an in-memory
 * server without binding a port.
 *
 * Status: STUB — routes are defined but return 501 until implementation lands.
 */

import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import type { Logger } from 'pino';
import { z } from 'zod';

const SubmitIdentitySchema = z.object({
  did: z.string().startsWith('did:midnight:'),
  documentType: z.enum(['DRIVERS_LICENSE', 'PASSPORT', 'NATIONAL_ID']),
  documentHash: z.string().regex(/^[0-9a-f]{64}$/),
  faceCommitment: z.string().regex(/^[0-9a-f]{64}$/),
  bindingProof: z.string(),
});

export function createServer(logger: Logger): Express {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  // ----- Health -----
  app.get('/healthz', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'didz-identity-provider-api', version: '0.1.0' });
  });

  // ----- Fi Standards-compliant service manifest -----
  app.get('/.well-known/didz-issuer.json', (_req: Request, res: Response) => {
    res.json({
      issuerDid: 'did:agentic:didz_foundation_0',
      issuerHumanName: 'DIDz.io Foundation',
      legalName: 'DIDz.io Foundation (placeholder)',
      issuerType: 'INSTITUTION',
      domains: ['IDENTITY_INFRA'],
      assuranceLevel: 'SYSTEM_CRITICAL',
      allowedCredentialTypes: ['KYC_TIER_1', 'KYC_TIER_2'],
      forbiddenCredentialTypes: ['FINANCIAL_ACCOUNT', 'MEDICAL_RECORD'],
      isActive: false,
    });
  });

  // ----- Submit identity docs (Phase 1) -----
  app.post('/api/v1/submit-identity', (req: Request, res: Response) => {
    const parsed = SubmitIdentitySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_request', detail: parsed.error.format() });
      return;
    }
    res.status(501).json({
      error: 'not_implemented',
      message: 'Identity submission handler lands in Phase 1.5 — track FI_STANDARDS_APPLIED_TO_DIDZ.md Section 5.',
    });
  });

  // ----- Issue credential (Phase 1) -----
  app.post('/api/v1/issue-credential', (_req: Request, res: Response) => {
    res.status(501).json({
      error: 'not_implemented',
      message: 'Schnorr credential issuance lands in Phase 1.5.',
    });
  });

  // ----- Revoke credential -----
  app.post('/api/v1/revoke-credential', (_req: Request, res: Response) => {
    res.status(501).json({
      error: 'not_implemented',
      message: 'Credential revocation lands with TrustedIssuerRegistry integration.',
    });
  });

  return app;
}
