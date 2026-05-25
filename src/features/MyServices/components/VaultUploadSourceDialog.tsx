import React, { useCallback } from 'react';
import { InteractionManager, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { Dialog } from '@/shared/components/dialog';
import { colors, radii, spacing } from '@/theme';

import type { VaultImagePickerSource } from '../utils/vaultImagePicker';

interface SourceOptionProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
}

function SourceOption({
  icon,
  title,
  subtitle,
  onPress,
  disabled = false,
}: SourceOptionProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        pressed && styles.optionCardPressed,
        disabled && styles.optionCardDisabled,
      ]}
    >
      <View style={styles.optionIconWrap}>
        <Ionicons name={icon} size={22} color={THEME.colors.primary} />
      </View>
      <View style={styles.optionTextBlock}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

function UploadDialogIcon(): React.ReactElement {
  return (
    <View style={styles.iconCircle}>
      <Ionicons name="cloud-upload-outline" size={24} color={THEME.colors.primary} />
    </View>
  );
}

export interface VaultUploadSourceDialogProps {
  visible: boolean;
  onClose: () => void;
  documentLabel: string | null;
  onSelectSource: (source: VaultImagePickerSource) => void;
}

export function VaultUploadSourceDialog({
  visible,
  onClose,
  documentLabel,
  onSelectSource,
}: VaultUploadSourceDialogProps): React.ReactElement {
  const description =
    documentLabel != null && documentLabel.length > 0
      ? `Add a file for ${documentLabel}.`
      : 'Choose how you want to add your document.';

  const handleSource = useCallback(
    (source: VaultImagePickerSource): void => {
      onClose();
      InteractionManager.runAfterInteractions(() => {
        onSelectSource(source);
      });
    },
    [onClose, onSelectSource],
  );

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      variant="default"
      title="Upload document"
      description={description}
      icon={<UploadDialogIcon />}
      actions={[{ label: 'Cancel', variant: 'ghost', onPress: onClose }]}
    >
      <View style={styles.options}>
        <SourceOption
          icon="camera-outline"
          title="Take photo"
          subtitle="Capture with your camera"
          onPress={() => handleSource('camera')}
        />
        <SourceOption
          icon="images-outline"
          title="Photo library"
          subtitle="Choose from your gallery"
          onPress={() => handleSource('library')}
        />
      </View>
      <Text style={styles.hint}>JPG, PNG or WEBP · maximum 10MB</Text>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  options: {
    width: '100%',
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  optionCardPressed: {
    opacity: 0.9,
    backgroundColor: colors.surfaceHover,
  },
  optionCardDisabled: {
    opacity: 0.55,
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextBlock: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  optionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
