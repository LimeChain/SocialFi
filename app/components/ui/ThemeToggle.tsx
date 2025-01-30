import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/providers/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, isDark, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(isDark ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <TouchableOpacity className="p-2 rounded-full" onPress={toggleTheme}>
      <Ionicons
        name={isDark ? "sunny" : "moon"}
        size={24}
        color={isDark ? "#FFFFFF" : "#000000"}
      />
    </TouchableOpacity>
  );
};
