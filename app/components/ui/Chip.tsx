import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
  variant?: "filled" | "outlined";
}

export const Chip = ({
  label,
  selected = false,
  variant = "filled",
  className,
  ...props
}: ChipProps) => {
  const baseStyles = "px-4 py-1.5 rounded-full";
  const variantStyles = {
    filled: selected ? "bg-primary" : "bg-gray-100",
    outlined: selected
      ? "bg-primary border border-primary"
      : "bg-transparent border border-gray-300",
  };
  const textStyles = selected
    ? "text-white font-medium"
    : "text-text-secondary";

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
      {...props}
    >
      <Text className={`text-sm ${textStyles}`}>{label}</Text>
    </TouchableOpacity>
  );
};
