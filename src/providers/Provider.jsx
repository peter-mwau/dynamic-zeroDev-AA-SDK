import {
  DynamicContextProvider,
  DynamicWidget,
  FilterChain,
} from "@dynamic-labs/sdk-react-core";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";

import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import {
  sepolia,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  skaleTitanTestnet,
} from "viem/chains";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import {
  BitcoinIcon,
  EthereumIcon,
  FlowIcon,
  SolanaIcon,
} from "@dynamic-labs/iconic";
import { getOrMapViemChain } from "@dynamic-labs/ethereum-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";

const customEvmNetworks = [
  {
    blockExplorerUrls: [
      "https://aware-fake-trim-testnet.explorer.testnet.skalenodes.com/api",
    ],
    chainId: 1020352220,
    name: "Morph",
    rpcUrls: ["https://testnet.skalenodes.com/v1/aware-fake-trim-testnet"],
    iconUrls: ["https://avatars.githubusercontent.com/u/132543920?v=4"],
    nativeCurrency: {
      name: "SKALE",
      symbol: "SKL",
      decimals: 18,
    },
    networkId: 1020352220,
  },
];

const config = createConfig({
  chains: [
    mainnet,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    base,
    skaleTitanTestnet,
    ...customEvmNetworks.map(getOrMapViemChain),
  ],
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
    });
  },
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [skaleTitanTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Provider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicContextProvider
        theme="dark"
        settings={{
          environmentId: "4a59cb0d-1840-4245-b235-5af508690679",
          appName: "ABYA Passport",
          appLogoUrl: "/content",
          walletConnectors: [
            EthereumWalletConnectors,
            DynamicWagmiConnector,
            ZeroDevSmartWalletConnectors,
            SolanaWalletConnectors,
          ],
          events: {
            onAuthSuccess: (args) => {},
          },
          overrides: {
            views: [
              {
                type: "wallet-list",
                tabs: {
                  items: [
                    {
                      label: { text: "All chains" },
                    },
                    {
                      label: { icon: <EthereumIcon /> },
                      walletsFilter: FilterChain("EVM"),
                      recommendedWallets: [
                        {
                          walletKey: "phantomevm",
                        },
                      ],
                    },
                    {
                      label: { icon: <SolanaIcon /> },
                      walletsFilter: FilterChain("SOL"),
                    },
                    {
                      label: { icon: <BitcoinIcon /> },
                      walletsFilter: FilterChain("BTC"),
                    },
                    {
                      label: { icon: <FlowIcon /> },
                      walletsFilter: FilterChain("FLOW"),
                    },
                  ],
                },
              },
            ],
          },
        }}
      >
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </DynamicContextProvider>
    </QueryClientProvider>
  );
}
