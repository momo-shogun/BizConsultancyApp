import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useFdpAskQuestionsScreen } from '@/features/Edp/hooks/useFdpAskQuestionsScreen';
import { EDP_HERO_BG } from '@/features/Edp/data/edpLandingData';
import { REMARK_MAX_LENGTH } from '@/features/Edp/utils/fdpAskQuestionsValidation';
import { Button, Input, SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { Dropdown } from '@/shared/components/dropdown/dropdown';

import { CANVAS, styles } from './FdpAskQuestions.styles';

const FOOTER_PADDING = 12;

function SectionLabel({ title }: { title: string }): React.ReactElement {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

const FdpAskQuestions = (): React.ReactElement => {
  const insets = useSafeAreaInsets();
  const screen = useFdpAskQuestionsScreen();
  const footerBottomInset = FOOTER_PADDING ;

  const topChrome = (
    <View style={[styles.topChrome, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Request programme guidance"
        headerColor={EDP_HERO_BG}
        onBackPress={screen.goBack}
      />
    </View>
  );

  if (screen.isProfileLoading || screen.isCategoriesLoading) {
    return (
      <SafeAreaWrapper
        edges={['bottom']}
        bgColor={EDP_HERO_BG}
        contentBgColor={CANVAS}
        statusBarStyle="light-content"
        style={styles.screen}
      >
        {topChrome}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={EDP_HERO_BG} />
        </View>
      </SafeAreaWrapper>
    );
  }

  const displayName = screen.name.length > 0 ? screen.name : '—';
  const displayMobile = screen.mobile.length > 0 ? screen.mobile : '—';
  const displayEmail = screen.email.length > 0 ? screen.email : '—';

  return (
    <SafeAreaWrapper
      edges={['bottom']}
      bgColor={EDP_HERO_BG}
      contentBgColor={CANVAS}
      statusBarStyle="light-content"
      style={styles.screen}
    >
      {topChrome}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: 96 + footerBottomInset },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.banner}>
            <Ionicons name="chatbubbles-outline" size={18} color="#059669" />
            <Text style={styles.bannerText}>
              Share your details and we will help you choose the right modules.
              Submissions are saved as enquiries tagged for the EDP programme.
            </Text>
          </View>

          {!screen.isAuthenticated ? (
            <View style={styles.banner}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#059669"
              />
              <Text style={styles.bannerText}>
                Sign in to auto-fill your name, mobile, and email.
              </Text>
            </View>
          ) : null}

          <SectionLabel title="Your details" />
          <View style={styles.card}>
            <Input
              label="Name"
              value={displayName}
              onChangeText={() => {}}
              editable={false}
              inputStyle={styles.readOnlyInputText}
              accessibilityLabel="Name"
            />
            <Input
              label="Mobile Number"
              value={displayMobile}
              onChangeText={() => {}}
              editable={false}
              inputStyle={styles.readOnlyInputText}
              keyboardType="phone-pad"
              accessibilityLabel="Mobile Number"
            />
            <Input
              label="Email"
              value={displayEmail}
              onChangeText={() => {}}
              editable={false}
              inputStyle={styles.readOnlyInputText}
              keyboardType="email-address"
              accessibilityLabel="Email"
            />
          </View>

          <SectionLabel title="Request details" />
          <View style={styles.card}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Category</Text>
              <Dropdown
                anchorMenu
                data={screen.categoryOptions.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                labelField="label"
                valueField="value"
                placeholder="Select category"
                value={screen.form.categoryId || null}
                onChange={(item) => {
                  if (item != null && typeof item.value === 'string') {
                    screen.setCategoryId(item.value);
                  }
                }}
                error={screen.categoryError != null}
                disabled={screen.isSubmitting}
              />
              {screen.categoryError != null ? (
                <Text style={styles.fieldError}>{screen.categoryError}</Text>
              ) : null}
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Segment</Text>
              <Dropdown
                anchorMenu
                data={screen.segmentOptions.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                labelField="label"
                valueField="value"
                placeholder={
                  screen.form.categoryId.length > 0
                    ? 'Select segment'
                    : 'Select category first'
                }
                value={screen.form.segmentId || null}
                onChange={(item) => {
                  if (item != null && typeof item.value === 'string') {
                    screen.setSegmentId(item.value);
                  }
                }}
                error={screen.segmentError != null}
                disabled={
                  screen.form.categoryId.length === 0 ||
                  screen.isSubmitting ||
                  screen.isSegmentsLoading
                }
              />
              {screen.segmentError != null ? (
                <Text style={styles.fieldError}>{screen.segmentError}</Text>
              ) : null}
            </View>

            <Input
              label="Remark (optional)"
              value={screen.form.remark}
              onChangeText={screen.setRemark}
              placeholder="Write your question or remark..."
              multiline
              maxLength={REMARK_MAX_LENGTH}
              accessibilityLabel="Remark"
            />

            <Text style={styles.helperText}>
              Optional. Up to {REMARK_MAX_LENGTH} characters.
            </Text>

            {screen.validationError != null &&
            screen.categoryError == null &&
            screen.segmentError == null ? (
              <View style={styles.errorRow}>
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color="#EF4444"
                />
                <Text style={styles.errorText}>{screen.validationError}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: footerBottomInset }]}>
          <Button
            label="Submit Request"
            accessibilityLabel="Submit programme guidance request"
            onPress={screen.handleSubmit}
            disabled={!screen.canSubmit}
            loading={screen.isSubmitting}
            style={styles.submitBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default FdpAskQuestions;
