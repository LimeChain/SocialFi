import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/app/providers/ThemeProvider";
import { createPressAnimation } from "@/app/utils/animations";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  label: string;
}

export const AnimatedButton = ({
  variant = "primary",
  size = "md",
  label,
  className,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedButtonProps) => {
  const { isDark } = useTheme();
  const pressed = useSharedValue(false);

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

  const animatedStyle = useAnimatedStyle(() => {
    return createPressAnimation(pressed.value);
  });

  return (
    <AnimatedTouchable
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        className || ""
      }`}
      style={animatedStyle}
      onPressIn={(e) => {
        pressed.value = true;
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = false;
        onPressOut?.(e);
      }}
      {...props}
    >
      <Text className={`${textStyles[variant]} ${textSizeStyles[size]}`}>
        {label}
      </Text>
    </AnimatedTouchable>
  );
};
