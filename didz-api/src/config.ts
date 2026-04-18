/**
 * DIDz.io — Environment Configurations
 *
 * Default configs for Undeployed (local), TestNet, and MainNet.
 * Runtime overrides come from `didz-ui/public/config.json` (loaded at startup).
 *
 * Status: ACTIVE
 */

import type { DidzRuntimeConfig, NetworkId } from './common-types.js';

export const UNDEPLOYED_DEFAULTS: DidzRuntimeConfig = {
  networkId: 'Undeployed',
  proofServerUrl: 'http://localhost:6300',
  indexerUrl: 'http://localhost:8088',
  identityProviderUrl: 'http://localhost:3000',
  didzRegistryAddress: '',  // set after local deploy
  trustedIssuerRegistryAddress: '',
};

export const TESTNET_DEFAULTS: DidzRuntimeConfig = {
  networkId: 'TestNet',
  proofServerUrl: 'https://proof.didz.io',
  indexerUrl: 'https://indexer.testnet.midnight.network',
  identityProviderUrl: 'https://idp.didz.io',
  didzRegistryAddress: '',  // set after testnet deploy
  trustedIssuerRegistryAddress: '',
};

export const MAINNET_DEFAULTS: DidzRuntimeConfig = {
  networkId: 'MainNet',
  proofServerUrl: 'https://proof.didz.io',
  indexerUrl: 'https://indexer.mainnet.midnight.network',
  identityProviderUrl: 'https://idp.didz.io',
  didzRegistryAddress: '',
  trustedIssuerRegistryAddress: '',
};

export function defaultsForNetwork(networkId: NetworkId): DidzRuntimeConfig {
  switch (networkId) {
    case 'Undeployed':
      return UNDEPLOYED_DEFAULTS;
    case 'TestNet':
      return TESTNET_DEFAULTS;
    case 'MainNet':
      return MAINNET_DEFAULTS;
  }
}
