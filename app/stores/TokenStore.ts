import { create } from "zustand";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWalletStore } from "@/app/stores/WalletStore";

// Define the TOKEN_PROGRAM_ID constant
const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
}

interface TokenBalance {
  amount: number;
  decimals: number;
}

interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: TokenBalance;
}

interface TokenState {
  tokens: TokenInfo[];
  popularTokens: Token[];
  userBalances: { [key: string]: number };
  selectedInputToken: TokenInfo | null;
  selectedOutputToken: TokenInfo | null;
  loading: boolean;
  fetchTokens: () => Promise<void>;
  fetchUserBalances: () => Promise<void>;
  setSelectedInputToken: (token: TokenInfo | null) => void;
  setSelectedOutputToken: (token: TokenInfo | null) => void;
  fetchTokenBalances: (
    connection: Connection,
    publicKey: PublicKey
  ) => Promise<void>;
  getFormattedBalance: (token: TokenInfo) => string;
}

// Common tokens on Solana Devnet
const POPULAR_TOKENS: Token[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Devnet USDC
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  // Add more popular tokens as needed
];

export const useTokenStore = create<TokenState>((set, get) => ({
  tokens: [],
  popularTokens: POPULAR_TOKENS,
  userBalances: {},
  selectedInputToken: null,
  selectedOutputToken: null,
  loading: false,

  fetchTokens: async () => {
    try {
      set({ loading: true });
      const { network } = useWalletStore.getState();

      // Use Jupiter's token list API with network parameter
      const response = await fetch(
        `https://token.jup.ag/strict${
          network === "mainnet-beta" ? "" : "?env=devnet"
        }`
      );

      const tokens: Token[] = await response.json();

      // Update the tokens list with available tokens for the current network
      set({
        tokens,
        // Update popular tokens to match available tokens
        popularTokens: POPULAR_TOKENS.map((popularToken) => {
          const matchingToken = tokens.find(
            (t) => t.symbol === popularToken.symbol
          );
          return matchingToken || popularToken;
        }),
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching tokens:", error);
      set({ loading: false });
    }
  },

  fetchUserBalances: async () => {
    const { connection } = useWalletStore.getState();
    const { publicKey } = useWalletStore.getState();

    if (!publicKey) return;

    try {
      set({ loading: true });
      // Implement token balance fetching logic here
      // This is a placeholder for now
      set({ loading: false });
    } catch (error) {
      console.error("Error fetching balances:", error);
      set({ loading: false });
    }
  },

  setSelectedInputToken: (token) => set({ selectedInputToken: token }),
  setSelectedOutputToken: (token) => set({ selectedOutputToken: token }),

  fetchTokenBalances: async (connection: Connection, publicKey: PublicKey) => {
    set({ loading: true });
    try {
      // Fetch SOL balance first
      const solBalance = await connection.getBalance(publicKey);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Update popular tokens with balances
      const updatedPopularTokens = POPULAR_TOKENS.map((token) => {
        if (token.address === "So11111111111111111111111111111111111111112") {
          return {
            ...token,
            balance: {
              amount: solBalance,
              decimals: 9,
            },
          };
        }
        const tokenAccount = tokenAccounts.value.find(
          (acc) => acc.account.data.parsed.info.mint === token.address
        );
        if (tokenAccount) {
          return {
            ...token,
            balance: {
              amount: Number(
                tokenAccount.account.data.parsed.info.tokenAmount.amount
              ),
              decimals:
                tokenAccount.account.data.parsed.info.tokenAmount.decimals,
            },
          };
        }
        return token;
      });

      const updatedTokens = get().tokens.map((token) => {
        // Handle native SOL
        if (token.address === "So11111111111111111111111111111111111111112") {
          return {
            ...token,
            balance: {
              amount: solBalance,
              decimals: 9, // SOL has 9 decimals
            },
          };
        }

        const tokenAccount = tokenAccounts.value.find(
          (acc) => acc.account.data.parsed.info.mint === token.address
        );

        if (tokenAccount) {
          const balance = {
            amount: Number(
              tokenAccount.account.data.parsed.info.tokenAmount.amount
            ),
            decimals:
              tokenAccount.account.data.parsed.info.tokenAmount.decimals,
          };
          return { ...token, balance };
        }
        return token;
      });

      set({
        tokens: updatedTokens,
        popularTokens: updatedPopularTokens,
      });
    } catch (error) {
      console.error("Error fetching token balances:", error);
    } finally {
      set({ loading: false });
    }
  },

  getFormattedBalance: (token: TokenInfo) => {
    if (!token.balance) return "0.00";
    const balance = token.balance.amount / Math.pow(10, token.balance.decimals);
    return balance.toFixed(
      token.balance.decimals > 4 ? 4 : token.balance.decimals
    );
  },
}));
