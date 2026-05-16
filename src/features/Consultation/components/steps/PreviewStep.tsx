import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { formatPreviewDate } from '../../data/demoSchedule';
import { useConsultationOnboarding } from '../../context/ConsultationOnboardingContext';
import type { ConsultationStepComponentProps } from '../../types/consultationOnboarding.types';

interface PreviewStepProps extends ConsultationStepComponentProps {
  onEditPress: () => void;
}

export function PreviewStep(props: PreviewStepProps): React.ReactElement {
  const { form, selectedDate, selectedTimeSlot } = useConsultationOnboarding();

  const dateLabel =
    selectedDate != null ? formatPreviewDate(selectedDate.date) : 'Not selected';
  const timeLabel = selectedTimeSlot?.label ?? 'Not selected';

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Consultation Preview</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit consultation details"
          onPress={props.onEditPress}
          style={styles.editBtn}
        >
          <Ionicons name="pencil-outline" size={14} color="#0B3B66" />
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        <PreviewField label="Problem Category" value={form.problemCategory} />
        <PreviewField label="Problem Sub-category" value={form.problemSubCategory} />
        <PreviewField label="Date" value={dateLabel} fullWidth />
        <PreviewField label="Time" value={timeLabel} />
        <PreviewField label="Consultation Type" value={form.consultationType} />
        <PreviewField label="Call Type" value={form.callType} />
        <PreviewField label="City" value={form.city} />
        <PreviewField label="Language" value={form.language} />
        <PreviewField label="Full name" value={form.contact.fullName} />
        <PreviewField label="Email" value={form.contact.email} />
        <PreviewField label="Phone" value={form.contact.phone} fullWidth />
        {form.consultantName != null && form.consultantName.length > 0 ? (
          <PreviewField label="Consultant" value={form.consultantName} fullWidth />
        ) : null}
      </View>
    </View>
  );
}

interface PreviewFieldProps {
  label: string;
  value: string;
  fullWidth?: boolean;
}

function PreviewField(props: PreviewFieldProps): React.ReactElement {
  return (
    <View style={[styles.field, props.fullWidth ? styles.fieldFull : null]}>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <Text style={styles.fieldValue}>{props.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B66',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  field: {
    width: '48%',
    gap: 4,
  },
  fieldFull: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#98A2B3',
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
});
