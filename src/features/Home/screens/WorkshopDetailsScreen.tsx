import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function WorkshopDetailsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Hero Banner */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200',
          }}
          style={styles.banner}
          imageStyle={styles.bannerImage}
        >
          <View style={styles.overlay} />

          <TouchableOpacity style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.bannerContent}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Workshop</Text>
            </View>

            <Text style={styles.bannerTitle}>
              Mobile App Development Masterclass
            </Text>

            <Text style={styles.bannerSubtitle}>
              Learn React Native, UI Design, APIs and production-ready app
              development with practical sessions.
            </Text>

            <View style={styles.bannerMetaRow}>
              <View style={styles.metaChip}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={14}
                  color="#FFFFFF"
                />
                <Text style={styles.metaText}>13 May 2026</Text>
              </View>

              <View style={styles.metaChip}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color="#FFFFFF"
                />
                <Text style={styles.metaText}>Lucknow</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Price Card */}
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Workshop Fee</Text>
              <Text style={styles.priceValue}>₹1 Only</Text>
            </View>

            <View style={styles.priceIcon}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={22}
                color="#0F172A"
              />
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this workshop</Text>

            <Text style={styles.description}>
              This workshop is designed for beginners and developers who want
              to build beautiful and scalable mobile applications using React
              Native and modern UI practices.
            </Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: '#DBEAFE' }]}>
              <Text style={[styles.tagText, { color: '#2563EB' }]}>
                React Native
              </Text>
            </View>

            <View style={[styles.tag, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.tagText, { color: '#16A34A' }]}>
                Flutter
              </Text>
            </View>

            <View style={[styles.tag, { backgroundColor: '#F3E8FF' }]}>
              <Text style={[styles.tagText, { color: '#9333EA' }]}>
                UI/UX
              </Text>
            </View>

            <View style={[styles.tag, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.tagText, { color: '#D97706' }]}>
                API Integration
              </Text>
            </View>
          </View>

          {/* What you'll learn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What you'll learn</Text>

            <View style={styles.learnGrid}>
              {[
                'Modern Mobile UI',
                'React Native Basics',
                'API Integration',
                'Authentication Flow',
                'App Navigation',
                'Production Deployment',
              ].map((item, index) => (
                <View key={index} style={styles.learnItem}>
                  <View style={styles.learnIcon}>
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color="#10B981"
                    />
                  </View>

                  <Text style={styles.learnText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Schedule Card */}
          <View style={styles.scheduleCard}>
            <Text style={styles.cardTitle}>Venue & Schedule</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={18}
                  color="#2563EB"
                />
              </View>

              <View>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>Wednesday, 13 May 2026</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color="#10B981"
                />
              </View>

              <View>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>09:00 AM - 10:00 AM</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={18}
                  color="#F97316"
                />
              </View>

              <View>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>Lucknow, Uttar Pradesh</Text>
              </View>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.contactCard}>
            <View style={styles.contactLeft}>
              <View style={styles.contactIcon}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={20}
                  color="#FFFFFF"
                />
              </View>

              <View>
                <Text style={styles.contactTitle}>Need Help?</Text>
                <Text style={styles.contactNumber}>+91 7007175608</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.chatButton}>
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Workshop Fee</Text>
          <Text style={styles.bottomPrice}>₹1</Text>
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  banner: {
    height: 340,
    justifyContent: 'space-between',
  },

  bannerImage: {
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,42,0.55)',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  backButton: {
    marginTop: 16,
    marginLeft: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerContent: {
    paddingHorizontal: 22,
    paddingBottom: 28,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 30,
    marginBottom: 18,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },

  liveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  bannerTitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  bannerSubtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.82)',
    marginBottom: 20,
  },

  bannerMetaRow: {
    flexDirection: 'row',
    gap: 10,
  },

  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },

  metaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -28,
  },

  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },

  priceLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },

  priceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  priceIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 26,
    color: '#64748B',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },

  tag: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },

  tagText: {
    fontSize: 13,
    fontWeight: '700',
  },

  learnGrid: {
    gap: 14,
  },

  learnItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  learnIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  learnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },

  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  infoIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  contactCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  contactTitle: {
    color: '#CBD5E1',
    fontSize: 13,
    marginBottom: 4,
  },

  contactNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  chatButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },

  chatButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  bottomPriceLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },

  bottomPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  bookButton: {
    height: 56,
    paddingHorizontal: 34,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});