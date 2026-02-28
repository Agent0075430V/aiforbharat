import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import HashtagChip from './HashtagChip';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';
import type { HashtagItem } from '../../../types/content.types';

export interface HashtagGroups {
  trending: HashtagItem[];
  niche: HashtagItem[];
  branded: HashtagItem[];
}

interface HashtagResultsProps {
  groups: HashtagGroups;
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
}

const Section: React.FC<{
  title: string;
  items: HashtagItem[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
}> = ({ title, items, selectedTags, onToggleTag }) => (
  <View style={{ marginBottom: spacing.lg }}>
    <Text
      style={{
        fontFamily: fontFamilies.heading.medium,
        fontSize: fontSizes.sm,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}
    >
      {title}
    </Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {items.map((item) => (
        <HashtagChip
          key={item.tag}
          item={item}
          selected={selectedTags.has(item.tag)}
          onToggle={() => onToggleTag(item.tag)}
        />
      ))}
    </View>
  </View>
);

export const HashtagResults: React.FC<HashtagResultsProps> = ({
  groups,
  selectedTags,
  onToggleTag,
}) => {
  return (
    <ScrollView
      style={{ marginTop: spacing.lg }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Section
        title="Trending"
        items={groups.trending}
        selectedTags={selectedTags}
        onToggleTag={onToggleTag}
      />
      <Section
        title="Niche"
        items={groups.niche}
        selectedTags={selectedTags}
        onToggleTag={onToggleTag}
      />
      <Section
        title="Branded"
        items={groups.branded}
        selectedTags={selectedTags}
        onToggleTag={onToggleTag}
      />
    </ScrollView>
  );
};

export default HashtagResults;
