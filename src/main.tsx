import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig, Chain } from "wagmi"; // Import 'Chain' from 'wagmi'
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";

const maxxChain: Chain = {
  id: 10201,
  name: 'Maxx Chain',
  network: 'maxxchain',
  nativeCurrency: {
    decimals: 18,
    name: 'Power',
    symbol: 'PWR',
  },
  rpcUrls: {
    default: 'https://mainrpc4.maxxchain.org/',
  },
  blockExplorers: {
    default: { name: 'Maxx Explorer', url: 'https://scan.maxxchain.org/' },
  },
  testnet: false,
};
const bsc: Chain = {
  id: 56, // BSC chain ID
  name: 'Binance Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Coin',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: 'https://bsc-dataseed.binance.org/',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com/' },
  },
  testnet: false,
};

const { chains, provider } = configureChains(
  [maxxChain],
  [
    jsonRpcProvider({
      rpc: () => {
        return {
          http: "https://mainrpc4.maxxchain.org/",
        };
      },
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "AnunakiNFT Dapp 2024",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider modalSize="compact" chains={chains}
        theme={darkTheme({
              accentColor: '#fcbb63',
              accentColorForeground: 'white',
              borderRadius: 'small',
              fontStack: 'system',
              overlayBlur: 'small',
            })}

        >
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  </React.StrictMode>
);
