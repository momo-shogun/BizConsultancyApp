import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getSlotMinutesFromLabel } from '@/features/ConsultantSlotTime/utils/scheduleValidation';
import { DatePickerField } from '@/shared/components';
import { THEME } from '@/constants/theme';

export interface SlotPreviewSectionProps {
  previewDate: Date;
  onPreviewDateChange: (date: Date) => void;
  slots: string[];
  isLoading: boolean;
  slugMissing: boolean;
}

export function SlotPreviewSection({
  previewDate,
  onPreviewDateChange,
  slots,
  isLoading,
  slugMissing,
}: SlotPreviewSectionProps): React.ReactElement {
  const chips = useMemo(() => {
    const now = new Date();
    const isSameDay =
      now.getFullYear() === previewDate.getFullYear() &&
      now.getMonth() === previewDate.getMonth() &&
      now.getDate() === previewDate.getDate();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return slots.map((slot) => {
      const slotMinutes = getSlotMinutesFromLabel(slot);
      const isPast = Boolean(isSameDay && slotMinutes != null && slotMinutes <= nowMinutes);
      return { slot, isPast };
    });
  }, [previewDate, slots]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="eye-outline" size={20} color="#059669" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Check your times</Text>
          <Text style={styles.subtitle}>See what clients can book on a day.</Text>
        </View>
      </View>

      <DatePickerField
        label="Pick a day"
        value={previewDate}
        onChange={onPreviewDateChange}
        minimumDate={new Date()}
        accessibilityLabel="Pick a day to preview"
        placeholder="Choose date"
      />

      {slugMissing ? (
        <Text style={styles.muted}>Finish your profile setup to see times here.</Text>
      ) : isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color="#059669" />
          <Text style={styles.muted}>Loading…</Text>
        </View>
      ) : chips.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.muted}>No open times on this day.</Text>
        </View>
      ) : (
        <View style={styles.chipWrap}>
          {chips.map(({ slot, isPast }) => (
            <View
              key={slot}
              style={[styles.chip, isPast ? styles.chipPast : styles.chipAvailable]}
            >
              <Text style={[styles.chipText, isPast ? styles.chipTextPast : styles.chipTextAvailable]}>
                {slot}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotAvailable]} />
          <Text style={styles.legendText}>Open</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotPast]} />
          <Text style={styles.legendText}>Already passed</Text>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(5,150,105,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    lineHeight: 17,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  muted: {
    fontSize: THEME.typography.size[14],
    color: '#64748B',
    lineHeight: 20,
  },
  emptyBox: {
    padding: THEME.spacing[14],
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  chip: {
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipAvailable: {
    backgroundColor: 'rgba(5,150,105,0.10)',
    borderColor: 'rgba(5,150,105,0.25)',
  },
  chipPast: {
    backgroundColor: 'rgba(244,63,94,0.08)',
    borderColor: 'rgba(244,63,94,0.22)',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chipTextAvailable: {
    color: '#047857',
  },
  chipTextPast: {
    color: '#BE123C',
  },
  legend: {
    flexDirection: 'row',
    gap: THEME.spacing[16],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotAvailable: {
    backgroundColor: '#10B981',
  },
  dotPast: {
    backgroundColor: '#F43F5E',
  },
  legendText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
