import type { Platform, ContentFormat } from './profile.types';

export interface DailyEngagement {
  date: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach: number;
  impressions: number;
}

export interface FollowerDataPoint {
  date: string;
  count: number;
  gained: number;
  lost: number;
}

export interface PlatformStats {
  platform: Platform;
  followers: number;
  followersGrowth: number;
  engagementRate: number;
  totalPosts: number;
  avgLikes: number;
  avgComments: number;
  avgSaves: number;
}

export interface TopPost {
  id: string;
  platform: Platform;
  format: ContentFormat;
  captionPreview: string;
  postedAt: string;
  likes: number;
  comments: number;
  saves: number;
  reach: number;
  engagementRate: number;
}

export interface AnalyticsData {
  period: 'week' | 'month' | '3months';
  platformStats: PlatformStats[];
  followerHistory: FollowerDataPoint[];
  dailyEngagement: DailyEngagement[];
  topPosts: TopPost[];
  contentHealthScore: number;
  aiInsights: string[];
}

