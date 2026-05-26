import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  useGetMasterCategoriesQuery,
  useGetMasterIndustriesQuery,
  useGetMasterSegmentsQuery,
} from '@/features/consultant/api/consultantApi';
import { ConsultantFullScreenModal } from '@/features/ConsultantSelf/components/ConsultantFullScreenModal';
import { Dropdown } from '@/shared/components/dropdown/dropdown';

export interface AddExpertiseModalProps {
  visible: boolean;
  isBusy: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    categoryId: number;
    segmentId: number;
    industryId: number;
  }) => void;
}

export function AddExpertiseModal({
  visible,
  isBusy,
  onClose,
  onSubmit,
}: AddExpertiseModalProps): React.ReactElement {
  const [categoryId, setCategoryId] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [industryId, setIndustryId] = useState('');

  const { data: categories = [] } = useGetMasterCategoriesQuery(undefined, { skip: !visible });
  const { data: segments = [] } = useGetMasterSegmentsQuery(
    categoryId.length > 0 ? { categoryId } : undefined,
    { skip: !visible || categoryId.length === 0 },
  );
  const { data: industries = [] } = useGetMasterIndustriesQuery(
    segmentId.length > 0 ? { segmentId } : {},
    { skip: !visible || segmentId.length === 0 },
  );

  useEffect(() => {
    if (!visible) {
      setCategoryId('');
      setSegmentId('');
      setIndustryId('');
    }
  }, [visible]);

  useEffect(() => {
    setSegmentId('');
    setIndustryId('');
  }, [categoryId]);

  useEffect(() => {
    setIndustryId('');
  }, [segmentId]);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: String(c.id) })),
    [categories],
  );
  const segmentOptions = useMemo(
    () => segments.map((s) => ({ label: s.name, value: String(s.id) })),
    [segments],
  );
  const industryOptions = useMemo(
    () => industries.map((i) => ({ label: i.name, value: String(i.id) })),
    [industries],
  );

  const canSubmit =
    categoryId.length > 0 && segmentId.length > 0 && industryId.length > 0 && !isBusy;

  const footer = (
    <View style={styles.footerRow}>
      <Pressable
        accessibilityRole="button"
        onPress={onClose}
        style={({ pressed }) => [styles.cancelBtn, pressed ? styles.pressed : null]}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={!canSubmit}
        onPress={() =>
          onSubmit({
            categoryId: Number(categoryId),
            segmentId: Number(segmentId),
            industryId: Number(industryId),
          })
        }
        style={({ pressed }) => [
          styles.submitBtn,
          !canSubmit ? styles.submitDisabled : null,
          pressed ? styles.pressed : null,
        ]}
      >
        {isBusy ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>Add industry</Text>
        )}
      </Pressable>
    </View>
  );

  return (
    <ConsultantFullScreenModal
      visible={visible}
      eyebrow="Expertise"
      title="Add industry"
      subtitle="Select category, segment, and industry for your expertise."
      onClose={onClose}
      footer={footer}
    >
      <Field label="Category">
        <Dropdown
          anchorMenu
          anchorMenuTheme="consultant"
          data={categoryOptions}
          labelField="label"
          valueField="value"
          value={categoryId || null}
          placeholder="Select category"
          onChange={(item) => {
            if (item != null && typeof item.value === 'string') {
              setCategoryId(item.value);
            }
          }}
        />
      </Field>
      <Field label="Segment">
        <Dropdown
          anchorMenu
          anchorMenuTheme="consultant"
          data={segmentOptions}
          labelField="label"
          valueField="value"
          value={segmentId || null}
          placeholder={categoryId ? 'Select segment' : 'Select category first'}
          disabled={categoryId.length === 0}
          onChange={(item) => {
            if (item != null && typeof item.value === 'string') {
              setSegmentId(item.value);
            }
          }}
        />
      </Field>
      <Field label="Industry">
        <Dropdown
          anchorMenu
          anchorMenuTheme="consultant"
          data={industryOptions}
          labelField="label"
          valueField="value"
          value={industryId || null}
          placeholder={segmentId ? 'Select industry' : 'Select segment first'}
          disabled={segmentId.length === 0}
          onChange={(item) => {
            if (item != null && typeof item.value === 'string') {
              setIndustryId(item.value);
            }
          }}
        />
      </Field>
    </ConsultantFullScreenModal>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  submitBtn: {
    flex: 1.4,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  submitDisabled: {
    opacity: 0.55,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.9,
  },
});
