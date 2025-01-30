import React from "react";
import { View, ActivityIndicator, ViewProps } from "react-native";

interface LoadingProps extends ViewProps {
  size?: "small" | "large";
  color?: string;
}

export const Loading = ({
  size = "large",
  color = "#512DA8",
  className,
  ...props
}: LoadingProps) => {
  return (
    <View
      className={`flex-1 items-center justify-center ${className || ""}`}
      {...props}
    >
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
