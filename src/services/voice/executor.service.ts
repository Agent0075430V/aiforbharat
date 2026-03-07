/**
 * executor.service.ts
 * Routes parsed voice commands to the correct service call and returns a spoken response.
 */
import type { ParsedCommand } from '../../types/voice.types';
import type { InfluencerProfile, Platform } from '../../types/profile.types';
import { generateCaptions } from '../api';

export const executeVoiceCommand = async (
  command: ParsedCommand,
  profile: InfluencerProfile,
  navigate: (screen: string, params?: any) => void
): Promise<{ success: boolean; result: any; spokenResponse: string }> => {
  const { intent, parameters } = command;

  try {
    switch (intent) {

      // ── Caption generation ────────────────────────────────────────────────
      case 'generate_captions': {
        const topic = (parameters.topic as string) || 'my latest content';
        const platform = ((parameters.platform as Platform) || profile.primaryPlatform || 'instagram') as Platform;
        const language = (parameters.language as string) || profile.language || 'English';

        let result: any;
        let spoken: string;
        try {
          result = await generateCaptions(topic, profile, platform, language);
          const captions = result?.captions ?? [];
          const best = captions[0];
          spoken = captions.length
            ? `I've written ${captions.length} captions for "${topic}" on ${platform}.` +
            (best?.engagementScore != null ? ` The top one scored ${best.engagementScore} out of 100.` : '') +
            ' Head to the Caption Generator to review and save them.'
            : `I prepared caption ideas for your ${topic} post on ${platform}.`;
        } catch {
          // AI caption API is down — give a helpful fallback response
          spoken = `I'd love to write captions for "${topic}" on ${platform}, but the AI service is currently unavailable. Open the Caption Generator and type your topic to generate them manually.`;
          result = null;
        }
        return { success: true, result, spokenResponse: spoken };
      }

      // ── Hashtags ──────────────────────────────────────────────────────────
      case 'generate_hashtags': {
        const topic = (parameters.topic as string) || 'your content';
        return {
          success: true,
          result: null,
          spokenResponse: `Opening the Hashtag Studio for "${topic}". You can find the best tags for your niche there.`,
        };
      }

      // ── Script writing ────────────────────────────────────────────────────
      case 'write_script': {
        const topic = (parameters.topic as string) || 'your idea';
        return {
          success: true,
          result: null,
          spokenResponse: `Head to the Script Writer to create a reel script for "${topic}". I'll write your hook, body, and call to action there.`,
        };
      }

      // ── Weekly plan ───────────────────────────────────────────────────────
      case 'generate_week_plan': {
        return {
          success: true,
          result: null,
          spokenResponse: 'Opening your Calendar. I can generate a full week of content for you there.',
        };
      }

      // ── Analytics ─────────────────────────────────────────────────────────
      case 'get_analytics': {
        return {
          success: true,
          result: null,
          spokenResponse: 'Taking you to Analytics so you can see your performance at a glance.',
        };
      }

      // ── Brands ────────────────────────────────────────────────────────────
      case 'check_brands': {
        return {
          success: true,
          result: null,
          spokenResponse: 'Opening the Brands section. You can review your partnerships and send media kits from there.',
        };
      }

      // ── Navigate ──────────────────────────────────────────────────────────
      case 'navigate': {
        const screen = (parameters.screen as string) || 'home';
        navigate(screen);
        return {
          success: true,
          result: null,
          spokenResponse: `Opening ${screen}.`,
        };
      }

      // ── Unknown / catch-all ───────────────────────────────────────────────
      case 'unknown':
      default:
        return {
          success: false,
          result: null,
          spokenResponse:
            "I'm not sure what you'd like me to do. Try saying things like: " +
            '"Write a caption about my morning routine", ' +
            '"Generate hashtags for fitness", or ' +
            '"Open Analytics".',
        };
    }
  } catch (error) {
    console.warn('[executeVoiceCommand] error:', error);
    return {
      success: false,
      result: null,
      spokenResponse: 'Something went wrong executing that command. Please try again.',
    };
  }
};
