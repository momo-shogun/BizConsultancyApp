import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  type WebViewProps,
} from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';

import { useEdpOverviewVideoScreen } from '../hooks/useEdpOverviewVideoScreen';
import { resolveEdpVideoEmbed } from '../utils/edpMedia';
import { buildDirectVideoHtml } from '../utils/edpOverviewVideoHtml';
import { styles } from './EdpOverviewVideoScreen.styles';

const LOCKED_WEB_VIEW_PROPS: Partial<WebViewProps> = {
  scrollEnabled: false,
  bounces: false,
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  overScrollMode: 'never',
  nestedScrollEnabled: false,
  setBuiltInZoomControls: false,
  setDisplayZoomControls: false,
};

export default function EdpOverviewVideoScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<EdpStackParamList>>();
  const route = useRoute<RouteProp<EdpStackParamList, typeof ROUTES.Edp.OverviewVideo>>();
  const { title, videoUrl } = route.params;
  const insets = useSafeAreaInsets();
  const { isLandscape, playerLayout, onPlayerLayout } = useEdpOverviewVideoScreen();
  const [playing, setPlaying] = useState(true);
  const [iframeReady, setIframeReady] = useState(false);

  const embed = useMemo(() => resolveEdpVideoEmbed(videoUrl), [videoUrl]);

  useEffect(() => {
    setIframeReady(false);
    setPlaying(true);
  }, [embed.src, embed.youtubeVideoId]);
  const directVideoHtml = useMemo(
    () => (embed.kind === 'video' ? buildDirectVideoHtml(embed.src) : null),
    [embed],
  );

  const handleBack = useCallback((): void => {
    setPlaying(false);
    navigation.goBack();
  }, [navigation]);

  const openInBrowser = useCallback((): void => {
    void Linking.openURL(videoUrl);
  }, [videoUrl]);

  const playerWidth = Math.round(playerLayout.width);
  const playerHeight = Math.round(playerLayout.height);
  const canRenderPlayer = playerWidth > 0 && playerHeight > 0;

  const renderPlayer = (): React.ReactElement => {
    if (!canRenderPlayer) {
      return (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color="#FFFFFF" size="large" />
        </View>
      );
    }

    if (embed.kind === 'youtube' && embed.youtubeVideoId != null) {
      return (
        <View style={[styles.playerClip, { width: playerWidth, height: playerHeight }]}>
          <YoutubePlayer
            height={playerHeight}
            width={playerWidth}
            play={playing}
            videoId={embed.youtubeVideoId}
            forceAndroidAutoplay
            allowWebViewZoom={false}
            viewContainerStyle={styles.playerClip}
            webViewStyle={styles.webView}
            webViewProps={{
              ...LOCKED_WEB_VIEW_PROPS,
              allowsFullscreenVideo: true,
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
            }}
            initialPlayerParams={{
              controls: true,
              preventFullScreen: false,
              modestbranding: true,
              rel: false,
            }}
            onChangeState={(next) => {
              if (next === 'ended') {
                setPlaying(false);
              }
            }}
          />
        </View>
      );
    }

    if (embed.kind === 'iframe') {
      return (
        <View style={[styles.playerClip, { width: playerWidth, height: playerHeight }]}>
          {!iframeReady ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator color="#FFFFFF" size="large" />
            </View>
          ) : null}
          <WebView
            style={[
              styles.webView,
              { width: playerWidth, height: playerHeight, opacity: iframeReady ? 1 : 0 },
            ]}
            source={{ uri: embed.src }}
            originWhitelist={['*']}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            setSupportMultipleWindows={false}
            {...LOCKED_WEB_VIEW_PROPS}
            onLoadEnd={() => {
              setIframeReady(true);
            }}
            onError={() => {
              setIframeReady(true);
            }}
          />
        </View>
      );
    }

    if (directVideoHtml != null) {
      return (
        <View style={[styles.playerClip, { width: playerWidth, height: playerHeight }]}>
          <WebView
            style={[styles.webView, { width: playerWidth, height: playerHeight }]}
            source={{ html: directVideoHtml, baseUrl: 'https://localhost' }}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            {...LOCKED_WEB_VIEW_PROPS}
          />
        </View>
      );
    }

    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>This video could not be played in the app.</Text>
        <Pressable onPress={openInBrowser} style={styles.openBrowserButton}>
          <Ionicons name="open-outline" size={18} color="#FFFFFF" />
          <Text style={styles.openBrowserLabel}>Open in browser</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.playerArea} onLayout={onPlayerLayout}>
        {renderPlayer()}
      </View>

      <View
        style={[
          styles.header,
          {
            paddingTop: (Platform.OS === 'ios' ? insets.top : 0) + 8,
            paddingLeft: insets.left + 12,
            paddingRight: insets.right + 12,
          },
        ]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        {!isLandscape ? (
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
