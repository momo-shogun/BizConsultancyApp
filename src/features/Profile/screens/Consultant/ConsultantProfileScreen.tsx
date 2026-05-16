import React, { useMemo } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { ProfileAccountCard } from '@/features/Profile/components/ProfileAccountCard';
import { SafeAreaWrapper, ScreenWrapper } from '@/shared/components';
import { Card } from '@/shared/components/card';

import { CONSULTANT_CANVAS, styles } from './ConsultantProfileScreen.styles';

type StatIconName = React.ComponentProps<typeof Ionicons>['name'];

interface ConsultantStatItem {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: StatIconName;
  iconColor: string;
  iconBg: string;
  accentBorder: string;
  valueMuted?: boolean;
}

const CONSULTANT_STATS: ConsultantStatItem[] = [
  {
    id: 'earnings',
    label: 'Total earnings',
    value: '₹0.00',
    subtitle: 'All paid bookings credited to your wallet.',
    icon: 'wallet-outline',
    iconColor: '#0D9488',
    iconBg: 'rgba(13,148,136,0.10)',
    accentBorder: '#0D9488',
    valueMuted: true,
  },
  {
    id: 'bookings',
    label: 'Total bookings',
    value: '0',
    subtitle: 'Confirmed sessions across all time.',
    icon: 'calendar-outline',
    iconColor: '#2563EB',
    iconBg: 'rgba(37,99,235,0.10)',
    accentBorder: '#2563EB',
    valueMuted: true,
  },
  {
    id: 'upcoming',
    label: 'Upcoming sessions',
    value: '0',
    subtitle: 'Next few bookings from your calendar.',
    icon: 'time-outline',
    iconColor: '#D97706',
    iconBg: 'rgba(217,119,6,0.10)',
    accentBorder: '#D97706',
    valueMuted: true,
  },
  {
    id: 'rating',
    label: 'Rating & review',
    value: '—',
    subtitle: 'Public rating surface coming soon.',
    icon: 'star-outline',
    iconColor: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.10)',
    accentBorder: '#7C3AED',
    valueMuted: true,
  },
];

interface WatchItem {
  id: string;
  title: string;
  label: string;
  subLabel?: string;
  remaining?: string;
  thumbnail?: string;
  /** 0–1 */
  progress: number;
  bgColor: string;
  titleColor: string;
}

const WATCH_ITEMS: WatchItem[] = [
  {
    id: 'section',
    title: 'Section Ka — The Only Boy',
    label: 'S1 E6',
    remaining: '22m left',
    progress: 0.4,
    bgColor: '#2D4A1A',
    titleColor: '#FF6B9D',
    thumbnail:
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=640&auto=format&fit=crop&q=80',
  },
  {
    id: 'doNotEnter',
    title: 'Do Not Enter',
    label: 'Do Not Enter',
    subLabel: '35m left',
    remaining: '35m left',
    progress: 0.65,
    bgColor: '#1A1A2E',
    titleColor: THEME.colors.white,
    thumbnail:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=640&auto=format&fit=crop&q=80',
  },
];

type AccountNav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.Home>;

