import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { SubmissionDocumentRequirementItem } from '../types/myServices.types';
import { styles } from '../screens/ApplyServiceScreen.styles';

interface ApplyDocumentRequirementCardProps {
  item: SubmissionDocumentRequirementItem;
  selectedIds: number[];
  isApplied: boolean;
  isUploading: boolean;
  deletingVaultDocId: number | null;
  onToggleDocument: (userDocumentId: number) => void;
  onUploadPress: () => void;
  onDeletePress: (documentId: number, documentName: string) => void;
}

export function ApplyDocumentRequirementCard({
  item,
  selectedIds,
  isApplied,
  isUploading,
  deletingVaultDocId,
  onToggleDocument,
  onUploadPress,
  onDeletePress,
}: ApplyDocumentRequirementCardProps): React.ReactElement {
  const uploadDisabled = isApplied || isUploading;

  return (
    <View style={styles.docGroup}>
      <Text style={styles.docGroupTitle}>
        {item.documentTypeName ?? 'Document'}
        {item.isRequired === 1 ? ' *' : ''}
      </Text>

      {item.availableDocuments.length === 0 ? (
        <Text style={styles.docEmpty}>No file yet.</Text>
      ) : (
        item.availableDocuments.map((doc) => {
          const selected = selectedIds.includes(doc.id);
          const isDeleting = deletingVaultDocId === doc.id;
          return (
            <View key={doc.id} style={styles.docRow}>
              <Pressable
                disabled={isApplied}
                onPress={() => onToggleDocument(doc.id)}
                style={[styles.docOption, selected && styles.docOptionSelected, styles.docOptionFlex]}
              >
                <View style={styles.docIconWrap}>
                  <Ionicons
                    name={selected ? 'checkmark-circle' : 'document-outline'}
                    size={20}
                    color={selected ? '#0F5132' : '#64748B'}
                  />
                </View>
                <View style={styles.docTextBlock}>
                  <Text style={styles.docName} numberOfLines={1}>
                    {doc.originalFilename ?? `Document #${doc.id}`}
                  </Text>
                  <Text style={styles.docMeta}>
                    {selected ? 'Selected' : 'Tap to select'}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete file"
                disabled={isApplied || isDeleting}
                onPress={() =>
                  onDeletePress(doc.id, doc.originalFilename ?? `Document #${doc.id}`)
                }
                style={styles.docDeleteBtn}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#BE123C" />
                ) : (
                  <Ionicons name="trash-outline" size={20} color="#BE123C" />
                )}
              </Pressable>
            </View>
          );
        })
      )}

      <Pressable
        accessibilityRole="button"
        disabled={uploadDisabled}
        onPress={onUploadPress}
        style={[styles.uploadBtn, uploadDisabled && styles.uploadBtnDisabled]}
      >
        {isUploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
            <Text style={styles.uploadBtnText}>Upload</Text>
          </>
        )}
      </Pressable>
      <Text style={styles.docSelectionCount}>
        {selectedIds.length} selected · JPG, PNG or WEBP · max 10MB
      </Text>
    </View>
  );
}
