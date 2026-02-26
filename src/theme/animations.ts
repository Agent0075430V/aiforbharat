import { Easing } from 'react-native-reanimated';

export const durations = {
  instant: 80,
  fast: 150,
  normal: 220,
  slow: 320,
  slower: 450,
} as const;

export const easing = {
  standard: Easing.bezier(0.2, 0.8, 0.2, 1),
  decel: Easing.bezier(0.05, 0.7, 0.1, 1),
  accel: Easing.bezier(0.3, 0, 0.8, 0.15),
} as const;

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
