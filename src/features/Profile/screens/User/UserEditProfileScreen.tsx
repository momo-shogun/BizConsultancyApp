import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { type ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { Input, KeyboardWrapper, Loader } from '@/shared/components';

import { ProfilePhotoSourceDialog } from '../../components/ProfilePhotoSourceDialog';
import { ProfileScreenHeaderChrome } from '../../components/ProfileScreenHeaderChrome';
import { useUserEditProfileScreen } from '../../hooks/useUserEditProfileScreen';
import type { UserGenderValue } from '../../types/userProfile.types';
import { styles } from './UserEditProfileScreen.styles';

type Nav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.EditProfile>;

const GENDER_OPTIONS: { label: string; value: UserGenderValue }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

function ReadOnlyField(props: ReadOnlyFieldProps): React.ReactElement {
  return (
    <View style={styles.readOnlyWrap}>
      <Text style={styles.readOnlyLabel}>{props.label}</Text>
      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyValue} numberOfLines={1}>
          {props.value}
        </Text>
        <View style={styles.readOnlyBadge}>
          <Text style={styles.readOnlyBadgeText}>Locked</Text>
        </View>
      </View>
    </View>
  );
}

export function UserEditProfileScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const {
    isAuthenticated,
    isLoading,
    isSaving,
    loadError,
    readOnlyName,
    readOnlyMobile,
    avatarUri,
    avatarInitial,
    pendingImageName,
    form,
    fieldErrors,
    setFormField,
    photoSourceDialogVisible,
    openPhotoSourceDialog,
    closePhotoSourceDialog,
    selectProfileImageSource,
    handleSave,
    refetch,
  } = useUserEditProfileScreen();

  const handleBack = (): void => {
    navigation.goBack();
  };

  const photoHint =
    pendingImageName != null
      ? `${pendingImageName} — tap Save to upload`
      : 'Tap photo to change · JPEG, PNG, GIF or WebP · max 5MB';

  const chromeProps = {
    title: 'My Profile',
    onBackPress: handleBack,
    avatarUri,
    avatarInitial,
    displayName: readOnlyName !== '—' ? readOnlyName : undefined,
    displaySubtitle: readOnlyMobile !== '—' ? readOnlyMobile : undefined,
    onAvatarPress: openPhotoSourceDialog,
  };

  if (!isAuthenticated) {
    return (
      <ProfileScreenHeaderChrome {...chromeProps} onAvatarPress={undefined}>
        <View style={styles.centered}>
          <Ionicons name="person-circle-outline" size={48} color="#94A3B8" />
          <Text style={styles.centeredText}>Sign in to view and edit your profile.</Text>
        </View>
      </ProfileScreenHeaderChrome>
    );
  }

  if (isLoading) {
    return (
      <ProfileScreenHeaderChrome {...chromeProps} onAvatarPress={undefined}>
        <View style={styles.centered}>
          <Loader visible />
        </View>
      </ProfileScreenHeaderChrome>
    );
  }

  if (loadError != null) {
    return (
      <ProfileScreenHeaderChrome {...chromeProps} onAvatarPress={undefined}>
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={40} color="#94A3B8" />
          <Text style={styles.centeredText}>{loadError}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={refetch}
            accessibilityRole="button"
            accessibilityLabel="Retry loading profile"
          >
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      </ProfileScreenHeaderChrome>
    );
  }

  return (
    <ProfileScreenHeaderChrome {...chromeProps}>
      <ProfilePhotoSourceDialog
        visible={photoSourceDialogVisible}
        onClose={closePhotoSourceDialog}
        onSelectSource={(source) => {
          void selectProfileImageSource(source);
        }}
      />
      <KeyboardWrapper style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.photoHintBanner}>
            <Ionicons name="information-circle-outline" size={18} color={THEME.colors.primary} />
            <Text style={styles.photoHintText}>{photoHint}</Text>
          </View>

          <Text style={styles.sectionLabel}>Basic</Text>
          <View style={styles.card}>
            <ReadOnlyField label="Name" value={readOnlyName} />
            <ReadOnlyField label="Mobile" value={readOnlyMobile} />
          </View>

          <Text style={styles.sectionLabel}>Contact</Text>
          <View style={styles.card}>
            <Input
              label="Email"
              value={form.email}
              onChangeText={(text) => setFormField('email', text)}
              placeholder="you@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              accessibilityLabel="Email"
              error={fieldErrors.email}
            />
          </View>

          <Text style={styles.sectionLabel}>Location</Text>
          <View style={styles.card}>
            <View style={styles.rowTwo}>
              <View style={styles.rowField}>
                <Input
                  label="City"
                  value={form.city}
                  onChangeText={(text) => setFormField('city', text)}
                  placeholder="City"
                  accessibilityLabel="City"
                  error={fieldErrors.city}
                />
              </View>
              <View style={styles.rowField}>
                <Input
                  label="State"
                  value={form.state}
                  onChangeText={(text) => setFormField('state', text)}
                  placeholder="State"
                  accessibilityLabel="State"
                  error={fieldErrors.state}
                />
              </View>
            </View>
            <Input
              label="Pincode"
              value={form.pincode}
              onChangeText={(text) =>
                setFormField('pincode', text.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="6-digit pincode"
              keyboardType="number-pad"
              maxLength={6}
              accessibilityLabel="Pincode"
              error={fieldErrors.pincode}
            />
          </View>

          <Text style={styles.sectionLabel}>Gender</Text>
          <View style={[styles.card, fieldErrors.gender != null ? styles.genderCardError : null]}>
            <View style={styles.genderWrap}>
              <Text style={styles.genderLabel}>Select gender</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => {
                  const selected = form.gender === option.value;
                  const chipHasError = fieldErrors.gender != null;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setFormField('gender', option.value)}
                      style={[
                        styles.genderChip,
                        selected ? styles.genderChipActive : null,
                        chipHasError && !selected ? styles.genderChipError : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          selected ? styles.genderChipTextActive : null,
                          chipHasError && !selected ? styles.genderChipTextError : null,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {fieldErrors.gender != null ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.gender}</Text>
              ) : null}
            </View>
          </View>
        </ScrollView>

        <View style={styles.saveFooter}>
          <Pressable
            style={[styles.saveButton, isSaving ? styles.saveButtonDisabled : null]}
            onPress={() => void handleSave()}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Save profile"
            accessibilityState={{ disabled: isSaving }}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save changes</Text>
            )}
          </Pressable>
        </View>
      </KeyboardWrapper>
    </ProfileScreenHeaderChrome>
  );
}
