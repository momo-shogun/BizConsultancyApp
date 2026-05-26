import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { SCHEDULE_TIME_OPTIONS } from '@/features/ConsultantSlotTime/constants/scheduleConstants';
import { THEME } from '@/constants/theme';

export interface TimeSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  /** Fill parent width in row layouts (weekly hours). */
  flexible?: boolean;
}

export function TimeSelectField({
  value,
  onChange,
  label,
  disabled = false,
  flexible = false,
}: TimeSelectFieldProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  const displayLabel = useMemo(() => {
    const normalized = value.slice(0, 5);
    const match = SCHEDULE_TIME_OPTIONS.find((option) => option.value === normalized);
    return match?.label ?? normalized;
  }, [value]);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          flexible ? styles.triggerFlexible : null,
          disabled ? styles.triggerDisabled : null,
          pressed && !disabled ? { opacity: 0.9 } : null,
        ]}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {displayLabel}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#64748B" />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={8}>
              <Ionicons name="close" size={22} color="#64748B" />
            </Pressable>
          </View>
          <FlatList
            data={SCHEDULE_TIME_OPTIONS}
            keyExtractor={(item) => item.value}
            style={styles.list}
            renderItem={({ item }) => {
              const selected = item.value === value.slice(0, 5);
              return (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={[styles.option, selected ? styles.optionSelected : null]}
                >
                  <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>
                    {item.label}
                  </Text>
                  {selected ? (
                    <Ionicons name="checkmark" size={18} color="#059669" />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 108,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  triggerFlexible: {
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  triggerDisabled: {
    opacity: 0.5,
    backgroundColor: '#F8FAFC',
  },
  triggerText: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    flex: 1,
    marginRight: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  sheet: {
    maxHeight: '55%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: THEME.spacing[24],
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[14],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  sheetTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  list: {
    paddingHorizontal: THEME.spacing[8],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    borderRadius: 10,
    marginVertical: 2,
  },
  optionSelected: {
    backgroundColor: 'rgba(5,150,105,0.08)',
  },
  optionText: {
    fontSize: THEME.typography.size[14],
    color: '#334155',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#047857',
    fontWeight: '700',
  },
});
