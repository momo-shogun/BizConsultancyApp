import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ACCOUNT_HUB_GREEN_HEADER_GRADIENT } from '@/constants/accountScreenTheme';
import { useSubmitUserFeedbackMutation } from '@/features/Profile/api/userFeedbackApi';
import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell, KeyboardWrapper } from '@/shared/components';
import { showGlobalError, showGlobalToast } from '@/shared/components/toast';
import { useAppSelector } from '@/store/typedHooks';

import { styles, USER_FEEDBACK_CANVAS } from './UserFeedbackScreen.styles';

const STAR_COLOR_ACTIVE = '#F59E0B';
const STAR_COLOR_IDLE = '#D4D4D4';
const SUBJECT_MAX = 255;
const MESSAGE_MAX = 4000;
const STICKY_BAR_HEIGHT = 88;

const RATING_DESCRIPTORS: Record<number, string> = {
  1: 'Needs improvement',
  2: 'Could be better',
  3: 'Good experience',
  4: 'Very good',
  5: 'Loved it!',
};

type Nav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.addReview>;

function readFeedbackError(error: unknown): string {
  if (error != null && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data != null && typeof data === 'object' && 'message' in data) {
      const message = (data as { message: unknown }).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }
  }
  return 'Failed to send feedback';
}

export default function UserFeedbackScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [rating, setRating] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [subjectFocused, setSubjectFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);
  const [submitFeedback, { isLoading: isSubmitting }] = useSubmitUserFeedbackMutation();

  const ratingDescriptor = useMemo((): string | null => {
    if (rating == null) {
      return null;
    }
    return RATING_DESCRIPTORS[rating] ?? null;
  }, [rating]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      showGlobalError('Please sign in to send feedback.');
      return;
    }
    if (rating == null || rating < 1 || rating > 5) {
      showGlobalError('Please choose a rating from 1 to 5 stars.');
      return;
    }

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    try {
      const result = await submitFeedback({
        rating,
        subject: trimmedSubject.length > 0 ? trimmedSubject : undefined,
        message: trimmedMessage.length > 0 ? trimmedMessage : undefined,
      }).unwrap();
      showGlobalToast(result.message || 'Thanks for your feedback.');
      setRating(null);
      setSubject('');
      setMessage('');
    } catch (err) {
      showGlobalError(readFeedbackError(err));
    }
  }, [isAuthenticated, message, rating, subject, submitFeedback]);

  const scrollBottomPadding = STICKY_BAR_HEIGHT + insets.bottom + 16;
  const stickyPaddingBottom = Math.max(insets.bottom, 12);

  if (!isAuthenticated) {
    return (
      <AccountHubScreenShell
        title="Feedback"
        onBackPress={() => navigation.goBack()}
        canvasColor={USER_FEEDBACK_CANVAS}
        headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
      >
        <View style={styles.centered}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="chatbubble-ellipses-outline" size={34} color="#878787" />
          </View>
          <Text style={styles.centeredTitle}>Sign in to continue</Text>
          <Text style={styles.centeredText}>
            Rate your experience and tell us what we can do better.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed ? styles.secondaryButtonPressed : null,
            ]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.secondaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </AccountHubScreenShell>
    );
  }

  const canSubmit = rating != null && !isSubmitting;

  return (
    <AccountHubScreenShell
      title="Feedback"
      onBackPress={() => navigation.goBack()}
      canvasColor={USER_FEEDBACK_CANVAS}
      headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
    >
      <KeyboardWrapper style={styles.flex}>
        <View style={styles.body}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: scrollBottomPadding },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>How was your experience?</Text>
            <Text style={styles.pageSubtitle}>
              Your rating helps us improve consultants, bookings, and the app.
            </Text>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Overall rating <Text style={styles.requiredMark}>*</Text>
              </Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = rating != null && value <= rating;
                  const selected = rating === value;
                  return (
                    <Pressable
                      key={value}
                      style={({ pressed }) => [
                        styles.starButton,
                        pressed ? styles.pressed : null,
                      ]}
                      onPress={() => setRating(value)}
                      accessibilityRole="button"
                      accessibilityLabel={`${value} star${value > 1 ? 's' : ''}`}
                      accessibilityState={{ selected }}
                    >
                      <Ionicons
                        name={active ? 'star' : 'star-outline'}
                        size={40}
                        color={active ? STAR_COLOR_ACTIVE : STAR_COLOR_IDLE}
                      />
                    </Pressable>
                  );
                })}
              </View>
              {ratingDescriptor != null ? (
                <Text style={styles.ratingCaption}>{ratingDescriptor}</Text>
              ) : (
                <Text style={styles.ratingCaptionMuted}>Select 1 to 5 stars</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>
                  Topic <Text style={styles.fieldOptional}>(optional)</Text>
                </Text>
                <Text style={styles.charCount}>
                  {subject.length}/{SUBJECT_MAX}
                </Text>
              </View>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="Booking, payments, app speed…"
                placeholderTextColor="#B0B0B0"
                style={[styles.input, subjectFocused ? styles.inputFocused : null]}
                maxLength={SUBJECT_MAX}
                onFocus={() => setSubjectFocused(true)}
                onBlur={() => setSubjectFocused(false)}
                accessibilityLabel="Feedback topic"
              />
            </View>

            <View style={styles.section}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>
                  Tell us more <Text style={styles.fieldOptional}>(optional)</Text>
                </Text>
                <Text style={styles.charCount}>
                  {message.length}/{MESSAGE_MAX}
                </Text>
              </View>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Share details — what worked, what didn’t"
                placeholderTextColor="#B0B0B0"
                style={[styles.textArea, messageFocused ? styles.inputFocused : null]}
                multiline
                maxLength={MESSAGE_MAX}
                onFocus={() => setMessageFocused(true)}
                onBlur={() => setMessageFocused(false)}
                accessibilityLabel="Feedback comments"
              />
            </View>

            <View style={styles.trustRow}>
              <Ionicons name="lock-closed-outline" size={16} color="#878787" />
              <Text style={styles.trustText}>
                Saved securely to your account · reviewed by our team
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.stickyBar, { paddingBottom: stickyPaddingBottom }]}>
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                !canSubmit ? styles.submitButtonDisabled : null,
                pressed && canSubmit ? styles.submitButtonPressed : null,
              ]}
              onPress={() => void handleSubmit()}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Submit feedback"
              accessibilityState={{ disabled: !canSubmit }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit feedback</Text>
              )}
            </Pressable>
            <Text style={styles.stickyHint}>
              {canSubmit ? 'You can submit again anytime to update' : 'Choose a star rating to continue'}
            </Text>
          </View>
        </View>
      </KeyboardWrapper>
    </AccountHubScreenShell>
  );
}
