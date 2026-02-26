import type { InfluencerProfile } from '../../../types/profile.types';

export const buildMediaKitPrompt = (profile: InfluencerProfile): string => `
You are Mediora AI, designing a professional media kit for a creator.
Generate a structured summary of their profile suitable for brands.

CREATOR PROFILE:
Name: ${profile.displayName}
Archetype: ${profile.archetype}
Niche: ${profile.niche}
Primary Platforms: ${profile.platforms.join(', ')}
Primary Goal: ${profile.primaryGoal}
Audience Location: ${profile.audienceLocation}

Return ONLY valid JSON:
{
  "bio": "Short, brand-friendly bio in 2–3 sentences",
  "primaryAudience": "Short description of main audience",
  "topContentFormats": ["reel", "carousel"],
  "collaborationTypes": [
    "Sponsored reels",
    "Long-term brand partnerships"
  ]
}
`;

