import { View } from "react-native";
import { Stack } from "expo-router";
import { Header } from "@/app/components/ui/Header";
import { ProfileView } from "@/app/components/ProfileView";

export default function ProfileScreen() {
  return (
    <View className="flex-1">
      <Header title="Profile" />
      <ProfileView />
    </View>
  );
}
