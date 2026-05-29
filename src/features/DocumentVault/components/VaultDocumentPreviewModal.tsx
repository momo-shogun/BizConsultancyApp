import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

import type { VaultDocument } from '../types/documentVault.types';
import {
  getVaultDocumentTitle,
  isVaultImageDocument,
  isVaultPdfDocument,
} from '../utils/documentVaultDisplay';

export interface VaultDocumentPreviewModalProps {
  visible: boolean;
  document: VaultDocument | null;
  onClose: () => void;
}

function buildWebPreviewUri(document: VaultDocument): string {
  const trimmed = document.documentUrl.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }
  if (isVaultPdfDocument(document)) {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(trimmed)}`;
  }
  return trimmed;
}

export function VaultDocumentPreviewModal({
  visible,
  document,
  onClose,
}: VaultDocumentPreviewModalProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [webLoading, setWebLoading] = useState(true);

  const title = document != null ? getVaultDocumentTitle(document) : 'Preview';
  const documentUrl = document?.documentUrl?.trim() ?? '';
  const isImage = document != null && isVaultImageDocument(document);
  const webUri = useMemo(
    () => (document != null ? buildWebPreviewUri(document) : ''),
    [document],
  );

  const previewHeight = Math.max(windowHeight - insets.top - insets.bottom - 72, 320);

  return (
    <Modal
      visible={visible && document != null && documentUrl.length > 0}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      onShow={() => setWebLoading(true)}
    >
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close preview"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => [styles.closeBtn, pressed ? styles.pressed : null]}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {isImage ? (
          <ScrollView
            style={styles.previewScroll}
            contentContainerStyle={styles.imageScrollContent}
            maximumZoomScale={3}
            minimumZoomScale={1}
            centerContent
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: documentUrl }}
              style={{ width: windowWidth, height: previewHeight }}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </ScrollView>
        ) : (
          <View style={[styles.webHost, { height: previewHeight }]}>
            {webLoading ? (
              <View style={styles.webLoading}>
                <ActivityIndicator size="large" color="#34D399" />
                <Text style={styles.webLoadingText}>Loading preview…</Text>
              </View>
            ) : null}
            <WebView
              source={{ uri: webUri }}
              style={styles.webView}
              onLoadStart={() => setWebLoading(true)}
              onLoadEnd={() => setWebLoading(false)}
              onError={() => setWebLoading(false)}
              startInLoadingState={false}
              scalesPageToFit
              allowsInlineMediaPlayback
            />
          </View>
        )}

        <View style={{ height: insets.bottom + 8 }} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  previewScroll: {
    flex: 1,
  },
  imageScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webHost: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  webLoadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
  },
  pressed: {
    opacity: 0.88,
  },
});
