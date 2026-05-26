import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { Dropdown } from '@/shared/components/dropdown/dropdown';
import type { VaultImagePickerSource } from '@/features/MyServices/utils/vaultImagePicker';

import type { VaultDocumentType } from '../types/documentVault.types';

export interface VaultUploadModalProps {
  visible: boolean;
  documentTypes: VaultDocumentType[];
  selectedDocumentTypeId: string;
  isBusy: boolean;
  onClose: () => void;
  onSelectDocumentType: (value: string) => void;
  onPickSource: (source: VaultImagePickerSource) => void;
}

export function VaultUploadModal({
  visible,
  documentTypes,
  selectedDocumentTypeId,
  isBusy,
  onClose,
  onSelectDocumentType,
  onPickSource,
}: VaultUploadModalProps): React.ReactElement {
  const insets = useSafeAreaInsets();

  const typeOptions = documentTypes.map((dt) => ({
    label: dt.docName,
    value: String(dt.id),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable accessibilityRole="button" style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <LinearGradient
            colors={[...PROFILE_HEADER_GRADIENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.eyebrow}>Document vault</Text>
            <Text style={styles.title}>Upload document</Text>
          </LinearGradient>

          <View style={styles.body}>
            <Text style={styles.label}>Document type</Text>
            <Dropdown
              data={typeOptions}
              labelField="label"
              valueField="value"
              value={selectedDocumentTypeId}
              placeholder="Select document type"
              onChange={(item) => {
                if (item != null && typeof item.value === 'string') {
                  onSelectDocumentType(item.value);
                }
              }}
            />

            <Text style={[styles.label, styles.pickLabel]}>Choose file</Text>
            <View style={styles.pickRow}>
              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={() => onPickSource('camera')}
                style={({ pressed }) => [styles.pickBtn, pressed ? styles.pressed : null]}
              >
                <Ionicons name="camera-outline" size={22} color="#059669" />
                <Text style={styles.pickText}>Camera</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={() => onPickSource('library')}
                style={({ pressed }) => [styles.pickBtn, pressed ? styles.pressed : null]}
              >
                <Ionicons name="images-outline" size={22} color="#059669" />
                <Text style={styles.pickText}>Gallery</Text>
              </Pressable>
            </View>

            {isBusy ? (
              <View style={styles.busyRow}>
                <ActivityIndicator color="#059669" />
                <Text style={styles.busyText}>Uploading…</Text>
              </View>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.cancelBtn, pressed ? styles.pressed : null]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  pickLabel: {
    marginTop: 18,
  },
  pickRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pickBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    backgroundColor: '#ECFDF5',
  },
  pickText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#047857',
  },
  busyRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  busyText: {
    fontSize: 14,
    color: '#64748B',
  },
  cancelBtn: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  pressed: {
    opacity: 0.9,
  },
});
