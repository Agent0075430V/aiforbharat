import type { InfluencerProfile } from '../../../types/profile.types';

export const buildHashtagPrompt = (
  topic: string,
  profile: InfluencerProfile,
  platform: string
): string => `
You are Mediora AI's hashtag strategist.
Generate highly relevant hashtags for this creator and topic.

CREATOR PROFILE:
Niche: ${profile.niche}
Archetype: ${profile.archetype}
Primary Platforms: ${profile.platforms.join(', ')}
Primary Goal: ${profile.primaryGoal}
Audience Location: ${profile.audienceLocation}

TOPIC: "${topic}"
PLATFORM: ${platform}

HASHTAG GROUPS:
- trending: High-volume, time-sensitive trend tags.
- niche: Deeply relevant to the creator's niche and topic.
- branded: Tags that can be used repeatedly by the creator.

RULES:
- Do NOT include banned or overly generic tags like #love #follow4follow etc.
- Mix high, medium, and low competition keywords.
- Do not repeat the exact same hashtag across groups.
- No explanations, only JSON.

Return ONLY valid JSON:
{
  "trending": [
    { "tag": "#tag", "estimatedPosts": "2.3M" }
  ],
  "niche": [
    { "tag": "#tag", "estimatedPosts": "120K" }
  ],
  "branded": [
    { "tag": "#tag", "estimatedPosts": "—" }
  ]
}
`;

