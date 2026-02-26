import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useDrafts } from '../../store/DraftsContext';
import { spacing, radius } from '../../theme/spacing';
import colors from '../../theme/colors';
import { fontFamilies, fontSizes } from '../../theme/typography';

export const RecentDrafts: React.FC = () => {
  const { drafts } = useDrafts();
  const navigation = useNavigation();
  const recentDrafts = drafts.slice(0, 5);

  return (
    <View style={{ marginTop: spacing.lg }}>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm,
        }}
      >
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.heading.medium,
            fontSize: 14,
            color: colors.text.secondary,
          }}
        >
          Recent drafts
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: 12,
            color: colors.text.gold,
          }}
        >
          View all →
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: spacing.lg }}
      >
        {recentDrafts.map((draft) => (
          <Pressable
            key={draft.id}
            onPress={() => (navigation as any).navigate('Content', { screen: 'DraftsList' })}
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
          >
          <Card
            style={{
              width: 200,
              marginRight: spacing.md,
              borderRadius: radius.lg,
            }}
          >
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontFamily: fontFamilies.body.medium,
                  fontSize: 12,
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                }}
              >
                {draft.platform.toUpperCase()}
              </Text>
              <Badge label="Draft" />
            </View>
            <Text
              numberOfLines={3}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginTop: spacing.sm,
                fontFamily: fontFamilies.body.regular,
                fontSize: 14,
                color: colors.text.primary,
              }}
            >
              {draft.caption.text}
            </Text>
          </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentDrafts;

