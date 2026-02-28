import type { Platform, Language, ContentFormat } from './profile.types';

export interface ScoreBreakdown {
  hookStrength: number; // 0-25
  toneMatch: number; // 0-20
  ctaStrength: number; // 0-20
  relatability: number; // 0-20
  languageQuality: number; // 0-15
}

export interface Caption {
  id: string;
  type: 'short' | 'medium' | 'long';
  text: string;
  engagementScore: number;
  scoreBreakdown: ScoreBreakdown;
  improvementTip: string;
  platform: Platform;
  language: Language;
  generatedAt: string;
}

export interface HashtagItem {
  tag: string;
  estimatedPosts: string;
  category: 'trending' | 'niche' | 'branded';
}

export interface ContentScript {
  id: string;
  format: 'reel' | 'short' | 'podcast' | 'long_video';
  topic: string;
  hook: string;
  body: string[];
  cta: string;
  estimatedDuration: string;
  platform: Platform;
  generatedAt: string;
}

export type DraftStatus = 'draft' | 'approved' | 'scheduled' | 'posted';

export interface Draft {
  id: string;
  topic: string;
  caption: Caption;
  hashtags: string[];
  platform: Platform;
  format: ContentFormat;
  status: DraftStatus;
  scheduledFor?: string;
  bestTimeToPost: string;
  engagementScore: number;
  createdAt: string;
  updatedAt: string;
  /** When set, this draft is script-first (saved from Script Writer). */
  script?: ContentScript;
}

