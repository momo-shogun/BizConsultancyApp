import { useMemo } from 'react';

import {
  useGetMasterCategoriesQuery,
  useGetMasterIndustriesQuery,
  useGetMasterSegmentsQuery,
} from '@/features/consultant/api/consultantApi';
import type { MasterDataItem } from '@/features/consultant/types/masterData.types';
import { useGetMyConsultantIndustriesQuery } from '@/features/ConsultantSelf/api/consultantSelfApi';

export interface UseExpertVideoTaxonomyResult {
  hasExpertise: boolean;
  categories: MasterDataItem[];
  segments: MasterDataItem[];
  industries: MasterDataItem[];
}

export function useExpertVideoTaxonomy(
  categoryId: string,
  segmentId: string,
): UseExpertVideoTaxonomyResult {
  const { data: myIndustries = [] } = useGetMyConsultantIndustriesQuery();
  const { data: allCategories = [] } = useGetMasterCategoriesQuery();
  const { data: allSegments = [] } = useGetMasterSegmentsQuery();
  const { data: allIndustries = [] } = useGetMasterIndustriesQuery({});

  const hasExpertise = myIndustries.length > 0;

  const allowedIndustryIds = useMemo(
    () => new Set(myIndustries.map((row) => Number(row.industryId))),
    [myIndustries],
  );

  const allowedIndustries = useMemo(() => {
    if (!hasExpertise) {
      return [];
    }
    return allIndustries.filter((industry) => allowedIndustryIds.has(industry.id));
  }, [allIndustries, allowedIndustryIds, hasExpertise]);

  const allowedSegmentIds = useMemo(() => {
    const set = new Set<number>();
    for (const row of myIndustries) {
      if (row.segmentId != null) {
        set.add(Number(row.segmentId));
      }
    }
    for (const industry of allowedIndustries) {
      if (industry.segmentId != null) {
        set.add(industry.segmentId);
      }
    }
    return set;
  }, [allowedIndustries, myIndustries]);

  const allowedCategoryIds = useMemo(() => {
    const set = new Set<number>();
    for (const industry of allowedIndustries) {
      if (industry.categoryId != null) {
        set.add(industry.categoryId);
      }
    }
    for (const segment of allSegments) {
      if (allowedSegmentIds.has(segment.id) && segment.categoryId != null) {
        set.add(segment.categoryId);
      }
    }
    return set;
  }, [allSegments, allowedIndustries, allowedSegmentIds]);

  const categories = useMemo(() => {
    if (!hasExpertise) {
      return [];
    }
    return allCategories.filter((category) => allowedCategoryIds.has(category.id));
  }, [allCategories, allowedCategoryIds, hasExpertise]);

  const segments = useMemo(() => {
    if (!hasExpertise) {
      return [];
    }
    const catNum = categoryId.length > 0 ? Number(categoryId) : null;
    return allSegments.filter((segment) => {
      if (!allowedSegmentIds.has(segment.id)) {
        return false;
      }
      if (catNum != null && segment.categoryId != null && segment.categoryId !== catNum) {
        return false;
      }
      return true;
    });
  }, [allSegments, allowedSegmentIds, categoryId, hasExpertise]);

  const industries = useMemo(() => {
    if (!hasExpertise) {
      return [];
    }
    const segNum = segmentId.length > 0 ? Number(segmentId) : null;
    return allowedIndustries.filter((industry) => {
      if (segNum != null && industry.segmentId != null && industry.segmentId !== segNum) {
        return false;
      }
      return true;
    });
  }, [allowedIndustries, hasExpertise, segmentId]);

  return { hasExpertise, categories, segments, industries };
}
