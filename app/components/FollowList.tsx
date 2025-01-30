import React from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from "./ui/Avatar";
import { Card } from "./ui/Card";
import { AnimatedPressable } from "./ui/AnimatedPressable";

interface FollowListProps {
  type: "followers" | "following";
  data: Array<{
    publicKey: string;
    username: string;
    avatar?: string;
  }>;
}

export const FollowList = ({ type, data }: FollowListProps) => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <AnimatedPressable
      className="mb-4"
      onPress={() => router.push(`/profile/${item.publicKey}`)}
    >
      <Card className="flex-row items-center p-4">
        <Avatar source={item.avatar} size="md" className="mr-3" />
        <View className="flex-1">
          <Text className="text-base font-semibold text-text-primary">
            {item.username}
          </Text>
          <Text className="text-sm text-text-secondary">
            {item.publicKey.slice(0, 4)}...{item.publicKey.slice(-4)}
          </Text>
        </View>
      </Card>
    </AnimatedPressable>
  );

  return (
    <View className="flex-1 bg-white">
      <Text className="text-xl font-bold text-text-primary px-4 py-3">
        {type === "followers" ? "Followers" : "Following"}
      </Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.publicKey}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
