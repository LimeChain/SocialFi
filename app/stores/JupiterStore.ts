import { create } from "zustand";
import { PublicKey } from "@solana/web3.js";
import { useWalletStore } from "@/app/stores/WalletStore";
import { QuoteResponse, QuoteResponseSuccess } from "@jup-ag/api";

interface RouteInfo {
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  otherAmountThreshold: string;
  swapMode: string;
}

interface JupiterQuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      inAmount: string;
      outAmount: string;
      inputMint: string;
      outputMint: string;
    };
  }>;
}

interface JupiterState {
  routes: RouteInfo[];
  selectedRoute: RouteInfo | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchRoutes: (
    inputMint: string,
    outputMint: string,
    amount: string,
    slippage?: number
  ) => Promise<void>;
  executeSwap: () => Promise<string>;
}

export const useJupiterStore = create<JupiterState>((set, get) => ({
  routes: [],
  selectedRoute: null,
  loading: false,
  error: null,

  fetchRoutes: async (inputMint, outputMint, amount, slippage = 1) => {
    set({ loading: true, error: null });
    try {
      const { network } = useWalletStore.getState();

      // Check if we're on devnet
      if (network === "devnet") {
        set({
          error:
            "Jupiter swaps are only available on mainnet-beta. Please switch networks to trade.",
        });
        return;
      }

      console.log("Fetching routes with params:", {
        network,
        inputMint,
        outputMint,
        amount,
        slippage,
      });

      const API_BASE = "https://quote-api.jup.ag/v6";

      const searchParams = new URLSearchParams({
        inputMint,
        outputMint,
        amount,
        slippageBps: (slippage * 100).toString(),
      });

      const url = `${API_BASE}/quote?${searchParams.toString()}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error("Failed to fetch routes");
      }

      const data = (await response.json()) as JupiterQuoteResponse;
      console.log("Route data:", data);

      if (data.outAmount) {
        const route = {
          inAmount: data.inAmount,
          outAmount: data.outAmount,
          priceImpactPct: parseFloat(data.priceImpactPct),
          otherAmountThreshold: data.otherAmountThreshold,
          swapMode: data.swapMode,
        };

        set({
          routes: [route],
          selectedRoute: route,
        });
      } else {
        set({ error: "No routes found for this token pair" });
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      set({ error: "Failed to fetch routes" });
    } finally {
      set({ loading: false });
    }
  },

  executeSwap: async () => {
    const { selectedRoute } = get();
    const { publicKey } = useWalletStore.getState();

    if (!selectedRoute || !publicKey) {
      throw new Error("Missing required swap parameters");
    }

    set({ loading: true, error: null });
    try {
      // We'll implement the actual swap in the next step
      // This will involve:
      // 1. Getting a swap instruction from Jupiter API
      // 2. Creating and signing the transaction
      // 3. Sending the transaction
      return "mock_transaction_id";
    } catch (error) {
      console.error("Swap failed:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
