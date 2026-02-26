import { QuizAnswers } from '../../../types/profile.types';

export const buildQuizAnalysisPrompt = (answers: QuizAnswers): string => `
You are Mediora AI. Analyse these quiz answers from a social media influencer
and determine their creator archetype and full profile.

QUIZ ANSWERS:
Creator Type: ${answers.creatorType}
Audience Location: ${answers.audienceLocation}
Platforms: ${answers.platforms.join(', ')}
Posting Frequency: ${answers.postingFrequency}
Biggest Challenge: ${answers.biggestChallenge}
Tone Style: ${answers.tone}
Content Formats: ${answers.contentFormats.join(', ')}
Primary Goal: ${answers.primaryGoal}

ARCHETYPES TO CHOOSE FROM:
VISIONARY, EDUCATOR, ENTERTAINER, STORYTELLER,
STRATEGIST, ARTIST, ADVOCATE, CONNECTOR

Return ONLY valid JSON:
{
  "archetype": "EDUCATOR",
  "archetypeDescription": "2-sentence description of this archetype for the user",
  "niche": "fitness",
  "primaryTone": "informative_clear",
  "suggestedLanguage": "English",
  "contentStrategy": "2-sentence content strategy recommendation",
  "topStrengths": ["strength1", "strength2", "strength3"],
  "focusAreas": ["area1", "area2"],
  "postingRecommendation": "Specific recommendation for posting frequency and times"
}`;

