import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { styles } from './RecommendedServicesSection.styles';

interface RecommendedServiceItem {
  href: string;
  title: string;
  description: string;
  servicePageId: number;
}

interface RecommendedServicesData {
  title?: string;
  description?: string;
  items?: RecommendedServiceItem[];
}

interface RecommendedServicesSectionProps {
  recommendedServices?: RecommendedServicesData;

  onPressService?: (
    item: RecommendedServiceItem
  ) => void;
}

const CARD_COLORS = [
  {
    soft: '#EFF6FF',
    border: '#BFDBFE',
    accent: '#2563EB',
  },
  {
    soft: '#ECFDF5',
    border: '#A7F3D0',
    accent: '#059669',
  },
  {
    soft: '#FFF7ED',
    border: '#FED7AA',
    accent: '#EA580C',
  },
  {
    soft: '#F5F3FF',
    border: '#DDD6FE',
    accent: '#7C3AED',
  },
];

const RecommendedServicesSection: React.FC<
  RecommendedServicesSectionProps
> = ({
  recommendedServices,
  onPressService,
}) => {
  const services =
    recommendedServices?.items ?? [];

  if (!services.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(350)}>
        <View style={styles.headerWrap}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Recommended
            </Text>
          </View>

          {!!recommendedServices?.title && (
            <Text style={styles.title}>
              {recommendedServices.title}
            </Text>
          )}

          {!!recommendedServices?.description && (
            <Text style={styles.description}>
              {recommendedServices.description}
            </Text>
          )}
        </View>
      </Animated.View>

      {/* Horizontal Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {services.map((service, index) => {
          const palette =
            CARD_COLORS[
              index % CARD_COLORS.length
            ];

          return (
            <Animated.View
              key={`${service.title}-${index}`}
              entering={FadeInDown.delay(
                index * 70
              )}
            >
              <Pressable
                onPress={() =>
                  onPressService?.(service)
                }
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor:
                      palette.soft,
                    borderColor:
                      palette.border,
                  },
                  pressed &&
                    styles.cardPressed,
                ]}
              >
                {/* Top Accent */}
                <View
                  style={[
                    styles.topAccent,
                    {
                      backgroundColor:
                        palette.accent,
                    },
                  ]}
                />

                <View style={styles.cardContent}>
                  {/* Top Row */}
                  <View style={styles.topRow}>
                    <View
                      style={[
                        styles.iconWrap,
                        {
                          backgroundColor: `${palette.accent}15`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.iconArrow,
                          {
                            color:
                              palette.accent,
                          },
                        ]}
                      >
                        ↗
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.tag,
                        {
                          backgroundColor: `${palette.accent}12`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color:
                              palette.accent,
                          },
                        ]}
                      >
                        Service
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={styles.serviceTitle}>
                    {service.title}
                  </Text>

                  {/* Full Description */}
                  <Text
                    style={
                      styles.serviceDescription
                    }
                  >
                    {service.description}
                  </Text>

                  {/* Footer */}
                  <View style={styles.footer}>
                    <Text
                      style={[
                        styles.exploreText,
                        {
                          color:
                            palette.accent,
                        },
                      ]}
                    >
                      Explore Service
                    </Text>

                    <Text
                      style={[
                        styles.footerArrow,
                        {
                          color:
                            palette.accent,
                        },
                      ]}
                    >
                      →
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default RecommendedServicesSection;