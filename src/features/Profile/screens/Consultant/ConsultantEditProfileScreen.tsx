import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import type { AccountStackParamList } from '@/navigation/types';
import { DatePickerField, Input, KeyboardWrapper, Loader } from '@/shared/components';

import { ProfilePhotoSourceDialog } from '../../components/ProfilePhotoSourceDialog';
import { ProfileScreenHeaderChrome } from '../../components/ProfileScreenHeaderChrome';
import { CONSULTANT_EXPERIENCE_HELPER } from '../../utils/consultantExperience';
import type { ConsultantGenderValue } from '../../types/consultantProfile.types';
import { useConsultantEditProfileScreen } from '../../hooks/useConsultantEditProfileScreen';

import { styles } from './ConsultantEditProfileScreen.styles';

const SLATE_PLACEHOLDER = '#94A3B8';

const GENDER_OPTIONS: { label: string; value: ConsultantGenderValue }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not' },
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

export function ConsultantEditProfileScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
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
    dobDate,
    fieldErrors,
    setFormField,
    setDobDate,
    photoSourceDialogVisible,
    openPhotoSourceDialog,
    closePhotoSourceDialog,
    selectProfileImageSource,
    handleSave,
    refetch,
  } = useConsultantEditProfileScreen();

  const handleBack = (): void => {
    navigation.goBack();
  };

  const photoHint = useMemo((): string => {
    if (pendingImageName != null) {
      return `${pendingImageName} — tap Save to upload your profile photo`;
    }
    return 'Tap your photo to change · JPEG, PNG, GIF or WebP · max 5MB';
  }, [pendingImageName]);

  const maxDob = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const chromeProps = {
    title: 'Edit Profile',
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
            <View style={[styles.genderWrap, fieldErrors.gender != null ? styles.genderCardError : null]}>
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

          <Text style={styles.sectionLabel}>Location</Text>
          <View style={styles.card}>
            <View style={styles.rowTwo}>
              <View style={styles.rowField}>
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
            </View>
            <Input
              label="State"
              value={form.state}
              onChangeText={(text) => setFormField('state', text)}
              placeholder="State"
              accessibilityLabel="State"
              error={fieldErrors.state}
            />
            <View style={styles.textareaWrap}>
              <Text style={styles.textareaLabel}>Address</Text>
              <TextInput
                style={[
                  styles.textarea,
                  fieldErrors.address != null ? styles.textareaError : null,
                ]}
                value={form.address}
                onChangeText={(text) => setFormField('address', text)}
                placeholder="Street, area, landmark"
                placeholderTextColor={SLATE_PLACEHOLDER}
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
                accessibilityLabel="Address"
              />
              {fieldErrors.address != null ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.address}</Text>
              ) : null}
            </View>
          </View>

          <Text style={styles.sectionLabel}>Professional</Text>
          <View style={styles.card}>
            <View style={styles.rowTwo}>
              <View style={styles.rowField}>
                <Input
                  label="Experience (years)"
                  value={form.experience}
                  onChangeText={(text) =>
                    setFormField('experience', text.replace(/\D/g, '').slice(0, 2))
                  }
                  placeholder="e.g. 6"
                  keyboardType="number-pad"
                  accessibilityLabel="Years of experience"
                  error={fieldErrors.experience}
                />
              </View>
              <View style={styles.rowField}>
                <DatePickerField
                  label="Date of birth"
                  value={dobDate}
                  onChange={setDobDate}
                  maximumDate={maxDob}
                  placeholder="Pick date"
                  accessibilityLabel="Date of birth"
                />
              </View>
            </View>
            <Text style={styles.helperText}>{CONSULTANT_EXPERIENCE_HELPER}</Text>
            <Input
              label="Highest qualification"
              value={form.qualification}
              onChangeText={(text) => setFormField('qualification', text)}
              placeholder="e.g. MCA"
              autoCapitalize="characters"
              accessibilityLabel="Highest qualification"
              error={fieldErrors.qualification}
            />
            <View style={styles.textareaWrap}>
              <Text style={styles.textareaLabel}>Profile summary</Text>
              <TextInput
                style={[
                  styles.textarea,
                  fieldErrors.summary != null ? styles.textareaError : null,
                ]}
                value={form.summary}
                onChangeText={(text) => setFormField('summary', text)}
                placeholder="Write a short professional summary"
                placeholderTextColor={SLATE_PLACEHOLDER}
                multiline
                numberOfLines={4}
                autoCapitalize="sentences"
                accessibilityLabel="Profile summary"
              />
              {fieldErrors.summary != null ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.summary}</Text>
              ) : null}
            </View>
          </View>

          <Text style={styles.sectionLabel}>Consultation fees</Text>
          <View style={styles.card}>
            <View style={styles.rowTwo}>
              <View style={styles.rowField}>
                <Input
                  label="Audio fee (₹)"
                  value={form.audioFee}
                  onChangeText={(text) => setFormField('audioFee', text)}
                  placeholder="e.g. 354"
                  keyboardType="number-pad"
                  accessibilityLabel="Audio consultation fee"
                  error={fieldErrors.audioFee}
                />
              </View>
              <View style={styles.rowField}>
                <Input
                  label="Video fee (₹)"
                  value={form.videoFee}
                  onChangeText={(text) => setFormField('videoFee', text)}
                  placeholder="e.g. 708"
                  keyboardType="number-pad"
                  accessibilityLabel="Video consultation fee"
                  error={fieldErrors.videoFee}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.saveFooter}>
          <Pressable
            style={[styles.saveButton, isSaving ? styles.saveButtonDisabled : null]}
            onPress={() => void handleSave()}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Save profile changes"
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
