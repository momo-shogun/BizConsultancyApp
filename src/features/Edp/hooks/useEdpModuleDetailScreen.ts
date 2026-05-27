import { useCallback, useEffect, useMemo, useState } from 'react';

import { useGetEdpCourseDetailsQuery } from '@/features/Edp/api/edpModuleApi';
import { useGetEdpCoursesWithDocumentsQuery } from '@/features/Edp/api/edpLandingApi';
import type { EdpModuleLang, EdpModuleLessonRow } from '@/features/Edp/types/edpCourseDetails.types';
import {
  mapEdpModuleLessons,
  normalizeEdpModuleSlug,
  pickEdpVideoUrl,
} from '@/features/Edp/utils/edpCourseDetailsParsing';
import { openEdpModulePdf } from '@/features/Edp/utils/edpPdfActions';
import {
  resolveEdpOverviewModulePdfUrl,
  resolveEdpVideoEmbed,
  resolveIidAssetUrl,
} from '@/features/Edp/utils/edpMedia';

import { useEdpModuleWatchProgress } from './useEdpModuleWatchProgress';
import type { EdpWatchProgressContext } from './useEdpWatchTimeHeartbeat';

export interface UseEdpModuleDetailScreenParams {
  slug: string;
  lang: EdpModuleLang;
}

export interface UseEdpModuleDetailScreenResult {
  isLoading: boolean;
  isError: boolean;
  isNotFound: boolean;
  moduleTitle: string;
  moduleDuration: string;
  videoCount: number;
  pdfCount: number;
  lessonCount: number;
  progressPercent: number;
  progressLabel: string;
  spentLabel: string;
  remainingLabel: string;
  isProgressLoading: boolean;
  lessons: EdpModuleLessonRow[];
  mainVideoUrl: string | null;
  videoEmbed: ReturnType<typeof resolveEdpVideoEmbed>;
  overviewPdfUrl: string | null;
  relatedModules: Array<{
    id: number;
    slug: string;
    title: string;
    thumbnailUrl: string | null;
    meta: string;
  }>;
  playing: boolean;
  setPlaying: (value: boolean) => void;
  watchProgressContext: EdpWatchProgressContext | null;
  playLessonVideo: (lesson: EdpModuleLessonRow) => void;
  openLessonPdf: (lesson: EdpModuleLessonRow) => void;
  openSupportingPdf: () => void;
  refreshProgress: () => void;
  refetch: () => void;
}

