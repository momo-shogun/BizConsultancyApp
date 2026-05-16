import React, { useMemo } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenWrapper } from '@/shared/components';

import { CONSULTANT_ACCENT, styles } from './ConsultantProfileScreen.styles';

type ProfileType = 'user' | 'kids' | 'add';

interface Profile {
  id: string;
  name: string;
  type: ProfileType;
  emoji?: string;
}

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

const PROFILES: Profile[] = [
  { id: '1', name: 'Ratnesh...', type: 'user', emoji: '😊' },
  { id: '2', name: 'Kids', type: 'kids' },
  { id: '3', name: 'Add', type: 'add' },
];

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

function SectionHeading(props: {
  title: string;
  rightAction?: React.ReactNode;
}): React.ReactElement {
  if (props.rightAction) {
    return (
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderTitleRow}>
          <Text style={styles.sectionTitle}>{props.title}</Text>
          <View style={styles.sectionLine} />
        </View>
        {props.rightAction}
      </View>
    );
  }

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{props.title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function ProfileAvatar({ profile }: { profile: Profile }): React.ReactElement {
  if (profile.type === 'add') {
    return (
      <View style={styles.addProfileCircle}>
        <Text style={styles.addProfilePlus}>+</Text>
      </View>
    );
  }

  if (profile.type === 'kids') {
    return (
      <View style={styles.profileKidsBadge}>
        <Text style={styles.profileKidsText}>KiDS</Text>
      </View>
    );
  }

  return (
    <View style={styles.profileAvatarRing}>
      <View style={styles.profileAvatarInner}>
        <Text style={styles.profileEmoji}>{profile.emoji ?? '😊'}</Text>
      </View>
    </View>
  );
}

export function ConsultantProfileScreen(): React.ReactElement {
  const navigation = useNavigation<AccountNav>();

  const watchRows = useMemo((): WatchItem[][] => {
    const rows: WatchItem[][] = [];
    for (let i = 0; i < WATCH_ITEMS.length; i += 2) {
      rows.push(WATCH_ITEMS.slice(i, i + 2));
    }
    return rows;
  }, []);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>My Profile</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help and settings"
          onPress={() => navigation.navigate(ROUTES.Account.HelpSettings)}
          style={({ pressed }) => [styles.settingsBtn, pressed ? { opacity: 0.88 } : null]}
        >
          <Ionicons name="settings-outline" size={16} color={CONSULTANT_ACCENT} />
          <Text style={styles.settingsBtnText}>Settings</Text>
        </Pressable>
      </View>

      <ScreenWrapper style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionShimmer} />
            <View style={styles.subscriptionInner}>
              <View style={styles.subscriptionRow}>
                <View style={styles.subscriptionLeft}>
                  <View style={styles.subscriptionPlanRow}>
                    <Text style={styles.subscriptionPlanText} numberOfLines={1}>
                      Mobile 28 days (Airtel)
                    </Text>
                    <Text style={styles.subscriptionChevron}>▾</Text>
                  </View>
                  <Text style={styles.subscriptionPhone}>+91 9794204560</Text>
                </View>
                <LinearGradient
                  colors={['#DCFCE7', '#BBF7D0', '#86EFAC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.upgradeBtn}
                >
                  <Text style={styles.upgradeBtnText}>Upgrade</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeading
              title="Profiles"
              rightAction={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Edit profiles"
                  style={({ pressed }) => [styles.editRow, pressed ? { opacity: 0.85 } : null]}
                >
                  <Ionicons name="create-outline" size={14} color={CONSULTANT_ACCENT} />
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              }
            />
            <View style={styles.profilesPanel}>
              <View style={styles.profilesRow}>
                {PROFILES.map((profile) => (
                  <View key={profile.id} style={styles.profileItem}>
                    <ProfileAvatar profile={profile} />
                    <Text style={styles.profileName} numberOfLines={1}>
                      {profile.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeading title="Notification" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open notification video"
              style={({ pressed }) => [styles.notificationCard, pressed ? { opacity: 0.92 } : null]}
            >
              <View style={styles.notificationShimmer} />
              <LinearGradient
                colors={['#F0FDF4', '#FFFFFF', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.notificationInner}
              >
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
              </LinearGradient>
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
                    style={({ pressed }) => [styles.watchCard, pressed ? { opacity: 0.92 } : null]}
                  >
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
                          color={CONSULTANT_ACCENT}
                        />
                      </Pressable>
                    </View>
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
