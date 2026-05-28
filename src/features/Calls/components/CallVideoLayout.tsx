import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native';
import { RenderModeType, RtcSurfaceView, VideoSourceType } from 'react-native-agora';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CallAvatar } from './CallAvatar';
import { PIP_HEIGHT, PIP_MARGIN, PIP_WIDTH, styles } from './CallVideoLayout.styles';

export interface CallVideoLayoutProps {
  remoteUid: number | null;
  remoteVideoEnabled: boolean;
  localVideoEnabled: boolean;
  remoteName: string;
  remoteAvatarUrl: string | null;
  onFlipCamera: () => void;
  topInset?: number;
  bottomReserved?: number;
}

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function snapToCorner(point: Point, bounds: Size, top: number, bottom: number): Point {
  const maxX = Math.max(PIP_MARGIN, bounds.width - PIP_WIDTH - PIP_MARGIN);
  const maxY = Math.max(top + PIP_MARGIN, bounds.height - PIP_HEIGHT - bottom - PIP_MARGIN);
  const midX = bounds.width / 2;
  const midY = (top + bounds.height - bottom) / 2;

  const snapX = point.x + PIP_WIDTH / 2 < midX ? PIP_MARGIN : maxX;
  const snapY = point.y + PIP_HEIGHT / 2 < midY ? top + PIP_MARGIN : maxY;

  return { x: snapX, y: snapY };
}

export function CallVideoLayout(props: CallVideoLayoutProps): React.ReactElement {
  const {
    remoteUid,
    remoteVideoEnabled,
    localVideoEnabled,
    remoteName,
    remoteAvatarUrl,
    onFlipCamera,
    topInset = 0,
    bottomReserved = 120,
  } = props;

  const hasRemoteUid = remoteUid != null && remoteUid > 0;
  const showRemoteCameraOff = hasRemoteUid && !remoteVideoEnabled;

  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const positionRef = useRef<Point>({ x: 0, y: 0 });
  const dragOrigin = useRef<Point>({ x: 0, y: 0 });
  const hasInitialized = useRef(false);

  const bounds = useMemo(
    () => ({
      maxX: Math.max(PIP_MARGIN, containerSize.width - PIP_WIDTH - PIP_MARGIN),
      minY: topInset + PIP_MARGIN,
      maxY: Math.max(
        topInset + PIP_MARGIN,
        containerSize.height - PIP_HEIGHT - bottomReserved - PIP_MARGIN,
      ),
    }),
    [bottomReserved, containerSize.height, containerSize.width, topInset],
  );

  const movePipTo = useCallback(
    (next: Point, animated = false): void => {
      const x = clamp(next.x, PIP_MARGIN, bounds.maxX);
      const y = clamp(next.y, bounds.minY, bounds.maxY);
      positionRef.current = { x, y };
      if (animated) {
        Animated.spring(position, {
          toValue: { x, y },
          useNativeDriver: false,
          friction: 7,
          tension: 80,
        }).start();
        return;
      }
      position.setValue({ x, y });
    },
    [bounds.maxX, bounds.maxY, bounds.minY, position],
  );

  const initializePipPosition = useCallback(
    (size: Size): void => {
      if (size.width <= 0 || size.height <= 0) {
        return;
      }
      const x = size.width - PIP_WIDTH - PIP_MARGIN;
      const y = size.height - PIP_HEIGHT - bottomReserved - PIP_MARGIN;
      movePipTo({ x, y });
      hasInitialized.current = true;
    },
    [bottomReserved, movePipTo],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent): void => {
      const { width, height } = event.nativeEvent.layout;
      if (width === containerSize.width && height === containerSize.height) {
        return;
      }
      setContainerSize({ width, height });
      if (!hasInitialized.current) {
        initializePipPosition({ width, height });
      }
    },
    [containerSize.height, containerSize.width, initializePipPosition],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
        onStartShouldSetPanResponder: () => false,
        onPanResponderGrant: () => {
          dragOrigin.current = { ...positionRef.current };
        },
        onPanResponderMove: (_, gesture) => {
          movePipTo({
            x: dragOrigin.current.x + gesture.dx,
            y: dragOrigin.current.y + gesture.dy,
          });
        },
        onPanResponderRelease: () => {
          const snapped = snapToCorner(
            positionRef.current,
            containerSize,
            topInset,
            bottomReserved,
          );
          movePipTo(snapped, true);
        },
        onPanResponderTerminate: () => {
          const snapped = snapToCorner(
            positionRef.current,
            containerSize,
            topInset,
            bottomReserved,
          );
          movePipTo(snapped, true);
        },
      }),
    [bottomReserved, containerSize, movePipTo, topInset],
  );

  return (
    <View style={styles.root} onLayout={handleLayout}>
      {hasRemoteUid ? (
        <>
          <RtcSurfaceView
            key={`remote-${remoteUid}`}
            style={styles.remoteVideo}
            canvas={{
              uid: remoteUid,
              sourceType: VideoSourceType.VideoSourceRemote,
              renderMode: RenderModeType.RenderModeHidden,
            }}
          />
          {showRemoteCameraOff ? (
            <View style={styles.remoteCameraOffOverlay} pointerEvents="none">
              <CallAvatar uri={remoteAvatarUrl} name={remoteName} size={96} />
              <Text style={styles.remoteName}>{remoteName}</Text>
              <Text style={styles.waitingText}>Camera is off</Text>
            </View>
          ) : null}
        </>
      ) : (
        <View style={styles.remoteFallback}>
          <CallAvatar uri={remoteAvatarUrl} name={remoteName} size={120} />
          <Text style={styles.remoteName}>{remoteName}</Text>
          <Text style={styles.waitingText}>Waiting for video…</Text>
        </View>
      )}

      <Animated.View
        style={[
          styles.localPip,
          {
            transform: position.getTranslateTransform(),
          },
        ]}
      >
        <View style={styles.pipDragArea} {...panResponder.panHandlers}>
          {localVideoEnabled ? (
            <RtcSurfaceView
              key="local-preview"
              style={styles.localVideo}
              canvas={{
                uid: 0,
                renderMode: RenderModeType.RenderModeHidden,
              }}
              zOrderOnTop
              zOrderMediaOverlay
            />
          ) : (
            <View style={styles.localFallback}>
              <Ionicons name="videocam-off-outline" size={28} color="rgba(255,255,255,0.75)" />
              <Text style={styles.cameraOffText}>Camera off</Text>
            </View>
          )}
        </View>

        {localVideoEnabled ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
            onPress={onFlipCamera}
            style={({ pressed }) => [styles.flipBtn, pressed ? styles.flipBtnPressed : null]}
          >
            <Ionicons name="camera-reverse" size={18} color="#FFFFFF" />
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}
