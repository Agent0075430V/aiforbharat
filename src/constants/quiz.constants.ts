import type {
  CreatorArchetype,
  QuizAnswers,
  Tone,
  ContentFormat,
  ContentGoal,
  Platform,
} from '../types/profile.types';
import colors from '../theme/colors';

// ─────────────────────────────────────────────
// Quiz question + option model
// ─────────────────────────────────────────────

export type QuizQuestionId =
  | 'q1_creatorType'
  | 'q2_audienceLocation'
  | 'q3_platforms'
  | 'q4_postingFrequency'
  | 'q5_biggestChallenge'
  | 'q6_tone'
  | 'q7_contentFormats'
  | 'q8_primaryGoal';

export type QuizQuestionType = 'single' | 'multi';

export interface QuizOption<TValue = string> {
  id: string;
  label: string;
  emoji?: string;
  description?: string;
  value: TValue;
}

export interface QuizQuestion<TValue = string> {
  id: QuizQuestionId;
  order: number;
  title: string;
  subtitle?: string;
  type: QuizQuestionType;
  options: QuizOption<TValue>[];
}

// ─────────────────────────────────────────────
// Q1–Q8 definitions (copy of master prompt text)
// ─────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion<any>[] = [
  {
    id: 'q1_creatorType',
    order: 1,
    type: 'single',
    title: 'Which describes you best?',
    options: [
      {
        id: 'performer',
        emoji: '🎭',
        label: "I'm a performer — I live for the camera",
        value: 'performer',
      },
      {
        id: 'educator',
        emoji: '📚',
        label: "I'm an educator — I love sharing knowledge",
        value: 'educator',
      },
      {
        id: 'aspirational',
        emoji: '🌟',
        label: "I'm an aspirational creator — I inspire lifestyles",
        value: 'aspirational',
      },
      {
        id: 'entertainer',
        emoji: '😂',
        label: "I'm an entertainer — if it's not fun, it's not me",
        value: 'entertainer',
      },
    ],
  },
  {
    id: 'q2_audienceLocation',
    order: 2,
    type: 'single',
    title: 'Where does most of your audience live?',
    options: [
      {
        id: 'in_tier1',
        emoji: '🇮🇳',
        label: 'India (Tier 1 cities)',
        value: 'india_tier1',
      },
      {
        id: 'in_tier23',
        emoji: '🇮🇳',
        label: 'India (Tier 2/3 cities)',
        value: 'india_tier2_3',
      },
      {
        id: 'south_asia',
        emoji: '🌍',
        label: 'South Asia',
        value: 'south_asia',
      },
      {
        id: 'global',
        emoji: '🌏',
        label: 'Global Audience',
        value: 'global',
      },
    ],
  },
  {
    id: 'q3_platforms',
    order: 3,
    type: 'multi',
    title: 'What platforms are you on?',
    options: [
      {
        id: 'instagram',
        label: 'Instagram',
        value: 'instagram' satisfies Platform,
      },
      {
        id: 'youtube',
        label: 'YouTube',
        value: 'youtube' satisfies Platform,
      },
      {
        id: 'tiktok',
        label: 'TikTok',
        value: 'tiktok' satisfies Platform,
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        value: 'linkedin' satisfies Platform,
      },
      {
        id: 'twitter',
        label: 'Twitter / X',
        value: 'twitter' satisfies Platform,
      },
    ],
  },
  {
    id: 'q4_postingFrequency',
    order: 4,
    type: 'single',
    title: 'How often do you post currently?',
    options: [
      {
        id: 'daily',
        emoji: '📅',
        label: 'Daily grind — every single day',
        value: 'daily',
      },
      {
        id: 'three_four',
        emoji: '🗓️',
        label: '3–4 times a week',
        value: '3_4_per_week',
      },
      {
        id: 'one_two',
        emoji: '📆',
        label: 'Once or twice a week',
        value: '1_2_per_week',
      },
      {
        id: 'irregular',
        emoji: '🌙',
        label: 'Whenever I feel like it',
        value: 'irregular',
      },
    ],
  },
  {
    id: 'q5_biggestChallenge',
    order: 5,
    type: 'single',
    title: "What's your biggest content challenge?",
    options: [
      {
        id: 'ideas',
        emoji: '💭',
        label: 'Running out of ideas',
        value: 'ideas',
      },
      {
        id: 'captions',
        emoji: '✍️',
        label: 'Writing captions that feel authentic',
        value: 'captions',
      },
      {
        id: 'consistency',
        emoji: '⏰',
        label: 'Staying consistent with posting',
        value: 'consistency',
      },
      {
        id: 'understanding',
        emoji: '📊',
        label: 'Understanding what performs well',
        value: 'understanding',
      },
      {
        id: 'brands',
        emoji: '🤝',
        label: 'Getting brand deals',
        value: 'brands',
      },
    ],
  },
  {
    id: 'q6_tone',
    order: 6,
    type: 'single',
    title: 'What best describes your posting tone?',
    options: [
      {
        id: 'bold_direct',
        emoji: '🔥',
        label: 'Bold & Direct',
        description: 'Example: "Stop doing this. Seriously."',
        value: 'bold_direct' satisfies Tone,
      },
      {
        id: 'warm_relatable',
        emoji: '💫',
        label: 'Warm & Relatable',
        description: 'Example: "Okay I finally tried it and..."',
        value: 'warm_relatable' satisfies Tone,
      },
      {
        id: 'informative_clear',
        emoji: '🧠',
        label: 'Informative & Clear',
        description: 'Example: "Here\'s what nobody tells you:"',
        value: 'informative_clear' satisfies Tone,
      },
      {
        id: 'playful_funny',
        emoji: '😂',
        label: 'Playful & Funny',
        description: 'Example: "POV: you\'re me at 2am thinking—"',
        value: 'playful_funny' satisfies Tone,
      },
    ],
  },
  {
    id: 'q7_contentFormats',
    order: 7,
    type: 'multi',
    title: 'What type of content do you make most?',
    options: [
      {
        id: 'reels',
        emoji: '🎬',
        label: 'Reels / Shorts',
        value: 'reel' satisfies ContentFormat,
      },
      {
        id: 'photos',
        emoji: '📸',
        label: 'Photos',
        value: 'post' satisfies ContentFormat,
      },
      {
        id: 'carousels',
        emoji: '📖',
        label: 'Carousels',
        value: 'carousel' satisfies ContentFormat,
      },
      {
        id: 'stories',
        emoji: '💬',
        label: 'Stories',
        value: 'story' satisfies ContentFormat,
      },
      {
        id: 'podcasts',
        emoji: '🎙️',
        label: 'Podcasts',
        value: 'podcast' satisfies ContentFormat,
      },
      {
        id: 'long_video',
        emoji: '📹',
        label: 'Long Videos',
        value: 'long_video' satisfies ContentFormat,
      },
    ],
  },
  {
    id: 'q8_primaryGoal',
    order: 8,
    type: 'single',
    title: "What's your primary goal for your content?",
    options: [
      {
        id: 'brand_partnerships',
        emoji: '💰',
        label: 'Grow brand partnerships & income',
        value: 'brand_partnerships' satisfies ContentGoal,
      },
      {
        id: 'community_building',
        emoji: '👥',
        label: 'Build a loyal community',
        value: 'community_building' satisfies ContentGoal,
      },
      {
        id: 'thought_leadership',
        emoji: '🌱',
        label: 'Establish myself as a thought leader',
        value: 'thought_leadership' satisfies ContentGoal,
      },
      {
        id: 'creative_expression',
        emoji: '🎨',
        label: 'Express my creativity',
        value: 'creative_expression' satisfies ContentGoal,
      },
    ],
  },
];

