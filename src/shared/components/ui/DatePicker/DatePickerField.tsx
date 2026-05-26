import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import RNDatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export interface DatePickerFieldProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  /** Defaults to start of today. */
  minimumDate?: Date;
  maximumDate?: Date;
  accessibilityLabel: string;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function DatePickerField(props: DatePickerFieldProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [draftDate, setDraftDate] = useState<Date>(() => new Date());

  const minimumDate = useMemo(
    () => (props.minimumDate != null ? startOfDay(props.minimumDate) : undefined),
    [props.minimumDate],
  );

  const maximumDate = useMemo(
    () => (props.maximumDate != null ? startOfDay(props.maximumDate) : undefined),
    [props.maximumDate],
  );

  const placeholder = props.placeholder ?? 'Select date';

  const displayText =
    props.value != null ? formatDateLabel(props.value) : placeholder;

  const openPicker = (): void => {
    const fallback = maximumDate ?? new Date();
    setDraftDate(props.value != null ? props.value : fallback);
    setOpen(true);
  };

  return (
    <View style={styles.container}>
      {props.label != null && props.label.length > 0 ? (
        <Text style={styles.label}>{props.label}</Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={props.accessibilityLabel}
        accessibilityHint="Opens date picker dialog"
        onPress={openPicker}
        style={({ pressed }) => [styles.field, pressed ? styles.fieldPressed : null]}
      >
        <Text
          style={[
            styles.fieldText,
            props.value == null ? styles.fieldTextPlaceholder : null,
          ]}
        >
          {displayText}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={THEME.colors.textSecondary} />
      </Pressable>

      <RNDatePicker
        modal
        open={open}
        date={draftDate}
        mode="date"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale="en-IN"
        theme={Platform.OS === 'ios' ? 'light' : 'auto'}
        onConfirm={(date) => {
          setOpen(false);
          props.onChange(startOfDay(date));
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: THEME.spacing[8],
  },
  label: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textPrimary,
  },
  field: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
  },
  fieldPressed: {
    borderColor: THEME.colors.primary,
    backgroundColor: '#F8FAFC',
  },
  fieldText: {
    flex: 1,
    fontSize: THEME.typography.size[16],
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  fieldTextPlaceholder: {
    color: THEME.colors.textSecondary,
    fontWeight: '400',
  },
});
