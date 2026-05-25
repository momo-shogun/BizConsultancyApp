import React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { DiagnosisDocumentRequirementItem } from '../types/diagnostics.types';
import {
  isImageDiagnosisDocument,
} from '../utils/diagnosisStatus';
import { modalStyles } from './DiagnosisApplyDocumentsModal.styles';

export interface DiagnosisApplyDocumentsModalProps {
  visible: boolean;
  items: DiagnosisDocumentRequirementItem[];
  saving: boolean;
  onClose: () => void;
  onToggle: (requirementId: number, userDocumentId: number, checked: boolean) => void;
  onApply: () => void;
}

export function DiagnosisApplyDocumentsModal(
  props: DiagnosisApplyDocumentsModalProps,
): React.ReactElement {
  const { visible, items, saving, onClose, onToggle, onApply } = props;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        <View style={modalStyles.header}>
          <Text style={modalStyles.title}>Apply Documents</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            hitSlop={8}
            style={modalStyles.closeBtn}
          >
            <Ionicons name="close" size={22} color="#64748B" />
          </Pressable>
        </View>
        <Text style={modalStyles.subtitle}>
          Select documents and apply them against your diagnostic membership requirements.
        </Text>

        <ScrollView
          style={modalStyles.scroll}
          contentContainerStyle={modalStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {items.length === 0 ? (
            <View style={modalStyles.emptyBox}>
              <Text style={modalStyles.emptyText}>
                No document requirements assigned yet for this membership.
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <View
                key={item.diagnosisMembershipDocumentId}
                style={modalStyles.requirementCard}
              >
                <Text style={modalStyles.requirementTitle}>
                  {item.documentTypeName ?? `Document Type #${item.documentTypeId}`}
                </Text>
                {item.availableDocuments.length === 0 ? (
                  <Text style={modalStyles.emptyHint}>
                    No documents uploaded for this type. Upload files in My Locker first.
                  </Text>
                ) : (
                  <View style={modalStyles.docGrid}>
                    {item.availableDocuments.map((doc) => {
                      const checked = item.selectedUserDocumentIds.includes(doc.id);
                      const isImage = isImageDiagnosisDocument(
                        doc.mimeType,
                        doc.originalFilename,
                      );
                      return (
                        <Pressable
                          key={doc.id}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked }}
                          onPress={() =>
                            onToggle(
                              item.diagnosisMembershipDocumentId,
                              doc.id,
                              !checked,
                            )
                          }
                          style={[
                            modalStyles.docTile,
                            checked ? modalStyles.docTileSelected : null,
                          ]}
                        >
                          <View style={modalStyles.docTileTop}>
                            <Ionicons
                              name={checked ? 'checkbox' : 'square-outline'}
                              size={20}
                              color={checked ? '#0F5132' : '#94A3B8'}
                            />
                            {isImage ? (
                              <Image
                                source={{ uri: doc.documentUrl }}
                                style={modalStyles.docPreview}
                                resizeMode="cover"
                              />
                            ) : (
                              <View style={modalStyles.docPreviewPlaceholder}>
                                <Ionicons
                                  name={
                                    (doc.mimeType ?? '').includes('pdf')
                                      ? 'document-text-outline'
                                      : 'document-outline'
                                  }
                                  size={28}
                                  color="#64748B"
                                />
                              </View>
                            )}
                          </View>
                          <Text style={modalStyles.docName} numberOfLines={2}>
                            {doc.originalFilename ?? `Document #${doc.id}`}
                          </Text>
                          <Pressable
                            accessibilityRole="link"
                            onPress={() => void Linking.openURL(doc.documentUrl)}
                            hitSlop={6}
                          >
                            <Text style={modalStyles.previewLink}>Preview</Text>
                          </Pressable>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>

        <View style={modalStyles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={modalStyles.footerOutlineBtn}
          >
            <Text style={modalStyles.footerOutlineText}>Cancel</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onApply}
            disabled={saving || items.length === 0}
            style={[modalStyles.footerPrimaryBtn, saving ? { opacity: 0.7 } : null]}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={modalStyles.footerPrimaryText}>Apply</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
