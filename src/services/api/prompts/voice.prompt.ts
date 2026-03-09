export const buildVoiceIntentPrompt = (transcript: string): string => `
You are Mediora AI's voice command interpreter.
Parse this voice command from a social media creator and return the correct intent.

VALID INTENTS (choose the ONE that best matches):
- generate_captions: User wants captions written for a post or topic
- generate_hashtags: User wants hashtag suggestions
- write_script: User wants a reel/video script
- generate_week_plan: User wants a weekly content calendar/plan
- schedule_post: User wants to schedule or plan a post
- check_calendar: User asking about their schedule or upcoming posts
- get_analytics: User asking about performance, views, reach, stats
- check_brands: User asking about brand deals or collaborations
- generate_media_kit: User wants their media kit created
- save_draft: User wants to save the current content
- navigate: User wants to go to a specific screen or section
- improve_caption: User wants to improve or edit an existing caption
- unknown: Transcript is empty, unclear, or not a content-related command

TRANSCRIPT: "${transcript}"

Analyse the transcript carefully. Extract:
- The core intent from the list above
- Any parameters mentioned (topic, platform, language, screen name, etc.)
- Your confidence level (0.0 to 1.0)

Return ONLY valid JSON. No markdown, no explanation:
{
  "intent": "<one of the VALID INTENTS above>",
  "parameters": {
    "topic": "<topic if mentioned, else omit>",
    "platform": "<instagram|youtube|tiktok|linkedin|twitter if mentioned, else omit>",
    "language": "<English|Hindi|Hinglish if mentioned, else omit>",
    "screen": "<screen name if navigate intent, else omit>"
  },
  "confidence": <0.0 to 1.0>,
  "responsePreview": "<one short sentence confirming what Mediora will do>"
}`;
