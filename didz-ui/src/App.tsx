import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FolderIcon from '@mui/icons-material/Folder';
import GitHubIcon from '@mui/icons-material/GitHub';
import type { DidzRuntimeConfig } from '@didz/didz-api';

/**
 * DIDz.io — App Shell
 *
 * Phase 1 scaffold: loads runtime config, shows wallet-connect CTA,
 * hints at the Fi Standards three-pillar workflow (Register / Attest / Verify).
 *
 * To be extended with the canonical flow stages and wallet integration
 * in subsequent sessions.
 */
export default function App() {
  const [config, setConfig] = useState<DidzRuntimeConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/config.json')
      .then((r) => {
        if (!r.ok) throw new Error(`config.json returned ${r.status}`);
        return r.json() as Promise<DidzRuntimeConfig>;
      })
      .then(setConfig)
      .catch((err: Error) => setConfigError(err.message));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <FingerprintIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            DIDz.io
          </Typography>
          {config && (
            <Chip
              label={config.networkId}
              color={config.networkId === 'MainNet' ? 'success' : 'default'}
              size="small"
              sx={{ mr: 2 }}
            />
          )}
          <Tooltip title="Source on GitHub">
            <IconButton
              component="a"
              href="https://github.com/bytewizard42i/DIDz-io"
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" color="primary" startIcon={<AccountBalanceWalletIcon />} sx={{ ml: 2 }} disabled>
            Connect Wallet
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" gutterBottom>
              Your Identity. Your Privacy. Your Rules.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720 }}>
              DIDz.io is the foundational identity layer for the DIDzMonolith ecosystem —
              register your decentralized identifier on Midnight, hold verifiable credentials,
              and prove facts about yourself without revealing the underlying data.
            </Typography>
          </Box>

          {configError && (
            <Alert severity="warning">
              Failed to load runtime config: {configError}. Showing development defaults.
            </Alert>
          )}

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <FingerprintIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Register Your DID
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a <code>did:midnight:human:...</code> anchored to your wallet key.
                  The DID document is public; all personal data stays off-chain and encrypted.
                </Typography>
              </CardContent>
              <CardActions>
                <Button disabled>Coming Soon</Button>
              </CardActions>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <VerifiedUserIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Receive Attestations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trusted Issuers (DMV, banks, universities) attest facts about your DID
                  using the three-axis model — each claim is a commitment, not the raw data.
                </Typography>
              </CardContent>
              <CardActions>
                <Button disabled>Coming Soon</Button>
              </CardActions>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <FolderIcon sx={{ fontSize: 40, mb: 2, color: '#7ee787' }} />
                <Typography variant="h5" gutterBottom>
                  Prove Without Revealing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Zero-knowledge proofs let you prove "I'm over 21" or "I'm accredited"
                  without showing your birth date, address, or account balance.
                </Typography>
              </CardContent>
              <CardActions>
                <Button disabled>Coming Soon</Button>
              </CardActions>
            </Card>
          </Stack>

          {config && (
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Runtime configuration
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 1, fontFamily: 'monospace', fontSize: 13 }}>
                  <div>networkId: {config.networkId}</div>
                  <div>proofServer: {config.proofServerUrl}</div>
                  <div>indexer: {config.indexerUrl}</div>
                  <div>identityProvider: {config.identityProviderUrl}</div>
                  <div>
                    didzRegistry: {config.didzRegistryAddress || '(not yet deployed)'}
                  </div>
                </Stack>
              </CardContent>
            </Card>
          )}

          <Alert severity="info">
            <strong>Scaffold status</strong>: Phase 1 — this UI is a shell.
            See <code>SCAFFOLD_README.md</code> and <code>docs/FI_STANDARDS_APPLIED_TO_DIDZ.md</code> for the plan.
          </Alert>
        </Stack>
      </Container>

      <Box sx={{ py: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          DIDz.io — built on Midnight Network. One day there will just be "Fi". 🏛️
        </Typography>
      </Box>
    </Box>
  );
}
