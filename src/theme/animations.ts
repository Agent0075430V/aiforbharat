import { Easing } from 'react-native';

export const durations = {
  instant: 80,
  fast: 150,
  normal: 220,
  slow: 320,
  slower: 450,
} as const;

// Note: Easing.bezier creates worklet functions in react-native-reanimated;
// for screen-level animations use Easing directly from react-native-reanimated
// in the component file. These are kept as lazy getters to avoid module-load-time worklet creation.
export const easing = {
  get standard() { return Easing.bezier(0.2, 0.8, 0.2, 1); },
  get decel() { return Easing.bezier(0.05, 0.7, 0.1, 1); },
  get accel() { return Easing.bezier(0.3, 0, 0.8, 0.15); },
};

export const motion = {
  durations,
  press: {
    scalePressed: 0.97,
    scaleRest: 1,
    opacityPressed: 0.85,
    duration: durations.fast,
  },
  hover: {
    scale: 1.02,
    duration: durations.normal,
  },
  entry: {
    fadeUpOffset: 12,
    staggerMs: 50,
    duration: durations.normal,
  },
  voiceOrb: {
    minScale: 0.95,
    maxScale: 1.05,
    durationMs: 2000,
  },
  scoreReveal: {
    durationMs: 1200,
  },
  calendarFill: {
    itemStaggerMs: 80,
  },
  chartDraw: {
    durationMs: 900,
  },
  shimmer: {
    durationMs: 1400,
  },
} as const;

export type Durations = typeof durations;
export type Motion = typeof motion;

export default {
  durations,
  easing,
  motion,
};
