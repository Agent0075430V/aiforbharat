export const colors = {
  background: {
    void: '#060608', // --void
    base: '#0C0C0F', // --base
    surface: '#131316', // --surface
    elevated: '#1A1A1F', // --elevated
    glass: 'rgba(255,255,255,0.03)', // --glass
    glassHover: 'rgba(255,255,255,0.06)', // --glass-hover
  },
  gold: {
    pure: '#C8A96E', // --gold-pure
    light: '#E2C98A', // --gold-light
    dim: '#6B5A38', // --gold-dim
    glow: 'rgba(200,169,110,0.15)', // --gold-glow
    glowStrong: 'rgba(200,169,110,0.35)', // --gold-glow-strong
  },
  teal: {
    pure: '#0DC9A4', // --teal-pure
    light: '#3DD9B8', // --teal-light
    dim: 'rgba(13,201,164,0.12)', // --teal-dim
    glow: 'rgba(13,201,164,0.22)', // --teal-glow
  },
  semantic: {
    success: '#22C55E', // --success
    warning: '#F5A623', // --warning
    error: '#EF4444', // --error
    info: '#60A5FA', // --info
  },
  text: {
    primary: '#EDE8E0', // --text-primary
    secondary: '#9A9590', // --text-secondary
    muted: '#5A5750', // --text-muted
    gold: '#C8A96E', // --text-gold
    teal: '#0DC9A4', // --text-teal
  },
  border: {
    hair: 'rgba(237,232,224,0.05)', // --border-hair
    subtle: 'rgba(237,232,224,0.09)', // --border-subtle
    default: 'rgba(237,232,224,0.14)', // --border-default
    gold: 'rgba(200,169,110,0.28)', // --border-gold
    active: 'rgba(200,169,110,0.55)', // --border-active
  },
  platform: {
    instagram: '#E1306C',
    youtube: '#FF0000',
    linkedin: '#0A66C2',
    tiktok: '#69C9D0',
    twitter: '#1DA1F2',
  },
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
} as const;

export type Colors = typeof colors;

export default colors;
