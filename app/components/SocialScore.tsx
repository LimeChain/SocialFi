import React from "react";
import { View, Text } from "react-native";
import { Card } from "./ui/Card";
import { useTokenStore } from "@/app/stores/TokenStore";
import { useProfileStore } from "@/app/stores/ProfileStore";

export const SocialScore = ({ publicKey }: { publicKey: string }) => {
  const { tokens } = useTokenStore();
  const { currentProfile } = useProfileStore();

  // Calculate social score based on multiple factors
  const calculateScore = () => {
    const holdingsScore =
      tokens.reduce((acc, token) => acc + (token.balance?.amount || 0), 0) /
      1000;
    const followersScore = (currentProfile?.followersCount || 0) * 10;
    const baseScore = Math.min(holdingsScore + followersScore, 100);
    return Math.round(baseScore);
  };

  return (
    <View className="p-4">
      <Card className="p-4">
        <Text className="text-xl font-bold text-text-primary mb-2">
          Social Score
        </Text>
        <Text className="text-4xl font-bold text-primary mb-4">
          {calculateScore()}
        </Text>
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-sm text-text-secondary mb-1">Engagement</Text>
            <Text className="text-base font-semibold text-text-primary">
              92%
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-text-secondary mb-1">Influence</Text>
            <Text className="text-base font-semibold text-text-primary">
              78%
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-text-secondary mb-1">Activity</Text>
            <Text className="text-base font-semibold text-text-primary">
              85%
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};
