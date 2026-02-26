import { colors } from './colors';

export const gradients = {
  goldVertical: {
    colors: [colors.gold.dim, colors.gold.pure, colors.gold.light],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  tealVertical: {
    colors: [colors.teal.pure, colors.teal.light],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  editorialBackground: {
    colors: [colors.background.base, colors.background.void],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  voiceOrbRing: {
    colors: [colors.gold.light, colors.teal.pure, colors.gold.pure],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  homeHeroGlow: {
    colors: [colors.gold.glow, colors.teal.glow],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

export type Gradients = typeof gradients;

export default gradients;
