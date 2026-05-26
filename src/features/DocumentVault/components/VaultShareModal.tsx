import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { Dropdown } from '@/shared/components/dropdown/dropdown';

import type { VaultDocument, VaultShareTargetUser } from '../types/documentVault.types';
import { formatShareTargetLabel, getVaultDocumentTitle } from '../utils/documentVaultDisplay';

export interface VaultShareModalProps {
  visible: boolean;
  document: VaultDocument | null;
  shareTargets: VaultShareTargetUser[];
  shareTargetUserId: string;
  isBusy: boolean;
  onClose: () => void;
  onSelectTarget: (value: string) => void;
  onSubmit: () => void;
}

export function VaultShareModal({
  visible,
  document,
  shareTargets,
  shareTargetUserId,
  isBusy,
  onClose,
  onSelectTarget,
  onSubmit,
}: VaultShareModalProps): React.ReactElement {
  const insets = useSafeAreaInsets();

  const targetOptions = useMemo(
    () =>
      shareTargets.map((target) => ({
        label: formatShareTargetLabel(target.name, target.mobile, target.id),
        value: String(target.id),
      })),
    [shareTargets],
  );

  const documentTitle =
    document != null ? getVaultDocumentTitle(document) : 'Select a document';

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
            <Text style={styles.title}>Share document</Text>
            <Text style={styles.subtitle}>View-only access for the selected user.</Text>
          </LinearGradient>

          <View style={styles.body}>
            <Text style={styles.label}>Document</Text>
            <View style={styles.docPreview}>
              <Text style={styles.docPreviewText} numberOfLines={2}>
                {documentTitle}
              </Text>
            </View>

            <Text style={[styles.label, styles.targetLabel]}>Share with user</Text>
            <Dropdown
              data={targetOptions}
              labelField="label"
              valueField="value"
              value={shareTargetUserId}
              placeholder="Select user"
              search
              searchPlaceholder="Search by name or number"
              onChange={(item) => {
                if (item != null && typeof item.value === 'string') {
                  onSelectTarget(item.value);
                }
              }}
            />

            <Pressable
              accessibilityRole="button"
              disabled={isBusy || shareTargetUserId.length === 0}
              onPress={onSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                pressed ? styles.pressed : null,
                isBusy || shareTargetUserId.length === 0 ? styles.submitDisabled : null,
              ]}
            >
              {isBusy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>Share document</Text>
              )}
            </Pressable>
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
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
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
  targetLabel: {
    marginTop: 16,
  },
  docPreview: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  docPreviewText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
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
