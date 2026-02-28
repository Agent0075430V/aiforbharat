// This executes voice commands by routing to the right service
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
      case 'generate_captions': {
        const result = await generateCaptions(
          parameters.topic as string,
          profile,
          ((parameters.platform as Platform) ||
            profile.primaryPlatform) as Platform,
          ((parameters.language as string) || profile.language) as string
        );
        const captions = result?.captions ?? [];
        const best = captions[0];
        const spoken = captions.length
          ? `I've generated ${captions.length} captions for your ${parameters.topic} post.${best?.engagementScore != null ? ` The best one scored ${best.engagementScore} out of 100.` : ''}`
          : `I've prepared caption ideas for your ${parameters.topic} post.`;
        return { success: true, result, spokenResponse: spoken };
      }

      case 'navigate': {
        navigate(parameters.screen as string);
        return {
          success: true,
          result: null,
          spokenResponse: `Opening ${parameters.screen}.`,
        };
      }

      // Other intents can be wired here as additional cases, e.g.:
      // - generate_hashtags
      // - write_script
      // - generate_week_plan
      // - get_analytics
      // - check_brands

      default:
        return {
          success: false,
          result: null,
          spokenResponse:
            "I'm not sure what you'd like me to do. Try saying something like: generate captions for my fitness post.",
        };
    }
  } catch (error) {
    console.warn('executeVoiceCommand error', error);
    return {
      success: false,
      result: null,
      spokenResponse: 'Something went wrong. Please try again.',
    };
  }
};

