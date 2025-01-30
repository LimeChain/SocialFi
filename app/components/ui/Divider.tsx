import React from "react";
import { View, ViewProps } from "react-native";

interface DividerProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
}

export const Divider = ({
  orientation = "horizontal",
  spacing = "md",
  className,
  ...props
}: DividerProps) => {
  const spacingStyles = {
    none: "my-0",
    sm: orientation === "horizontal" ? "my-2" : "mx-2",
    md: orientation === "horizontal" ? "my-4" : "mx-4",
    lg: orientation === "horizontal" ? "my-6" : "mx-6",
  };

  return (
    <View
      className={`bg-gray-200 ${
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full"
      } ${spacingStyles[spacing]} ${className || ""}`}
      {...props}
    />
  );
};
