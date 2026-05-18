import { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AddReviewScreen() {
  const [rating, setRating] = useState(4);
const navigation = useNavigation<NavigationProp<AccountStackParamList>>();
  return (
        <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
          <ScreenHeader
            title="Add Review"
            onBackPress={() => navigation.goBack()}
          />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#0F172A"
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>Add Review</Text>
            <Text style={styles.subtitle}>
              Share your feedback and help us improve your experience.
            </Text>
          </View>
        </View>

        {/* Rating Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Overall Rating *</Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setRating(item)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={item <= rating ? 'star' : 'star-outline'}
                  size={34}
                  color="#F59E0B"
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingText}>
            {rating >= 4
              ? 'Excellent Experience'
              : rating >= 3
              ? 'Good Experience'
              : 'Needs Improvement'}
          </Text>
        </View>

        {/* Subject */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subject (optional)</Text>

          <TextInput
            placeholder="e.g. Booking flow, website speed"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        {/* Comments */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comments (optional)</Text>

          <TextInput
            multiline
            textAlignVertical="top"
            placeholder="Tell us about your experience..."
            placeholderTextColor="#94A3B8"
            style={styles.textArea}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="information-outline"
            size={18}
            color="#2563EB"
          />

          <Text style={styles.infoText}>
            Your response is securely saved to your account and helps improve
            our services.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} activeOpacity={0.9}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    maxWidth: 280,
  },

  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 14,
  },

  ratingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  ratingText: {
    fontSize: 14,
    color: '#64748B',
  },

  inputContainer: {
    marginBottom: 20,
  },

  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0F172A',
  },

  textArea: {
    minHeight: 140,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 28,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#1E40AF',
  },

  submitButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});