import React, { useState } from 'react';
import { View, Text } from 'react-native';
import HashtagSearch from './HashtagSearch';
import HashtagResults from './HashtagResults';
import SelectedBar from './SelectedBar';
import RecentSets from './RecentSets';
import Button from '../../../components/ui/Button';
import { useProfile } from '../../../store/ProfileContext';
import { mockRecentHashtagSets, mockInfluencerProfile } from '../../../constants/mockData.constants';
import { generateHashtags } from '../../../services/api';
import Toast from 'react-native-toast-message';
import type { HashtagItem } from '../../../types/content.types';
import type { HashtagGroups } from './HashtagResults';
import type { Platform } from '../../../types/profile.types';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

function normalizeGroups(raw: unknown): HashtagGroups {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const toItems = (arr: unknown, cat: 'trending' | 'niche' | 'branded'): HashtagItem[] => {
    if (!Array.isArray(arr)) return [];
    return arr.map((x: any) => {
      // Handle plain string "#tag" (new Bedrock action:'hashtag' format)
      if (typeof x === 'string') {
        return { tag: x.startsWith('#') ? x : `#${x}`, estimatedPosts: '—', category: cat };
      }
      // Handle object {tag, estimatedPosts} (legacy format)
      return {
        tag: typeof x?.tag === 'string' ? x.tag : '#tag',
        estimatedPosts: typeof x?.estimatedPosts === 'string' ? x.estimatedPosts : '—',
        category: cat,
      };
    });
  };
  return {
    trending: toItems(o.trending, 'trending'),
    niche: toItems(o.niche, 'niche'),
    branded: toItems(o.branded, 'branded'),
  };
}

export const HashtagStudioScreen: React.FC = () => {
  const { profile } = useProfile();
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<HashtagGroups>({ trending: [], niche: [], branded: [] });
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const clearSelection = () => setSelectedTags(new Set());

  const handleSelectRecentSet = (tags: string[]) => {
    setSelectedTags(new Set(tags));
  };

  const handleGenerate = async () => {
    const topic = query.trim() || 'content creation';
    const profileOrMock = profile ?? mockInfluencerProfile;
    setLoading(true);
    try {
      const raw = await generateHashtags(topic, profileOrMock, platform);
      const normalized = normalizeGroups(raw);
      const hasResults = normalized.trending.length + normalized.niche.length + normalized.branded.length > 0;
      if (!hasResults) {
        Toast.show({
          type: 'info',
          text1: 'AI unavailable',
          text2: 'Enable Bedrock model access in AWS Console to generate hashtags.',
        });
        return;
      }
      setGroups(normalized);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'AI unavailable',
        text2: 'Enable Bedrock model access in AWS Console to generate hashtags.',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedList = Array.from(selectedTags);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.base }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
        <Text
          style={{
            fontFamily: fontFamilies.heading.semibold,
            fontSize: 22,
            color: colors.text.primary,
          }}
        >
          Hashtag Studio
        </Text>
        <Text
          style={{
            marginTop: spacing.xs,
            fontFamily: fontFamilies.body.regular,
            fontSize: fontSizes.sm,
            color: colors.text.secondary,
          }}
        >
          Find and combine hashtags for your posts
        </Text>

        <HashtagSearch value={query} onChangeText={setQuery} />
        <Button
          title={loading ? 'Generating…' : 'Generate 20 Hashtags'}
          onPress={handleGenerate}
          loading={loading}
          style={{ marginTop: spacing.sm }}
        />
        <RecentSets
          sets={mockRecentHashtagSets}
          onSelectSet={handleSelectRecentSet}
        />
      </View>

      <HashtagResults
        groups={groups}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
      />

      <SelectedBar
        selectedCount={selectedTags.size}
        selectedTags={selectedList}
        onCopy={() => Toast.show({ type: 'success', text1: 'Copied to clipboard' })}
        onClear={clearSelection}
      />
    </View>
  );
};

export default HashtagStudioScreen;
