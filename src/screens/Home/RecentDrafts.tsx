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
        {drafts.length > 0 && (
          <Pressable onPress={() => (navigation as any).navigate('Content', { screen: 'DraftsList' })}>
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
          </Pressable>
        )}
      </View>

      {/* Empty state */}
      {recentDrafts.length === 0 ? (
        <Pressable onPress={() => (navigation as any).navigate('Content', { screen: 'CaptionGenerator' })}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              padding: spacing.lg,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border.subtle,
              borderStyle: 'dashed',
              alignItems: 'center',
              backgroundColor: colors.background.surface,
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>✍️</Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontFamily: fontFamilies.heading.medium,
                fontSize: fontSizes.md,
                color: colors.text.primary,
                marginBottom: 4,
              }}
            >
              No drafts yet
            </Text>
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.muted,
                textAlign: 'center',
              }}
            >
              Tap to generate your first caption →
            </Text>
          </View>
        </Pressable>
      ) : (
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
                  <Badge label={draft.status === 'posted' ? 'Posted' : 'Draft'} />
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
      )}
    </View>
  );
};

export default RecentDrafts;
