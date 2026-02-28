import type { InfluencerProfile } from '../../../types/profile.types';

export const buildAnalyticsInsightPrompt = (
  profile: InfluencerProfile,
  period: 'week' | 'month' | '3months'
): string => `
You are Mediora AI, an analytics strategist for creators.
Analyse this creator's recent performance data and provide clear, actionable insights.

CREATOR PROFILE:
Archetype: ${profile.archetype}
Niche: ${profile.niche}
Primary Platforms: ${profile.platforms.join(', ')}
Primary Goal: ${profile.primaryGoal}

PERIOD: ${period}

Return ONLY valid JSON:
{
  "aiInsights": [
    "Insight 1 in one or two sentences",
    "Insight 2 in one or two sentences"
  ]
}
`;

