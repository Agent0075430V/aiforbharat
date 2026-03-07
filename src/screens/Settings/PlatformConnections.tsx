import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useProfile } from '../../store/ProfileContext';
import { callGroqForJSON } from '../../services/api/groq.service';
import { ARCHETYPES } from '../../constants/quiz.constants';
import type { Platform, CreatorArchetype } from '../../types/profile.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

// ─── Platform definitions ─────────────────────────────────────────────────────

interface PlatformDef {
    key: Platform;
    label: string;
    icon: string;
    color: string;
    placeholder: string;
    urlBase: string;
}

const PLATFORMS: PlatformDef[] = [
    {
        key: 'instagram',
        label: 'Instagram',
        icon: '📸',
        color: colors.platform.instagram,
        placeholder: '@yourhandle',
        urlBase: 'https://instagram.com/',
    },
    {
        key: 'youtube',
        label: 'YouTube',
        icon: '▶️',
        color: colors.platform.youtube,
        placeholder: '@yourchannel',
        urlBase: 'https://youtube.com/@',
    },
    {
        key: 'tiktok',
        label: 'TikTok',
        icon: '🎵',
        color: colors.platform.tiktok,
        placeholder: '@yourhandle',
        urlBase: 'https://tiktok.com/@',
    },
    {
        key: 'linkedin',
        label: 'LinkedIn',
        icon: '💼',
        color: colors.platform.linkedin,
        placeholder: 'your-profile-slug',
        urlBase: 'https://linkedin.com/in/',
    },
    {
        key: 'twitter',
        label: 'Twitter / X',
        icon: '𝕏',
        color: colors.platform.twitter,
        placeholder: '@yourhandle',
        urlBase: 'https://x.com/',
    },
];

const VALID_ARCHETYPES: CreatorArchetype[] = [
    'VISIONARY', 'EDUCATOR', 'ENTERTAINER', 'STORYTELLER',
    'STRATEGIST', 'ARTIST', 'ADVOCATE', 'CONNECTOR',
];

// ─── Component ────────────────────────────────────────────────────────────────

