import React from "react";
import { View, ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/app/providers/ThemeProvider";
import { createStaggeredAnimation } from "@/app/utils/animations";

const AnimatedView = Animated.createAnimatedComponent(View);

interface AnimatedCardProps extends ViewProps {
  entering?: boolean;
  index?: number;
  duration?: number;
}

export const AnimatedCard = ({
  children,
  entering = true,
  index = 0,
  duration = 100,
  className,
  ...props
}: AnimatedCardProps) => {
  const { isDark } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    if (!entering) return {};

    return createStaggeredAnimation(index, duration);
  });

  return (
    <AnimatedView
      className={`p-4 rounded-lg mb-4 ${
        isDark ? "bg-dark-secondary" : "bg-secondary"
      } ${className || ""}`}
      style={[
        entering && { transform: [{ translateY: 50 }], opacity: 0 },
        animatedStyle,
      ]}
      {...props}
    >
      {children}
    </AnimatedView>
  );
};
