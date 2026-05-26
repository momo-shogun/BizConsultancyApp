import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { OverrideFormState } from '@/features/ConsultantSlotTime/types/consultantSchedule.types';
import { DatePickerField } from '@/shared/components';
import { THEME } from '@/constants/theme';

import { TimeSelectField } from './TimeSelectField';

export interface OverrideEditorModalProps {
  visible: boolean;
  isEdit: boolean;
  form: OverrideFormState;
  isSaving: boolean;
  onClose: () => void;
  onChange: (patch: Partial<OverrideFormState>) => void;
  onSave: () => void;
}

function parseOverrideDate(value: string): Date | null {
  if (value.trim().length < 10) {
    return null;
  }
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function OverrideEditorModal({
  visible,
  isEdit,
  form,
  isSaving,
  onClose,
  onChange,
  onSave,
}: OverrideEditorModalProps): React.ReactElement {
  const selectedDate = parseOverrideDate(form.overrideDate);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{isEdit ? 'Change day off' : 'Add day off'}</Text>

          <DatePickerField
            label="Which day?"
            value={selectedDate}
            onChange={(date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              onChange({ overrideDate: `${year}-${month}-${day}` });
            }}
            minimumDate={new Date()}
            accessibilityLabel="Day off date"
            placeholder="Choose date"
          />

          <View style={styles.timeRow}>
            <View style={styles.timeCol}>
              <Text style={styles.fieldLabel}>From</Text>
              <TimeSelectField
                label="From time"
                value={form.startTime}
                onChange={(startTime) => onChange({ startTime })}
              />
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.fieldLabel}>To</Text>
              <TimeSelectField
                label="To time"
                value={form.endTime}
                onChange={(endTime) => onChange({ endTime })}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              disabled={isSaving}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onSave}
              disabled={isSaving}
              style={[styles.saveBtn, isSaving ? { opacity: 0.7 } : null]}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>{isEdit ? 'Update' : 'Add'}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: THEME.spacing[20],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[28],
    gap: THEME.spacing[14],
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    color: '#64748B',
    lineHeight: 20,
    marginTop: -6,
  },
  timeRow: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
  },
  timeCol: {
    flex: 1,
    gap: 6,
  },
  fieldLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  actions: {
    flexDirection: 'row',
    gap: THEME.spacing[10],
    marginTop: THEME.spacing[4],
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[14],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelText: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: '#334155',
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing[14],
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  saveText: {
    fontSize: THEME.typography.size[16],
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
