import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { VaultDocument } from '../types/documentVault.types';
import { isVaultImageDocument } from '../utils/documentVaultDisplay';

export interface VaultDocumentThumbProps {
  document: VaultDocument;
  size?: number;
}

function VaultDocumentThumbComponent({
  document,
  size = 48,
}: VaultDocumentThumbProps): React.ReactElement {
  const isImage = isVaultImageDocument(document);

  if (isImage) {
    return (
      <Image
        source={{ uri: document.documentUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: size * 0.2 }]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={[styles.fileBadge, { width: size, height: size, borderRadius: size * 0.2 }]}>
      <Ionicons name="document-text-outline" size={size * 0.42} color="#64748B" />
      <Text style={styles.fileLabel}>FILE</Text>
    </View>
  );
}

export const VaultDocumentThumb = memo(VaultDocumentThumbComponent);

const styles = StyleSheet.create({
  image: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  fileBadge: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileLabel: {
    marginTop: 2,
    fontSize: 8,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
});
