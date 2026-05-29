import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
  ACCOUNT_HUB_LIST_CANVAS,
} from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell } from '@/shared/components';

import { VaultDocumentRow } from '../components/VaultDocumentRow';
import { VaultShareModal } from '../components/VaultShareModal';
import { VaultShareRow } from '../components/VaultShareRow';
import { VaultUploadModal } from '../components/VaultUploadModal';
import { useUserDocumentVaultScreen } from '../hooks/useUserDocumentVaultScreen';
import { useVaultDocumentPreviewModal } from '../hooks/useVaultDocumentPreviewModal';
import type { VaultDocument, VaultDocumentShare } from '../types/documentVault.types';
import {
  formatShareTargetConsultantLabel,
  formatShareTargetLabel,
} from '../utils/documentVaultDisplay';
import { styles } from './ConsultantDocumentVaultScreen.styles';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.UserLockers
>;

function confirmUnshare(onConfirm: () => void): void {
  Alert.alert(
    'Remove share?',
    'The consultant will no longer be able to view this document.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unshare', style: 'destructive', onPress: onConfirm },
    ],
  );
}

export function UserDocumentVaultScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useUserDocumentVaultScreen();
  const { openPreview, previewModal } = useVaultDocumentPreviewModal();

  const handleUnshare = useCallback(
    (shareId: number): void => {
      confirmUnshare(() => void screen.removeShare(shareId));
    },
    [screen],
  );

  const uploadHeaderAction = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Upload document"
      onPress={screen.openUploadModal}
      hitSlop={8}
      style={({ pressed }) => [styles.headerIconBtn, pressed ? { opacity: 0.85 } : null]}
    >
      <Ionicons name="cloud-upload-outline" size={22} color="#FFFFFF" />
    </Pressable>
  );

  if (screen.isLoading) {
    return (
      <AccountHubScreenShell
        title="My Locker"
        canvasColor={ACCOUNT_HUB_LIST_CANVAS}
        headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
        onBackPress={() => navigation.goBack()}
        headerRightAction={uploadHeaderAction}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </AccountHubScreenShell>
    );
  }

  return (
    <AccountHubScreenShell
      title="My Locker"
      canvasColor={ACCOUNT_HUB_LIST_CANVAS}
      headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
      onBackPress={() => navigation.goBack()}
      headerRightAction={uploadHeaderAction}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refresh}
            tintColor="#059669"
          />
        }
      >
        <View style={styles.statsRowPlain}>
          <View style={styles.statCardPlain}>
            <Text style={styles.statLabelPlain}>Documents</Text>
            <Text style={styles.statValuePlain}>{screen.documentCount}</Text>
          </View>
          <View style={styles.statCardPlain}>
            <Text style={styles.statLabelPlain}>Sent shares</Text>
            <Text style={styles.statValuePlain}>{screen.sentShareCount}</Text>
          </View>
          <View style={styles.statCardPlain}>
            <Text style={styles.statLabelPlain}>Received</Text>
            <Text style={styles.statValuePlain}>{screen.receivedShareCount}</Text>
          </View>
        </View>

        {screen.errorMessage != null ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={THEME.colors.danger} />
            <Text style={styles.errorText}>{screen.errorMessage}</Text>
            <Pressable accessibilityRole="button" onPress={screen.refresh}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sent shares</Text>
          {screen.sentShares.length === 0 ? (
            <Text style={styles.sectionEmpty}>No sent shares yet.</Text>
          ) : (
            <View style={styles.rowGap}>
              {screen.sentShares.map((share: VaultDocumentShare) => (
                <VaultShareRow
                  key={share.id}
                  share={share}
                  onPreview={openPreview}
                  subtitle={`Shared with ${
                    share.targetName ??
                    formatShareTargetConsultantLabel(null, [], share.targetUserId)
                  }`}
                  showUnshare
                  isBusy={screen.isBusy}
                  onUnshare={() => handleUnshare(share.id)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared with me</Text>
          {screen.receivedShares.length === 0 ? (
            <Text style={styles.sectionEmpty}>No documents shared with you yet.</Text>
          ) : (
            <View style={styles.rowGap}>
              {screen.receivedShares.map((share: VaultDocumentShare) => (
                <VaultShareRow
                  key={share.id}
                  share={share}
                  onPreview={openPreview}
                  subtitle={`Shared by ${
                    share.ownerName ??
                    (share.ownerUserType.toLowerCase() === 'consultant'
                      ? formatShareTargetConsultantLabel(null, [], share.ownerUserId)
                      : formatShareTargetLabel(null, null, share.ownerUserId))
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My documents</Text>
          {screen.groupedDocuments.length === 0 ? (
            <Text style={styles.sectionEmpty}>
              No documents uploaded yet. Tap upload in the header to add your first file.
            </Text>
          ) : (
            screen.groupedDocuments.map((group) => (
              <View key={group.typeName} style={styles.groupBlock}>
                <Text style={styles.groupTitle}>{group.typeName}</Text>
                <View style={styles.rowGap}>
                  {group.documents.map((document: VaultDocument) => (
                    <VaultDocumentRow
                      key={document.id}
                      document={document}
                      showActions={screen.isOwnDocument(document)}
                      disabled={screen.isBusy}
                      onPreview={openPreview}
                      onPressActions={() => screen.openDocumentActions(document)}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <VaultUploadModal
        visible={screen.uploadModalVisible}
        documentTypes={screen.documentTypes}
        selectedDocumentTypeId={screen.selectedDocumentTypeId}
        isBusy={screen.isBusy}
        onClose={screen.closeUploadModal}
        onSelectDocumentType={screen.setSelectedDocumentTypeId}
        onPickSource={(source) => void screen.uploadFromSource(source)}
      />

      {previewModal}

      <VaultShareModal
        visible={screen.shareModalVisible}
        document={screen.shareDocumentPreview}
        shareTargets={screen.shareTargetOptions}
        shareTargetUserId={screen.shareTargetUserId}
        isBusy={screen.isBusy}
        shareWithLabel="Share with consultant"
        modalSubtitle="View-only access for the selected consultant."
        searchPlaceholder="Search by name or industry"
        onClose={screen.closeShareModal}
        onSelectTarget={screen.setShareTargetUserId}
        onSubmit={() => void screen.submitShare()}
      />
    </AccountHubScreenShell>
  );
}
