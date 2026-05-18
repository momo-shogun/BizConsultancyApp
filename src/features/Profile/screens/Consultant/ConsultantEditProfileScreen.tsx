import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import {
  Button,
  Input,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
} from '@/shared/components';

import { styles } from './ConsultantEditProfileScreen.styles';
import { AccountStackParamList } from '@/navigation/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormState {
  email: string;
  gender: string;
  pinCode: string;
  city: string;
  state: string;
  address: string;
  experience: string;
  dob: string;
  qualification: string;
  summary: string;
  audioFee: string;
  videoFee: string;
}

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.readOnlyWrap}>
      <Text style={styles.readOnlyLabel}>{label}</Text>
      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>{value}</Text>
        <View style={styles.readOnlyBadge}>
          <Text style={styles.readOnlyBadgeText}>Read only</Text>
        </View>
      </View>
    </View>
  );
}

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function GenderPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.dropdownWrap}>
      <Text style={styles.dropdownLabel}>Gender</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {GENDER_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.8}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: selected ? THEME.colors.primary : THEME.colors.border,
                backgroundColor: selected ? '#F0FAF5' : THEME.colors.white,
              }}
            >
              <Text
                style={{
                  fontSize: THEME.typography.size[12],
                  fontWeight: selected
                    ? THEME.typography.weight.semibold
                    : THEME.typography.weight.regular,
                  color: selected ? THEME.colors.primary : THEME.colors.textSecondary,
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ConsultantEditProfileScreen(): React.ReactElement {
  const [form, setForm] = useState<FormState>({
    email: '',
    gender: '',
    pinCode: '',
    city: '',
    state: '',
    address: '',
    experience: '',
    dob: '',
    qualification: '',
    summary: '',
    audioFee: '',
    videoFee: '',
  });
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  function set(key: keyof FormState) {
    return (val: string) => setForm((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
             <ScreenHeader
               title="Edit Profile"
               onBackPress={() => navigation.goBack()}
             />
      <ScreenWrapper style={{ padding: 0 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Info banner ── */}
          <LinearGradient
            colors={['#F0FAF5', '#E8F5E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <Ionicons name="information-circle-outline" size={18} color={THEME.colors.primary} />
            <Text style={styles.bannerText}>
              Name and phone are read-only. You can update your email and other profile details below.
            </Text>
          </LinearGradient>

          {/* ── Basic Info ── */}
          <SectionLabel title="Basic Info" />
          <View style={styles.card}>
            <ReadOnlyField label="Full Name" value="Krishna" />
            <ReadOnlyField label="Phone Number" value="8433011748" />
            <Input
              label="Email Address"
              value={form.email}
              onChangeText={set('email')}
              placeholder="you@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              accessibilityLabel="Email Address"
            />
            <GenderPicker value={form.gender} onChange={set('gender')} />
          </View>

          {/* ── Location ── */}
          <SectionLabel title="Location" />
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Input
                  label="Pin Code"
                  value={form.pinCode}
                  onChangeText={set('pinCode')}
                  placeholder="e.g. 226022"
                  keyboardType="number-pad"
                  accessibilityLabel="Pin Code"
                />
              </View>
              <View style={styles.rowItem}>
                <Input
                  label="City"
                  value={form.city}
                  onChangeText={set('city')}
                  placeholder="City"
                  autoCapitalize="words"
                  accessibilityLabel="City"
                />
              </View>
            </View>
            <Input
              label="State"
              value={form.state}
              onChangeText={set('state')}
              placeholder="State"
              autoCapitalize="words"
              accessibilityLabel="State"
            />
            <View style={styles.textareaWrap}>
              <Text style={styles.textareaLabel}>Address</Text>
              <TextInput
                style={styles.textarea}
                value={form.address}
                onChangeText={set('address')}
                placeholder="Street, area, landmark"
                placeholderTextColor={THEME.colors.textSecondary}
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
              />
            </View>
          </View>

          {/* ── Professional Details ── */}
          <SectionLabel title="Professional Details" />
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Input
                  label="Years of Experience"
                  value={form.experience}
                  onChangeText={set('experience')}
                  placeholder="e.g. 6"
                  keyboardType="number-pad"
                  accessibilityLabel="Years of Experience"
                />
              </View>
              <View style={styles.rowItem}>
                <Input
                  label="Date of Birth"
                  value={form.dob}
                  onChangeText={set('dob')}
                  placeholder="DD/MM/YYYY"
                  keyboardType="number-pad"
                  accessibilityLabel="Date of Birth"
                />
              </View>
            </View>
            <Text style={styles.helperText}>
              Numbers only for experience. We add "years" — e.g. 5 is shown as 5 years.
            </Text>
            <Input
              label="Highest Qualification"
              value={form.qualification}
              onChangeText={set('qualification')}
              placeholder="e.g. MCA"
              autoCapitalize="characters"
              accessibilityLabel="Highest Qualification"
            />
            <View style={styles.textareaWrap}>
              <Text style={styles.textareaLabel}>Profile Summary</Text>
              <TextInput
                style={styles.textarea}
                value={form.summary}
                onChangeText={set('summary')}
                placeholder="Write a short professional summary"
                placeholderTextColor={THEME.colors.textSecondary}
                multiline
                numberOfLines={4}
                autoCapitalize="sentences"
              />
            </View>
          </View>

          {/* ── Consultation Fees ── */}
          <SectionLabel title="Consultation Fees" />
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Input
                  label="Audio Fee (₹)"
                  value={form.audioFee}
                  onChangeText={set('audioFee')}
                  placeholder="e.g. 354"
                  keyboardType="number-pad"
                  accessibilityLabel="Audio Fee"
                />
              </View>
              <View style={styles.rowItem}>
                <Input
                  label="Video Fee (₹)"
                  value={form.videoFee}
                  onChangeText={set('videoFee')}
                  placeholder="e.g. 708"
                  keyboardType="number-pad"
                  accessibilityLabel="Video Fee"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>

      <View style={styles.stickyFooter}>
        <Button
          label="Save Changes"
          onPress={() => {}}
          accessibilityLabel="Save Changes"
          style={styles.saveBtn}
        />
      </View>
    </SafeAreaWrapper>
  );
}
