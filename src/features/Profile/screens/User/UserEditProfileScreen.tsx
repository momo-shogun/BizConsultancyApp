import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import {
  Input,
  KeyboardWrapper,
  Loader,
  SafeAreaWrapper,
  ScreenHeader,
} from '@/shared/components';

import { useUserEditProfileScreen } from '../../hooks/useUserEditProfileScreen';
import type { UserGenderValue } from '../../types/userProfile.types';
import { PROFILE_CANVAS, styles } from './UserEditProfileScreen.styles';

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
    setFormField,
    pickProfileImage,
    handleSave,
    refetch,
  } = useUserEditProfileScreen();

  if (!isAuthenticated) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PROFILE_CANVAS}>
        <ScreenHeader title="My Profile" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Ionicons name="person-circle-outline" size={48} color="#94A3B8" />
          <Text style={styles.centeredText}>Sign in to view and edit your profile.</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PROFILE_CANVAS}>
        <ScreenHeader title="My Profile" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Loader />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (loadError != null) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PROFILE_CANVAS}>
        <ScreenHeader title="My Profile" onBackPress={() => navigation.goBack()} />
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
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PROFILE_CANVAS}>
      <ScreenHeader title="My Profile" onBackPress={() => navigation.goBack()} />
      <KeyboardWrapper style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['#047857', '#059669', '#0D9488']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <Text style={styles.heroTitle}>Personal details</Text>
            <Text style={styles.heroSubtitle}>
              Name and mobile are verified. You can update contact, location, gender, and photo.
            </Text>
          </LinearGradient>

          <View style={styles.avatarSection}>
            <Pressable
              onPress={() => void pickProfileImage()}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <View style={styles.avatarRing}>
                <View style={styles.avatarInner}>
                  {avatarUri != null ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode="cover" />
                  ) : (
                    <Text style={styles.avatarInitial}>{avatarInitial}</Text>
                  )}
                </View>
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </View>
              </View>
            </Pressable>
            <Pressable
              style={styles.changePhotoBtn}
              onPress={() => void pickProfileImage()}
              accessibilityRole="button"
              accessibilityLabel="Choose profile image"
            >
              <Ionicons name="image-outline" size={16} color={THEME.colors.primary} />
              <Text style={styles.changePhotoText}>Change photo</Text>
            </Pressable>
            <Text style={styles.photoHint}>
              {pendingImageName != null
                ? `${pendingImageName} — tap Save to upload`
                : 'JPEG, PNG, GIF or WebP · max 5MB'}
            </Text>
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
                />
              </View>
              <View style={styles.rowField}>
                <Input
                  label="State"
                  value={form.state}
                  onChangeText={(text) => setFormField('state', text)}
                  placeholder="State"
                  accessibilityLabel="State"
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
            />
          </View>

          <Text style={styles.sectionLabel}>Gender</Text>
          <View style={styles.card}>
            <View style={styles.genderWrap}>
              <Text style={styles.genderLabel}>Select gender</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => {
                  const selected = form.gender === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setFormField('gender', option.value)}
                      style={[styles.genderChip, selected ? styles.genderChipActive : null]}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          selected ? styles.genderChipTextActive : null,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

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
        </ScrollView>
      </KeyboardWrapper>
    </SafeAreaWrapper>
  );
}
