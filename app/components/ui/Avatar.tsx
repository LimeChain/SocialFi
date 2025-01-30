import React from "react";
import { Image, View, ViewProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AvatarProps extends ViewProps {
  size?: "sm" | "md" | "lg";
  source?: string;
  fallback?: string;
}

export const Avatar = ({
  size = "md",
  source,
  fallback,
  className,
  ...props
}: AvatarProps) => {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <View
      className={`${
        sizeStyles[size]
      } rounded-full overflow-hidden bg-gray-100 items-center justify-center ${
        className || ""
      }`}
      {...props}
    >
      {source ? (
        <Image source={{ uri: source }} className="w-full h-full" />
      ) : (
        <Ionicons name="person" size={iconSizes[size]} color="#666" />
      )}
    </View>
  );
};
