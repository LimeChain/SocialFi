import React from "react";
import { View } from "react-native";
import { Header } from "@/app/components/ui/Header";
import { ProfileView } from "@/app/components/ProfileView";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

export default function MyProfileScreen() {
  return (
    <View className="flex-1">
      <Header
        title="My Profile"
        showBack={false}
        rightElement={<ThemeToggle />}
      />
      <ProfileView />
    </View>
  );
}