// ─────────────────────────────────────────────
// Archetypes definitions
// ─────────────────────────────────────────────

export interface ArchetypeDefinition {
  id: CreatorArchetype;
  name: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  primaryColor: string;
  accentColor: string;
}

export const ARCHETYPES: Record<CreatorArchetype, ArchetypeDefinition> = {
  VISIONARY: {
    id: 'VISIONARY',
    name: 'The Visionary',
    icon: '🌅',
    shortDescription: 'Big ideas, aspirational, lifestyle-focused.',
    longDescription:
      'You see the bigger picture before anyone else. Your content paints a future your audience wants to step into, blending ambition with aesthetic storytelling.',
    primaryColor: colors.gold.light,
    accentColor: colors.teal.pure,
  },
  EDUCATOR: {
    id: 'EDUCATOR',
    name: 'The Educator',
    icon: '📚',
    shortDescription: 'Knowledge-first, clear, trusted authority.',
    longDescription:
      'You build trust through clarity and depth. Your audience comes to you for insights, frameworks, and step-by-step breakdowns they can actually use.',
    primaryColor: colors.teal.pure,
    accentColor: colors.gold.pure,
  },
  ENTERTAINER: {
    id: 'ENTERTAINER',
    name: 'The Entertainer',
    icon: '🎭',
    shortDescription: 'Viral energy, trends, humor, relatability.',
    longDescription:
      'You own the spotlight. Your content is punchy, meme-aware, and designed to be shared—keeping your audience smiling and coming back for more.',
    primaryColor: colors.platform.instagram,
    accentColor: colors.teal.light,
  },
  STORYTELLER: {
    id: 'STORYTELLER',
    name: 'The Storyteller',
    icon: '📖',
    shortDescription: 'Emotional depth, narratives, authenticity.',
    longDescription:
      'You turn everyday moments into cinematic stories. Your audience connects with your honesty, vulnerability, and the way you make them feel seen.',
    primaryColor: colors.gold.dim,
    accentColor: colors.text.primary,
  },
  STRATEGIST: {
    id: 'STRATEGIST',
    name: 'The Strategist',
    icon: '🧠',
    shortDescription: 'Analytics-driven, growth-focused, tactical.',
    longDescription:
      'You treat content like a system. You test, iterate, and optimise, turning data into decision-making superpowers for consistent growth.',
    primaryColor: colors.teal.pure,
    accentColor: colors.semantic.info,
  },
  ARTIST: {
    id: 'ARTIST',
    name: 'The Artist',
    icon: '🎨',
    shortDescription: 'Aesthetic perfection, visual-first content.',
    longDescription:
      'You design experiences, not just posts. Every frame, color, and transition is intentional—your feed feels like a gallery instead of a grid.',
    primaryColor: colors.gold.pure,
    accentColor: colors.platform.instagram,
  },
  ADVOCATE: {
    id: 'ADVOCATE',
    name: 'The Advocate',
    icon: '📢',
    shortDescription: 'Purpose-driven, community, social impact.',
    longDescription:
      'You use your platform for something bigger. Your content mobilises people around causes, conversations, and change that actually matters.',
    primaryColor: colors.semantic.error,
    accentColor: colors.gold.light,
  },
  CONNECTOR: {
    id: 'CONNECTOR',
    name: 'The Connector',
    icon: '🤝',
    shortDescription: 'Collaboration, community-building, DMs.',
    longDescription:
      'You are the bridge. Your content sparks conversations, relationships, and collabs—turning followers into a tight-knit, active community.',
    primaryColor: colors.teal.light,
    accentColor: colors.platform.twitter,
  },
};

