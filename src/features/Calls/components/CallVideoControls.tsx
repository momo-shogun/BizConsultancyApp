import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface CallVideoControlsProps {
  localMuted: boolean;
  speakerOn: boolean;
  localVideoEnabled: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export function CallVideoControls(props: CallVideoControlsProps): React.ReactElement {
  const {
    localMuted,
    speakerOn,
    localVideoEnabled,
    onToggleMute,
    onToggleSpeaker,
    onToggleVideo,
    onEndCall,
  } = props;

  return (
    <View style={styles.pill}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={localVideoEnabled ? 'Turn camera off' : 'Turn camera on'}
        onPress={onToggleVideo}
        style={({ pressed }) => [
          styles.btn,
          localVideoEnabled ? styles.btnVideoOn : styles.btnDark,
          pressed ? styles.btnPressed : null,
        ]}
      >
        <Ionicons
          name={localVideoEnabled ? 'videocam' : 'videocam-off'}
          size={22}
          color={localVideoEnabled ? '#111111' : '#FFFFFF'}
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={speakerOn ? 'Speaker on' : 'Speaker off'}
        onPress={onToggleSpeaker}
        style={({ pressed }) => [
          styles.btn,
          speakerOn ? styles.btnLight : styles.btnDark,
          pressed ? styles.btnPressed : null,
        ]}
      >
        <Ionicons
          name={speakerOn ? 'volume-high' : 'volume-mute'}
          size={22}
          color={speakerOn ? '#111111' : '#FFFFFF'}
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={localMuted ? 'Unmute microphone' : 'Mute microphone'}
        onPress={onToggleMute}
        style={({ pressed }) => [
          styles.btn,
          localMuted ? styles.btnDark : styles.btnLight,
          pressed ? styles.btnPressed : null,
        ]}
      >
        <Ionicons
          name={localMuted ? 'mic-off' : 'mic'}
          size={22}
          color={localMuted ? '#FFFFFF' : '#111111'}
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="End call"
        onPress={onEndCall}
        style={({ pressed }) => [styles.btn, styles.btnEnd, pressed ? styles.btnPressed : null]}
      >
        <Ionicons name="call" size={24} color="#FFFFFF" style={styles.endIcon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(28,28,30,0.82)',
  },
  btn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDark: {
    backgroundColor: 'rgba(60,60,67,0.9)',
  },
  btnLight: {
    backgroundColor: '#FFFFFF',
  },
  btnVideoOn: {
    backgroundColor: '#FFFFFF',
  },
  btnEnd: {
    backgroundColor: '#FF3B30',
  },
  btnPressed: {
    opacity: 0.88,
  },
  endIcon: {
    transform: [{ rotate: '135deg' }],
  },
});
