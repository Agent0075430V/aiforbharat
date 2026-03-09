/**
 * DayDetailSheet.tsx
 *
 * Inline edit panel for a calendar day.
 * Users can edit topic, caption, hashtags, time, platform, format and status,
 * then tap "Save & Schedule" to persist changes back to the calendar.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CalendarDay } from '../../types/calendar.types';
import type { Platform, ContentFormat } from '../../types/profile.types';
import type { DraftStatus } from '../../types/content.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';


// ─── Types ───────────────────────────────────────────────────────────────────

interface DayDetailSheetProps {
  day: CalendarDay;
  onClose: () => void;
  onSave: (updated: CalendarDay) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PLATFORMS: Platform[] = ['instagram', 'youtube', 'tiktok', 'linkedin', 'twitter'];
const FORMATS: ContentFormat[] = ['reel', 'post', 'story', 'carousel', 'short', 'podcast', 'long_video'];
const STATUSES: DraftStatus[] = ['draft', 'approved', 'scheduled', 'posted'];

const STATUS_COLOR: Record<DraftStatus, { bg: string; text: string }> = {
  draft: { bg: colors.gold.glow, text: colors.text.gold },
  approved: { bg: colors.teal.dim, text: colors.teal.pure },
  scheduled: { bg: colors.semantic.success + '22', text: colors.semantic.success },
  posted: { bg: colors.background.surface, text: colors.text.secondary },
};

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'IG',
  youtube: 'YT',
  tiktok: 'TT',
  linkedin: 'LI',
  twitter: 'X',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Section label */
const Label: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.label}>{children}</Text>
);

