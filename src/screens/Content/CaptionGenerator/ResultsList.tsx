import React from 'react';
import { ScrollView, View } from 'react-native';
import CaptionCard from '../../../components/features/CaptionCard';
import type { Caption } from '../../../types/content.types';
import { spacing } from '../../../theme/spacing';

interface ResultsListProps {
  captions: Caption[];
  onSaveDraft?: (caption: Caption) => void;
  onRegenerate?: (caption: Caption) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  captions,
  onSaveDraft,
  onRegenerate,
}) => {
  return (
    <ScrollView
      style={{ marginTop: spacing.xl }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      {captions.map((caption) => (
        <CaptionCard
          key={caption.id}
          caption={caption}
          onSaveDraft={onSaveDraft}
          onRegenerate={onRegenerate}
        />
      ))}
    </ScrollView>
  );
};

export default ResultsList;
