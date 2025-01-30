import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as web3 from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import { encode, decode } from "bs58";

interface AuthState {
  wallet: Keypair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  createWallet: () => Promise<void>;
  loadWallet: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  wallet: null,
  isAuthenticated: false,
  isLoading: true,

  createWallet: async () => {
    try {
      const wallet = web3.Keypair.generate();
      const privateKeyString = encode(wallet.secretKey);

      await AsyncStorage.setItem("wallet_private_key", privateKeyString);

      set({
        wallet,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
      set({ isLoading: false });
    }
  },

  loadWallet: async () => {
    try {
      const privateKeyString = await AsyncStorage.getItem("wallet_private_key");

      if (privateKeyString) {
        const secretKey = decode(privateKeyString);
        const wallet = web3.Keypair.fromSecretKey(secretKey);

        set({
          wallet,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      await AsyncStorage.removeItem("wallet_private_key");
      set({
        wallet: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },
}));