// ─────────────────────────────────────────────
// Scoring matrix logic
// ─────────────────────────────────────────────

export type ArchetypeScores = Record<CreatorArchetype, number>;

const createEmptyScores = (): ArchetypeScores => ({
  VISIONARY: 0,
  EDUCATOR: 0,
  ENTERTAINER: 0,
  STORYTELLER: 0,
  STRATEGIST: 0,
  ARTIST: 0,
  ADVOCATE: 0,
  CONNECTOR: 0,
});

// Weights per question / option → archetype bias
const Q1_WEIGHTS: Record<
  string,
  Partial<ArchetypeScores>
> = {
  performer: { ENTERTAINER: 3, STORYTELLER: 1 },
  educator: { EDUCATOR: 3, STRATEGIST: 2 },
  aspirational: { VISIONARY: 3, ARTIST: 2 },
  entertainer: { ENTERTAINER: 3, CONNECTOR: 1 },
};

const Q5_WEIGHTS: Record<string, Partial<ArchetypeScores>> = {
  ideas: { VISIONARY: 1, ARTIST: 1, STORYTELLER: 1 },
  captions: { STORYTELLER: 2, EDUCATOR: 1, ENTERTAINER: 1 },
  consistency: { STRATEGIST: 2, VISIONARY: 1 },
  understanding: { STRATEGIST: 3, EDUCATOR: 1 },
  brands: { CONNECTOR: 2, ADVOCATE: 1, VISIONARY: 1 },
};

