import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "@/app/providers/ThemeProvider";

export const Card = ({ children, className, ...props }: ViewProps) => {
  const { isDark } = useTheme();

  return (
    <View
      className={`p-4 rounded-lg mb-4 ${
        isDark ? "bg-dark-secondary" : "bg-secondary"
      } ${className || ""}`}
      {...props}
    >
      {children}
    </View>
  );
};
