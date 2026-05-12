import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { THEME } from '@/constants/theme';
import { styles } from './EligibilitySection.styles';

interface EligibilityItem {
  icon: string;
  title: string;
  description: string;
}

interface EligibilityData {
  items: EligibilityItem[];
  title: string;
  description?: string;
}

interface Props {
  item?: EligibilityData;
  activeTab: string;
}

/** ICON MAP (clean + meaningful only) */
const getIcon = (name: string) => {
  switch (name) {
    case 'Users':
      return (props: any) => <Feather name="users" {...props} />;
    case 'LuBuilding2':
      return (props: any) => (
        <MaterialCommunityIcons name="office-building" {...props} />
      );
    case 'LuClock':
      return (props: any) => <Feather name="clock" {...props} />;
    case 'LuTrendingUp':
      return (props: any) => <Feather name="trending-up" {...props} />;
    case 'LuGlobe':
      return (props: any) => <Feather name="globe" {...props} />;
    case 'LuShield':
      return (props: any) => <Feather name="shield-check" {...props} />;
    default:
      return (props: any) => <Feather name="check-circle" {...props} />;
  }
};

const SectionHeader = ({ title }: { title: string }) => (
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

const EligibilityRow = ({
  item,
  index,
}: {
  item: EligibilityItem;
  index: number;
}) => {
  const Icon = getIcon(item.icon);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={styles.row}
    >
      {/* ICON */}
      <View style={styles.iconWrap}>
        <View style={styles.iconInner}>
          <Icon size={18} color={THEME.colors.accentAmber} />
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.rowTitle}>{item.title || "Order Placement"}</Text>
        <Text style={styles.rowDesc}>{item.description || "Description not available"}</Text>
      </View>

      {/* STATUS DOT */}
      <View style={styles.statusDot} />
    </Animated.View>
  );
};

const TrustBar = () => (
  <View style={styles.trustBar}>
    <Text style={styles.trustItem}>🔒 Govt Verified</Text>
    <Text style={styles.trustDivider}>|</Text>
    <Text style={styles.trustItem}>⚡ Fast Process</Text>
    <Text style={styles.trustDivider}>|</Text>
    <Text style={styles.trustItem}>💬 Expert Help</Text>
  </View>
);

const EligibilitySection: React.FC<Props> = ({ item, activeTab }) => {
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
};

export default EligibilitySection;