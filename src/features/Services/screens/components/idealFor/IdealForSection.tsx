import React from 'react';
import { Text, View } from 'react-native';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { RemoteImage } from '@/shared/components';

import type { IdealForSection as IdealForSectionData, TextSegment } from '../../types';
import { styles } from './IdealForSection.styles';

interface IdealForSectionProps {
  idealFor: IdealForSectionData;
}

const ROW_ACCENTS = ['#7C3AED', '#2563EB', '#059669', '#EA580C'] as const;

function SectionHeader({ idealFor }: { idealFor: IdealForSectionData }): React.ReactElement {
  const segments = idealFor.titleSegments ?? [];

  return (
    <>
      <Animated.View entering={FadeInUp.duration(280)}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>IDEAL FOR</Text>
        </View>
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(30).duration(280)}>
        {segments.length > 0 ? (
          <View style={styles.titleRow}>
            {segments.map((segment: TextSegment, index: number) => (
              <Text
                key={`${segment.value}-${index}`}
                style={segment.type === 'highlight' ? styles.titleHighlight : styles.title}
              >
                {segment.value}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.title}>Who is this ideal for?</Text>
        )}
      </Animated.View>
    </>
  );
}

function IdealForRow({
  item,
  index,
  isLast,
}: {
  item: IdealForSectionData['items'][number];
  index: number;
  isLast: boolean;
}): React.ReactElement {
  const accent = ROW_ACCENTS[index % ROW_ACCENTS.length];
  const hasDescription = item.description.trim().length > 0;

  return (
    <Animated.View
      entering={FadeInDown.delay(70 + index * 45).duration(280)}
      style={[styles.row, isLast ? null : styles.rowBorder]}
    >
      <View style={[styles.thumbWrap, { borderColor: `${accent}40` }]}>
        <RemoteImage
          uri={item.image}
          resizeMode="cover"
          placeholderVariant="card"
          accessibilityLabel={item.title}
        />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowIndex, { color: accent }]}>
          {String(index + 1).padStart(2, '0')}
        </Text>
        <Text style={styles.rowTitle}>{item.title}</Text>
        {hasDescription ? (
          <Text style={styles.rowDescription} numberOfLines={3}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

function IdealForSection({ idealFor }: IdealForSectionProps): React.ReactElement | null {
  if (!idealFor.items.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SectionHeader idealFor={idealFor} />

      <Animated.View entering={FadeInUp.delay(60).duration(300)} style={styles.card}>
        {idealFor.items.map((item, index) => (
          <IdealForRow
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            isLast={index === idealFor.items.length - 1}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default IdealForSection;