export function useEdpModuleDetailScreen(
  params: UseEdpModuleDetailScreenParams,
): UseEdpModuleDetailScreenResult {
  const { slug, lang } = params;
  const moduleSlug = normalizeEdpModuleSlug(slug);
  const {
    data: detail,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetEdpCourseDetailsQuery(moduleSlug, { skip: moduleSlug.length === 0 });
  const { data: catalogue } = useGetEdpCoursesWithDocumentsQuery();

  const [mainVideoUrl, setMainVideoUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [watchProgressContext, setWatchProgressContext] = useState<EdpWatchProgressContext | null>(
    null,
  );

  const course = detail?.edpCourseDetail;
  const subs = detail?.edpSubSubCategories ?? [];

  const {
    progressPercent,
    progressLabel,
    spentLabel,
    remainingLabel,
    isLoading: isProgressLoading,
    refreshProgress,
  } = useEdpModuleWatchProgress(detail, moduleSlug);

  const moduleTitle = useMemo(() => {
    if (course == null) {
      return '';
    }
    const hi = course.hindi_name?.trim() ?? course.name;
    return lang === 'en' ? course.name : hi;
  }, [course, lang]);

  const catalogueIndex = useMemo(() => {
    const list = catalogue?.freeEdps ?? [];
    return list.findIndex((item) => item.slug?.trim() === moduleSlug);
  }, [catalogue?.freeEdps, moduleSlug]);

  const overviewPdfUrl = useMemo(() => {
    if (catalogueIndex < 0) {
      return null;
    }
    return resolveEdpOverviewModulePdfUrl(catalogueIndex);
  }, [catalogueIndex]);

  useEffect(() => {
    const firstTopic = subs[0];
    if (firstTopic != null) {
      setWatchProgressContext({
        categoryId: firstTopic.category_id,
        subCategoryId: firstTopic.id,
      });
    } else {
      setWatchProgressContext(null);
    }
  }, [subs]);

  useEffect(() => {
    const intro = course?.url?.trim();
    if (intro != null && intro.length > 0) {
      setMainVideoUrl(intro);
      setPlaying(true);
      return;
    }
    const first = subs[0]?.edp_content?.[0];
    if (first != null) {
      const fallback = pickEdpVideoUrl(first, lang);
      setMainVideoUrl(fallback);
      setPlaying(fallback != null);
      return;
    }
    setMainVideoUrl(null);
    setPlaying(false);
  }, [course?.url, course?.id, subs, lang]);

  const lessons = useMemo(
    () => mapEdpModuleLessons(subs, lang, mainVideoUrl),
    [subs, lang, mainVideoUrl],
  );

  const videoEmbed = useMemo(
    () => resolveEdpVideoEmbed(mainVideoUrl ?? ''),
    [mainVideoUrl],
  );

  const relatedModules = useMemo(() => {
    const list = detail?.edpRelatedCourses ?? [];
    return list
      .filter((item) => item.slug !== moduleSlug)
      .slice(0, 8)
      .map((item) => {
        const title =
          lang === 'en' ? item.name : (item.hindi_name?.trim() ?? item.name);
        const videos = item.e_videos_count ?? 0;
        const pdfs = item.e_documents_count ?? 0;
        const duration = item.total_duration?.trim() ?? '';
        const metaParts = [
          duration.length > 0 ? duration : null,
          `${videos} videos`,
          `${pdfs} PDFs`,
        ].filter((part): part is string => part != null);
        return {
          id: item.id,
          slug: item.slug,
          title,
          thumbnailUrl: resolveIidAssetUrl(item.thumbnail),
          meta: metaParts.join(' · '),
        };
      });
  }, [detail?.edpRelatedCourses, lang, moduleSlug]);

  const playLessonVideo = useCallback((lesson: EdpModuleLessonRow): void => {
    const next = lesson.videoUrl?.trim();
    if (next == null || next.length === 0) {
      return;
    }
    setWatchProgressContext({
      categoryId: lesson.categoryId,
      subCategoryId: lesson.topicId,
    });
    setMainVideoUrl(next);
    setPlaying(true);
  }, []);

  const openLessonPdf = useCallback((lesson: EdpModuleLessonRow): void => {
    if (lesson.pdfUrl == null) {
      return;
    }
    setWatchProgressContext({
      categoryId: lesson.categoryId,
      subCategoryId: lesson.topicId,
    });
    void openEdpModulePdf(lesson.pdfUrl, lesson.title);
  }, []);

  const openSupportingPdf = useCallback((): void => {
    if (overviewPdfUrl == null || moduleTitle.length === 0) {
      return;
    }
    void openEdpModulePdf(overviewPdfUrl, moduleTitle);
  }, [moduleTitle, overviewPdfUrl]);

  const isNotFound = !isLoading && !isFetching && isError;

  return {
    isLoading: isLoading || isFetching,
    isError: isError && detail == null,
    isNotFound,
    moduleTitle,
    moduleDuration: course?.total_duration?.trim() ?? '—',
    videoCount: course?.e_videos_count ?? 0,
    pdfCount: course?.e_documents_count ?? 0,
    lessonCount: lessons.length,
    progressPercent,
    progressLabel,
    spentLabel,
    remainingLabel,
    isProgressLoading,
    lessons,
    mainVideoUrl,
    videoEmbed,
    overviewPdfUrl,
    relatedModules,
    playing,
    setPlaying,
    watchProgressContext,
    playLessonVideo,
    openLessonPdf,
    openSupportingPdf,
    refreshProgress,
    refetch,
  };
}
