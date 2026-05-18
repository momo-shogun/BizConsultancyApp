import { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GUIDE_DATA = [
  {
    id: '1',
    title: 'Slot Booking',
    duration: '02:45',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200',
    accent: '#2563EB',
  },
  {
    id: '2',
    title: 'Expertise Add',
    duration: '03:10',
    image:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200',
    accent: '#10B981',
  },
  {
    id: '3',
    title: 'Consultant Login',
    duration: '02:30',
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200',
    accent: '#3B82F6',
  },
  {
    id: '4',
    title: 'Permission Setup',
    duration: '01:55',
    image:
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1200',
    accent: '#8B5CF6',
  },
  {
    id: '5',
    title: 'My Locker',
    duration: '02:20',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200',
    accent: '#F97316',
  },
  {
    id: '6',
    title: 'Download App',
    duration: '01:10',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200',
    accent: '#14B8A6',
  },
];

const FAQ_DATA = [
  {
    id: '1',
    question: 'How to become a User on Biz Consultancy?',
    answer:
      'Download the Biz app, create your account using mobile verification, and complete your profile setup.',
  },
  {
    id: '2',
    question: 'How to become a Consultant on Biz Consultant?',
    answer:
      'Submit your expertise details, upload required documents, and wait for verification approval.',
  },
  {
    id: '3',
    question: 'How to create profile on Biz Consultant?',
    answer:
      'Open profile settings, upload your photo, add bio and business details, then save changes.',
  },
  {
    id: '4',
    question: 'How to add your expertise as Expert on Biz Consultant?',
    answer:
      'Go to Expertise section and select your service categories and consultation fields.',
  },
  {
    id: '5',
    question: 'How to add slot for users on Biz Consultant?',
    answer:
      'Use the Slot Booking section to create available consultation timings.',
  },
  {
    id: '6',
    question: 'How to create document locker and upload document?',
    answer:
      'Open My Locker, create folders, and upload documents securely from your device.',
  },
];

export default function UserGuideScreen() {
  const [activeTab, setActiveTab] = useState('videos');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const navigation =
    useNavigation<NavigationProp<AccountStackParamList>>();

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />

        <View style={styles.playButton}>
          <MaterialCommunityIcons
            name="play"
            size={24}
            color={item.accent}
          />
        </View>

        <View style={styles.cardFooter}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.cardTitle}>
              {item.title}
            </Text>

            <Text style={styles.cardDuration}>
              {item.duration}
            </Text>
          </View>

          <View
            style={[
              styles.indexBadge,
              {
                backgroundColor: `${item.accent}15`,
              },
            ]}
          >
            <Text
              style={[
                styles.indexText,
                { color: item.accent },
              ]}
            >
              {item.id}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor="white">
      <StatusBar barStyle="dark-content" />

      <ScreenHeader
        title="User Guide"
        onBackPress={() => navigation.goBack()}
      />

      {/* Subtitle */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>
          Step-by-step guides to help you get the most out of Biz.
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'videos' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('videos')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'videos' &&
                styles.activeTabText,
            ]}
          >
            Video Guide
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'faq' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('faq')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'faq' &&
                styles.activeTabText,
            ]}
          >
            FAQ
          </Text>
        </TouchableOpacity>
      </View>

      {/* FAQ */}
      {activeTab === 'faq' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.faqContainer}
        >
          {FAQ_DATA.map((item) => {
            const isExpanded =
              expandedFAQ === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                style={styles.faqCard}
                onPress={() =>
                  setExpandedFAQ(
                    isExpanded ? null : item.id,
                  )
                }
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>
                    {item.question}
                  </Text>

                  <MaterialCommunityIcons
                    name={
                      isExpanded ? 'minus' : 'plus'
                    }
                    size={22}
                    color="#0F172A"
                  />
                </View>

                {isExpanded && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.faqAnswer}>
                      {item.answer}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <FlatList
          data={GUIDE_DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.gridContainer
          }
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
        />
      )}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headerSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    padding: 4,
    borderRadius: 16,
    marginBottom: 20,
  },

  tabButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#FFFFFF',
  },

  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },

  activeTabText: {
    color: '#0F172A',
  },

  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F8FAFC',
  },

  playButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardFooter: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },

  cardDuration: {
    fontSize: 13,
    color: '#64748B',
  },

  indexBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  indexText: {
    fontSize: 14,
    fontWeight: '700',
  },

  faqContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },

  faqQuestion: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: '#0F172A',
  },

  answerContainer: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
});