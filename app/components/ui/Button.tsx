import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { useTheme } from "@/app/providers/ThemeProvider";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  label: string;
}

export const Button = ({
  variant = "primary",
  size = "md",
  label,
  className,
  ...props
}: ButtonProps) => {
  const { isDark } = useTheme();

  const baseStyles = "rounded-lg items-center justify-center";
  const variantStyles = {
    primary: "bg-primary",
    secondary: isDark ? "bg-dark-secondary" : "bg-gray-100",
  };
  const sizeStyles = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };
  const textStyles = {
    primary: "text-white font-semibold",
    secondary: isDark ? "text-dark-text-primary" : "text-text-primary",
  };
  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        className || ""
      }`}
      {...props}
    >
      <Text className={`${textStyles[variant]} ${textSizeStyles[size]}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
