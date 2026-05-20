import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { THEME } from '@/constants/theme';
import { DatePickerField } from '@/shared/components';

import { useConsultationOnboarding } from '../../context/ConsultationOnboardingContext';
import type {
  ConsultationStepComponentProps,
  ConsultationTimeSlot,
} from '../../types/consultationOnboarding.types';

export function ScheduleStep(_props: ConsultationStepComponentProps): React.ReactElement {
  const {
    slotGroups,
    slotsLoading,
    slotsError,
    form,
    setPreferredDate,
    setSelectedTimeSlotId,
  } = useConsultationOnboarding();

  const hasConsultantSlug =
    form.consultantSlug != null && form.consultantSlug.trim().length > 0;
  const hasPreferredDate = form.preferredDate != null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferred date</Text>
      <DatePickerField
        label="Select date"
        value={form.preferredDate}
        onChange={setPreferredDate}
        accessibilityLabel="Preferred consultation date"
      />

      <Text style={styles.sectionTitle}>Preferred time</Text>

      {!hasConsultantSlug ? (
        <Text style={styles.hintText}>Consultant information is missing. Go back and try again.</Text>
      ) : !hasPreferredDate ? (
        <Text style={styles.hintText}>Select a date to see available time slots.</Text>
      ) : slotsLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
          <Text style={styles.hintText}>Loading available slots…</Text>
        </View>
      ) : slotsError ? (
        <Text style={styles.errorText}>Could not load time slots. Please try another date.</Text>
      ) : slotGroups.length === 0 ? (
        <Text style={styles.hintText}>No slots available for this date. Try another day.</Text>
      ) : (
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timeScroll}
        >
          {slotGroups.map((group) => (
            <View key={group.label} style={styles.periodBlock}>
              <Text style={styles.periodLabel}>{group.label}</Text>
              <View style={styles.slotGrid}>
                {group.slots.map((slot) => (
                  <TimeSlotChip
                    key={slot.id}
                    slot={slot}
                    selected={form.selectedTimeSlotId === slot.id}
                    onPress={() => setSelectedTimeSlotId(slot.id)}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

interface TimeSlotChipProps {
  slot: ConsultationTimeSlot;
  selected: boolean;
  onPress: () => void;
}

function TimeSlotChip(props: TimeSlotChipProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.slot.label}
      accessibilityState={{ selected: props.selected }}
      onPress={props.onPress}
      style={[styles.timeChip, props.selected ? styles.timeChipSelected : null]}
    >
      <Text style={[styles.timeChipText, props.selected ? styles.timeChipTextSelected : null]}>
        {props.slot.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    minHeight: 360,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  hintText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5B6B7E',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME.colors.danger,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeScroll: {
    gap: 16,
    paddingBottom: 8,
  },
  periodBlock: {
    gap: 10,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    minWidth: 96,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D5DCE5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  timeChipSelected: {
    borderColor: '#0B3B66',
    backgroundColor: '#EEF4FA',
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timeChipTextSelected: {
    color: '#0B3B66',
  },
});
