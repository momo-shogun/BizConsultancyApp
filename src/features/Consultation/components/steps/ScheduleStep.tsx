import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DatePickerField } from '@/shared/components';

import { groupSlotsByPeriod } from '../../data/demoSchedule';
import { useConsultationOnboarding } from '../../context/ConsultationOnboardingContext';
import type {
  ConsultationStepComponentProps,
  ConsultationTimeSlot,
} from '../../types/consultationOnboarding.types';

export function ScheduleStep(_props: ConsultationStepComponentProps): React.ReactElement {
  const { timeSlots, form, setPreferredDate, setSelectedTimeSlotId } = useConsultationOnboarding();

  const groupedSlots = useMemo(() => groupSlotsByPeriod(timeSlots), [timeSlots]);

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
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.timeScroll}
      >
        {groupedSlots.map((group) => (
          <View key={group.period} style={styles.periodBlock}>
            <Text style={styles.periodLabel}>{group.label}</Text>
            <View style={styles.slotGrid}>
              {group.slots.map((slot) => (
                <TimeSlotChip
                  key={slot.id}
                  slot={slot}
                  selected={form.selectedTimeSlotId === slot.id}
                  onPress={() => {
                    if (slot.available) {
                      setSelectedTimeSlotId(slot.id);
                    }
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

interface TimeSlotChipProps {
  slot: ConsultationTimeSlot;
  selected: boolean;
  onPress: () => void;
}

function TimeSlotChip(props: TimeSlotChipProps): React.ReactElement {
  const disabled = !props.slot.available;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.slot.label}
      accessibilityState={{ selected: props.selected, disabled }}
      disabled={disabled}
      onPress={props.onPress}
      style={[
        styles.timeChip,
        props.selected ? styles.timeChipSelected : null,
        disabled ? styles.timeChipDisabled : null,
      ]}
    >
      <Text
        style={[
          styles.timeChipText,
          props.selected ? styles.timeChipTextSelected : null,
          disabled ? styles.timeChipTextDisabled : null,
        ]}
      >
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
  timeChipDisabled: {
    borderColor: '#ECEFF3',
    backgroundColor: '#F8FAFC',
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timeChipTextSelected: {
    color: '#0B3B66',
  },
  timeChipTextDisabled: {
    color: '#C0C8D2',
  },
});