export const PlatformConnections: React.FC = () => {
    const { profile, setProfile } = useProfile();

    // Local edit state per platform
    const [handles, setHandles] = useState<Partial<Record<Platform, string>>>(
        profile?.socialHandles ?? {}
    );
    const [followers, setFollowers] = useState<Partial<Record<Platform, string>>>(
        Object.fromEntries(
            Object.entries(profile?.followerCounts ?? {}).map(([k, v]) => [k, v ? String(v) : ''])
        )
    );

    const [saving, setSaving] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verifyResult, setVerifyResult] = useState<{
        confirmedArchetype: CreatorArchetype;
        confidence: string;
        reasoning: string;
        suggestion?: string;
    } | null>(null);

    // ─── Save handles to profile ──────────────────────────────────────────────

    const handleSave = async () => {
        if (!profile) {
            Toast.show({ type: 'error', text1: 'No profile found', text2: 'Complete the quiz first.' });
            return;
        }
        setSaving(true);
        try {
            const cleanHandles: Partial<Record<Platform, string>> = {};
            const cleanFollowers: Partial<Record<Platform, number>> = {};

            for (const { key } of PLATFORMS) {
                const h = handles[key]?.trim().replace(/^@/, '');
                if (h) cleanHandles[key] = h;

                const f = followers[key]?.trim().replace(/[,_]/g, '');
                const fNum = f ? parseInt(f, 10) : NaN;
                if (!isNaN(fNum) && fNum > 0) cleanFollowers[key] = fNum;
            }

            await setProfile({ ...profile, socialHandles: cleanHandles, followerCounts: cleanFollowers });
            Toast.show({ type: 'success', text1: '✅ Accounts saved!', text2: 'Your social handles are now linked.' });
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Save failed', text2: 'Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    // ─── AI double-check ──────────────────────────────────────────────────────

    const handleVerify = async () => {
        if (!profile) {
            Toast.show({ type: 'error', text1: 'No profile', text2: 'Complete the quiz first.' });
            return;
        }

        const linkedHandles = Object.entries(handles)
            .filter(([, v]) => v?.trim())
            .map(([platform, handle]) => `${platform}: @${handle?.replace(/^@/, '')}`)
            .join(', ');

        if (!linkedHandles) {
            Toast.show({ type: 'info', text1: 'Add your handles first', text2: 'Enter at least one social media handle.' });
            return;
        }

        setVerifying(true);
        setVerifyResult(null);

        const prompt = `
You are Mediora AI, an expert social media analyst assessing creator archetypes.

A creator completed a quiz and was assigned archetype: "${profile.archetype}".

QUIZ ANSWERS:
- Creator type self-described: ${profile.quizAnswers?.creatorType ?? 'unknown'}
- Posting tone: ${profile.tone}
- Content formats: ${profile.contentFormats?.join(', ') ?? 'unknown'}
- Primary goal: ${profile.primaryGoal}
- Biggest challenge: ${profile.quizAnswers?.biggestChallenge ?? 'unknown'}
- Audience location: ${profile.audienceLocation}

SOCIAL MEDIA PRESENCE:
- Linked accounts: ${linkedHandles}
- Follower counts: ${Object.entries(profile.followerCounts ?? {}).map(([p, c]) => `${p}: ${c?.toLocaleString()}`).join(', ') || 'not provided'}
- Platforms in quiz: ${profile.platforms?.join(', ') ?? 'unknown'}
- Niche: ${profile.niche}

VALID ARCHETYPES: VISIONARY, EDUCATOR, ENTERTAINER, STORYTELLER, STRATEGIST, ARTIST, ADVOCATE, CONNECTOR

Based on this data, evaluate whether "${profile.archetype}" is the right archetype.
Consider: Educators typically make carousels/long videos with informative tone. Entertainers make reels with playful tone. Visionaries post aspirational lifestyle content. Strategists are data-driven with bold tone. Artists are visual-first. Storytellers make emotional, personal content. Connectors focus on community. Advocates are purpose-driven.

Return ONLY valid JSON:
{
  "confirmedArchetype": "<the best archetype from the valid list>",
  "confidence": "<High / Medium / Low>",
  "reasoning": "<2-3 sentences explaining why this archetype fits based on their data>",
  "suggestion": "<Optional: one specific content tip tailored to their archetype and platforms>"
}
`.trim();

        try {
            const result = await callGroqForJSON<{
                confirmedArchetype: string;
                confidence: string;
                reasoning: string;
                suggestion?: string;
            }>(prompt);

            const confirmed = (result.confirmedArchetype?.toUpperCase() ?? '') as CreatorArchetype;
            if (!VALID_ARCHETYPES.includes(confirmed)) {
                throw new Error(`Invalid archetype returned: ${confirmed}`);
            }

            setVerifyResult({
                confirmedArchetype: confirmed,
                confidence: result.confidence ?? 'Medium',
                reasoning: result.reasoning ?? '',
                suggestion: result.suggestion,
            });

            // If archetype changed, offer to update profile
            if (confirmed !== profile.archetype) {
                Alert.alert(
                    '🤔 Archetype Mismatch',
                    `Your quiz said "${profile.archetype}" but based on your social presence, Mediora thinks "${confirmed}" fits better.\n\nUpdate your profile?`,
                    [
                        { text: 'Keep original', style: 'cancel' },
                        {
                            text: `Switch to ${confirmed}`,
                            onPress: async () => {
                                await setProfile({ ...profile, archetype: confirmed });
                                Toast.show({ type: 'success', text1: '✅ Archetype updated!', text2: `You are now: ${ARCHETYPES[confirmed].name}` });
                            },
                        },
                    ]
                );
            }
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Verification failed',
                text2: err?.message?.includes('API_KEY') ? 'Add EXPO_PUBLIC_GROQ_API_KEY to .env (free at console.groq.com)' : 'Could not verify archetype. Try again.',
            });
        } finally {
            setVerifying(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    const currentArchetype = profile?.archetype ? ARCHETYPES[profile.archetype] : null;

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background.base }}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <Text style={{
                fontFamily: fontFamilies.heading.semibold,
                fontSize: 20,
                color: colors.text.primary,
                marginBottom: spacing.xs,
            }}>
                Link Social Accounts
            </Text>
            <Text style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.muted,
                marginBottom: spacing.xl,
            }}>
                Add your handles so Mediora can verify your archetype matches your real presence.
            </Text>

            {/* Current archetype pill */}
            {currentArchetype && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing.sm,
                    borderRadius: radius.lg,
                    backgroundColor: colors.background.surface,
                    borderWidth: 1,
                    borderColor: colors.border.gold,
                    marginBottom: spacing.xl,
                    gap: spacing.sm,
                }}>
                    <Text style={{ fontSize: 22 }}>{currentArchetype.icon}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.xs, color: colors.text.muted }}>
                            Current archetype
                        </Text>
                        <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.md, color: colors.text.gold }}>
                            {currentArchetype.name}
                        </Text>
                    </View>
                </View>
            )}

            {/* Platform rows */}
            {PLATFORMS.map((p) => {
                const isLinked = !!(handles[p.key]?.trim());
                return (
                    <View key={p.key} style={{
                        marginBottom: spacing.md,
                        padding: spacing.md,
                        borderRadius: radius.lg,
                        backgroundColor: colors.background.surface,
                        borderWidth: 1,
                        borderColor: isLinked ? `${p.color}55` : colors.border.subtle,
                    }}>
                        {/* Row header */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm }}>
                            <Text style={{ fontSize: 18 }}>{p.icon}</Text>
                            <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.sm, color: p.color, flex: 1 }}>
                                {p.label}
                            </Text>
                            {isLinked && (
                                <View style={{
                                    paddingHorizontal: spacing.sm,
                                    paddingVertical: 2,
                                    borderRadius: radius.full ?? 99,
                                    backgroundColor: `${colors.semantic.success}22`,
                                }}>
                                    <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: 10, color: colors.semantic.success }}>
                                        ✓ Linked
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Handle input */}
                        <TextInput
                            value={handles[p.key] ?? ''}
                            onChangeText={(t) => setHandles((prev) => ({ ...prev, [p.key]: t }))}
                            placeholder={p.placeholder}
                            placeholderTextColor={colors.text.muted}
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={{
                                fontFamily: fontFamilies.body.regular,
                                fontSize: fontSizes.sm,
                                color: colors.text.primary,
                                backgroundColor: colors.background.elevated,
                                borderRadius: radius.md,
                                padding: spacing.sm,
                                borderWidth: 1,
                                borderColor: colors.border.hair,
                                marginBottom: spacing.sm,
                            }}
                        />

                        {/* Follower count input */}
                        <TextInput
                            value={followers[p.key] ?? ''}
                            onChangeText={(t) => setFollowers((prev) => ({ ...prev, [p.key]: t }))}
                            placeholder="Followers (e.g. 15000), optional"
                            placeholderTextColor={colors.text.muted}
                            keyboardType="numeric"
                            style={{
                                fontFamily: fontFamilies.body.regular,
                                fontSize: fontSizes.sm,
                                color: colors.text.secondary,
                                backgroundColor: colors.background.elevated,
                                borderRadius: radius.md,
                                padding: spacing.sm,
                                borderWidth: 1,
                                borderColor: colors.border.hair,
                            }}
                        />
                    </View>
                );
            })}

            {/* Save button */}
            <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={{
                    padding: spacing.md,
                    borderRadius: radius.lg,
                    backgroundColor: colors.gold.pure,
                    alignItems: 'center',
                    marginBottom: spacing.md,
                    opacity: saving ? 0.7 : 1,
                }}
            >
                {saving ? (
                    <ActivityIndicator color={colors.background.base} size="small" />
                ) : (
                    <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.md, color: colors.background.base }}>
                        Save Linked Accounts
                    </Text>
                )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: colors.border.subtle, marginVertical: spacing.md }} />

            {/* AI Double-check */}
            <Text style={{
                fontFamily: fontFamilies.heading.medium,
                fontSize: fontSizes.md,
                color: colors.text.primary,
                marginBottom: spacing.xs,
            }}>
                🤖 AI Archetype Verification
            </Text>
            <Text style={{
                fontFamily: fontFamilies.body.regular,
                fontSize: fontSizes.sm,
                color: colors.text.muted,
                marginBottom: spacing.md,
            }}>
                Mediora analyses your social presence and quiz answers together to confirm (or refine) your archetype.
            </Text>

            <TouchableOpacity
                onPress={handleVerify}
                disabled={verifying}
                style={{
                    padding: spacing.md,
                    borderRadius: radius.lg,
                    backgroundColor: colors.background.surface,
                    borderWidth: 1,
                    borderColor: colors.teal.pure,
                    alignItems: 'center',
                    marginBottom: spacing.lg,
                    opacity: verifying ? 0.7 : 1,
                }}
            >
                {verifying ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <ActivityIndicator color={colors.teal.pure} size="small" />
                        <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.md, color: colors.teal.pure }}>
                            Analysing your profile…
                        </Text>
                    </View>
                ) : (
                    <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.md, color: colors.teal.pure }}>
                        ✦ Double-Check My Archetype
                    </Text>
                )}
            </TouchableOpacity>

            {/* Verification result card */}
            {verifyResult && (
                <View style={{
                    padding: spacing.md,
                    borderRadius: radius.lg,
                    backgroundColor: colors.background.surface,
                    borderWidth: 1,
                    borderColor: verifyResult.confirmedArchetype === profile?.archetype
                        ? colors.border.gold
                        : `${colors.semantic.info}55`,
                    gap: spacing.sm,
                }}>
                    {/* Result header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <Text style={{ fontSize: 24 }}>{ARCHETYPES[verifyResult.confirmedArchetype].icon}</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.xs, color: colors.text.muted }}>
                                Mediora says you are
                            </Text>
                            <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.lg, color: colors.text.gold }}>
                                {ARCHETYPES[verifyResult.confirmedArchetype].name}
                            </Text>
                        </View>
                        <View style={{
                            paddingHorizontal: spacing.sm,
                            paddingVertical: 4,
                            borderRadius: radius.full ?? 99,
                            backgroundColor:
                                verifyResult.confidence === 'High' ? `${colors.semantic.success}22` :
                                    verifyResult.confidence === 'Low' ? `${colors.semantic.warning}22` :
                                        `${colors.semantic.info}22`,
                        }}>
                            <Text style={{
                                fontFamily: fontFamilies.body.medium,
                                fontSize: 10,
                                color:
                                    verifyResult.confidence === 'High' ? colors.semantic.success :
                                        verifyResult.confidence === 'Low' ? colors.semantic.warning :
                                            colors.semantic.info,
                            }}>
                                {verifyResult.confidence} confidence
                            </Text>
                        </View>
                    </View>

                    {/* Reasoning */}
                    <Text style={{
                        fontFamily: fontFamilies.body.regular,
                        fontSize: fontSizes.sm,
                        color: colors.text.secondary,
                        lineHeight: 20,
                    }}>
                        {verifyResult.reasoning}
                    </Text>

                    {/* Suggestion */}
                    {verifyResult.suggestion && (
                        <View style={{
                            padding: spacing.sm,
                            borderRadius: radius.md,
                            backgroundColor: colors.background.elevated,
                            borderLeftWidth: 2,
                            borderLeftColor: colors.teal.pure,
                        }}>
                            <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.xs, color: colors.text.teal, marginBottom: 4 }}>
                                💡 Content Tip
                            </Text>
                            <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.secondary }}>
                                {verifyResult.suggestion}
                            </Text>
                        </View>
                    )}

                    {/* Match / mismatch badge */}
                    {verifyResult.confirmedArchetype === profile?.archetype ? (
                        <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.sm, color: colors.semantic.success, textAlign: 'center' }}>
                            ✅ Your quiz archetype is confirmed!
                        </Text>
                    ) : (
                        <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.sm, color: colors.semantic.warning, textAlign: 'center' }}>
                            ⚠️ Tap "Double-Check" above again to apply the updated archetype
                        </Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

export default PlatformConnections;
