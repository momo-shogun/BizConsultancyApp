import React, { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { VaultDocument, VaultDocumentShare } from '../types/documentVault.types';
import { getVaultDocumentTitle } from '../utils/documentVaultDisplay';
import { VaultDocumentThumb } from './VaultDocumentThumb';

export interface VaultShareRowProps {
  share: VaultDocumentShare;
  subtitle: string;
  showUnshare?: boolean;
  isBusy?: boolean;
  onUnshare?: () => void;
  onPreview?: (document: VaultDocument) => void;
}

function VaultShareRowComponent({
  share,
  subtitle,
  showUnshare = false,
  isBusy = false,
  onUnshare,
  onPreview,
}: VaultShareRowProps): React.ReactElement {
  const document = share.userDocument;
  const title =
    document != null ? getVaultDocumentTitle(document) : `Document #${share.userDocumentId}`;

  const openPreview = (): void => {
    if (document != null) {
      onPreview?.(document);
    }
  };

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        onPress={openPreview}
        disabled={document == null}
        style={({ pressed }) => [pressed ? styles.pressed : null]}
      >
        {document != null ? (
          <VaultDocumentThumb document={document} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      {showUnshare ? (
        <Pressable
          accessibilityRole="button"
          onPress={onUnshare}
          disabled={isBusy}
          style={({ pressed }) => [
            styles.unshareBtn,
            pressed ? styles.pressed : null,
            isBusy ? styles.disabled : null,
          ]}
        >
          {isBusy ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.unshareText}>Unshare</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

export const VaultShareRow = memo(VaultShareRowComponent);

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
  placeholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
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
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
  },
  unshareBtn: {
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unshareText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
});
