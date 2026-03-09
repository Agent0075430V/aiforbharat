/**
 * executor.service.ts
 *
 * Routes parsed voice commands to the correct service call,
 * saves outputs to drafts, navigates the app, and returns a spoken response.
 *
 * The `ctx` argument provides callbacks the executor needs from React:
 *   - navigate(tabName, screenName?)  — navigates to a tab/screen
 *   - saveDraftFromCaption(...)       — saves a caption to the Drafts store
 */

import type { ParsedCommand } from '../../types/voice.types';
import type { InfluencerProfile, Platform } from '../../types/profile.types';
import type { Caption } from '../../types/content.types';
import { generateCaptions } from '../api';

export interface ExecutorContext {
  /** Navigate to a main tab (and optionally a screen within it) */
  navigate: (tab: string, screen?: string) => void;
  /** Save a generated caption as a draft in the Drafts store */
  saveDraftFromCaption: (topic: string, caption: Caption, platform: Platform) => Promise<void>;
}

export const executeVoiceCommand = async (
  command: ParsedCommand,
  profile: InfluencerProfile,
  ctx: ExecutorContext,
): Promise<{ success: boolean; result: any; spokenResponse: string }> => {
  const { intent, parameters } = command;
  const { navigate, saveDraftFromCaption } = ctx;

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
          const captions: Caption[] = result?.captions ?? [];
          const best = captions[0];

          if (captions.length > 0) {
            // ✅ Save the best caption as a draft automatically
            await saveDraftFromCaption(topic, best, platform);

            spoken =
              `I've written ${captions.length} caption${captions.length > 1 ? 's' : ''} ` +
              `for "${topic}" on ${platform} and saved the top one to your Drafts.` +
              (best?.engagementScore != null
                ? ` It scored ${best.engagementScore}/100.`
                : '');
          } else {
            spoken = `I prepared caption ideas for your ${topic} post on ${platform}.`;
          }
        } catch {
          spoken = `I'd love to write captions for "${topic}" on ${platform}, but the AI service is currently unavailable. Open the Caption Generator and type your topic to generate them manually.`;
          result = null;
        }

        // Navigate to Drafts so the user can see the saved caption
        navigate('ContentStack', 'DraftsList');
        return { success: true, result, spokenResponse: spoken };
      }

      // ── Hashtags ──────────────────────────────────────────────────────────
      case 'generate_hashtags': {
        const topic = (parameters.topic as string) || 'your content';
        navigate('ContentStack', 'HashtagStudio');
        return {
          success: true,
          result: null,
          spokenResponse: `Opening Hashtag Studio for "${topic}". I've navigated there so you can generate and copy the best tags.`,
        };
      }

      // ── Script writing ────────────────────────────────────────────────────
      case 'write_script': {
        const topic = (parameters.topic as string) || 'your idea';
        navigate('ContentStack', 'ScriptWriter');
        return {
          success: true,
          result: null,
          spokenResponse: `Opening Script Writer for "${topic}". I've navigated there — enter the topic and hit Generate to get your hook, body, and CTA.`,
        };
      }

      // ── Weekly plan ───────────────────────────────────────────────────────
      case 'generate_week_plan': {
        navigate('CalendarStack');
        return {
          success: true,
          result: null,
          spokenResponse: 'Opening your Calendar. Tap "Generate week" to create a full content plan for this week.',
        };
      }

      // ── Check calendar / schedule post ────────────────────────────────────
      case 'check_calendar':
      case 'schedule_post': {
        navigate('CalendarStack');
        return {
          success: true,
          result: null,
          spokenResponse: 'Opening your Calendar.',
        };
      }

      // ── Analytics ─────────────────────────────────────────────────────────
      case 'get_analytics': {
        navigate('AnalyticsStack');
        return {
          success: true,
          result: null,
          spokenResponse: 'Taking you to Analytics so you can see your performance at a glance.',
        };
      }

      // ── Brands ────────────────────────────────────────────────────────────
      case 'check_brands':
      case 'generate_media_kit': {
        navigate('BrandStack');
        return {
          success: true,
          result: null,
          spokenResponse: 'Opening the Brands section. You can review partnerships and send media kits from there.',
        };
      }

      // ── Save draft ────────────────────────────────────────────────────────
      case 'save_draft': {
        navigate('ContentStack', 'DraftsList');
        return {
          success: true,
          result: null,
          spokenResponse: 'Opening your Drafts.',
        };
      }

      // ── Navigate ──────────────────────────────────────────────────────────
      case 'navigate': {
        const screen = ((parameters.screen as string) || '').toLowerCase();

        const TAB_MAP: Record<string, string> = {
          home: 'HomeStack',
          content: 'ContentStack',
          captions: 'ContentStack',
          hashtags: 'ContentStack',
          script: 'ContentStack',
          drafts: 'ContentStack',
          calendar: 'CalendarStack',
          analytics: 'AnalyticsStack',
          brands: 'BrandStack',
          settings: 'HomeStack',
        };

        const SCREEN_MAP: Record<string, string | undefined> = {
          captions: 'CaptionGenerator',
          hashtags: 'HashtagStudio',
          script: 'ScriptWriter',
          drafts: 'DraftsList',
        };

        const tab = TAB_MAP[screen] ?? 'HomeStack';
        const subScreen = SCREEN_MAP[screen];

        navigate(tab, subScreen);
        return {
          success: true,
          result: null,
          spokenResponse: `Opening ${screen || 'home'}.`,
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
