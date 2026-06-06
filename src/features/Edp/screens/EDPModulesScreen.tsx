import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import { useGetEdpCoursesWithDocumentsQuery } from '@/features/Edp/api/edpLandingApi';
import { useEdpModulesListProgress } from '@/features/Edp/hooks/useEdpModulesListProgress';
import type { EdpFreeEdpModule } from '@/features/Edp/types/edpCourses.types';
import { normalizeEdpModuleSlug } from '@/features/Edp/utils/edpCourseDetailsParsing';
import { openEdpModuleForUser } from '@/features/Edp/utils/edpGuestVideoAccess';
import { resolveIidAssetUrl } from '@/features/Edp/utils/edpMedia';
import type { EdpStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';

import {
  EdpModulesListSkeleton,
  EdpModulesSearchSkeleton,
} from '@/features/Edp/components/EdpModuleCardSkeleton';

import { styles } from './EDPModulesScreen.styles';

interface ModuleCardItem {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  overviewVideoUrl: string | null;
  videos: number;
  pdfs: number;
  imageUrl: string | null;
  progressPercent: number;
}

const CARD_GRADIENTS: readonly [string, string][] = [
  ['#DBEAFE', '#E0F2FE'],
  ['#DCFCE7', '#ECFEFF'],
  ['#FCE7F3', '#F5F3FF'],
  ['#FEF3C7', '#FCE7F3'],
  ['#E0E7FF', '#F0FDFA'],
  ['#FEE2E2', '#FFEDD5'],
];

function toModuleCardItems(modules: EdpFreeEdpModule[] | undefined): ModuleCardItem[] {
  if (modules == null) {
    return [];
  }
  return modules.map((module) => {
    const nameEn = module.name?.trim() ?? '';
    const nameHi = module.hindi_name?.trim() ?? '';
    const progressRaw = module.progress?.trim();
    const progressParsed = progressRaw != null && progressRaw.length > 0 ? Number(progressRaw) : NaN;
    const progressPercent = Number.isFinite(progressParsed)
      ? Math.max(0, Math.min(100, Math.round(progressParsed)))
      : 0;
    const overviewVideoUrl = module.url?.trim();
    return {
      id: String(module.id),
      slug: module.slug?.trim() ?? '',
      titleEn: nameEn.length > 0 ? nameEn : 'Module',
      titleHi: nameHi.length > 0 ? nameHi : nameEn,
      overviewVideoUrl:
        overviewVideoUrl != null && overviewVideoUrl.length > 0 ? overviewVideoUrl : null,
      videos: module.e_videos_count ?? 0,
      pdfs: module.e_documents_count ?? 0,
      imageUrl: resolveIidAssetUrl(module.thumbnail),
      progressPercent,
    };
  });
}

function ModuleCard(props: {
  item: ModuleCardItem;
  index: number;
  lang: 'ENG' | 'HI';
  onPress: () => void;
}): React.ReactElement {
  const { item, index, onPress, lang } = props;
  const [from, to] = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const moduleTitle = lang === 'HI' && item.titleHi.length > 0 ? item.titleHi : item.titleEn;
  return (
    <Pressable
      style={({ pressed }) => [styles.cardPressable, pressed ? styles.cardPressed : null]}
      onPress={onPress}
    >
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          {item.imageUrl != null ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <LinearGradient colors={[from, to]} style={styles.imageFallback} />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(15,23,42,0.35)']}
            style={styles.imageOverlay}
          />
          <View style={styles.cornerCta}>
            <Ionicons name="arrow-forward" size={14} color={THEME.colors.white} />
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {moduleTitle}
          </Text>

          <View style={styles.progressBlock}>
            <View style={styles.progressTopRow}>
              <Text style={styles.progressLabel}>Completed</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{item.progressPercent}%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${item.progressPercent}%` }]} />
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText} numberOfLines={1}>
              {`${item.videos} videos · ${item.pdfs} PDFs`}
            </Text>
          </View>

          {/* <View style={styles.cardFooter}>
            <Text style={styles.cardMeta}>IID catalogue module</Text>
            <Text style={styles.openLabel}>Open</Text>
          </View> */}
        </View>
      </View>
    </Pressable>
  );
}

export interface EDPModulesScreenProps {
  onBack?: () => void;
  onOpenModule?: (moduleId: string) => void;
}

const EDPModulesScreen = ({ onBack, onOpenModule }: EDPModulesScreenProps): React.ReactElement => {
  const [lang, setLang] = useState<'ENG' | 'HI'>('ENG');
  const [query, setQuery] = useState<string>('');
  const navigation = useNavigation<NavigationProp<EdpStackParamList>>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data, isLoading, isError } = useGetEdpCoursesWithDocumentsQuery();
  const { progressBySlug } = useEdpModulesListProgress(data?.freeEdps);

  const modules = useMemo(() => {
    const items = toModuleCardItems(data?.freeEdps);
    return items.map((item) => {
      const slug = normalizeEdpModuleSlug(item.slug);
      const tracked = progressBySlug[slug];
      if (tracked == null) {
        return item;
      }
      return { ...item, progressPercent: tracked.progressPercent };
    });
  }, [data?.freeEdps, progressBySlug]);
  const filteredModules = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (search.length === 0) {
      return modules;
    }
    return modules.filter((item) => {
      const title = lang === 'HI' && item.titleHi.length > 0 ? item.titleHi : item.titleEn;
      return title.toLowerCase().includes(search);
    });
  }, [lang, modules, query]);

  const handleOpenModule = (module: ModuleCardItem): void => {
    if (onOpenModule != null) {
      onOpenModule(module.id);
      return;
    }

    const moduleTitle =
      lang === 'HI' && module.titleHi.length > 0 ? module.titleHi : module.titleEn;

    openEdpModuleForUser(navigation, {
      isAuthenticated,
      moduleSlug: module.slug,
      moduleTitle,
      overviewVideoUrl: module.overviewVideoUrl,
      lang: lang === 'HI' ? 'hi' : 'en',
    });
  };

  return (
    <SafeAreaWrapper
      edges={['top', 'bottom']}
      bgColor={THEME.colors.primary}
      statusBarStyle="light-content"
    >
      <View style={styles.root}>
        <ScreenHeader
          title="EDP Modules"
          headerColor={THEME.colors.primary}
          onBackPress={onBack ?? (() => navigation.goBack())}
          showLanguageSwitch
          lang={lang}
          onLangSwitch={setLang}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? (
            <EdpModulesSearchSkeleton />
          ) : (
            <View style={styles.searchWrap}>
              <Ionicons name="search" size={18} color={THEME.colors.textSecondary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={lang === 'HI' ? 'मॉड्यूल खोजें...' : 'Search modules...'}
                placeholderTextColor={THEME.colors.textSecondary}
                style={styles.searchInput}
              />
              <Text style={styles.countText}>{filteredModules.length}</Text>
            </View>
          )}

          {isLoading ? (
            <EdpModulesListSkeleton />
          ) : (
            <View style={styles.grid}>
              {filteredModules.map((item, index) => (
                <ModuleCard
                  key={item.id}
                  item={item}
                  index={index}
                  lang={lang}
                  onPress={() => handleOpenModule(item)}
                />
              ))}
            </View>
          )}

          {!isLoading && isError ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>Could not load modules</Text>
              <Text style={styles.messageBody}>Check your connection and try again.</Text>
            </View>
          ) : null}

          {!isLoading && !isError && filteredModules.length === 0 ? (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>No modules found</Text>
              <Text style={styles.messageBody}>Try a different search keyword.</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default EDPModulesScreen;