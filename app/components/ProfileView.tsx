import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useProfileStore } from "@/app/stores/ProfileStore";
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { FollowList } from "./FollowList";
import { ActivityFeed } from "./ActivityFeed";

export const ProfileView = () => {
  const { id } = useLocalSearchParams();
  const {
    profiles,
    following,
    followers,
    followUser,
    unfollowUser,
    loadProfile,
  } = useProfileStore();

  useEffect(() => {
    // Load mock profile data if not loaded
    if (Object.keys(profiles).length === 0) {
      loadProfile({
        publicKey: "myProfile",
        username: "Demo User",
        bio: "Web3 Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        followersCount: 1242,
        followingCount: 890,
        tokenBalance: 1000,
        tokenSymbol: "SOCIAL",
        stakedAmount: 500,
      });
    }
  }, []);

  const profile = id ? profiles[id as string] : profiles["myProfile"];
  const isFollowing = following.includes(profile?.publicKey || "");
  const isOwnProfile = !id;

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-text-secondary">Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <Avatar size="lg" source={profile.avatar} />
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
              {profile.username}
            </Text>
            <Text className="text-base text-text-secondary dark:text-dark-text-secondary">
              {profile.bio}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-around mb-6">
          <View className="items-center">
            <Text className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
              {profile.followingCount}
            </Text>
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              Following
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
              {profile.followersCount}
            </Text>
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              Followers
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
              {profile.tokenBalance}
            </Text>
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              {profile.tokenSymbol}
            </Text>
          </View>
        </View>

        <Card className="mb-6">
          <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">
            Token Stats
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              Staked Amount
            </Text>
            <Text className="text-text-primary dark:text-dark-text-primary font-semibold">
              {profile.stakedAmount} {profile.tokenSymbol}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              APR
            </Text>
            <Text className="text-text-primary dark:text-dark-text-primary font-semibold">
              12.5%
            </Text>
          </View>
        </Card>

        {!isOwnProfile && (
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            label={isFollowing ? "Following" : "Follow"}
            onPress={() =>
              isFollowing
                ? unfollowUser(profile.publicKey)
                : followUser(profile.publicKey)
            }
            className="mb-6"
          />
        )}

        <Card className="mb-6">
          <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
            Recent Activity
          </Text>
          <ActivityFeed publicKey={profile.publicKey} showTitle={false} />
        </Card>
      </View>
    </ScrollView>
  );
};