function SectionHeading(props: { title: string }): React.ReactElement {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{props.title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

interface StatCardProps {
  item: ConsultantStatItem;
  width: number;
}

function StatCard(props: StatCardProps): React.ReactElement {
  const { item, width } = props;

  return (
    <Card
      style={[styles.statCard, { width, borderLeftColor: item.accentBorder }]}
      accessibilityRole="text"
      accessibilityLabel={`${item.label}, ${item.value}. ${item.subtitle}`}
    >
      <View style={styles.statCardTop}>
        <Text style={styles.statLabel}>{item.label}</Text>
        <View style={[styles.statIconWrap, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon} size={18} color={item.iconColor} />
        </View>
      </View>
      <View>
        <Text
          style={[styles.statValue, item.valueMuted ? styles.statValueMuted : null]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {item.value}
        </Text>
        <Text style={styles.statSubtitle}>{item.subtitle}</Text>
      </View>
    </Card>
  );
}

const GRID_GAP = THEME.spacing[10];
const GRID_H_PADDING = THEME.spacing[12];

export function ConsultantProfileScreen(): React.ReactElement {
  const navigation = useNavigation<AccountNav>();
  const { width: screenWidth } = useWindowDimensions();

  const statCardWidth = useMemo((): number => {
    const inner = screenWidth - GRID_H_PADDING * 2 - GRID_GAP;
    return Math.floor(inner / 2);
  }, [screenWidth]);

  const watchRows = useMemo((): WatchItem[][] => {
    const rows: WatchItem[][] = [];
    for (let i = 0; i < WATCH_ITEMS.length; i += 2) {
      rows.push(WATCH_ITEMS.slice(i, i + 2));
    }
    return rows;
  }, []);

  return (
    <SafeAreaWrapper
      edges={['top', 'bottom']}
      bgColor={CONSULTANT_CANVAS}
      contentBgColor={CONSULTANT_CANVAS}
    >
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>My Profile</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help and settings"
          onPress={() => navigation.navigate(ROUTES.Account.HelpSettings)}
          style={({ pressed }) => [styles.settingsBtn, pressed ? { opacity: 0.88 } : null]}
        >
          <Ionicons name="settings-outline" size={16} color={THEME.colors.textSecondary} />
          <Text style={styles.settingsBtnText}>Settings</Text>
        </Pressable>
      </View>

      <ScreenWrapper style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileAccountCard accountRole="consultant" style={styles.subscriptionCard} />

          <View style={styles.section}>
            <SectionHeading title="Business overview" />
            <View style={styles.statsGrid}>
              {CONSULTANT_STATS.map((stat) => (
                <StatCard key={stat.id} item={stat} width={statCardWidth} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeading title="Notification" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open notification video"
              style={({ pressed }) => [pressed ? { opacity: 0.92 } : null]}
            >
              <Card style={styles.notificationCard}>
                <View style={styles.notificationShimmer} />
                <View style={styles.notificationInner}>
                <Image
                  source={{
                    uri: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
                  }}
                  style={styles.videoThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.notificationContent}>
                  <Text numberOfLines={1} style={styles.videoTitle}>
                    Learn React Native Navigation in 10 Minutes
                  </Text>
                  <Text numberOfLines={2} style={styles.videoDescription}>
                    Complete beginner friendly tutorial to understand stack, tabs and screen
                    navigation easily.
                  </Text>
                </View>
                <View style={styles.arrowBox}>
                  <Ionicons name="chevron-forward" size={18} color={THEME.colors.white} />
                </View>
              </View>
              </Card>
            </Pressable>
          </View>

          <View style={styles.section}>
            <SectionHeading title="Continue Watching for Aparna Dewal" />
            {watchRows.map((row, rowIndex) => (
              <View key={`watch-row-${rowIndex}`} style={styles.watchRow}>
                {row.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Continue watching ${item.title}`}
                    style={({ pressed }) => [styles.watchCardPressable, pressed ? { opacity: 0.92 } : null]}
                  >
                    <Card style={styles.watchCard}>
                    {item.thumbnail ? (
                      <ImageBackground
                        source={{ uri: item.thumbnail }}
                        style={styles.watchThumbnail}
                        imageStyle={styles.watchThumbnailImage}
                      >
                        <LinearGradient
                          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']}
                          style={styles.watchThumbnailOverlay}
                        />
                        <View style={styles.watchPlayOverlay}>
                          <Ionicons name="play" size={12} color={THEME.colors.white} />
                        </View>
                      </ImageBackground>
                    ) : (
                      <View style={[styles.watchThumbnail, { backgroundColor: item.bgColor }]}>
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.65)']}
                          style={styles.watchThumbnailOverlay}
                        />
                        <View style={styles.watchPlayOverlay}>
                          <Ionicons name="play" size={12} color={THEME.colors.white} />
                        </View>
                      </View>
                    )}
                    <View style={styles.watchProgressTrack}>
                      <View
                        style={[
                          styles.watchProgressFill,
                          { width: `${Math.round(item.progress * 100)}%` },
                        ]}
                      />
                    </View>
                    <View style={styles.watchCardMeta}>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text numberOfLines={2} style={styles.watchCardTitle}>
                          {item.title}
                        </Text>
                        {item.remaining ? (
                          <Text style={styles.watchCardSubLabel}>{item.remaining}</Text>
                        ) : null}
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="More options"
                        style={styles.watchMoreBtn}
                      >
                        <Ionicons
                          name="ellipsis-vertical"
                          size={14}
                          color="#64748B"
                        />
                      </Pressable>
                    </View>
                    </Card>
                  </Pressable>
                ))}
                {row.length === 1 ? <View style={styles.watchCardSpacer} /> : null}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}
