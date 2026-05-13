import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { THEME } from '@/constants/theme';
import type { EligibilityItem } from '../../types';
import { styles } from './EligibilitySection.styles';

interface EligibilityData {
  items: EligibilityItem[];
  title: string;
  description?: string;
}

interface EligibilitySectionProps {
  item?: EligibilityData;
  activeTab: string;
}

interface IconProps {
  size: number;
  color: string;
}

function getIcon(name: string): (props: IconProps) => React.ReactElement {
  switch (name) {
    case 'Users':
      return (props: IconProps) => <Feather name="users" {...props} />;
    case 'LuBuilding2':
      return (props: IconProps) => (
        <MaterialCommunityIcons name="office-building" {...props} />
      );
    case 'LuClock':
      return (props: IconProps) => <Feather name="clock" {...props} />;
    case 'LuTrendingUp':
      return (props: IconProps) => <Feather name="trending-up" {...props} />;
    case 'LuGlobe':
      return (props: IconProps) => <Feather name="globe" {...props} />;
    case 'LuShield':
      return (props: IconProps) => <Feather name="shield-check" {...props} />;
    default:
      return (props: IconProps) => <Feather name="check-circle" {...props} />;
  }
}

function SectionHeader({ title }: { title: string }): React.ReactElement {
  return (
    <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
      <View style={styles.accentBar} />
      <View>
        <Text style={styles.title}>{title || "How the Process Works"}</Text>
        <Text style={styles.subtitle}>
          Verification requirements for registration
        </Text>
      </View>
    </Animated.View>
  );
}

function EligibilityRow({
  item,
  index,
}: {
  item: EligibilityItem;
  index: number;
}): React.ReactElement {
  const Icon = getIcon(item.icon ?? 'default');

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={styles.row}
    >
      <View style={styles.iconWrap}>
        <View style={styles.iconInner}>
          <Icon size={18} color={THEME.colors.accentAmber} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.rowTitle}>{item.title || "Order Placement"}</Text>
        <Text style={styles.rowDesc}>{item.description || "Description not available"}</Text>
      </View>

      <View style={styles.statusDot} />
    </Animated.View>
  );
}

function TrustBar(): React.ReactElement {
  return (
    <View style={styles.trustBar}>
      <Text style={styles.trustItem}>🔒 Govt Verified</Text>
      <Text style={styles.trustDivider}>|</Text>
      <Text style={styles.trustItem}>⚡ Fast Process</Text>
      <Text style={styles.trustDivider}>|</Text>
      <Text style={styles.trustItem}>💬 Expert Help</Text>
    </View>
  );
}

export function EligibilitySection({ item, activeTab }: EligibilitySectionProps): React.ReactElement | null {
  if (!item || activeTab !== 'process') return null;

  return (
    <Animated.View entering={FadeInUp.springify()}>
      <View style={styles.container}>
        <SectionHeader title={item.title} />

        <View style={styles.list}>
          {item.items.map((it, index) => (
            <EligibilityRow key={it.title} item={it} index={index} />
          ))}
        </View>

        <TrustBar />
      </View>
    </Animated.View>
  );
}
