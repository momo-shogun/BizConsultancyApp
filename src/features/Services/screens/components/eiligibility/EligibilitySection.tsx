import React from 'react';
import { Text, View } from 'react-native';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import type { EligibilityItem } from '../../types';
import { styles } from './EligibilitySection.styles';

export interface EligibilitySectionData {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  items: EligibilityItem[];
}

interface EligibilitySectionProps {
  eligibility: EligibilitySectionData;
}

interface IconProps {
  size: number;
  color: string;
}

function resolveIcon(name: string | undefined): (props: IconProps) => React.ReactElement {
  switch (name) {
    case 'Users':
      return (props: IconProps) => <Feather name="users" {...props} />;
    case 'LuBuilding2':
      return (props: IconProps) => (
        <MaterialCommunityIcons name="office-building-outline" {...props} />
      );
    case 'LuClock':
      return (props: IconProps) => <Feather name="clock" {...props} />;
    case 'LuShield':
      return (props: IconProps) => <Feather name="shield" {...props} />;
    case 'LuGlobe':
      return (props: IconProps) => <Feather name="globe" {...props} />;
    default:
      return (props: IconProps) => <Feather name="check-circle" {...props} />;
  }
}

function PrerequisiteRow({
  item,
  index,
  isLast,
}: {
  item: EligibilityItem;
  index: number;
  isLast: boolean;
}): React.ReactElement {
  const Icon = resolveIcon(item.icon);
  const hasDescription = item.description.trim().length > 0;

  return (
    <Animated.View
      entering={FadeInDown.delay(60 + index * 50).duration(320)}
      style={[styles.row, isLast ? null : styles.rowBorder]}
    >
      <View style={styles.iconWrap}>
        <Icon size={18} color="#1D4ED8" />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        {hasDescription ? <Text style={styles.rowDesc}>{item.description}</Text> : null}
      </View>
      <Text style={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</Text>
    </Animated.View>
  );
}

export function EligibilitySection({
  eligibility,
}: EligibilitySectionProps): React.ReactElement | null {
  const { items, badge, title, titleHighlight, description } = eligibility;

  if (items.length === 0) {
    return null;
  }

  const badgeLabel = badge?.trim() || 'PREREQUISITES';

  return (
    <View style={styles.container}>
      {/* <Animated.View entering={FadeInUp.duration(320)}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel.toUpperCase()}</Text>
        </View>
      </Animated.View> */}

      <Animated.View entering={FadeInUp.delay(40).duration(320)}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {titleHighlight != null && titleHighlight.length > 0 ? (
            <Text style={styles.titleHighlight}>{titleHighlight}</Text>
          ) : null}
        </View>
      </Animated.View>

      {description != null && description.length > 0 ? (
        <Animated.View entering={FadeInUp.delay(80).duration(320)}>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{description}</Text>
          </View>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.delay(120).duration(320)} style={styles.listCard}>
        {items.map((row, index) => (
          <PrerequisiteRow
            key={`${row.title}-${index}`}
            item={row}
            index={index}
            isLast={index === items.length - 1}
          />
        ))}
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Feather name="shield" size={14} color="#475569" />
          <Text style={styles.footerText}>Govt verified</Text>
        </View>
        <View style={styles.footerItem}>
          <Feather name="zap" size={14} color="#475569" />
          <Text style={styles.footerText}>Fast process</Text>
        </View>
        <View style={styles.footerItem}>
          <Feather name="headphones" size={14} color="#475569" />
          <Text style={styles.footerText}>Expert help</Text>
        </View>
      </View>
    </View>
  );
}
