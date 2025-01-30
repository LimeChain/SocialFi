import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useWalletStore } from "@/app/stores/WalletStore";
import { AnimatedButton } from "@/app/components/ui/AnimatedButton";
import { AnimatedCard } from "@/app/components/ui/AnimatedCard";
import { useTheme } from "@/app/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export default function AuthScreen() {
  const router = useRouter();
  const {
    connectWallet,
    connecting,
    connected,
    publicKey,
    loadPersistedConnection,
  } = useWalletStore();
  const { isDark } = useTheme();

  useEffect(() => {
    loadPersistedConnection();
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      router.replace("/(tabs)/home");
    }
  }, [connected, publicKey]);

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getButtonLabel = () => {
    if (connected && publicKey) {
      return `Connected: ${formatAddress(publicKey.toString())}`;
    }
    if (connecting) {
      return "Connecting...";
    }
    return "Connect Wallet";
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-surface">
      <LinearGradient
        colors={[
          isDark ? "rgba(123, 77, 255, 0.1)" : "rgba(81, 45, 168, 0.1)",
          isDark ? "rgba(123, 77, 255, 0.05)" : "rgba(81, 45, 168, 0.05)",
          "transparent",
        ]}
        className="absolute top-0 left-0 right-0 h-96"
      />

      <View className="flex-1 px-6 pt-12">
        <View className="items-center mb-12">
          <View className="w-24 h-24 mb-4 items-center justify-center bg-primary/10 rounded-full">
            <Ionicons
              name="wallet-outline"
              size={48}
              color={isDark ? "#7B4DFF" : "#512DA8"}
            />
          </View>
          <Text className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
            SocialFi
          </Text>
          <Text className="text-base text-text-secondary dark:text-dark-text-secondary text-center">
            Connect with the decentralized social network
          </Text>
        </View>

        <View className="space-y-4 mb-12">
          <AnimatedCard index={0}>
            <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
              Social Tokens
            </Text>
            <Text className="text-base text-text-secondary dark:text-dark-text-secondary">
              Launch your personal token and build your community
            </Text>
          </AnimatedCard>

          <AnimatedCard index={1}>
            <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
              Decentralized
            </Text>
            <Text className="text-base text-text-secondary dark:text-dark-text-secondary">
              Own your content and data on the blockchain
            </Text>
          </AnimatedCard>

          <AnimatedCard index={2}>
            <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
              Earn
            </Text>
            <Text className="text-base text-text-secondary dark:text-dark-text-secondary">
              Get rewarded for your contributions and engagement
            </Text>
          </AnimatedCard>
        </View>

        <AnimatedButton
          variant="primary"
          size="lg"
          label={getButtonLabel()}
          className="w-full"
          onPress={handleConnectWallet}
          disabled={connecting || connected}
        />
      </View>
    </SafeAreaView>
  );
}
