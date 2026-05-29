import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { VaultDocument } from '../types/documentVault.types';
import { getVaultDocumentTitle } from '../utils/documentVaultDisplay';
import { VaultDocumentThumb } from './VaultDocumentThumb';

export interface VaultDocumentRowProps {
  document: VaultDocument;
  showActions: boolean;
  disabled?: boolean;
  onPressActions: () => void;
  onPreview: (document: VaultDocument) => void;
}

function VaultDocumentRowComponent({
  document,
  showActions,
  disabled = false,
  onPressActions,
  onPreview,
}: VaultDocumentRowProps): React.ReactElement {
  const title = getVaultDocumentTitle(document);

  const openPreview = (): void => {
    onPreview(document);
  };

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Preview ${title}`}
        onPress={openPreview}
        style={({ pressed }) => [styles.thumbPress, pressed ? styles.pressed : null]}
      >
        <VaultDocumentThumb document={document} />
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Pressable accessibilityRole="link" onPress={openPreview}>
          <Text style={styles.previewLink}>Preview</Text>
        </Pressable>
      </View>

      {showActions ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Document actions"
          disabled={disabled}
          onPress={onPressActions}
          style={({ pressed }) => [
            styles.menuBtn,
            pressed ? styles.pressed : null,
            disabled ? styles.disabled : null,
          ]}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="#475569" />
        </Pressable>
      ) : null}
    </View>
  );
}

export const VaultDocumentRow = memo(VaultDocumentRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  thumbPress: {
    borderRadius: 12,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  previewLink: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
});
