import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./ui/Card";
import { useRouter } from "expo-router";

interface TrendingItem {
  type: "token" | "trade" | "social";
  symbol?: string;
  name?: string;
  logoURI?: string;
  priceChange?: number;
  volume?: number;
  description?: string;
  engagement?: number;
}

const FILTER_OPTIONS = ["All", "Social", "Gaming", "DeFi", "NFT"];
const TIME_RANGES = ["24h", "7d", "30d", "1y"];

export const TrendingList = () => {
  // Mock data - would come from an API/store in real implementation
  const trendingItems: TrendingItem[] = [
    {
      type: "token",
      symbol: "SOL",
      name: "Solana",
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      priceChange: 5.2,
      volume: 1500000,
    },
    {
      type: "token",
      symbol: "JTO",
      name: "Jito",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/24899.png",
      priceChange: 8.7,
      volume: 2100000,
    },
    {
      type: "trade",
      symbol: "BONK",
      name: "Bonk",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
      priceChange: 12.5,
      volume: 890000,
    },
    {
      type: "trade",
      symbol: "PYTH",
      name: "Pyth Network",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/16595.png",
      priceChange: -3.2,
      volume: 750000,
    },
    {
      type: "social",
      description: "New DeFi protocol launch",
      engagement: 1200,
    },
    {
      type: "social",
      description: "Major NFT collection reveal",
      engagement: 2500,
    },
    {
      type: "token",
      symbol: "ORCA",
      name: "Orca",
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png",
      priceChange: 15.3,
      volume: 980000,
    },
    {
      type: "social",
      description: "Solana network upgrade announcement",
      engagement: 5000,
    },
    {
      type: "trade",
      symbol: "MANGO",
      name: "Mango Markets",
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac/token.png",
      priceChange: 7.8,
      volume: 650000,
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGES[0]);
  const router = useRouter();

  const filteredItems = trendingItems
    .filter((item) => {
      if (selectedFilter === "All") return true;
      if (selectedFilter === "Social") return item.type === "social";
      if (selectedFilter === "Gaming")
        return item.type === "token" || item.type === "trade";
      if (selectedFilter === "DeFi")
        return item.type === "token" || item.type === "trade";
      if (selectedFilter === "NFT")
        return item.type === "token" || item.type === "trade";
      return false;
    })
    .sort((a, b) => {
      if (selectedFilter !== "All") return 0;

      // Define type priority
      const typePriority = {
        token: 1,
        trade: 2,
        social: 3,
      };

      // Sort by type first
      return typePriority[a.type] - typePriority[b.type];
    });

  const renderTrendingItem = ({ item }: { item: TrendingItem }) => {
    if (item.type === "token" || item.type === "trade") {
      return (
        <Card>
          <View className="flex-row items-center">
            <Image
              source={{ uri: item.logoURI }}
              className="w-10 h-10 rounded-full"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold text-text-primary">
                {item.symbol}
              </Text>
              <Text className="text-sm text-text-secondary">{item.name}</Text>
            </View>
            <View className="items-end">
              <Text
                className={`text-sm font-medium ${
                  item.priceChange && item.priceChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.priceChange && item.priceChange >= 0 ? "+" : ""}
                {item.priceChange?.toFixed(2)}%
              </Text>
              <Text className="text-base font-semibold text-text-primary">
                Vol: ${item.volume ? (item.volume / 1000000).toFixed(2) : "N/A"}
                M
              </Text>
            </View>
          </View>
        </Card>
      );
    }

    return (
      <Card>
        <View className="flex-row items-center">
          <Ionicons name="trending-up" size={24} color="#512DA8" />
          <View className="flex-1">
            <Text className="text-lg font-bold text-text-primary">
              {item.description}
            </Text>
            <Text className="text-base font-semibold text-text-primary">
              {item.engagement} engagements
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View className="flex-1">
      <View className="flex-row px-4 py-2 border-b border-gray-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {FILTER_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => setSelectedFilter(option)}
              className={`px-3 py-1.5 rounded-full mr-2 ${
                selectedFilter === option ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm ${
                  selectedFilter === option ? "text-white" : "text-gray-600"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row ml-2.5"
        >
          {TIME_RANGES.map((range) => (
            <Pressable
              key={range}
              onPress={() => setSelectedTimeRange(range)}
              className={`px-3 py-1.5 rounded-full mr-2 ${
                selectedTimeRange === range ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm ${
                  selectedTimeRange === range ? "text-white" : "text-gray-600"
                }`}
              >
                {range}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderTrendingItem}
        keyExtractor={(_, index) => index.toString()}
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
