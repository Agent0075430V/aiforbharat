import type { Platform, ContentFormat } from './profile.types';
import type { DraftStatus } from './content.types';

export interface CalendarDay {
  date: string; // ISO date string
  dayName: string; // "Monday"
  platform: Platform;
  format: ContentFormat;
  topic: string;
  captionPreview: string; // First 60 chars of caption
  hashtags: string[];
  bestTimeToPost: string;
  scheduledTime?: string;   // HH:MM — set when user schedules the post
  engagementScore: number;
  status: DraftStatus;
  draftId?: string;
}


export interface CalendarWeek {
  weekStartDate: string;
  weekEndDate: string;
  days: CalendarDay[];
  totalPosts: number;
  averageScore: number;
  generatedAt: string;
}

