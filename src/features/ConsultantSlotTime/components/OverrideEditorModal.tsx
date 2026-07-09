import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const selectedDate = parseOverrideDate(form.overrideDate);

  const [isMounted, setIsMounted] = React.useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(480)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(480);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 22,
          stiffness: 260,
          mass: 0.9,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 480,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsMounted(false);
      }
    });
  }, [backdropOpacity, sheetTranslateY, visible]);

  const handleBackdropPress = (): void => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!isMounted) {
    return <></>;
  }

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={handleBackdropPress}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close day off form"
          onPress={handleBackdropPress}
          disabled={isSaving}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </Pressable>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.sheet,
              {
                paddingBottom: THEME.spacing[20] + insets.bottom,
                transform: [{ translateY: sheetTranslateY }],
              },
            ]}
          >
            <View style={styles.handle} />
            <Text style={styles.title}>{isEdit ? 'Change day off' : 'Add day off'}</Text>
            <Text style={styles.subtitle}>
              Clients will not be able to book you for this date and time.
            </Text>

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

            <View style={styles.timeSection}>
              <Text style={styles.timeSectionLabel}>Blocked time</Text>
              <View style={styles.timeRow}>
                <View style={styles.timeCol}>
                  <Text style={styles.fieldLabel}>From</Text>
                  <TimeSelectField
                    label="From time"
                    value={form.startTime}
                    onChange={(startTime) => onChange({ startTime })}
                    appearance="field"
                    flexible
                  />
                </View>
                <View style={styles.timeDivider} accessibilityElementsHidden>
                  <Ionicons name="arrow-forward" size={18} color="#94A3B8" />
                </View>
                <View style={styles.timeCol}>
                  <Text style={styles.fieldLabel}>To</Text>
                  <TimeSelectField
                    label="To time"
                    value={form.endTime}
                    onChange={(endTime) => onChange({ endTime })}
                    appearance="field"
                    flexible
                  />
                </View>
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
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
  },
  sheetWrap: {
    width: '100%',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: THEME.spacing[20],
    paddingTop: THEME.spacing[12],
    gap: THEME.spacing[14],
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 24,
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
  timeSection: {
    gap: THEME.spacing[8],
  },
  timeSectionLabel: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing[12],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: THEME.spacing[8],
  },
  timeCol: {
    flex: 1,
    minWidth: 0,
    gap: THEME.spacing[8],
  },
  timeDivider: {
    width: 24,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: '#64748B',
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
