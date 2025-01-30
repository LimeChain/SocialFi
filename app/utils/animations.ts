import { withSequence, withSpring, withDelay } from "react-native-reanimated";

export const springConfig = {
  mass: 0.5,
  damping: 12,
  stiffness: 100,
};

export const createStaggeredAnimation = (index: number, duration = 100) => {
  return {
    transform: [
      {
        translateY: withDelay(index * duration, withSpring(0, springConfig)),
      },
    ],
    opacity: withDelay(index * duration, withSpring(1, springConfig)),
  };
};

export const createPressAnimation = (pressed: boolean, scale = 0.95) => {
  return {
    transform: [
      {
        scale: withSpring(pressed ? scale : 1, {
          mass: 0.3,
          damping: 12,
        }),
      },
    ],
  };
};
