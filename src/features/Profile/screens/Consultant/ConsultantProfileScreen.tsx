import React from 'react';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/app/providers/AuthProvider';
import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader, ScreenWrapper } from '@/shared/components';

import { styles } from './ConsultantProfileScreen.styles';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Static data ───────────────────────────────────────────────────────────────
const PROFILES: Profile[] = [
  { id: '1', name: 'Ratnesh...', type: 'user', emoji: '😊' },
  { id: '2', name: 'Kids', type: 'kids' },
  { id: '3', name: 'Add', type: 'add' },
];

const WATCH_ITEMS: WatchItem[] = [
  {
    id: 'section',
    title: 'Section Ka\nThe Only Boy',
    label: 'S1 E6',
    remaining: '22m left',
    progress: 0.4,
    bgColor: '#2D4A1A',
    titleColor: '#FF6B9D',
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
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
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

function WatchCard({
  item,
  onMore,
}: {
  item: WatchItem;
  onMore: () => void;
}): React.ReactElement {
  return (
    <View style={styles.watchCard}>
      <View style={[styles.watchThumbnail, { backgroundColor: item.bgColor }]}>
        <Text style={[styles.watchThumbnail, { color: item.titleColor }]}>
          {item.title}
        </Text>
        <View style={styles.watchPlayOverlay}>
          <Text style={styles.watchPlayIcon}>▶</Text>
        </View>
      </View>

      <View style={styles.watchProgressTrack}>
        <View style={[styles.watchProgressFill, { width: `${item.progress * 100}%` }]} />
      </View>

      <View style={styles.watchCardMeta}>
        <View>
          <Text style={styles.watchCardSubLabel}>{item.label}</Text>
          {item.subLabel ? (
            <Text style={styles.watchCardSubLabel}>{item.subLabel}</Text>
          ) : null}
        </View>
        <TouchableOpacity style={styles.watchMoreBtn} onPress={onMore}>
          <Text style={styles.watchMoreBtn}>•••</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
type AccountNav = NativeStackNavigationProp<AccountStackParamList, typeof ROUTES.Account.Home>;

export function ConsultantProfileScreen(): React.ReactElement {
  const { logout } = useAuth();
  const navigation = useNavigation<AccountNav>();
  const watchRows: WatchItem[][] = [];
  for (let i = 0; i < WATCH_ITEMS.length; i += 2) {
    watchRows.push(WATCH_ITEMS.slice(i, i + 2));
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
  <ScreenHeader title="My Profile Consultant" />

<TouchableOpacity
  activeOpacity={0.8}
  style={styles.helpBtn}
  onPress={() => navigation.navigate(ROUTES.Account.HelpSettings)}
>
  <Ionicons
    name="settings-outline"
    size={18}
    color="#A855F7"
  />
  <Text style={styles.helpText}>
    Help & Settings
  </Text>
</TouchableOpacity>
</View>
      <ScreenWrapper style={styles.screen}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ── Subscription card ─────────────────────────── */}
          <View style={styles.subscriptionCard}>
            <View/>
            <View style={styles.subscriptionInner}>
              <View style={styles.subscriptionRow}>
                <View style={styles.subscriptionLeft}>
                  <View style={styles.subscriptionPlanRow}>
                    <Text style={styles.subscriptionPlanText}>
                      Mobile 28 days (Airtel)
                    </Text>
                    <Text style={styles.subscriptionChevron}>▾</Text>
                  </View>
                  <Text style={styles.subscriptionPhone}>+91 9794204560</Text>
                </View>

                <LinearGradient
  colors={['#ffedd8', '#f3d5b5' ,'#e7bc91']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.upgradeBtn}
>
  <Text>Upgrade</Text>
</LinearGradient>
              </View>
            </View>
          </View>

          {/* ── Profiles ──────────────────────────────────── */}
          <View style={{ gap: THEME.spacing[16], marginTop: THEME.spacing[20] }}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionAccentBar} />
                <Text style={styles.sectionTitle}>Profiles</Text>
              </View>
              <TouchableOpacity style={styles.editRow}>
                <Text style={styles.editIcon}>✎</Text>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profilesRow}>
              {PROFILES.map((profile) => (
                <View key={profile.id} style={styles.profileItem}>
                  <ProfileAvatar profile={profile} />
                  <Text style={styles.profileName}>{profile.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.paddingTop}>
     <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionAccentBar} />
                <Text style={styles.sectionTitle}>Notification</Text>
              </View>
          </View>

                  

          {/* ── Jeeto banner ──────────────────────────────── */}
<TouchableOpacity activeOpacity={0.9}>
  <LinearGradient
    colors={['#FFF8F3', '#F9F1FF', '#F5EFFF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.notificationCard, { marginTop: THEME.spacing[20] }]}
  >
    <View style={styles.notificationGlow} />

    <View style={styles.notificationInner}>
      
      <Image
        source={{
          uri: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        }}
        style={styles.videoThumbnail}
      />

      <View style={styles.notificationContent}>
        <Text numberOfLines={1} style={styles.videoTitle}>
          Learn React Native Navigation in 10 Minutes
        </Text>

        <Text numberOfLines={2} style={styles.videoDescription}>
          Complete beginner friendly tutorial to understand stack,
          tabs and screen navigation easily.
        </Text>
      </View>

      <View style={styles.arrowBox}>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#7C3AED"
        />
      </View>
    </View>
  </LinearGradient>
</TouchableOpacity>

          {/* ── Continue watching ──────────────────────────── */}
          {/* ── Continue watching ──────────────────────────── */}
<View style={{ gap: THEME.spacing[20] }}>

  <View style={styles.paddingTop}>
    <View style={styles.sectionHeaderLeft}>
      <View style={styles.sectionAccentBar} />

      <Text style={styles.sectionTitle}>
        Continue Watching for Aparna Dewal
      </Text>
    </View>
  </View>

  {watchRows.map((row, rowIndex) => (
    <View key={rowIndex} style={styles.watchRow}>
      {row.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.9}
          style={styles.watchCard}
        >
          {/* Thumbnail */}
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={styles.watchThumbnail}
            imageStyle={styles.watchThumbnailImage}
          >
            {/* Dark overlay */}
            <LinearGradient
              colors={[
                'rgba(0,0,0,0.05)',
                'rgba(0,0,0,0.65)',
              ]}
              style={styles.watchThumbnailOverlay}
            />

            {/* Play Button */}
            <View style={styles.watchPlayOverlay}>
              <Ionicons
                name="play"
                size={12}
                color="#fff"
              />
            </View>
          </ImageBackground>

          {/* Progress */}
          <View style={styles.watchProgressTrack}>
            <View
              style={[
                styles.watchProgressFill,
                { width: `${item.progress}%` },
              ]}
            />
          </View>

          {/* Meta */}
          <View style={styles.watchCardMeta}>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={styles.watchCardTitle}
              >
                {item.title}
              </Text>

              <Text style={styles.watchCardSubLabel}>
                {item.remaining}
              </Text>
            </View>

            <TouchableOpacity style={styles.watchMoreBtn}>
              <Ionicons
                name="ellipsis-vertical"
                size={16}
                color="#A1A1AA"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {row.length === 1 ? (
        <View style={styles.watchCardSpacer} />
      ) : null}
    </View>
  ))}
</View>

        </ScrollView>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}