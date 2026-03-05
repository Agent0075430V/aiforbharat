import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import TopicInput from './TopicInput';
import PlatformControls from './PlatformControls';
import LanguageSelector from './LanguageSelector';
import GeneratingState from './GeneratingState';
import ResultsList from './ResultsList';
import EmptyState from './EmptyState';
import Button from '../../../components/ui/Button';
import { useProfile } from '../../../store/ProfileContext';
import { useDrafts } from '../../../store/DraftsContext';
import { mockInfluencerProfile } from '../../../constants/mockData.constants';
import { generateCaptions } from '../../../services/api';
import type { Caption } from '../../../types/content.types';
import type { Platform } from '../../../types/profile.types';
import type { Language } from '../../../types/profile.types';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export const CaptionGeneratorScreen: React.FC = () => {
  const { profile } = useProfile();
  const { addDraftFromCaption } = useDrafts();
  const [userId, setUserId] = useState<string>('anonymous');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [language, setLanguage] = useState<Language>('English');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Caption[]>([]);

  // Load real Cognito userId from AsyncStorage (set on login/signup)
  useEffect(() => {
    AsyncStorage.getItem('last_user_id').then((id) => {
      if (id) setUserId(id);
    });
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResults([]);
    // Build a profile object with the real userId so Bedrock can fetch the user's
    // voice profile from DynamoDB and save the draft under the correct account.
    const profileOrMock = profile
      ? { ...profile, userId }
      : { ...mockInfluencerProfile, userId };
    try {
      const data = await generateCaptions(
        topic.trim(),
        profileOrMock as any,
        platform,
        language
      );
      // Lambda now returns captions[] with short/medium/long variants
      const rawCaptions = Array.isArray(data?.captions) ? data.captions : [];
      if (rawCaptions.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'AI generation in progress',
          text2: 'Bedrock model access not yet enabled. Enable it in AWS Console to use AI.',
        });
        return;
      }
      const captions = rawCaptions.map((c: any, i: number) => ({
        id: c.id || `gen-${i}-${Date.now()}`,
        type: c.type || 'short',
        text: c.text || '',
        engagementScore: c.engagementScore ?? 80,
        scoreBreakdown: c.scoreBreakdown || {
          hookStrength: 20,
          toneMatch: 16,
          ctaStrength: 16,
          relatability: 16,
          languageQuality: 12,
        },
        improvementTip: c.improvementTip || '',
        platform,
        language,
        generatedAt: new Date().toISOString(),
      }));
      setResults(captions);
    } catch (err: any) {
      console.warn('[CaptionGenerator] Bedrock call failed:', err);
      Toast.show({
        type: 'error',
        text1: 'AI unavailable',
        text2: 'Enable Bedrock model access in AWS Console to generate captions.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = (caption: Caption) => {
    addDraftFromCaption(topic.trim() || caption.text.slice(0, 50), caption, platform);
  };

  const handleRegenerate = (caption: Caption) => {
    setTopic(topic || caption.text.slice(0, 50));
    setResults([]);
    handleGenerate();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background.base }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontFamily: fontFamilies.heading.semibold,
          fontSize: 22,
          color: colors.text.primary,
        }}
      >
        Write Caption
      </Text>
      <Text
        style={{
          marginTop: spacing.xs,
          fontFamily: fontFamilies.body.regular,
          fontSize: fontSizes.sm,
          color: colors.text.secondary,
        }}
      >
        Sounds like you, powered by AI
      </Text>

      <View style={{ marginTop: spacing.lg }}>
        <TopicInput value={topic} onChangeText={setTopic} />
        <PlatformControls value={platform} onChange={setPlatform} />
        <LanguageSelector value={language} onChange={setLanguage} />
      </View>

      <Button
        title={loading ? 'AI is writing...' : '✨ Generate Captions'}
        onPress={handleGenerate}
        disabled={!topic.trim() || loading}
        loading={loading}
        style={{ marginTop: spacing.xl }}
      />

      {loading && <GeneratingState />}
      {!loading && results.length > 0 && (
        <ResultsList
          captions={results}
          onSaveDraft={handleSaveDraft}
          onRegenerate={handleRegenerate}
        />
      )}
      {!loading && results.length === 0 && (
        <EmptyState onGenerate={topic.trim() ? handleGenerate : undefined} />
      )}
    </ScrollView>
  );
};

export default CaptionGeneratorScreen;
