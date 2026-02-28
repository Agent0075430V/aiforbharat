export type CreatorArchetype =
  | 'VISIONARY'
  | 'EDUCATOR'
  | 'ENTERTAINER'
  | 'STORYTELLER'
  | 'STRATEGIST'
  | 'ARTIST'
  | 'ADVOCATE'
  | 'CONNECTOR';

export type Niche =
  | 'fitness'
  | 'food'
  | 'tech'
  | 'fashion'
  | 'travel'
  | 'education'
  | 'finance'
  | 'lifestyle'
  | 'gaming'
  | 'entertainment';

export type Tone =
  | 'bold_direct'
  | 'warm_relatable'
  | 'informative_clear'
  | 'playful_funny';

export type Language =
  | 'English'
  | 'Hindi'
  | 'Hinglish'
  | 'Tamil'
  | 'Telugu';

export type Platform =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'linkedin'
  | 'twitter';

export type ContentFormat =
  | 'reel'
  | 'post'
  | 'story'
  | 'carousel'
  | 'short'
  | 'podcast'
  | 'long_video';

export type PostingFrequency =
  | 'daily'
  | '3_4_per_week'
  | '1_2_per_week'
  | 'irregular';

export type ContentGoal =
  | 'brand_partnerships'
  | 'community_building'
  | 'thought_leadership'
  | 'creative_expression';

export interface QuizAnswers {
  creatorType: string;
  audienceLocation: string;
  platforms: Platform[];
  postingFrequency: PostingFrequency;
  biggestChallenge: string;
  tone: Tone;
  contentFormats: ContentFormat[];
  primaryGoal: ContentGoal;
}

export interface InfluencerProfile {
  userId: string;
  displayName: string;
  bio?: string;
  archetype: CreatorArchetype;
  niche: Niche;
  tone: Tone;
  language: Language;
  platforms: Platform[];
  primaryPlatform: Platform;
  contentFormats: ContentFormat[];
  postingFrequency: PostingFrequency;
  primaryGoal: ContentGoal;
  audienceLocation: string;
  quizAnswers: QuizAnswers;
  followerCounts: Partial<Record<Platform, number>>;
  socialHandles: Partial<Record<Platform, string>>;
  completedAt: string;
}

