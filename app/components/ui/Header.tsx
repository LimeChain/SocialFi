import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/providers/ThemeProvider";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export const Header = ({
  title,
  showBack = true,
  rightElement,
}: HeaderProps) => {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-row items-center justify-between p-4 border-b ${
        isDark
          ? "bg-dark-secondary border-gray-800"
          : "bg-white border-gray-100"
      }`}
    >
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity className="mr-3" onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDark ? "#FFFFFF" : "#000000"}
            />
          </TouchableOpacity>
        )}
        <Text
          className={`text-lg font-semibold ${
            isDark ? "text-dark-text-primary" : "text-text-primary"
          }`}
        >
          {title}
        </Text>
      </View>
      {rightElement && (
        <View className="flex-row items-center">{rightElement}</View>
      )}
    </View>
  );
};
