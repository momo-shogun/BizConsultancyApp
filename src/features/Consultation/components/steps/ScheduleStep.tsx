import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';

import { groupSlotsByPeriod } from '../../data/demoSchedule';
import { useConsultationOnboarding } from '../../context/ConsultationOnboardingContext';
import type {
  ConsultationDateOption,
  ConsultationStepComponentProps,
  ConsultationTimeSlot,
} from '../../types/consultationOnboarding.types';

const DATE_CARD_WIDTH = 108;

export function ScheduleStep(_props: ConsultationStepComponentProps): React.ReactElement {
  const {
    dateOptions,
    timeSlots,
    form,
    setSelectedDateId,
    setSelectedTimeSlotId,
  } = useConsultationOnboarding();

  const groupedSlots = useMemo(() => groupSlotsByPeriod(timeSlots), [timeSlots]);

  const renderDateCard: ListRenderItem<ConsultationDateOption> = ({ item }) => {
    const isSelected = form.selectedDateId === item.id;
    const dotColor = item.availability === 'limited' ? '#F5B301' : '#22C55E';

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.label}, ${item.slotCount} slots`}
        accessibilityState={{ selected: isSelected }}
        onPress={() => setSelectedDateId(item.id)}
        style={[styles.dateCard, isSelected ? styles.dateCardSelected : null]}
      >
        <Text style={[styles.dateLabel, isSelected ? styles.dateLabelSelected : null]}>
          {item.label}
        </Text>
        <View style={styles.slotRow}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={[styles.slotText, isSelected ? styles.slotTextSelected : null]}>
            {item.slotCount} slots
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferred date</Text>
      <FlatList
        horizontal
        data={dateOptions}
        keyExtractor={(item) => item.id}
        renderItem={renderDateCard}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateList}
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
  dateList: {
    gap: 10,
    paddingRight: 8,
  },
  dateCard: {
    width: DATE_CARD_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DCE5',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  dateCardSelected: {
    borderColor: '#0B3B66',
    backgroundColor: '#EEF4FA',
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  dateLabelSelected: {
    color: '#0B3B66',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  slotText: {
    fontSize: 13,
    color: '#5B6B7E',
    fontWeight: '600',
  },
  slotTextSelected: {
    color: '#0B3B66',
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
