import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { styles } from './ourPackagestyles.ts';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface PackageItem {
  icon: string;
  title: string;
  status: string;
  details: string[];
  category: string;
}

interface OurPackage {
  items: PackageItem[];
  sectionTitle: string;
}

interface Props {
  ourPackage: OurPackage;
}

// ─────────────────────────────────────────────────────────────
// Icon Component
// ─────────────────────────────────────────────────────────────

const PackageIcon = ({ type }: { type: string }) => {
  const icons: Record<string, string> = {
    fileText: '📄',
    award: '🏆',
    shield: '🛡️',
    check: '✓',
  };

  return <Text style={{ fontSize: 20 }}>{icons[type] ?? '📋'}</Text>;
};

// ─────────────────────────────────────────────────────────────
// Card Config
// ─────────────────────────────────────────────────────────────

const CARD_CONFIG: Record<
  string,
  {
    gradient: [string, string];
    accent: string;
  }
> = {
  'Scope of Work': {
    gradient: ['#0F172A', '#1E3A5F'],
    accent: '#38BDF8',
  },

  Deliverables: {
    gradient: ['#0F2A1A', '#0D3B2B'],
    accent: '#34D399',
  },

  Support: {
    gradient: ['#1A0F2E', '#2D1B6B'],
    accent: '#A78BFA',
  },
};

// ─────────────────────────────────────────────────────────────
// Detail Row
// ─────────────────────────────────────────────────────────────

const DetailRow = ({
  text,
  accent,
}: {
  text: string;
  accent: string;
}) => {
  return (
    <View style={styles.detailRow}>
      <View
        style={[
          styles.detailDot,
          {
            backgroundColor: accent,
          },
        ]}
      />

      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Package Card
// ─────────────────────────────────────────────────────────────

const PackageCard = ({
  pkg,
  index,
}: {
  pkg: PackageItem;
  index: number;
}) => {
  // Open by default
  const [expanded, setExpanded] = useState(true);

  const config = CARD_CONFIG[pkg.category] ?? CARD_CONFIG.Support;

  // Professional subtle chevron animation only
  const rotate = useSharedValue(1);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${withTiming(rotate.value ? 180 : 0, {
          duration: 180,
        })}deg`,
      },
    ],
  }));

  const handlePress = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        220,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );

    rotate.value = expanded ? 0 : 1;

    setExpanded(prev => !prev);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(300)}
    >
      <Pressable
        onPress={handlePress}
        style={styles.cardPressable}
      >
        <View
          style={[
            styles.cardBg,
            {
              backgroundColor: config.gradient[1],
            },
          ]}
        >
          {/* Accent Top Line */}
          <View
            style={[
              styles.cardShimmerEdge,
              {
                backgroundColor: config.accent,
              },
            ]}
          />

          {/* Header */}
          <View style={styles.cardHeader}>
            {/* Icon */}
            <View
              style={[
                styles.cardIconWrap,
                {
                  borderColor: `${config.accent}40`,
                },
              ]}
            >
              <View
                style={[
                  styles.cardIconInner,
                  {
                    backgroundColor: `${config.accent}18`,
                  },
                ]}
              >
                <PackageIcon type={pkg.icon} />
              </View>
            </View>

            {/* Content */}
            <View style={styles.cardHeaderText}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${config.accent}15`,
                    borderColor: `${config.accent}35`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: config.accent,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color: config.accent,
                    },
                  ]}
                >
                  COMPLETE
                </Text>
              </View>

              <Text style={styles.cardTitle}>
                {pkg.title}
              </Text>

              <Text
                style={[
                  styles.cardMeta,
                  {
                    color: `${config.accent}99`,
                  },
                ]}
              >
                {pkg.details.length} items included
              </Text>
            </View>

            {/* Chevron */}
            <Animated.View style={chevronStyle}>
              <Text
                style={[
                  styles.chevron,
                  {
                    color: config.accent,
                  },
                ]}
              >
                ⌃
              </Text>
            </Animated.View>
          </View>

          {/* Expanded Content */}
          {expanded && (
            <Animated.View
              entering={FadeIn.duration(180)}
            >
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: `${config.accent}25`,
                  },
                ]}
              />

              {pkg.details.map((detail, i) => (
                <DetailRow
                  key={`${pkg.title}-${i}`}
                  text={detail}
                  accent={config.accent}
                />
              ))}
            </Animated.View>
          )}

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View
              style={[
                styles.footerPill,
                {
                  backgroundColor: `${config.accent}12`,
                  borderColor: `${config.accent}25`,
                },
              ]}
            >
              <Text
                style={[
                  styles.footerPillText,
                  {
                    color: config.accent,
                  },
                ]}
              >
                {pkg.category}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Section
// ─────────────────────────────────────────────────────────────

export const OurPackageSection = ({
  ourPackage,
}: Props) => {
  if (!ourPackage) return null;

  return (
    <View style={styles.packageSection}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(350)}
        style={styles.sectionHeader}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={styles.headerAccentBar} />

          <Text style={styles.sectionTitle}>
            {ourPackage.sectionTitle}
          </Text>
        </View>

        <View style={styles.sectionCountBadge}>
          <Text style={styles.sectionCountText}>
            {ourPackage.items.length} tiers
          </Text>
        </View>
      </Animated.View>

      {/* Subtitle */}
      <Text style={styles.sectionSubtitle}>
        Tap each package to explore what's included
      </Text>

      {/* Cards */}
      <View style={styles.cardList}>
        {ourPackage.items.map((pkg, index) => (
          <PackageCard
            key={`${pkg.title}-${index}`}
            pkg={pkg}
            index={index}
          />
        ))}
      </View>

      {/* Trust Footer */}
      <Animated.View
        entering={FadeIn.duration(450)}
        style={styles.trustFooter}
      >
        <View style={styles.trustItem2}>
          <Text style={styles.trustEmoji}>🔒</Text>
          <Text style={styles.trustLabel}>
            Govt. Approved
          </Text>
        </View>

        <View style={styles.trustSep} />

        <View style={styles.trustItem2}>
          <Text style={styles.trustEmoji}>⚡</Text>
          <Text style={styles.trustLabel}>
            Fast Processing
          </Text>
        </View>

        <View style={styles.trustSep} />

        <View style={styles.trustItem2}>
          <Text style={styles.trustEmoji}>💬</Text>
          <Text style={styles.trustLabel}>
            Expert Support
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};