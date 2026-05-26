import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { SCHEDULE_DAY_LABELS } from '@/features/ConsultantSlotTime/constants/scheduleConstants';
import type { ScheduleDayConfig } from '@/features/ConsultantSlotTime/types/consultantSchedule.types';
import { THEME } from '@/constants/theme';

import { TimeSelectField } from './TimeSelectField';

export interface ScheduleDayCardProps {
  day: ScheduleDayConfig;
  isLast?: boolean;
  onToggleActive: (active: boolean) => void;
  onAddRange: () => void;
  onRemoveRange: (rangeIndex: number) => void;
  onUpdateRange: (
    rangeIndex: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => void;
  onAddDayOff?: () => void;
}

export function ScheduleDayCard({
  day,
  isLast = false,
  onToggleActive,
  onAddRange,
  onRemoveRange,
  onUpdateRange,
  onAddDayOff,
}: ScheduleDayCardProps): React.ReactElement {
  const dayName = SCHEDULE_DAY_LABELS[day.dayOfWeek] ?? 'Day';
  const isOpen = day.isActive;

  return (
    <View style={[styles.dayRow, !isLast ? styles.dayRowBorder : null]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.dayLabel}>{dayName}</Text>
            <View style={[styles.statusPill, isOpen ? styles.statusOpen : styles.statusClosed]}>
              <Text
                style={[
                  styles.statusText,
                  isOpen ? styles.statusTextOpen : styles.statusTextClosed,
                ]}
              >
                {isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          {isOpen ? (
            <Text style={styles.switchHint}>Clients can book on this day</Text>
          ) : (
            <Text style={styles.switchHint}>No bookings every week on this day</Text>
          )}
        </View>
        <Switch
          value={isOpen}
          onValueChange={onToggleActive}
          trackColor={{ false: '#CBD5E1', true: '#6EE7B7' }}
          thumbColor={isOpen ? '#059669' : '#F8FAFC'}
          accessibilityLabel={`${dayName} available for booking`}
        />
      </View>

      {!isOpen ? (
        onAddDayOff != null ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAddDayOff}
            style={({ pressed }) => [styles.dayOffLink, pressed ? { opacity: 0.88 } : null]}
          >
            <Ionicons name="calendar-outline" size={14} color="#059669" />
            <Text style={styles.dayOffLinkText}>One date only? Days off tab</Text>
          </Pressable>
        ) : null
      ) : (
        <View style={styles.openBody}>
          {day.ranges.map((range, rangeIndex) => (
            <View key={`${day.dayOfWeek}-${rangeIndex}`} style={styles.slotBlock}>
              {day.ranges.length > 1 ? (
                <View style={styles.slotHeader}>
                  <Text style={styles.slotLabel}>Slot {rangeIndex + 1}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove time slot"
                    onPress={() => onRemoveRange(rangeIndex)}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  </Pressable>
                </View>
              ) : null}

              <View style={styles.timeFields}>
                <View style={styles.timeField}>
                  <Text style={styles.timeFieldLabel}>Start</Text>
                  <TimeSelectField
                    label="Start"
                    value={range.startTime}
                    onChange={(next) => onUpdateRange(rangeIndex, 'startTime', next)}
                    flexible
                  />
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.timeFieldLabel}>End</Text>
                  <TimeSelectField
                    label="End"
                    value={range.endTime}
                    onChange={(next) => onUpdateRange(rangeIndex, 'endTime', next)}
                    flexible
                  />
                </View>
              </View>
            </View>
          ))}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add another time slot"
            onPress={onAddRange}
            style={({ pressed }) => [styles.addSlotBtn, pressed ? { opacity: 0.88 } : null]}
          >
            <Ionicons name="add" size={16} color="#059669" />
            <Text style={styles.addSlotBtnText}>Add time slot</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dayRow: {
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[14],
    gap: THEME.spacing[12],
    backgroundColor: THEME.colors.white,
  },
  dayRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[10],
  },
  headerLeft: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  dayLabel: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusOpen: {
    backgroundColor: 'rgba(5,150,105,0.12)',
  },
  statusClosed: {
    backgroundColor: 'rgba(148,163,184,0.2)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextOpen: {
    color: '#047857',
  },
  statusTextClosed: {
    color: '#64748B',
  },
  switchHint: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 17,
  },
  dayOffLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  dayOffLinkText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: '#047857',
  },
  openBody: {
    gap: THEME.spacing[12],
  },
  slotBlock: {
    gap: THEME.spacing[8],
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: '#64748B',
  },
  timeFields: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
  },
  timeField: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  timeFieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  addSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  addSlotBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: '#059669',
  },
});
