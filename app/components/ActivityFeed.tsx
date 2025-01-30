import React from "react";
import { View, Text, FlatList, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./ui/Card";
import { useTheme } from "@/app/providers/ThemeProvider";

interface ActivityFeedProps {
  publicKey?: string;
  showTitle?: boolean;
}

interface Activity {
  type: "trade" | "follow" | "stake" | "vote" | "reward";
  description: string;
  timestamp: Date;
  txHash?: string;
  tokenAmount?: number;
  tokenSymbol?: string;
  actor?: string;
  target?: string;
}

export const ActivityFeed = ({
  publicKey,
  showTitle = true,
}: ActivityFeedProps) => {
  const { isDark } = useTheme();

  // Mock activities - would come from blockchain indexer in real implementation
  const activities: Activity[] = [
    {
      type: "stake",
      description: "Staked 500 SOCIAL in Governance Pool",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      txHash: "5D4Ld...8Xpq",
      tokenAmount: 500,
      tokenSymbol: "SOCIAL",
    },
    {
      type: "reward",
      description: "Received 25 SOCIAL from staking rewards",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      txHash: "7G9Kp...2Wrt",
      tokenAmount: 25,
      tokenSymbol: "SOCIAL",
    },
    {
      type: "follow",
      description: "Started following @alice_sol",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      txHash: "3H7Jm...9Yth",
      actor: "myProfile",
      target: "alice_sol",
    },
    {
      type: "vote",
      description: "Voted on Proposal #23: Token Distribution",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      txHash: "9K2Np...4Rth",
    },
    {
      type: "trade",
      description: "Bought 1000 SOCIAL tokens",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      txHash: "2F5Hp...7Qth",
      tokenAmount: 1000,
      tokenSymbol: "SOCIAL",
    },
    {
      type: "reward",
      description: "Earned 50 SOCIAL for content creation",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      txHash: "6M8Jp...1Wth",
      tokenAmount: 50,
      tokenSymbol: "SOCIAL",
    },
  ];

  const filteredActivities = publicKey
    ? activities.filter(
        (activity) =>
          activity.actor === publicKey ||
          activity.target === publicKey ||
          activity.txHash?.includes(publicKey)
      )
    : activities;

  const renderIcon = (type: Activity["type"]) => {
    const icons = {
      trade: "swap-horizontal",
      follow: "people",
      stake: "lock-closed",
      vote: "checkbox",
      reward: "trophy",
    };

    return icons[type];
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <Card className="flex-row items-start p-3">
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
        <Ionicons
          name={renderIcon(item.type)}
          size={24}
          color={isDark ? "#7B4DFF" : "#512DA8"}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-text-primary dark:text-dark-text-primary mb-1">
          {item.description}
        </Text>
        <Text className="text-xs text-text-secondary dark:text-dark-text-secondary">
          {formatTimeAgo(item.timestamp)}
        </Text>
      </View>
      <TouchableOpacity
        className="bg-gray-100 px-3 py-1.5 rounded-full"
        onPress={() => Linking.openURL(`https://solscan.io/tx/${item.txHash}`)}
      >
        <Text className="text-xs text-primary">View</Text>
      </TouchableOpacity>
    </Card>
  );

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <View className="flex-1 bg-white">
      {showTitle && (
        <Text className="text-2xl font-bold mb-6 text-text-primary px-4">
          Activity
        </Text>
      )}
      <FlatList
        data={filteredActivities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.txHash || item.timestamp.toString()}
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
