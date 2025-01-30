import { create } from "zustand";
import { Connection, PublicKey } from "@solana/web3.js";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletReadyState } from "@solana/wallet-adapter-base";

type Network = "mainnet-beta" | "devnet" | "testnet";

// Use devnet endpoint
const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

interface WalletState {
  connection: Connection;
  publicKey: PublicKey | null;
  connecting: boolean;
  connected: boolean;
  network: Network;
  availableWallets: any[];
  currentWallet: PhantomWalletAdapter | SolflareWalletAdapter | null;
  setPublicKey: (key: PublicKey | null) => void;
  setConnecting: (connecting: boolean) => void;
  setConnected: (connected: boolean) => void;
  setNetwork: (network: Network) => void;
  connectWallet: () => Promise<void>;
  disconnect: () => Promise<void>;
  loadPersistedConnection: () => Promise<void>;
}

const NETWORK_KEY = "walletNetwork";
const CONNECTED_KEY = "walletConnected";

export const useWalletStore = create<WalletState>((set, get) => ({
  connection: new Connection(SOLANA_RPC_ENDPOINT, "confirmed"),
  publicKey: null,
  connecting: false,
  connected: false,
  network: "devnet",
  availableWallets: [],
  currentWallet: null,

  setPublicKey: (key) => set({ publicKey: key }),
  setConnecting: (connecting) => set({ connecting }),
  setNetwork: async (network: Network) => {
    set({ network });
    await AsyncStorage.setItem(NETWORK_KEY, network);
    set({
      connection: new Connection(
        `https://api.${
          network === "mainnet-beta" ? "mainnet-beta" : network
        }.solana.com`
      ),
    });
  },

  setConnected: async (connected) => {
    set({ connected });
    await AsyncStorage.setItem(CONNECTED_KEY, JSON.stringify(connected));
  },

  loadPersistedConnection: async () => {
    try {
      const [connectedStr, networkStr] = await Promise.all([
        AsyncStorage.getItem(CONNECTED_KEY),
        AsyncStorage.getItem(NETWORK_KEY),
      ]);

      const connected = connectedStr ? JSON.parse(connectedStr) : false;

      if (connected && Platform.OS === "web") {
        const wallet = new PhantomWalletAdapter();

        // Check if wallet is actually available
        if (wallet.readyState === WalletReadyState.Installed) {
          try {
            // Try to reconnect without user interaction
            await wallet.connect();

            if (wallet.publicKey) {
              const network = "mainnet-beta"; // or whichever network you want to use
              set({
                publicKey: wallet.publicKey,
                connected: true,
                network,
                currentWallet: wallet,
                connection: new Connection(`https://api.${network}.solana.com`),
              });
              return;
            }
          } catch (error) {
            // If silent connection fails, reset connection state
            console.log("Silent connection failed:", error);
            set({ connected: false });
            await AsyncStorage.setItem(CONNECTED_KEY, "false");
          }
        }
      }

      // If no wallet connection, use stored network or default
      const network = (networkStr as Network) || "devnet";
      const defaultEndpoint = `https://api.${network}.solana.com`;
      set({
        network,
        connection: new Connection(defaultEndpoint),
        connected: false,
        currentWallet: null,
      });
    } catch (error) {
      console.error("Error loading wallet connection:", error);
    }
  },

  connectWallet: async () => {
    try {
      set({ connecting: true });

      if (Platform.OS === "web") {
        const wallet = new PhantomWalletAdapter();

        // Only disconnect if we have a current wallet instance
        const { currentWallet } = get();
        if (currentWallet) {
          try {
            await currentWallet.disconnect();
            // Clear the current wallet after disconnection
            set({ currentWallet: null });
          } catch (e) {
            console.log("No existing connection to disconnect");
          }
        }

        // Check if wallet is installed
        if (wallet.readyState !== WalletReadyState.Installed) {
          throw new Error("Please install Phantom wallet to continue");
        }

        // Connect with user interaction
        await wallet.connect();

        if (wallet.publicKey) {
          // Wait for wallet to be fully initialized
          await new Promise((resolve) => setTimeout(resolve, 100));

          const network = get().network; // Use the current network setting
          const defaultEndpoint = `https://api.${network}.solana.com`;
          const connection = new Connection(defaultEndpoint);

          await AsyncStorage.setItem(CONNECTED_KEY, "true");
          set({
            publicKey: wallet.publicKey,
            connected: true,
            currentWallet: wallet,
            network,
            connection,
          });
        }
      } else {
        await transact(async (wallet) => {
          try {
            const authResult = await wallet.authorize({
              cluster: get().network,
              identity: {
                name: "SocialFi",
                uri: "https://socialfi.app",
                icon: "https://socialfi.app/icon.png",
              },
            });

            set({
              publicKey: new PublicKey(authResult.accounts[0].address),
              connected: true,
            });
          } catch (error) {
            throw new Error("Failed to authorize wallet access");
          }
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      set({ connecting: false });
    }
  },

  disconnect: async () => {
    const { currentWallet } = get();

    if (Platform.OS === "web" && currentWallet) {
      try {
        await currentWallet.disconnect();
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    }

    // Clear all wallet-related storage
    await AsyncStorage.multiRemove([CONNECTED_KEY, NETWORK_KEY]);

    set({
      publicKey: null,
      connected: false,
      currentWallet: null,
      network: "devnet", // Reset to default network
    });
  },
}));