/** Styled TextInput wrapper */
const Field: React.FC<{
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  lines?: number;
}> = ({ value, onChangeText, placeholder, multiline, lines = 1 }) => (
  <TextInput
    style={[styles.input, multiline && { height: lines * 22 + 20, textAlignVertical: 'top' }]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={colors.text.muted}
    multiline={multiline}
    selectionColor={colors.text.gold}
  />
);

/** Chip selector row */
function ChipRow<T extends string>({
  options,
  selected,
  onSelect,
  label,
}: {
  options: T[];
  selected: T;
  onSelect: (v: T) => void;
  label: (v: T) => string;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
      {options.map((opt) => {
        const active = opt === selected;
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(opt)}
            style={[
              styles.chip,
              active && styles.chipActive,
            ]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {label(opt)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export const DayDetailSheet: React.FC<DayDetailSheetProps> = ({ day, onClose, onSave }) => {
  const navigation = useNavigation<any>();

  // Local edit state — mirrors CalendarDay fields
  const [topic, setTopic] = useState(day.topic);
  const [caption, setCaption] = useState(day.captionPreview);
  const [hashtagsRaw, setHashtagsRaw] = useState(day.hashtags.join(' '));
  const [platform, setPlatform] = useState<Platform>(day.platform);
  const [format, setFormat] = useState<ContentFormat>(day.format);
  const [status, setStatus] = useState<DraftStatus>(day.status);
  const [scheduledTime, setScheduledTime] = useState(
    day.scheduledTime ?? day.bestTimeToPost ?? '09:00'
  );

  const isDirty =
    topic !== day.topic ||
    caption !== day.captionPreview ||
    hashtagsRaw !== day.hashtags.join(' ') ||
    platform !== day.platform ||
    format !== day.format ||
    status !== day.status ||
    scheduledTime !== (day.scheduledTime ?? day.bestTimeToPost ?? '09:00');

  const handleSave = () => {
    const updated: CalendarDay = {
      ...day,
      topic: topic.trim(),
      captionPreview: caption.trim(),
      hashtags: hashtagsRaw.trim().split(/\s+/).filter(Boolean),
      platform,
      format,
      status,
      scheduledTime,
      bestTimeToPost: status === 'scheduled' ? scheduledTime : day.bestTimeToPost,
    };
    onSave(updated);
    onClose();
  };

  const handleGoHome = () => {
    onClose();
    // Navigate to the Home tab
    try {
      navigation.navigate('App', { screen: 'Home' });
    } catch {
      navigation.navigate('Home');
    }
  };

  return (
    <ScrollView
      style={{ maxHeight: 520 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Top header bar ── */}
      <View style={styles.topBar}>
        {/* Back button */}
        <Pressable onPress={onClose} style={styles.topBarBtn} hitSlop={8}>
          <Text style={styles.topBarBtnText}>← Back</Text>
        </Pressable>

        {/* Mediora brand — taps to go home */}
        <Pressable onPress={handleGoHome} hitSlop={8}>
          <Text style={styles.brandTitle}>Mediora</Text>
        </Pressable>

        {/* Save button */}
        <Pressable
          onPress={isDirty ? handleSave : undefined}
          style={[styles.topBarSaveBtn, !isDirty && styles.topBarSaveBtnDisabled]}
          hitSlop={8}
        >
          <Text style={[styles.topBarSaveBtnText, !isDirty && styles.topBarSaveBtnTextDisabled]}>
            {status === 'scheduled' ? '📅 Save' : '💾 Save'}
          </Text>
        </Pressable>
      </View>

      {/* Day label + unsaved badge */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{day.dayName}, {day.date}</Text>
        {isDirty && (
          <View style={styles.dirtyBadge}>
            <Text style={styles.dirtyBadgeText}>Unsaved</Text>
          </View>
        )}
      </View>

      {/* ── Status chips ── */}
      <Label>STATUS</Label>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
        {STATUSES.map((s) => {
          const active = s === status;
          const col = STATUS_COLOR[s];
          return (
            <Pressable
              key={s}
              onPress={() => setStatus(s)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? col.bg : colors.background.surface,
                  borderColor: active ? col.text : colors.border.hair
                },
              ]}
            >
              <Text style={[styles.chipText, { color: active ? col.text : colors.text.muted }]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Platform ── */}
      <Label>PLATFORM</Label>
      <ChipRow
        options={PLATFORMS}
        selected={platform}
        onSelect={setPlatform}
        label={(p) => PLATFORM_LABEL[p]}
      />

      {/* ── Format ── */}
      <Label>FORMAT</Label>
      <ChipRow
        options={FORMATS}
        selected={format}
        onSelect={setFormat}
        label={(f) => f.replace('_', ' ')}
      />

      {/* ── Scheduled time ── */}
      <Label>SCHEDULED TIME (HH:MM)</Label>
      <Field
        value={scheduledTime}
        onChangeText={setScheduledTime}
        placeholder="e.g. 18:30"
      />

      {/* ── Topic ── */}
      <Label>TOPIC</Label>
      <Field
        value={topic}
        onChangeText={setTopic}
        placeholder="What's this post about?"
        multiline
        lines={2}
      />

      {/* ── Caption preview ── */}
      <Label>CAPTION</Label>
      <Field
        value={caption}
        onChangeText={setCaption}
        placeholder="Write your caption…"
        multiline
        lines={4}
      />

      {/* ── Hashtags ── */}
      <Label>HASHTAGS (space separated)</Label>
      <Field
        value={hashtagsRaw}
        onChangeText={setHashtagsRaw}
        placeholder="#fitness #motivation #reels"
        multiline
        lines={2}
      />

      {/* Bottom spacer */}
      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Top navigation bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.hair,
  },
  topBarBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  topBarBtnText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  brandTitle: {
    fontFamily: fontFamilies.heading.semibold,
    fontSize: fontSizes.md,
    color: colors.text.gold,
    letterSpacing: 1,
  },
  topBarSaveBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.gold.pure,
  },
  topBarSaveBtnDisabled: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.hair,
  },
  topBarSaveBtnText: {
    fontFamily: fontFamilies.body.bold,
    fontSize: fontSizes.xs,
    color: '#000',
  },
  topBarSaveBtnTextDisabled: {
    color: colors.text.muted,
  },
  // ── Day heading row ──
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  heading: {
    fontFamily: fontFamilies.heading.semibold,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    flex: 1,
  },
  dirtyBadge: {
    backgroundColor: colors.gold.glow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  dirtyBadgeText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.gold,
  },
  label: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.gold,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.hair,
    backgroundColor: colors.background.surface,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.gold.glow,
    borderColor: colors.text.gold,
  },
  chipText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: colors.text.gold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.gold.pure ?? colors.text.gold,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    fontFamily: fontFamilies.body.bold,
    fontSize: fontSizes.sm,
    color: '#000',
  },
});

export default DayDetailSheet;
