import { View, Text } from "react-native";
import { useWalletStore } from "@/app/stores/WalletStore";
import { TrendingList } from "@/app/components/TrendingList";
import { useState } from "react";

const FILTER_OPTIONS = ["All", "Social", "Gaming", "DeFi", "NFT"];
const TIME_RANGES = ["24h", "7d", "30d", "1y"];

export default function HomeScreen() {
  const { publicKey, network } = useWalletStore();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-5 pt-15 border-b border-gray-200">
        <Text className="text-2xl font-bold">Trending</Text>
        {publicKey && (
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-gray-600">
              {formatAddress(publicKey.toString())}
            </Text>
            <Text className="text-sm text-gray-600 ml-1">{network}</Text>
          </View>
        )}
      </View>

      <TrendingList />
    </View>
  );
}
