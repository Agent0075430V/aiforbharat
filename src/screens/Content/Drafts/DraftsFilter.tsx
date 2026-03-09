import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import type { DraftStatus } from '../../../types/content.types';
import type { Platform } from '../../../types/profile.types';
import colors from '../../../theme/colors';
import { spacing, radius } from '../../../theme/spacing';
import { fontFamilies, fontSizes } from '../../../theme/typography';

export interface DraftFilters {
    platform: Platform | 'all';
    status: DraftStatus | 'all';
}

interface DraftsFilterProps {
    filters: DraftFilters;
    onFiltersChange: (filters: DraftFilters) => void;
    totalCount: number;
    filteredCount: number;
}

const PLATFORMS: Array<Platform | 'all'> = ['all', 'instagram', 'youtube', 'linkedin', 'twitter', 'tiktok'];
const STATUSES: Array<DraftStatus | 'all'> = ['all', 'draft', 'approved', 'scheduled', 'posted'];

const PLATFORM_LABELS: Record<Platform | 'all', string> = {
    all: 'All',
    instagram: 'IG',
    youtube: 'YT',
    linkedin: 'LI',
    twitter: 'X',
    tiktok: 'TT',
};

const STATUS_LABELS: Record<DraftStatus | 'all', string> = {
    all: 'All',
    draft: 'Draft',
    approved: 'Approved',
    scheduled: 'Scheduled',
    posted: 'Posted',
};

const STATUS_COLORS: Record<DraftStatus | 'all', string> = {
    all: colors.text.secondary,
    draft: colors.text.muted,
    approved: '#4ECDC4',
    scheduled: colors.gold?.pure ?? '#D4AF37',
    posted: '#6BCB77',
};

export const DraftsFilter: React.FC<DraftsFilterProps> = ({
    filters,
    onFiltersChange,
    totalCount,
    filteredCount,
}) => {
    const setPlatform = (p: Platform | 'all') =>
        onFiltersChange({ ...filters, platform: p });

    const setStatus = (s: DraftStatus | 'all') =>
        onFiltersChange({ ...filters, status: s });

    const hasActiveFilters = filters.platform !== 'all' || filters.status !== 'all';

    const clearAll = () => onFiltersChange({ platform: 'all', status: 'all' });

    return (
        <View style={{ marginBottom: spacing.md }}>
            {/* Result count + clear */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <Text style={{ fontFamily: fontFamilies.body.regular, fontSize: fontSizes.xs, color: colors.text.muted }}>
                    {filteredCount} of {totalCount} drafts
                </Text>
                {hasActiveFilters && (
                    <TouchableOpacity onPress={clearAll}>
                        <Text style={{ fontFamily: fontFamilies.body.medium, fontSize: fontSizes.xs, color: colors.gold?.pure ?? '#D4AF37' }}>
                            Clear filters
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Platform row */}
            <Text style={sectionLabel}>PLATFORM</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
                <View style={{ flexDirection: 'row', gap: spacing.xs, paddingBottom: spacing.xs }}>
                    {PLATFORMS.map((p) => {
                        const active = filters.platform === p;
                        return (
                            <TouchableOpacity
                                key={p}
                                onPress={() => setPlatform(p)}
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
                                }}>
                                    {PLATFORM_LABELS[p]}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Status row */}
            <Text style={sectionLabel}>STATUS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: spacing.xs, paddingBottom: spacing.xs }}>
                    {STATUSES.map((s) => {
                        const active = filters.status === s;
                        const color = STATUS_COLORS[s];
                        return (
                            <TouchableOpacity
                                key={s}
                                onPress={() => setStatus(s)}
                                style={{
                                    paddingVertical: 6,
                                    paddingHorizontal: spacing.md,
                                    borderRadius: radius.full,
                                    borderWidth: 1,
                                    borderColor: active ? color : colors.border.subtle,
                                    backgroundColor: active ? `${color}22` : colors.background.surface,
                                }}
                            >
                                <Text style={{
                                    fontFamily: fontFamilies.body.medium,
                                    fontSize: fontSizes.sm,
                                    color: active ? color : colors.text.secondary,
                                    textTransform: 'capitalize',
                                }}>
                                    {STATUS_LABELS[s]}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const sectionLabel = {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
} as const;

export default DraftsFilter;
