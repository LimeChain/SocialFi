import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Ionicons as IconsType } from "@expo/vector-icons/build/Icons";
import { useTheme } from "@/app/providers/ThemeProvider";

interface IconButtonProps extends TouchableOpacityProps {
  name: keyof typeof IconsType;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
}

export const IconButton = ({
  name,
  size = "md",
  variant = "primary",
  className,
  ...props
}: IconButtonProps) => {
  const { isDark } = useTheme();

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

  const variantStyles = {
    primary: "bg-primary",
    secondary: isDark ? "bg-dark-secondary" : "bg-gray-100",
    ghost: "bg-transparent",
  };

  const iconColors = {
    primary: "#fff",
    secondary: isDark ? "#7B4DFF" : "#512DA8",
    ghost: isDark ? "#7B4DFF" : "#512DA8",
  };

  return (
    <TouchableOpacity
      className={`${
        sizeStyles[size]
      } rounded-full items-center justify-center ${variantStyles[variant]} ${
        className || ""
      }`}
      {...props}
    >
      <Ionicons
        name={name}
        size={iconSizes[size]}
        color={iconColors[variant]}
      />
    </TouchableOpacity>
  );
};
