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
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import { VaultDocumentRow } from '../components/VaultDocumentRow';
import { VaultShareModal } from '../components/VaultShareModal';
import { VaultShareRow } from '../components/VaultShareRow';
import { VaultUploadModal } from '../components/VaultUploadModal';
import { useConsultantDocumentVaultScreen } from '../hooks/useConsultantDocumentVaultScreen';
import type { VaultDocument, VaultDocumentShare } from '../types/documentVault.types';
import { formatShareTargetLabel } from '../utils/documentVaultDisplay';
import {
  CONSULTANT_VAULT_CANVAS,
  styles,
} from './ConsultantDocumentVaultScreen.styles';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.ConsultantLockers
>;

function confirmUnshare(onConfirm: () => void): void {
  Alert.alert('Remove share?', 'The user will no longer be able to view this document.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Unshare', style: 'destructive', onPress: onConfirm },
  ]);
}

export function ConsultantDocumentVaultScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const screen = useConsultantDocumentVaultScreen();

  const handleUnshare = useCallback(
    (shareId: number): void => {
      confirmUnshare(() => void screen.removeShare(shareId));
    },
    [screen],
  );

  if (screen.isLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CONSULTANT_VAULT_CANVAS}>
        <ScreenHeader title="My Lockers" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={CONSULTANT_VAULT_CANVAS}>
      <ScreenHeader title="My Lockers" onBackPress={() => navigation.goBack()} />

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
        <LinearGradient
          colors={[...PROFILE_HEADER_GRADIENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroText}>
              <Text style={styles.heroEyebrow}>Consultant dashboard</Text>
              <Text style={styles.heroTitle}>Document Vault</Text>
              <Text style={styles.heroSubtitle}>
                Upload and reuse documents across services. Share view-only copies with users.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={screen.openUploadModal}
              style={({ pressed }) => [styles.uploadBtn, pressed ? { opacity: 0.92 } : null]}
            >
              <Ionicons name="cloud-upload-outline" size={16} color="#047857" />
              <Text style={styles.uploadBtnText}>Upload</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Documents</Text>
              <Text style={styles.statValue}>{screen.documentCount}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Sent shares</Text>
              <Text style={styles.statValue}>{screen.sentShareCount}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Received</Text>
              <Text style={styles.statValue}>{screen.receivedShareCount}</Text>
            </View>
          </View>
        </LinearGradient>

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
                  subtitle={`Shared with ${
                    share.targetName ??
                    formatShareTargetLabel(null, null, share.targetUserId)
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
                  subtitle={`Shared by ${
                    share.ownerName ??
                    formatShareTargetLabel(null, null, share.ownerUserId)
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
              No documents uploaded yet. Tap Upload to add your first file.
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

      <VaultShareModal
        visible={screen.shareModalVisible}
        document={screen.shareDocumentPreview}
        shareTargets={screen.shareTargets}
        shareTargetUserId={screen.shareTargetUserId}
        isBusy={screen.isBusy}
        onClose={screen.closeShareModal}
        onSelectTarget={screen.setShareTargetUserId}
        onSubmit={() => void screen.submitShare()}
      />
    </SafeAreaWrapper>
  );
}
