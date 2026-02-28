import type { InfluencerProfile } from '../../../types/profile.types';
import type { CalendarWeek } from '../../../types/calendar.types';

export const buildCalendarPrompt = (
  profile: InfluencerProfile,
  referenceWeekStart: string
): string => `
You are Mediora AI, an advanced content planning assistant for creators.
Generate a detailed one-week content calendar tailored to this creator.

CREATOR PROFILE:
Name: ${profile.displayName}
Archetype: ${profile.archetype}
Niche: ${profile.niche}
Primary Platforms: ${profile.platforms.join(', ')}
Primary Goal: ${profile.primaryGoal}
Posting Frequency: ${profile.postingFrequency}
Audience Location: ${profile.audienceLocation}

RULES:
- Only schedule posts on platforms the creator actually uses.
- Match the creator's tone and archetype in topic ideas.
- Include a mix of post types (Reels, Posts, Stories, Carousels) based on their contentFormats.
- Respect their postingFrequency when deciding how many posts to schedule.
- Suggest a realistic best time to post for each day based on audienceLocation.

Return ONLY valid JSON for exactly one week starting from weekStartDate:
{
  "weekStartDate": "${referenceWeekStart}",
  "weekEndDate": "YYYY-MM-DD",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "dayName": "Monday",
      "platform": "instagram",
      "format": "reel",
      "topic": "Short human-readable topic line",
      "captionPreview": "First 60 characters of a suggested caption",
      "hashtags": ["#tag1", "#tag2"],
      "bestTimeToPost": "7:30 PM",
      "engagementScore": 78,
      "status": "scheduled"
    }
  ],
  "totalPosts": 7,
  "averageScore": 82,
  "generatedAt": "ISO timestamp"
}
`;

export type CalendarPlanResponse = CalendarWeek;

