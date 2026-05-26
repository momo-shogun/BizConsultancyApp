import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Animated, { Easing, FadeIn, FadeInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { THEME } from '@/constants/theme';
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from '@/utils/youtubeUrl';

import {
  USER_GUIDE_FAQ_ITEMS,
  USER_GUIDE_VIDEOS,
  type UserGuideFaqItem,
  type UserGuideVideo,
} from '../../constants/userGuideContent';
import {
  UserGuideAnimatedTabs,
  type UserGuideTabKey,
} from '../../components/UserGuideAnimatedTabs';
import { UserGuideVideoModal } from '../../components/UserGuideVideoModal';
import { GUIDE_CANVAS, styles } from './UserGuideScreen.styles';

const EASE_OUT_CUBIC = Easing.bezier(0.25, 0.46, 0.45, 0.94);

const GUIDE_TABS = [
  {
    key: 'videos' as const,
    label: 'Videos',
    icon: 'play-circle-outline' as const,
    count: USER_GUIDE_VIDEOS.length,
  },
  {
    key: 'faq' as const,
    label: 'FAQ',
    icon: 'help-circle-outline' as const,
    count: USER_GUIDE_FAQ_ITEMS.length,
  },
];

interface VideoCardProps {
  item: UserGuideVideo;
  onPress: (item: UserGuideVideo) => void;
}

function VideoCard(props: VideoCardProps): React.ReactElement {
  const { item, onPress } = props;
  const thumb = getYouTubeThumbnailUrl(item.link);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Play guide: ${item.title}`}
      style={({ pressed }) => [styles.videoCard, pressed ? styles.videoCardPressed : null]}
      onPress={() => onPress(item)}
    >
      <View style={styles.thumbWrap}>
        {thumb != null ? (
          <Image source={{ uri: thumb }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="videocam-outline" size={26} color="#94A3B8" />
          </View>
        )}
        <View style={styles.thumbOverlay} />
        <View style={styles.playBtnWrap}>
          <View style={styles.playBtn}>
            <Ionicons
              name="play"
              size={18}
              color={THEME.colors.primary}
              style={styles.playBtnIcon}
            />
          </View>
        </View>
      </View>
      <View style={styles.videoBody}>
        <Text numberOfLines={2} style={styles.videoTitle}>
          {item.title}
        </Text>
        <View style={styles.videoMetaRow}>
          <Ionicons name="logo-youtube" size={12} color={THEME.colors.primary} />
          <Text style={styles.videoMeta}>Watch guide</Text>
        </View>
      </View>
    </Pressable>
  );
}

function isFaqLeadLine(line: string, lineIndex: number): boolean {
  return lineIndex === 0 || line.endsWith(':');
}

export default function UserGuideScreen(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<UserGuideTabKey>('videos');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState<UserGuideVideo | null>(null);
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  const activeVideoId = useMemo((): string | null => {
    if (activeVideo == null) {
      return null;
    }
    return getYouTubeVideoId(activeVideo.link);
  }, [activeVideo]);

  const handleVideoPress = useCallback((item: UserGuideVideo): void => {
    setActiveVideo(item);
    setVideoModalVisible(true);
  }, []);

  const handleCloseVideo = useCallback((): void => {
    setVideoModalVisible(false);
    setActiveVideo(null);
  }, []);

  const renderVideoItem = useCallback(
    ({ item }: { item: UserGuideVideo }) => (
      <VideoCard item={item} onPress={handleVideoPress} />
    ),
    [handleVideoPress],
  );

  const renderFaqItem = useCallback((item: UserGuideFaqItem, index: number): React.ReactElement => {
    const isExpanded = expandedFaq === item.id;
    const isLast = index === USER_GUIDE_FAQ_ITEMS.length - 1;

    return (
      <Pressable
        key={item.id}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        style={[
          styles.faqRow,
          isExpanded ? styles.faqRowExpanded : null,
          isLast ? styles.faqRowLast : null,
        ]}
        onPress={() => setExpandedFaq(isExpanded ? null : item.id)}
      >
        <View style={styles.faqHeader}>
          <View style={styles.faqIndex}>
            <Text style={styles.faqIndexText}>{index + 1}</Text>
          </View>
          <Text style={styles.faqQuestion}>{item.q}</Text>
          <View style={[styles.faqChevron, isExpanded ? styles.faqChevronExpanded : null]}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME.colors.primary}
            />
          </View>
        </View>
        {isExpanded ? (
          <View style={styles.faqAnswerBlock}>
            {item.lines.map((line, lineIndex) => (
              <Text
                key={`${item.id}-line-${lineIndex}`}
                style={[
                  styles.faqAnswerLine,
                  isFaqLeadLine(line, lineIndex) ? styles.faqAnswerLineLead : null,
                ]}
              >
                {line}
              </Text>
            ))}
          </View>
        ) : null}
      </Pressable>
    );
  }, [expandedFaq]);

  const sectionTitle = activeTab === 'videos' ? 'Video guides' : 'Frequently asked';
  const sectionMeta =
    activeTab === 'videos'
      ? `${USER_GUIDE_VIDEOS.length} tutorials`
      : `${USER_GUIDE_FAQ_ITEMS.length} questions`;

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={GUIDE_CANVAS}>
      <ScreenHeader title="User Guide" onBackPress={() => navigation.goBack()} />

      <LinearGradient
        colors={['#047857', '#059669', '#0D9488']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroEyebrow}>Help center</Text>
        <Text style={styles.heroTitle}>Learn Biz Consultancy</Text>
        <Text style={styles.heroSubtitle}>
          Step-by-step videos and answers to common questions.
        </Text>
      </LinearGradient>

      <UserGuideAnimatedTabs
        tabs={GUIDE_TABS}
        activeKey={activeTab}
        onChange={setActiveTab}
        accentColor={THEME.colors.primary}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <Text style={styles.sectionMeta}>{sectionMeta}</Text>
      </View>

      {activeTab === 'faq' ? (
        <Animated.View
          key="faq"
          entering={FadeIn.duration(200).easing(EASE_OUT_CUBIC)}
          style={styles.tabContent}
        >
          <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.duration(220).delay(30)}>
              <View style={styles.faqList}>
                {USER_GUIDE_FAQ_ITEMS.map((item, index) => renderFaqItem(item, index))}
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      ) : (
        <Animated.View
          key="videos"
          entering={FadeIn.duration(200).easing(EASE_OUT_CUBIC)}
          style={styles.tabContent}
        >
          <FlatList
            style={styles.screen}
            data={USER_GUIDE_VIDEOS}
            renderItem={renderVideoItem}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.columnWrapper}
          />
        </Animated.View>
      )}

      <UserGuideVideoModal
        visible={videoModalVisible}
        videoId={activeVideoId}
        title={activeVideo?.title ?? ''}
        onClose={handleCloseVideo}
      />
    </SafeAreaWrapper>
  );
}
