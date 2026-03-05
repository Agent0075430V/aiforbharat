import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useProfile } from '../../store/ProfileContext';
import { saveUser } from '../../services/aws/mediora.service';
import type { Niche, Tone, Language, Platform, PostingFrequency } from '../../types/profile.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

// ─── Option sets ──────────────────────────────────────────────────────────────

const NICHES: Niche[] = ['fitness', 'food', 'tech', 'fashion', 'travel', 'education', 'finance', 'lifestyle', 'gaming', 'entertainment'];
const TONES: { value: Tone; label: string }[] = [
    { value: 'bold_direct', label: 'Bold & Direct' },
    { value: 'warm_relatable', label: 'Warm & Relatable' },
    { value: 'informative_clear', label: 'Informative & Clear' },
    { value: 'playful_funny', label: 'Playful & Funny' },
];
const LANGUAGES: Language[] = ['English', 'Hindi', 'Hinglish', 'Tamil', 'Telugu'];
const PLATFORMS: Platform[] = ['instagram', 'youtube', 'tiktok', 'linkedin', 'twitter'];
const FREQUENCIES: { value: PostingFrequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: '3_4_per_week', label: '3-4× / week' },
    { value: '1_2_per_week', label: '1-2× / week' },
    { value: 'irregular', label: 'Irregular' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const ProfileSection: React.FC = () => {
    const { profile, setProfile } = useProfile();
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Get the real Cognito userId from AsyncStorage
    useEffect(() => {
        AsyncStorage.getItem('last_user_id').then((id) => {
            if (id) setUserId(id);
        });
    }, []);

    // Local editable state — mirrors profile fields
    const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
    const [bio, setBio] = useState(profile?.bio ?? '');
    const [niche, setNiche] = useState<Niche>(profile?.niche ?? 'lifestyle');
    const [tone, setTone] = useState<Tone>(profile?.tone ?? 'warm_relatable');
    const [language, setLanguage] = useState<Language>(profile?.language ?? 'English');
    const [platforms, setPlatforms] = useState<Platform[]>(profile?.platforms ?? ['instagram']);
    const [frequency, setFrequency] = useState<PostingFrequency>(profile?.postingFrequency ?? '3_4_per_week');

    // Re-sync form when profile first loads from AsyncStorage
    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName ?? '');
            setBio(profile.bio ?? '');
            setNiche(profile.niche ?? 'lifestyle');
            setTone(profile.tone ?? 'warm_relatable');
            setLanguage(profile.language ?? 'English');
            setPlatforms(profile.platforms ?? ['instagram']);
            setFrequency(profile.postingFrequency ?? '3_4_per_week');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!!profile]); // only re-sync when profile goes undefined→defined

    const togglePlatform = (p: Platform) => {
        setPlatforms((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
    };

    const handleSave = async () => {
        if (!displayName.trim()) {
            Toast.show({ type: 'error', text1: 'Display name cannot be empty' });
            return;
        }
        if (platforms.length === 0) {
            Toast.show({ type: 'error', text1: 'Select at least one platform' });
            return;
        }

        setSaving(true);
        try {
            const updatedProfile = {
                ...(profile as any),
                displayName: displayName.trim(),
                bio: bio.trim(),
                niche,
                tone,
                language,
                platforms,
                primaryPlatform: platforms[0],
                postingFrequency: frequency,
            };
            await setProfile(updatedProfile);

            // Sync to DynamoDB
            if (userId) {
                await saveUser({ userId, niche, tone, language });
            }

            Toast.show({ type: 'success', text1: 'Profile updated ✓' });
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Failed to save profile' });
        } finally {
            setSaving(false);
        }
    };

    if (!profile) {
        return (
            <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                <Text style={{ fontFamily: fontFamilies.body.regular, color: colors.text.muted }}>
                    Complete onboarding to edit your profile
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Archetype badge */}
            <View style={{
                marginBottom: spacing.xl,
                padding: spacing.md,
                backgroundColor: colors.background.surface,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.border.subtle,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
            }}>
                <Text style={{ fontSize: 32 }}>
                    {profile.archetype === 'EDUCATOR' ? '📚'
                        : profile.archetype === 'ENTERTAINER' ? '🎭'
                            : profile.archetype === 'STORYTELLER' ? '📖'
                                : profile.archetype === 'STRATEGIST' ? '♟️'
                                    : profile.archetype === 'VISIONARY' ? '🔭'
                                        : profile.archetype === 'ARTIST' ? '🎨'
                                            : profile.archetype === 'ADVOCATE' ? '📢'
                                                : '🤝'}
                </Text>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fontFamilies.heading.semibold, fontSize: fontSizes.md, color: colors.text.primary }}>
                        {profile.archetype}
                    </Text>
                    <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.xs, color: colors.text.muted }}>
                        Creator archetype from your quiz
                    </Text>
                </View>
            </View>

            {/* Display Name */}
            <FieldLabel>DISPLAY NAME</FieldLabel>
            <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={inputStyle}
                placeholder="Your name or handle"
                placeholderTextColor={colors.text.muted}
            />

            {/* Bio */}
            <FieldLabel>BIO</FieldLabel>
            <TextInput
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                style={[inputStyle, { minHeight: 72, textAlignVertical: 'top' }]}
                placeholder="Short bio (optional)"
                placeholderTextColor={colors.text.muted}
            />

            {/* Niche */}
            <FieldLabel>NICHE</FieldLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg }}>
                {NICHES.map((n) => (
                    <ChipButton
                        key={n}
                        label={n}
                        active={niche === n}
                        onPress={() => setNiche(n)}
                    />
                ))}
            </View>

            {/* Tone */}
            <FieldLabel>CONTENT TONE</FieldLabel>
            <View style={{ gap: spacing.xs, marginBottom: spacing.lg }}>
                {TONES.map(({ value, label }) => (
                    <TouchableOpacity
                        key={value}
                        onPress={() => setTone(value)}
                        style={{
                            padding: spacing.md,
                            borderRadius: radius.md,
                            borderWidth: 1,
                            borderColor: tone === value ? colors.gold?.pure ?? '#D4AF37' : colors.border.subtle,
                            backgroundColor: tone === value ? `${colors.gold?.pure ?? '#D4AF37'}15` : colors.background.surface,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View style={{
                            width: 18, height: 18, borderRadius: 9,
                            borderWidth: 2,
                            borderColor: tone === value ? colors.gold?.pure ?? '#D4AF37' : colors.border.subtle,
                            backgroundColor: tone === value ? colors.gold?.pure ?? '#D4AF37' : 'transparent',
                            marginRight: spacing.sm,
                        }} />
                        <Text style={{
                            fontFamily: fontFamilies.body.medium,
                            fontSize: fontSizes.sm,
                            color: tone === value ? colors.text.primary : colors.text.secondary,
                        }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Language */}
            <FieldLabel>PREFERRED LANGUAGE</FieldLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg }}>
                {LANGUAGES.map((l) => (
                    <ChipButton
                        key={l}
                        label={l}
                        active={language === l}
                        onPress={() => setLanguage(l)}
                    />
                ))}
            </View>

            {/* Platforms */}
            <FieldLabel>PLATFORMS</FieldLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg }}>
                {PLATFORMS.map((p) => (
                    <ChipButton
                        key={p}
                        label={p}
                        active={platforms.includes(p)}
                        onPress={() => togglePlatform(p)}
                    />
                ))}
            </View>

            {/* Posting Frequency */}
            <FieldLabel>POSTING FREQUENCY</FieldLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xl }}>
                {FREQUENCIES.map(({ value, label }) => (
                    <ChipButton
                        key={value}
                        label={label}
                        active={frequency === value}
                        onPress={() => setFrequency(value)}
                    />
                ))}
            </View>

            {/* Save button */}
            <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={{
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
                        Save Profile
                    </Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Text style={{
        fontFamily: fontFamilies.body.medium,
        fontSize: fontSizes.xs,
        color: colors.text.gold ?? colors.text.muted,
        letterSpacing: 1,
        marginBottom: spacing.xs,
        marginTop: 0,
    }}>
        {children}
    </Text>
);

const ChipButton: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            paddingVertical: 6,
            paddingHorizontal: spacing.md,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: active ? colors.gold?.pure ?? '#D4AF37' : colors.border.subtle,
            backgroundColor: active ? `${colors.gold?.pure ?? '#D4AF37'}22` : colors.background.surface,
        }}
    >
        <Text style={{
            fontFamily: fontFamilies.body.medium,
            fontSize: fontSizes.sm,
            color: active ? colors.gold?.pure ?? '#D4AF37' : colors.text.secondary,
            textTransform: 'capitalize',
        }}>
            {label}
        </Text>
    </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputStyle = {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    backgroundColor: colors.background.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.lg,
} as const;

export default ProfileSection;
