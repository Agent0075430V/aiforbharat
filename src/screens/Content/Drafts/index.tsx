import React, { useState, useRef, useMemo } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ContentStackParamList } from '../../../types/navigation.types';
import Card from '../../../components/ui/Card';
import BottomSheet, { type BottomSheetRef } from '../../../components/ui/BottomSheet';
import useHaptics from '../../../hooks/useHaptics';
import { useDrafts } from '../../../store/DraftsContext';
import type { Draft, DraftStatus } from '../../../types/content.types';
import type { Platform } from '../../../types/profile.types';
import DraftsFilter, { type DraftFilters } from './DraftsFilter';
import { DraftEditSheet } from './DraftEditSheet';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

type Nav = NativeStackNavigationProp<ContentStackParamList, 'DraftsList'>;

const STATUS_COLORS: Record<DraftStatus, string> = {
  draft: colors.text.muted,
  approved: '#4ECDC4',
  scheduled: colors.gold?.pure ?? '#D4AF37',
  posted: '#6BCB77',
};

export const DraftsListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const haptics = useHaptics();
  const { drafts } = useDrafts();
  const editSheetRef = useRef<BottomSheetRef>(null);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [filters, setFilters] = useState<DraftFilters>({ platform: 'all', status: 'all' });

  const filteredDrafts = useMemo(() => {
    return drafts.filter((d) => {
      const platformMatch = filters.platform === 'all' || d.platform === filters.platform;
      const statusMatch = filters.status === 'all' || d.status === filters.status;
      return platformMatch && statusMatch;
    });
  }, [drafts, filters]);

  const handleDraftPress = (draft: Draft) => {
    haptics.light();
    navigation.navigate('DraftDetail', { draftId: draft.id });
  };

  const handleEditPress = (draft: Draft) => {
    haptics.medium?.() ?? haptics.light();
    setEditingDraftId(draft.id);
    editSheetRef.current?.snapToIndex(0);
  };

  const handleEditClose = () => {
    editSheetRef.current?.snapToIndex(-1);
    setEditingDraftId(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.base }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
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
          Drafts
        </Text>

        {/* Filter bar */}
        {drafts.length > 0 && (
          <DraftsFilter
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={drafts.length}
            filteredCount={filteredDrafts.length}
          />
        )}

        {/* Empty state */}
        {drafts.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: spacing.xxl }}>
            <Text style={{ fontSize: 40, marginBottom: spacing.md }}>✍️</Text>
            <Text style={{ fontFamily: fontFamilies.heading.medium, fontSize: fontSizes.lg, color: colors.text.primary, marginBottom: spacing.xs }}>
              No drafts yet
            </Text>
            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted, textAlign: 'center' }}>
              Generate captions or scripts{'\n'}to see them here
            </Text>
          </View>
        ) : filteredDrafts.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: spacing.xl }}>
            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
              No drafts match these filters
            </Text>
          </View>
        ) : (
          filteredDrafts.map((draft) => (
            <Pressable
              key={draft.id}
              onPress={() => handleDraftPress(draft)}
              style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
            >
              <Card style={{ marginBottom: spacing.sm, borderRadius: radius.lg, padding: spacing.md }}>
                {/* Title + edit button */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontFamily: fontFamilies.heading.medium,
                      fontSize: fontSizes.md,
                      color: colors.text.primary,
                    }}
                  >
                    {draft.topic}
                  </Text>
                  <Pressable
                    onPress={(e) => { e.stopPropagation(); handleEditPress(draft); }}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    style={{ marginLeft: spacing.sm }}
                  >
                    <Text style={{ fontSize: 16, color: colors.text.muted }}>✏️</Text>
                  </Pressable>
                </View>

                {/* Caption preview */}
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: fontFamilies.body.regular,
                    fontSize: fontSizes.sm,
                    color: colors.text.secondary,
                    marginTop: spacing.xs,
                    lineHeight: 20,
                  }}
                >
                  {draft.caption.text}
                </Text>

                {/* Meta row */}
                <View style={{ flexDirection: 'row', marginTop: spacing.sm, gap: spacing.sm, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fontFamilies.mono.regular, fontSize: fontSizes.xs, color: colors.text.muted, textTransform: 'capitalize' }}>
                    {draft.platform} · {draft.format}
                  </Text>
                  <View style={{
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: radius.sm,
                    backgroundColor: `${STATUS_COLORS[draft.status]}22`,
                  }}>
                    <Text style={{
                      fontFamily: fontFamilies.mono.medium,
                      fontSize: fontSizes.xs,
                      color: STATUS_COLORS[draft.status],
                      textTransform: 'capitalize',
                    }}>
                      {draft.status}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: fontFamilies.mono.medium, fontSize: fontSizes.xs, color: colors.text.gold ?? colors.text.muted, marginLeft: 'auto' }}>
                    ⚡ {draft.engagementScore}
                  </Text>
                </View>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Edit bottom sheet */}
      <BottomSheet
        ref={editSheetRef}
        initialIndex={-1}
        snapPoints={['75%', '95%']}
        onClose={handleEditClose}
      >
        {editingDraftId ? (
          <DraftEditSheet
            draftId={editingDraftId}
            onClose={handleEditClose}
          />
        ) : null}
      </BottomSheet>
    </View>
  );
};

export default DraftsListScreen;
