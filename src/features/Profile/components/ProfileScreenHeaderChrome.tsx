import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import {
  PROFILE_CANVAS,
  PROFILE_HEADER_GRADIENT,
  PROFILE_HEADER_STATUS_BAR,
} from '../constants/profileScreenTheme';

export interface ProfileScreenHeaderChromeProps {
  title: string;
  onBackPress?: () => void;
  avatarUri?: string | null;
  avatarInitial?: string;
  displayName?: string;
  displaySubtitle?: string;
  onAvatarPress?: () => void;
  membershipLabel?: string;
  onMembershipPress?: () => void;
  rightAction?: React.ReactNode;
  /** Omit bottom inset on main tab profile; nested stacks should keep the default. */
  safeAreaEdges?: Edge[];
  children: React.ReactNode;
}

export function ProfileScreenHeaderChrome(
  props: ProfileScreenHeaderChromeProps,
): React.ReactElement {
  const insets = useSafeAreaInsets();
  const showHero =
    props.displayName != null ||
    props.avatarUri != null ||
    props.avatarInitial != null ||
    props.onAvatarPress != null;

  return (
    <SafeAreaWrapper
      edges={props.safeAreaEdges ?? ['bottom']}
      bgColor={PROFILE_HEADER_STATUS_BAR}
      statusBarStyle="light-content"
      style={chromeStyles.flex}
    >
      <LinearGradient
        colors={[...PROFILE_HEADER_GRADIENT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[chromeStyles.headerGradient, { paddingTop: insets.top }]}
      >
        {props.onBackPress != null ? (
          <ScreenHeader
            title={props.title}
            onBackPress={props.onBackPress}
            headerColor="transparent"
          />
        ) : (
          <View style={chromeStyles.titleRow}>
            <Text style={chromeStyles.headerTitle}>{props.title}</Text>
            {props.rightAction != null ? props.rightAction : <View style={chromeStyles.titleSpacer} />}
          </View>
        )}

        {showHero ? (
          <View style={chromeStyles.heroBlock}>
            <Pressable
              onPress={props.onAvatarPress}
              disabled={props.onAvatarPress == null}
              accessibilityRole={props.onAvatarPress != null ? 'button' : 'image'}
              accessibilityLabel={
                props.onAvatarPress != null ? 'Change profile photo' : 'Profile photo'
              }
            >
              <View style={chromeStyles.avatarRing}>
                <View style={chromeStyles.avatarInner}>
                  {props.avatarUri != null ? (
                    <Image
                      source={{ uri: props.avatarUri }}
                      style={chromeStyles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={chromeStyles.avatarInitial}>
                      {props.avatarInitial ?? 'U'}
                    </Text>
                  )}
                </View>
                {props.onAvatarPress != null ? (
                  <View style={chromeStyles.cameraBadge}>
                    <Ionicons name="camera" size={14} color="#FFFFFF" />
                  </View>
                ) : null}
              </View>
            </Pressable>

            {props.displayName != null && props.displayName.length > 0 ? (
              <Text style={chromeStyles.heroName} numberOfLines={1}>
                {props.displayName}
              </Text>
            ) : null}
            {props.displaySubtitle != null && props.displaySubtitle.length > 0 ? (
              <Text style={chromeStyles.heroSubtitle} numberOfLines={1}>
                {props.displaySubtitle}
              </Text>
            ) : null}
            {props.membershipLabel != null && props.membershipLabel.trim().length > 0 ? (
              <Pressable
                onPress={props.onMembershipPress}
                disabled={props.onMembershipPress == null}
                accessibilityRole={props.onMembershipPress != null ? 'button' : 'text'}
                accessibilityLabel={
                  props.onMembershipPress != null
                    ? `Membership plan ${props.membershipLabel}. Open plans`
                    : `Membership plan ${props.membershipLabel}`
                }
                style={({ pressed }) => [
                  chromeStyles.membershipPill,
                  props.onMembershipPress == null ? chromeStyles.membershipPillStatic : null,
                  pressed && props.onMembershipPress != null ? chromeStyles.membershipPillPressed : null,
                ]}
              >
                <View style={chromeStyles.membershipLeft}>
                  <View style={chromeStyles.membershipIconWrap}>
                    <Ionicons name="ribbon-outline" size={13} color="#FFFFFF" />
                  </View>
                  <View style={chromeStyles.membershipCopy}>
                    <Text style={chromeStyles.membershipCaption}>Current plan</Text>
                    <Text style={chromeStyles.membershipText} numberOfLines={1}>
                      {props.membershipLabel}
                    </Text>
                  </View>
                </View>
                {props.onMembershipPress != null ? (
                  <View style={chromeStyles.upgradeChip}>
                    <Text style={chromeStyles.upgradeChipText}>Upgrade</Text>
                    <Ionicons name="arrow-up-outline" size={13} color="#14532D" />
                  </View>
                ) : null}
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </LinearGradient>

      <View style={chromeStyles.body}>{props.children}</View>
    </SafeAreaWrapper>
  );
}

const chromeStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerGradient: {
    width: '100%',
    paddingBottom: THEME.spacing[20],
  },
  titleRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing[16],
  },
  headerTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  titleSpacer: {
    width: 40,
  },
  heroBlock: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginBottom: THEME.spacing[4],
  },
  avatarInner: {
    flex: 1,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 34,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(15,81,50,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroName: {
    fontSize: THEME.typography.size[18],
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    maxWidth: '100%',
  },
  heroSubtitle: {
    fontSize: THEME.typography.size[12],
    fontWeight: '500',
    color: 'rgba(255,255,255,0.88)',
    maxWidth: '100%',
  },
  membershipPill: {
    marginTop: THEME.spacing[8],
    maxWidth: '92%',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  membershipPillStatic: {
    paddingRight: 12,
  },
  membershipPillPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
  membershipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  membershipIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  membershipCopy: {
    flex: 1,
    minWidth: 0,
  },
  membershipCaption: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 10,
    fontWeight: '600',
  },
  membershipText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.size[12],
    fontWeight: '700',
  },
  upgradeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  upgradeChipText: {
    color: '#14532D',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    backgroundColor: PROFILE_CANVAS,
  },
});
