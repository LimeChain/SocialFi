import React from "react";
import { View, Text, ViewProps } from "react-native";

interface BadgeProps extends ViewProps {
  variant?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  label: string;
}

export const Badge = ({
  variant = "primary",
  size = "md",
  label,
  className,
  ...props
}: BadgeProps) => {
  const variantStyles = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    error: "bg-red-100 text-red-600",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <View
      className={`rounded-full ${variantStyles[variant]} ${className || ""}`}
      {...props}
    >
      <Text
        className={`font-medium ${sizeStyles[size]} ${
          variantStyles[variant].split(" ")[1]
        }`}
      >
        {label}
      </Text>
    </View>
  );
};
