import { create } from "zustand";
import { PublicKey } from "@solana/web3.js";
import { useWalletStore } from "@/app/stores/WalletStore";

interface Profile {
  publicKey: string;
  username: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  tokenBalance?: number;
  tokenSymbol?: string;
  stakedAmount?: number;
}

interface ProfileState {
  currentProfile: Profile | null;
  profiles: { [key: string]: Profile };
  followers: string[];
  following: string[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchProfile: (publicKey: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  followUser: (publicKey: string) => Promise<void>;
  unfollowUser: (publicKey: string) => Promise<void>;
  fetchFollowers: (publicKey: string) => Promise<void>;
  fetchFollowing: (publicKey: string) => Promise<void>;
  loadProfile: (profile: Profile) => void;
}

// Mock data for demonstration
const MOCK_PROFILES: { [key: string]: Profile } = {
  mock1: {
    publicKey: "mock1",
    username: "alice_sol",
    avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=alice",
    bio: "Solana developer & DeFi enthusiast",
    followersCount: 1242,
    followingCount: 890,
  },
  mock2: {
    publicKey: "mock2",
    username: "bob_trader",
    avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=bob",
    bio: "Full-time crypto trader | NFT collector",
    followersCount: 2891,
    followingCount: 1204,
  },
  mock3: {
    publicKey: "mock3",
    username: "carol_nft",
    avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=carol",
    bio: "NFT artist | Building on Solana",
    followersCount: 5642,
    followingCount: 2341,
  },
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  currentProfile: null,
  profiles: {},
  followers: [],
  following: [],
  loading: false,
  error: null,

  fetchProfile: async (publicKey: string) => {
    set({ loading: true, error: null });
    try {
      // Use mock data or generate a profile
      const profile = MOCK_PROFILES[publicKey] || {
        publicKey,
        username: `user_${publicKey.slice(0, 6)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${publicKey}`,
        bio: "No bio yet",
        followersCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 1000),
      };

      set((state) => ({
        profiles: {
          ...state.profiles,
          [publicKey]: profile,
        },
        currentProfile: profile,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching profile:", error);
      set({ error: "Failed to fetch profile", loading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    set({ loading: true, error: null });
    try {
      const { publicKey } = useWalletStore.getState();
      if (!publicKey) throw new Error("Wallet not connected");

      // TODO: Replace with actual API call
      const currentProfile = get().profiles[publicKey.toString()];
      const updatedProfile = {
        ...currentProfile,
        ...updates,
      };

      set((state) => ({
        profiles: {
          ...state.profiles,
          [publicKey.toString()]: updatedProfile,
        },
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      set({ error: "Failed to update profile", loading: false });
    }
  },

  followUser: async (targetPublicKey: string) => {
    set({ loading: true, error: null });
    try {
      const { publicKey } = useWalletStore.getState();
      if (!publicKey) throw new Error("Wallet not connected");

      // TODO: Replace with actual API call
      set((state) => ({
        following: [...state.following, targetPublicKey],
        profiles: {
          ...state.profiles,
          [targetPublicKey]: {
            ...state.profiles[targetPublicKey],
            followersCount:
              (state.profiles[targetPublicKey]?.followersCount || 0) + 1,
            isFollowing: true,
          },
        },
        loading: false,
      }));
    } catch (error) {
      console.error("Error following user:", error);
      set({ error: "Failed to follow user", loading: false });
    }
  },

  unfollowUser: async (targetPublicKey: string) => {
    set({ loading: true, error: null });
    try {
      const { publicKey } = useWalletStore.getState();
      if (!publicKey) throw new Error("Wallet not connected");

      // TODO: Replace with actual API call
      set((state) => ({
        following: state.following.filter((pk) => pk !== targetPublicKey),
        profiles: {
          ...state.profiles,
          [targetPublicKey]: {
            ...state.profiles[targetPublicKey],
            followersCount: Math.max(
              (state.profiles[targetPublicKey]?.followersCount || 1) - 1,
              0
            ),
            isFollowing: false,
          },
        },
        loading: false,
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
      set({ error: "Failed to unfollow user", loading: false });
    }
  },

  fetchFollowers: async (publicKey: string) => {
    set({ loading: true, error: null });
    try {
      // Return mock followers
      const mockFollowers = Object.values(MOCK_PROFILES)
        .filter((p) => p.publicKey !== publicKey)
        .map((p) => p.publicKey);

      set({
        followers: mockFollowers,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching followers:", error);
      set({ error: "Failed to fetch followers", loading: false });
    }
  },

  fetchFollowing: async (publicKey: string) => {
    set({ loading: true, error: null });
    try {
      // Return mock following
      const mockFollowing = Object.values(MOCK_PROFILES)
        .filter((p) => p.publicKey !== publicKey)
        .map((p) => p.publicKey);

      set({
        following: mockFollowing,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching following:", error);
      set({ error: "Failed to fetch following", loading: false });
    }
  },

  loadProfile: (profile) =>
    set((state) => ({
      profiles: {
        ...state.profiles,
        [profile.publicKey]: profile,
      },
    })),
}));
