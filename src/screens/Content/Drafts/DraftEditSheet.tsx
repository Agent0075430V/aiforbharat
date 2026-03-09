import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDrafts } from '../../../store/DraftsContext';
import type { Draft, DraftStatus } from '../../../types/content.types';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

/** Works on both native (Alert) and web (window.confirm) */
function crossPlatformConfirm(
    title: string,
    message: string,
    onConfirm: () => void
) {
    if (Platform.OS === 'web') {
        if (window.confirm(`${title}\n\n${message}`)) {
            onConfirm();
        }
    } else {
        Alert.alert(title, message, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: onConfirm },
        ]);
    }
}

interface DraftEditSheetProps {
    draftId: string;
    onClose: () => void;
    onSaved?: () => void;
}

const STATUS_OPTIONS: DraftStatus[] = ['draft', 'approved', 'scheduled', 'posted'];

const STATUS_COLORS: Record<DraftStatus, string> = {
    draft: colors.text.muted,
    approved: colors.teal?.pure ?? '#4ECDC4',
    scheduled: colors.gold?.pure ?? '#D4AF37',
    posted: '#6BCB77',
};

export const DraftEditSheet: React.FC<DraftEditSheetProps> = ({
    draftId,
    onClose,
    onSaved,
}) => {
    const { getDraft, removeDraft, addDraft } = useDrafts();
    const draft = getDraft(draftId);

    const [captionText, setCaptionText] = useState(draft?.caption.text ?? '');
    const [hashtagsText, setHashtagsText] = useState(
        draft?.hashtags.join(' ') ?? ''
    );
    const [status, setStatus] = useState<DraftStatus>(draft?.status ?? 'draft');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (draft) {
            setCaptionText(draft.caption.text);
            setHashtagsText(draft.hashtags.join(' '));
            setStatus(draft.status);
        }
    }, [draftId]);

    if (!draft) {
        return (
            <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <Text style={{ color: colors.text.muted, fontFamily: fontFamilies.body.regular }}>
                    Draft not found
                </Text>
            </View>
        );
    }

    const handleSave = async () => {
        if (!captionText.trim()) {
            Toast.show({ type: 'error', text1: 'Caption cannot be empty' });
            return;
        }
        setSaving(true);
        try {
            // Parse hashtags — split on spaces and commas, ensure leading #
            const hashtags = hashtagsText
                .split(/[\s,]+/)
                .filter(Boolean)
                .map((t) => (t.startsWith('#') ? t : `#${t}`));

            // Remove old draft and add updated one (preserves sort order)
            await removeDraft(draftId);
            await addDraft({
                topic: draft.topic,
                caption: { ...draft.caption, text: captionText.trim() },
                hashtags,
                platform: draft.platform,
                format: draft.format,
                status,
                bestTimeToPost: draft.bestTimeToPost,
                engagementScore: draft.engagementScore,
                script: draft.script,
            });

            Toast.show({ type: 'success', text1: 'Draft saved ✓' });
            onSaved?.();
            onClose();
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Failed to save draft' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        crossPlatformConfirm(
            'Delete Draft',
            'This action cannot be undone.',
            async () => {
                await removeDraft(draftId);
                Toast.show({ type: 'success', text1: 'Draft deleted' });
                onClose();
            }
        );
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background.surface }}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.lg, color: colors.text.primary }}>
                    Edit Draft
                </Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.md, color: colors.text.muted }}>✕</Text>
                </TouchableOpacity>
            </View>

            {/* Caption */}
            <Text style={labelStyle}>CAPTION</Text>
            <TextInput
                value={captionText}
                onChangeText={setCaptionText}
                multiline
                numberOfLines={6}
                style={[inputStyle, { minHeight: 120, textAlignVertical: 'top' }]}
                placeholderTextColor={colors.text.muted}
                placeholder="Write your caption..."
            />

            {/* Hashtags */}
            <Text style={[labelStyle, { marginTop: spacing.lg }]}>HASHTAGS</Text>
            <TextInput
                value={hashtagsText}
                onChangeText={setHashtagsText}
                multiline
                style={[inputStyle, { minHeight: 72, textAlignVertical: 'top' }]}
                placeholderTextColor={colors.text.muted}
                placeholder="#fitness #motivation #reels"
                autoCapitalize="none"
            />
            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.xs, color: colors.text.muted, marginTop: 4 }}>
                Separate with spaces or commas. # is optional.
            </Text>

            {/* Status */}
            <Text style={[labelStyle, { marginTop: spacing.lg }]}>STATUS</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs }}>
                {STATUS_OPTIONS.map((s) => (
                    <TouchableOpacity
                        key={s}
                        onPress={() => setStatus(s)}
                        style={{
                            paddingVertical: spacing.xs,
                            paddingHorizontal: spacing.md,
                            borderRadius: radius.full,
                            borderWidth: 1,
                            borderColor: status === s ? STATUS_COLORS[s] : colors.border.subtle,
                            backgroundColor: status === s ? `${STATUS_COLORS[s]}22` : 'transparent',
                        }}
                    >
                        <Text style={{
                            fontFamily: fontFamilies.body.medium,
                            fontSize: fontSizes.sm,
                            color: status === s ? STATUS_COLORS[s] : colors.text.muted,
                            textTransform: 'capitalize',
                        }}>
                            {s}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Metadata row */}
            <View style={{ flexDirection: 'row', marginTop: spacing.lg, gap: spacing.sm }}>
                <View style={chipStyle}>
                    <Text style={chipTextStyle}>{draft.platform}</Text>
                </View>
                <View style={chipStyle}>
                    <Text style={chipTextStyle}>{draft.format}</Text>
                </View>
                <View style={chipStyle}>
                    <Text style={chipTextStyle}>Score {draft.engagementScore}</Text>
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={{
                    marginTop: spacing.xl,
                    paddingVertical: spacing.md,
                    borderRadius: radius.lg,
                    backgroundColor: colors.gold?.pure ?? '#D4AF37',
                    alignItems: 'center',
                }}
            >
                {saving ? (
                    <ActivityIndicator color="#000" size="small" />
                ) : (
                    <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.md, color: '#000' }}>
                        Save Changes
                    </Text>
                )}
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
                onPress={handleDelete}
                style={{
                    marginTop: spacing.sm,
                    paddingVertical: spacing.md,
                    borderRadius: radius.lg,
                    backgroundColor: `${colors.semantic?.error ?? '#FF6B6B'}18`,
                    borderWidth: 1,
                    borderColor: colors.semantic?.error ?? '#FF6B6B',
                    alignItems: 'center',
                }}
            >
                <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.md, color: colors.semantic?.error ?? '#FF6B6B' }}>
                    🗑 Delete Draft
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelStyle = {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.gold ?? colors.text.muted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
} as const;

const inputStyle = {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    backgroundColor: colors.background.base,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    lineHeight: 22,
} as const;

const chipStyle = {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.base,
    borderWidth: 1,
    borderColor: colors.border.hair,
} as const;

const chipTextStyle = {
    fontFamily: fontFamilies.mono.regular,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    textTransform: 'capitalize' as const,
};

export default DraftEditSheet;
