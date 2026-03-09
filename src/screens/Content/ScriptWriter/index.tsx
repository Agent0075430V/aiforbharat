import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import ScriptForm, { type ScriptFormat } from './ScriptForm';
import ScriptResult from './ScriptResult';
import ScriptActions from './ScriptActions';
import Button from '../../../components/ui/Button';
import MedioraHeader from '../../../components/layout/MedioraHeader';
import { useProfile } from '../../../store/ProfileContext';
import { useDrafts } from '../../../store/DraftsContext';
import { mockInfluencerProfile } from '../../../constants/mockData.constants';
import { generateScript } from '../../../services/api';
import type { ContentScript } from '../../../types/content.types';
import type { Platform } from '../../../types/profile.types';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

const DEFAULT_DURATION = '45–60 sec';

function toContentScript(
  raw: unknown,
  topic: string,
  format: ScriptFormat,
  platform: Platform,
  duration: string
): ContentScript {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const body = Array.isArray(o.body) ? (o.body as string[]) : [];
  return {
    id: typeof o.id === 'string' ? o.id : `script-${Date.now()}`,
    format: format === 'short' ? 'short' : 'reel',
    topic,
    hook: typeof o.hook === 'string' ? o.hook : '',
    body: body.length ? body : ['(Add your main points here.)'],
    cta: typeof o.cta === 'string' ? o.cta : '',
    estimatedDuration: duration,
    platform,
    generatedAt: new Date().toISOString(),
  };
}

export const ScriptWriterScreen: React.FC = () => {
  const { profile } = useProfile();
  const { addDraftFromScript } = useDrafts();
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState<ScriptFormat>('reel');
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<ContentScript | null>(null);

  const profileOrMock = profile ?? mockInfluencerProfile;

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setScript(null);
    try {
      const data = await generateScript(
        topic.trim(),
        profileOrMock,
        format,
        platform
      );
      const result = toContentScript(data, topic.trim(), format, platform, duration);
      if (!result.hook && !result.cta) {
        Toast.show({
          type: 'info',
          text1: 'AI unavailable',
          text2: 'Add EXPO_PUBLIC_GROQ_API_KEY to your .env to generate scripts.',
        });
        return;
      }
      setScript(result);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'AI unavailable',
        text2: 'Add EXPO_PUBLIC_GROQ_API_KEY to your .env to generate scripts.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (s: ContentScript) => {
    addDraftFromScript(s);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.base }}>
      <MedioraHeader showBack />
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontFamily: fontFamilies.heading.semibold,
            fontSize: fontSizes.xl,
            color: colors.text.primary,
            marginBottom: spacing.lg,
          }}
        >
          Script Writer
        </Text>

        <ScriptForm
          topic={topic}
          onTopicChange={setTopic}
          format={format}
          onFormatChange={setFormat}
          duration={duration}
          onDurationChange={setDuration}
          platform={platform}
          onPlatformChange={setPlatform}
        />

        <View style={{ marginTop: spacing.xl }}>
          <Button
            title={loading ? 'Generating…' : 'Generate script'}
            variant="primary"
            loading={loading}
            disabled={!topic.trim()}
            onPress={handleGenerate}
          />
        </View>

        {loading && (
          <View
            style={{
              marginTop: spacing.xl,
              alignItems: 'center',
              paddingVertical: spacing.xxl,
            }}
          >
            <ActivityIndicator size="large" color={colors.gold.pure} />
            <Text
              style={{
                marginTop: spacing.sm,
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.secondary,
              }}
            >
              Writing your hook, body, and CTA…
            </Text>
          </View>
        )}

        {!loading && script && (
          <>
            <ScriptResult script={script} />
            <ScriptActions script={script} onSave={handleSave} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ScriptWriterScreen;
