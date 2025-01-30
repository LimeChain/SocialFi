import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function TabLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
        },
        headerTitleStyle: {
          color: isDark ? "#FFFFFF" : "#000000",
        },
        tabBarStyle: {
          backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
          borderTopColor: isDark ? "#333333" : "#E5E5E5",
        },
        tabBarActiveTintColor: isDark ? "#7B4DFF" : "#512DA8",
        tabBarInactiveTintColor: isDark ? "#AAAAAA" : "#666666",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="presale"
        options={{
          title: "Presale",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="trade"
        options={{
          title: "Trade",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="launch"
        options={{
          title: "Launch",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="rocket" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
