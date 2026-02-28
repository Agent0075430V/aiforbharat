import React from 'react';
import { Text, View } from 'react-native';
import GoldBorderCard from '../../ui/Card/GoldBorderCard';
import { styles } from './CaptionCard.styles';
import { Caption } from '../../../types/content.types';
import EngagementMeter from './EngagementMeter';
import ScoreBreakdown from './ScoreBreakdown';
import CaptionActions from './CaptionActions';
import colors from '../../../theme/colors';

interface CaptionCardProps {
  caption: Caption;
  onSaveDraft?: (caption: Caption) => void;
  onRegenerate?: (caption: Caption) => void;
}

export const CaptionCard: React.FC<CaptionCardProps> = ({
  caption,
  onSaveDraft,
  onRegenerate,
}) => {
  const variantLabel =
    caption.type === 'short'
      ? 'Short'
      : caption.type === 'medium'
      ? 'Medium'
      : 'Long';

  return (
    <View style={styles.container}>
      <GoldBorderCard>
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{variantLabel}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text
              style={[
                styles.scoreValue,
                {
                  color:
                    caption.engagementScore >= 80
                      ? colors.semantic.success
                      : caption.engagementScore >= 60
                      ? colors.semantic.warning
                      : colors.semantic.error,
                },
              ]}
            >
              {caption.engagementScore}
            </Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
        </View>

        <Text style={styles.captionText}>{caption.text}</Text>

        <EngagementMeter score={caption.engagementScore} />
        <ScoreBreakdown breakdown={caption.scoreBreakdown} />

        {caption.improvementTip ? (
          <Text style={styles.tipText}>💡 {caption.improvementTip}</Text>
        ) : null}

        <CaptionActions
          captionText={caption.text}
          onSaveDraft={onSaveDraft ? () => onSaveDraft(caption) : undefined}
          onRegenerate={onRegenerate ? () => onRegenerate(caption) : undefined}
        />
      </GoldBorderCard>
    </View>
  );
};

export default CaptionCard;

