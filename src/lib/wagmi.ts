import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
  ],
  transports: {
    // Base Denim Mainnet (200ms native canonical blocks)
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      timeout: 10_000,
    }),
  },
});
