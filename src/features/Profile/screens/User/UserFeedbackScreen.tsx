import React, { useCallback, useState } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSubmitUserFeedbackMutation } from '@/features/Profile/api/userFeedbackApi';
import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { KeyboardWrapper, SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { showGlobalError, showGlobalToast } from '@/shared/components/toast';
import { useAppSelector } from '@/store/typedHooks';

import { styles, USER_FEEDBACK_CANVAS } from './UserFeedbackScreen.styles';

const STAR_COLOR_ACTIVE = '#F59E0B';
const STAR_COLOR_IDLE = '#CBD5E1';
const SUBJECT_MAX = 255;
const MESSAGE_MAX = 4000;

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
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [rating, setRating] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitFeedback, { isLoading: isSubmitting }] = useSubmitUserFeedbackMutation();

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

  if (!isAuthenticated) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={USER_FEEDBACK_CANVAS}>
        <ScreenHeader title="User Feedback" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Ionicons name="chatbubble-ellipses-outline" size={40} color="#94A3B8" />
          <Text style={styles.centeredText}>Sign in to rate your experience and share suggestions.</Text>
          <Pressable
            style={styles.signInButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.signInButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaWrapper>
    );
  }

  const canSubmit = rating != null && !isSubmitting;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={USER_FEEDBACK_CANVAS}>
      <ScreenHeader title="User Feedback" onBackPress={() => navigation.goBack()} />
      <KeyboardWrapper style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Share your experience</Text>
            <Text style={styles.heroDesc}>
              Rate your experience and share suggestions. Your response is saved to your account.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>
                Overall rating <Text style={styles.requiredMark}>*</Text>
              </Text>
              <View style={styles.starRow} accessibilityRole="adjustable">
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = rating != null && value <= rating;
                  return (
                    <Pressable
                      key={value}
                      style={styles.starButton}
                      onPress={() => setRating(value)}
                      accessibilityRole="button"
                      accessibilityLabel={`${value} star${value > 1 ? 's' : ''}`}
                      accessibilityState={{ selected: rating === value }}
                    >
                      <Ionicons
                        name={active ? 'star' : 'star-outline'}
                        size={36}
                        color={active ? STAR_COLOR_ACTIVE : STAR_COLOR_IDLE}
                      />
                    </Pressable>
                  );
                })}
                {rating != null ? (
                  <Text style={styles.ratingHint}>{rating} / 5</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>
                Subject <Text style={styles.labelMuted}>(optional)</Text>
              </Text>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Booking flow, app speed"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                maxLength={SUBJECT_MAX}
                accessibilityLabel="Feedback subject"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>
                Comments <Text style={styles.labelMuted}>(optional)</Text>
              </Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="What went well? What could we improve?"
                placeholderTextColor="#94A3B8"
                style={styles.textArea}
                multiline
                maxLength={MESSAGE_MAX}
                accessibilityLabel="Feedback comments"
              />
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#059669" />
              <Text style={styles.infoText}>
                Your feedback is securely linked to your account and helps us improve services.
              </Text>
            </View>

            <Pressable
              style={[styles.submitButton, !canSubmit ? styles.submitButtonDisabled : null]}
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
          </View>
        </ScrollView>
      </KeyboardWrapper>
    </SafeAreaWrapper>
  );
}
