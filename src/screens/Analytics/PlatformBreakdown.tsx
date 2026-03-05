import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Card from '../../components/ui/Card';
import type { PlatformStats } from '../../types/analytics.types';
import colors from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface PlatformBreakdownProps {
    platformStats: PlatformStats[];
}

const PLATFORM_EMOJIS: Record<string, string> = {
    instagram: '📸',
    youtube: '▶️',
    tiktok: '🎵',
    linkedin: '💼',
    twitter: '🐦',
};

const PLATFORM_COLORS: Record<string, string> = {
    instagram: '#E1306C',
    youtube: '#FF0000',
    tiktok: '#69C9D0',
    linkedin: '#0077B5',
    twitter: '#1DA1F2',
};

function formatFollowers(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

export const PlatformBreakdown: React.FC<PlatformBreakdownProps> = ({ platformStats }) => {
    if (!platformStats?.length) {
        return (
            <View style={{ padding: spacing.md, alignItems: 'center' }}>
                <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.sm, color: colors.text.muted }}>
                    No platform data yet
                </Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={{
                fontFamily: fontFamilies.heading.semibold,
                fontSize: fontSizes.lg,
                color: colors.text.primary,
                marginBottom: spacing.md,
            }}>
                By Platform
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: spacing.sm, paddingBottom: spacing.xs }}>
                    {platformStats.map((stat) => {
                        const accent = PLATFORM_COLORS[stat.platform] ?? colors.gold?.pure ?? '#D4AF37';
                        const emoji = PLATFORM_EMOJIS[stat.platform] ?? '📱';
                        return (
                            <Card
                                key={stat.platform}
                                style={{
                                    width: 180,
                                    borderRadius: radius.lg,
                                    padding: spacing.md,
                                    borderLeftWidth: 3,
                                    borderLeftColor: accent,
                                }}
                            >
                                {/* Platform header */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm }}>
                                    <Text style={{ fontSize: 18 }}>{emoji}</Text>
                                    <Text style={{
                                        fontFamily: fontFamilies.heading.medium,
                                        fontSize: fontSizes.sm,
                                        color: colors.text.primary,
                                        textTransform: 'capitalize',
                                    }}>
                                        {stat.platform}
                                    </Text>
                                </View>

                                {/* Followers */}
                                <StatRow
                                    label="Followers"
                                    value={formatFollowers(stat.followers)}
                                    accent={accent}
                                    highlight
                                />
                                <StatRow
                                    label="Growth"
                                    value={`+${stat.followersGrowth > 0 ? formatFollowers(stat.followersGrowth) : 0}`}
                                    accent={accent}
                                />
                                <StatRow
                                    label="Engagement"
                                    value={`${stat.engagementRate.toFixed(1)}%`}
                                    accent={accent}
                                />
                                <StatRow
                                    label="Avg. Likes"
                                    value={formatFollowers(stat.avgLikes)}
                                    accent={accent}
                                />
                                <StatRow
                                    label="Avg. Saves"
                                    value={formatFollowers(stat.avgSaves)}
                                    accent={accent}
                                />
                                <StatRow
                                    label="Total Posts"
                                    value={String(stat.totalPosts)}
                                    accent={accent}
                                />
                            </Card>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

// ─── Helper ───────────────────────────────────────────────────────────────────

const StatRow: React.FC<{ label: string; value: string; accent: string; highlight?: boolean }> = ({
    label, value, accent, highlight,
}) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
        <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.xs, color: colors.text.muted }}>
            {label}
        </Text>
        <Text style={{
            fontFamily: fontFamilies.mono.medium,
            fontSize: fontSizes.xs,
            color: highlight ? accent : colors.text.secondary,
        }}>
            {value}
        </Text>
    </View>
);

export default PlatformBreakdown;
