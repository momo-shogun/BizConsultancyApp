import { baseApi } from '@/services/api/baseApi';

import type { EdpCourseDetailsResponse } from '../types/edpCourseDetails.types';
import {
  normalizeEdpModuleSlug,
  parseEdpCourseDetailsResponse,
  unwrapEdpCourseDetailsPayload,
} from '../utils/edpCourseDetailsParsing';

/** Portal: `GET /api/frontend/edp/course-details/:slug` (IID `getEdpCourseDetails`). */
export const EDP_COURSE_DETAILS_PATH = 'frontend/edp/course-details';

export function buildEdpCourseDetailsPath(slug: string): string {
  const safe = encodeURIComponent(normalizeEdpModuleSlug(slug));
  return `${EDP_COURSE_DETAILS_PATH}/${safe}`;
}

export const edpModuleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEdpCourseDetails: build.query<EdpCourseDetailsResponse, string>({
      query: (slug) => buildEdpCourseDetailsPath(slug),
      transformResponse: (response: unknown) => {
        const parsed = parseEdpCourseDetailsResponse(unwrapEdpCourseDetailsPayload(response));
        if (parsed == null) {
          throw new Error('Invalid EDP course details response');
        }
        return parsed;
      },
      providesTags: (_result, _error, slug) => [
        { type: 'EdpModuleDetail', id: normalizeEdpModuleSlug(slug) },
      ],
    }),
  }),
});

export const { useGetEdpCourseDetailsQuery } = edpModuleApi;