const TONE_WEIGHTS: Record<Tone, Partial<ArchetypeScores>> = {
  bold_direct: { STRATEGIST: 1, VISIONARY: 1, ADVOCATE: 1 },
  warm_relatable: { STORYTELLER: 2, CONNECTOR: 1 },
  informative_clear: { EDUCATOR: 3, STRATEGIST: 1 },
  playful_funny: { ENTERTAINER: 3, CONNECTOR: 1 },
};

const FORMAT_WEIGHTS: Record<ContentFormat, Partial<ArchetypeScores>> = {
  reel: { ENTERTAINER: 2, VISIONARY: 1 },
  post: { ARTIST: 1, STORYTELLER: 1 },
  story: { CONNECTOR: 2, ADVOCATE: 1 },
  carousel: { EDUCATOR: 2, STRATEGIST: 1 },
  short: { ENTERTAINER: 2, STRATEGIST: 1 },
  podcast: { STORYTELLER: 2, EDUCATOR: 1 },
  long_video: { EDUCATOR: 1, STORYTELLER: 2 },
};

const GOAL_WEIGHTS: Record<ContentGoal, Partial<ArchetypeScores>> = {
  brand_partnerships: { CONNECTOR: 2, VISIONARY: 1 },
  community_building: { CONNECTOR: 2, ADVOCATE: 1, STORYTELLER: 1 },
  thought_leadership: { EDUCATOR: 2, STRATEGIST: 1, VISIONARY: 1 },
  creative_expression: { ARTIST: 3, STORYTELLER: 1 },
};

export interface QuizScoringResult {
  primaryArchetype: CreatorArchetype;
  scores: ArchetypeScores;
}

export const scoreQuizAnswersLocally = (answers: QuizAnswers): QuizScoringResult => {
  const scores = createEmptyScores();

  // Q1 creator type
  const q1Weights = Q1_WEIGHTS[answers.creatorType];
  if (q1Weights) {
    for (const [key, value] of Object.entries(q1Weights)) {
      scores[key as CreatorArchetype] += value ?? 0;
    }
  }

  // Q5 biggest challenge
  const q5Weights = Q5_WEIGHTS[answers.biggestChallenge];
  if (q5Weights) {
    for (const [key, value] of Object.entries(q5Weights)) {
      scores[key as CreatorArchetype] += value ?? 0;
    }
  }

  // Q6 tone
  const toneWeights = TONE_WEIGHTS[answers.tone];
  for (const [key, value] of Object.entries(toneWeights)) {
    scores[key as CreatorArchetype] += value ?? 0;
  }

  // Q7 content formats
  for (const format of answers.contentFormats) {
    const formatWeights = FORMAT_WEIGHTS[format];
    if (!formatWeights) continue;
    for (const [key, value] of Object.entries(formatWeights)) {
      scores[key as CreatorArchetype] += value ?? 0;
    }
  }

  // Q8 primary goal
  const goalWeights = GOAL_WEIGHTS[answers.primaryGoal];
  for (const [key, value] of Object.entries(goalWeights)) {
    scores[key as CreatorArchetype] += value ?? 0;
  }

  // Find highest scoring archetype
  let primaryArchetype: CreatorArchetype = 'VISIONARY';
  let bestScore = -Infinity;
  (Object.keys(scores) as CreatorArchetype[]).forEach((key) => {
    if (scores[key] > bestScore) {
      bestScore = scores[key];
      primaryArchetype = key;
    }
  });

  return { primaryArchetype, scores };
};

