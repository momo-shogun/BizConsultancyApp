import React, { useCallback } from 'react';
import { InteractionManager, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { Dialog } from '@/shared/components/dialog';
import { colors, radii, spacing } from '@/theme';

import type { ProfileImagePickerSource } from '../utils/profileImagePicker';

interface SourceOptionProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  accentColor: string;
  onPress: () => void;
}

function SourceOption({
  icon,
  title,
  subtitle,
  accentColor,
  onPress,
}: SourceOptionProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
    >
      <View style={[styles.optionIconWrap, { backgroundColor: `${accentColor}14` }]}>
        <Ionicons name={icon} size={24} color={accentColor} />
      </View>
      <View style={styles.optionTextBlock}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

function ProfilePhotoDialogIcon(): React.ReactElement {
  return (
    <View style={styles.iconCircle}>
      <Ionicons name="person" size={26} color={THEME.colors.primary} />
      <View style={styles.iconBadge}>
        <Ionicons name="camera" size={12} color="#FFFFFF" />
      </View>
    </View>
  );
}

export interface ProfilePhotoSourceDialogProps {
  visible: boolean;
  onClose: () => void;
  onSelectSource: (source: ProfileImagePickerSource) => void;
}

export function ProfilePhotoSourceDialog({
  visible,
  onClose,
  onSelectSource,
}: ProfilePhotoSourceDialogProps): React.ReactElement {
  const handleSource = useCallback(
    (source: ProfileImagePickerSource): void => {
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
      title="Update profile photo"
      description="Choose how you want to add your picture. You can change it anytime before saving."
      icon={<ProfilePhotoDialogIcon />}
      actions={[{ label: 'Cancel', variant: 'ghost', onPress: onClose }]}
    >
      <View style={styles.options}>
        <SourceOption
          icon="camera-outline"
          title="Take a photo"
          subtitle="Open camera for a new selfie"
          accentColor={THEME.colors.primary}
          onPress={() => handleSource('camera')}
        />
        <SourceOption
          icon="images-outline"
          title="Choose from gallery"
          subtitle="Pick an existing photo from your device"
          accentColor="#0D9488"
          onPress={() => handleSource('library')}
        />
      </View>
      <Text style={styles.hint}>JPEG, PNG, GIF or WebP · maximum 5MB</Text>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  iconBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  optionCardPressed: {
    opacity: 0.92,
    backgroundColor: colors.surfaceHover,
  },
  optionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextBlock: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
