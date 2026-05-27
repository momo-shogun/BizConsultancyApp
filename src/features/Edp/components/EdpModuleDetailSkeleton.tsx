import React from 'react';
import { ScrollView, View } from 'react-native';

import { ContentPlaceholder } from '@/shared/components';

import {
  detailSkeletonStyles as styles,
  PLAYER_HEIGHT,
  SCREEN_WIDTH,
} from './EdpModuleDetailSkeleton.styles';

const PLAYLIST_ROWS = 5;

function PlaylistRowSkeleton(): React.ReactElement {
  return (
    <View style={styles.playlistRow}>
      <ContentPlaceholder variant="block" width={120} height={68} style={styles.thumb} />
      <View style={styles.rowBody}>
        <ContentPlaceholder variant="line" width={28} height={10} />
        <ContentPlaceholder variant="line" width="95%" height={14} />
        <ContentPlaceholder variant="line" width="72%" height={14} />
      </View>
      <ContentPlaceholder variant="circle" width={36} height={36} />
    </View>
  );
}

export interface EdpModuleDetailSkeletonProps {
  topInset: number;
}

export function EdpModuleDetailSkeleton(props: EdpModuleDetailSkeletonProps): React.ReactElement {
  const { topInset } = props;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={false}
      accessibilityLabel="Loading module"
    >
      <View style={styles.playerSection}>
        <View style={[styles.statusBarSpacer, { height: topInset }]} />
        <ContentPlaceholder
          variant="block"
          width={SCREEN_WIDTH}
          height={PLAYER_HEIGHT}
          style={styles.playerBlock}
        />
      </View>

      <View style={styles.content}>
        <ContentPlaceholder variant="line" width="96%" height={20} />
        <ContentPlaceholder variant="line" width="72%" height={20} style={styles.titleGap} />

        <View style={styles.metaRow}>
          <ContentPlaceholder variant="line" width={88} height={28} style={styles.chip} />
          <ContentPlaceholder variant="line" width={96} height={28} style={styles.chip} />
          <ContentPlaceholder variant="line" width={80} height={28} style={styles.chip} />
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressHeader}>
            <ContentPlaceholder variant="line" width={96} height={14} />
            <ContentPlaceholder variant="line" width={40} height={14} />
          </View>
          <ContentPlaceholder variant="line" width="100%" height={4} style={styles.progressTrack} />
          <ContentPlaceholder variant="line" width="55%" height={12} style={styles.progressMeta} />
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionHeader}>
          <ContentPlaceholder variant="line" width={120} height={16} />
          <ContentPlaceholder variant="line" width={72} height={14} />
        </View>

        <View style={styles.playlist}>
          {Array.from({ length: PLAYLIST_ROWS }, (_, index) => (
            <PlaylistRowSkeleton key={`playlist-skel-${index}`} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
