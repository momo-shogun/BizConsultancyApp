import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { Dialog } from '@/shared/components/dialog';
import { spacing } from '@/theme';

export interface UserGuideVideoModalProps {
  visible: boolean;
  videoId: string | null;
  title: string;
  onClose: () => void;
}

export function UserGuideVideoModal({
  visible,
  videoId,
  title,
  onClose,
}: UserGuideVideoModalProps): React.ReactElement {
  const { width: screenWidth } = useWindowDimensions();
  /** Dialog card width = screen minus overlay horizontal padding. */
  const playerWidth = screenWidth - spacing.lg * 2;
  const playerHeight = Math.round((playerWidth * 9) / 16);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (visible) {
      setPlaying(true);
    }
  }, [visible, videoId]);

  const handleClose = useCallback((): void => {
    setPlaying(false);
    onClose();
  }, [onClose]);

  const handleStateChange = useCallback((state: string): void => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  return (
    <Dialog
      visible={visible}
      onClose={handleClose}
      variant="default"
      title={title.length > 0 ? title : 'User Guide Video'}
      icon={<View style={styles.hiddenIcon} />}
      contentStyle={styles.dialogContent}
    >
      {videoId != null ? (
        <View style={[styles.playerWrap, { width: playerWidth }]}>
          <YoutubePlayer
            height={playerHeight}
            width={playerWidth}
            play={playing}
            videoId={videoId}
            onChangeState={handleStateChange}
          />
        </View>
      ) : null}
    </Dialog>
  );
}

const styles = StyleSheet.create({
  hiddenIcon: {
    height: 0,
    width: 0,
    overflow: 'hidden',
  },
  dialogContent: {
    alignItems: 'stretch',
    gap: 0,
    paddingBottom: spacing.sm,
  },
  playerWrap: {
    marginHorizontal: -spacing.lg,
    marginTop: spacing.sm,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
});
