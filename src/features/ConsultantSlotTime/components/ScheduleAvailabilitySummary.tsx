import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { SCHEDULE_DAY_LABELS } from '@/features/ConsultantSlotTime/constants/scheduleConstants';
import type {
  ConsultantAvailabilityOverride,
  ScheduleDayConfig,
} from '@/features/ConsultantSlotTime/types/consultantSchedule.types';
import { formatOverrideDisplay } from '@/features/ConsultantSlotTime/utils/scheduleDisplay';
import { THEME } from '@/constants/theme';

export interface ScheduleAvailabilitySummaryProps {
  scheduleDays: ScheduleDayConfig[];
  overrides: ConsultantAvailabilityOverride[];
  onManageDaysOff: () => void;
}

export function ScheduleAvailabilitySummary(
  props: ScheduleAvailabilitySummaryProps,
): React.ReactElement {
  const { scheduleDays, overrides, onManageDaysOff } = props;

  const weeklyOffLabels = useMemo((): string[] => {
    return scheduleDays
      .filter((day) => !day.isActive)
      .map((day) => SCHEDULE_DAY_LABELS[day.dayOfWeek] ?? 'Day');
  }, [scheduleDays]);

  const sortedOverrides = useMemo(
    () =>
      [...overrides].sort((a, b) => a.overrideDate.localeCompare(b.overrideDate)),
    [overrides],
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>When you are off</Text>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>Every week</Text>
        {weeklyOffLabels.length === 0 ? (
          <Text style={styles.muted}>All days are open in your weekly hours.</Text>
        ) : (
          <View style={styles.chipRow}>
            {weeklyOffLabels.map((label) => (
              <View key={label} style={styles.chipOff}>
                <Text style={styles.chipOffText}>{label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockLabel}>Blocked dates</Text>
        {sortedOverrides.length === 0 ? (
          <Text style={styles.muted}>No single-day blocks yet.</Text>
        ) : (
          <View style={styles.dateList}>
            {sortedOverrides.slice(0, 4).map((override) => (
              <View key={override.id} style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color="#BE123C" />
                <Text style={styles.dateText} numberOfLines={1}>
                  {formatOverrideDisplay(override)}
                </Text>
              </View>
            ))}
            {sortedOverrides.length > 4 ? (
              <Text style={styles.moreText}>+{sortedOverrides.length - 4} more in Days off</Text>
            ) : null}
          </View>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onManageDaysOff}
        style={({ pressed }) => [styles.linkBtn, pressed ? { opacity: 0.88 } : null]}
      >
        <Text style={styles.linkBtnText}>Add or edit days off</Text>
        <Ionicons name="chevron-forward" size={16} color="#059669" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: THEME.spacing[16],
    gap: THEME.spacing[14],
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  block: {
    gap: THEME.spacing[8],
  },
  blockLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  muted: {
    fontSize: THEME.typography.size[13],
    color: '#64748B',
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  chipOff: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(244,63,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244,63,94,0.22)',
  },
  chipOffText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: '#BE123C',
  },
  dateList: {
    gap: THEME.spacing[8],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    flex: 1,
    fontSize: THEME.typography.size[13],
    color: '#334155',
    fontWeight: '500',
  },
  moreText: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    fontStyle: 'italic',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: THEME.spacing[10],
    borderRadius: 12,
    backgroundColor: 'rgba(5,150,105,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.2)',
  },
  linkBtnText: {
    fontSize: THEME.typography.size[13],
    fontWeight: '700',
    color: '#047857',
  },
});
