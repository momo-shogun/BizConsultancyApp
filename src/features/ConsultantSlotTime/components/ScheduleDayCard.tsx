import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { SCHEDULE_DAY_LABELS } from '@/features/ConsultantSlotTime/constants/scheduleConstants';
import type { ScheduleDayConfig } from '@/features/ConsultantSlotTime/types/consultantSchedule.types';
import { THEME } from '@/constants/theme';

import { TimeSelectField } from './TimeSelectField';

export interface ScheduleDayCardProps {
  day: ScheduleDayConfig;
  onToggleActive: (active: boolean) => void;
  onAddRange: () => void;
  onRemoveRange: (rangeIndex: number) => void;
  onUpdateRange: (
    rangeIndex: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => void;
}

export function ScheduleDayCard({
  day,
  onToggleActive,
  onAddRange,
  onRemoveRange,
  onUpdateRange,
}: ScheduleDayCardProps): React.ReactElement {
  return (
    <View style={[styles.card, !day.isActive ? styles.cardInactive : null]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Switch
            value={day.isActive}
            onValueChange={onToggleActive}
            trackColor={{ false: '#CBD5E1', true: '#6EE7B7' }}
            thumbColor={day.isActive ? '#059669' : '#F8FAFC'}
          />
          <Text style={styles.dayLabel}>{SCHEDULE_DAY_LABELS[day.dayOfWeek] ?? 'Day'}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add time slot"
          disabled={!day.isActive}
          onPress={onAddRange}
          style={({ pressed }) => [
            styles.addBtn,
            !day.isActive ? styles.addBtnDisabled : null,
            pressed && day.isActive ? { opacity: 0.88 } : null,
          ]}
        >
          <Ionicons name="add" size={16} color={day.isActive ? '#059669' : '#94A3B8'} />
          <Text style={[styles.addBtnText, !day.isActive ? styles.addBtnTextDisabled : null]}>
            Add time
          </Text>
        </Pressable>
      </View>

      {!day.isActive ? (
        <Text style={styles.hint}>Switch on to allow bookings.</Text>
      ) : (
        <View style={styles.ranges}>
          {day.ranges.map((range, rangeIndex) => (
            <View key={`${day.dayOfWeek}-${rangeIndex}`} style={styles.rangeRow}>
              <TimeSelectField
                label="From"
                value={range.startTime}
                onChange={(next) => onUpdateRange(rangeIndex, 'startTime', next)}
              />
              <Text style={styles.dash}>–</Text>
              <TimeSelectField
                label="To"
                value={range.endTime}
                onChange={(next) => onUpdateRange(rangeIndex, 'endTime', next)}
              />
              {day.ranges.length > 1 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove time range"
                  onPress={() => onRemoveRange(rangeIndex)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="remove-circle-outline" size={22} color="#DC2626" />
                </Pressable>
              ) : (
                <View style={styles.removeSpacer} />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: THEME.spacing[14],
    gap: THEME.spacing[10],
  },
  cardInactive: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    flex: 1,
    minWidth: 0,
  },
  dayLabel: {
    flex: 1,
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  addBtn: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.35)',
    backgroundColor: 'rgba(5,150,105,0.08)',
  },
  addBtnDisabled: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  addBtnTextDisabled: {
    color: '#94A3B8',
  },
  hint: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 17,
  },
  ranges: {
    gap: THEME.spacing[8],
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
    padding: THEME.spacing[10],
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dash: {
    fontSize: THEME.typography.size[14],
    color: '#94A3B8',
    fontWeight: '600',
  },
  removeBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  removeSpacer: {
    width: 30,
  },
});
