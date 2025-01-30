import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedPressableProps extends TouchableOpacityProps {
  scale?: number;
}

export const AnimatedPressable = ({
  children,
  scale = 0.95,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps) => {
  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(pressed.value ? scale : 1, {
            mass: 0.3,
            damping: 12,
          }),
        },
      ],
    };
  });

  return (
    <AnimatedTouchable
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
      {children}
    </AnimatedTouchable>
  );
};
