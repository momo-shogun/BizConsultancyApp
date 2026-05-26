import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ConsultantFullScreenModal } from '@/features/ConsultantSelf/components/ConsultantFullScreenModal';
import { Dropdown } from '@/shared/components/dropdown/dropdown';
import { Input } from '@/shared/components/ui/Input/Input';
import {
  getVaultAssetMimeType,
  launchVaultImagePicker,
  validateVaultPickerAsset,
} from '@/features/MyServices/utils/vaultImagePicker';
import { assetToMultipartFile } from '@/services/api/multipartFetch';

import { useExpertVideoTaxonomy } from '../hooks/useExpertVideoTaxonomy';

export interface CreateExpertVideoModalProps {
  visible: boolean;
  isBusy: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    categoryId: number;
    segmentId: number;
    industryId: number;
    title: string;
    url: string;
    duration?: number;
    type: 'paid' | 'free';
    amount?: number;
    thumbnail?: { uri: string; name: string; type: string };
  }) => void;
}

export function CreateExpertVideoModal({
  visible,
  isBusy,
  onClose,
  onSubmit,
}: CreateExpertVideoModalProps): React.ReactElement {
  const [categoryId, setCategoryId] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState<'free' | 'paid'>('free');
  const [amount, setAmount] = useState('');
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [thumbFile, setThumbFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const taxonomy = useExpertVideoTaxonomy(categoryId, segmentId);

  useEffect(() => {
    if (!visible) {
      setCategoryId('');
      setSegmentId('');
      setIndustryId('');
      setTitle('');
      setUrl('');
      setDuration('');
      setType('free');
      setAmount('');
      setThumbPreview(null);
      setThumbFile(null);
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
    () => taxonomy.categories.map((c) => ({ label: c.name, value: String(c.id) })),
    [taxonomy.categories],
  );
  const segmentOptions = useMemo(
    () => taxonomy.segments.map((s) => ({ label: s.name, value: String(s.id) })),
    [taxonomy.segments],
  );
  const industryOptions = useMemo(
    () => taxonomy.industries.map((i) => ({ label: i.name, value: String(i.id) })),
    [taxonomy.industries],
  );
  const typeOptions = [
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' },
  ];

  const pickThumbnail = async (): Promise<void> => {
    const result = await launchVaultImagePicker('library');
    if (result.errorMessage != null || result.asset == null) {
      return;
    }
    const validation = validateVaultPickerAsset(result.asset);
    if (validation != null) {
      return;
    }
    const mime = getVaultAssetMimeType(result.asset);
    const file = assetToMultipartFile(
      result.asset,
      result.asset.fileName?.trim() || `thumbnail_${Date.now()}.jpg`,
      mime,
    );
    setThumbFile(file);
    setThumbPreview(file.uri);
  };

  const canSubmit =
    taxonomy.hasExpertise &&
    categoryId.length > 0 &&
    segmentId.length > 0 &&
    industryId.length > 0 &&
    title.trim().length > 0 &&
    url.trim().length > 0 &&
    !isBusy;

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
            title: title.trim(),
            url: url.trim(),
            duration: duration.trim().length > 0 ? Number(duration) : undefined,
            type,
            amount: type === 'paid' && amount.trim().length > 0 ? Number(amount) : 0,
            thumbnail: thumbFile ?? undefined,
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
          <Text style={styles.submitText}>Save video</Text>
        )}
      </Pressable>
    </View>
  );

  return (
    <ConsultantFullScreenModal
      visible={visible}
      eyebrow="Expert videos"
      title="Add expert video"
      subtitle={
        taxonomy.hasExpertise
          ? 'Upload a thumbnail and fill in video details.'
          : 'Add expertise industries first, then you can publish videos.'
      }
      onClose={onClose}
      footer={footer}
    >
      {!taxonomy.hasExpertise ? (
        <Text style={styles.warn}>
          Configure expertise under Help and Settings → Expertise before adding videos.
        </Text>
      ) : null}

      <Field label="Title">
        <Input value={title} onChangeText={setTitle} placeholder="Video title" />
      </Field>
      <Field label="URL">
        <Input value={url} onChangeText={setUrl} placeholder="https://..." autoCapitalize="none" />
      </Field>
      <Field label="Duration (minutes)">
        <Input
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g. 12"
          keyboardType="number-pad"
        />
      </Field>

      <Field label="Thumbnail">
        <Pressable
          accessibilityRole="button"
          onPress={() => void pickThumbnail()}
          style={({ pressed }) => [styles.thumbPick, pressed ? styles.pressed : null]}
        >
          {thumbPreview != null ? (
            <Image source={{ uri: thumbPreview }} style={styles.thumbPreview} />
          ) : (
            <>
              <Ionicons name="image-outline" size={22} color="#EA580C" />
              <Text style={styles.thumbPickText}>Choose image</Text>
            </>
          )}
        </Pressable>
      </Field>

      <Field label="Category">
        <Dropdown
          anchorMenu
          anchorMenuTheme="consultant"
          data={categoryOptions}
          labelField="label"
          valueField="value"
          value={categoryId || null}
          placeholder="Select category"
          disabled={!taxonomy.hasExpertise}
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
          disabled={!taxonomy.hasExpertise || categoryId.length === 0}
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
          disabled={!taxonomy.hasExpertise || segmentId.length === 0}
          onChange={(item) => {
            if (item != null && typeof item.value === 'string') {
              setIndustryId(item.value);
            }
          }}
        />
      </Field>
      <Field label="Type">
        <Dropdown
          anchorMenu
          anchorMenuTheme="consultant"
          data={typeOptions}
          labelField="label"
          valueField="value"
          value={type}
          onChange={(item) => {
            if (item != null && (item.value === 'free' || item.value === 'paid')) {
              setType(item.value);
              if (item.value === 'free') {
                setAmount('');
              }
            }
          }}
        />
      </Field>
      {type === 'paid' ? (
        <Field label="Amount (₹)">
          <Input
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 199"
            keyboardType="number-pad"
          />
        </Field>
      ) : null}
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
  field: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  warn: {
    fontSize: 13,
    color: '#B45309',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    lineHeight: 18,
  },
  thumbPick: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderStyle: 'dashed',
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbPreview: { width: '100%', height: '100%' },
  thumbPickText: { marginTop: 6, fontSize: 13, fontWeight: '600', color: '#EA580C' },
  footerRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '700', color: '#334155' },
  submitBtn: {
    flex: 1.4,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  submitDisabled: { opacity: 0.55 },
  submitText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  pressed: { opacity: 0.9 },
});
