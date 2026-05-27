import { baseApi } from '@/services/api/baseApi';

import type { EdpCoursesWithDocumentsResponse } from '../types/edpCourses.types';
import type { EdpFaqsResponse } from '../types/edpFaqs.types';
import { parseEdpCoursesWithDocumentsResponse } from '../utils/edpCoursesParsing';
import { parseEdpFaqsResponse } from '../utils/edpFaqsParsing';

export const edpLandingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEdpFaqs: build.query<EdpFaqsResponse, void>({
      query: () => 'frontend/edp/faqs',
      transformResponse: (response: unknown) => parseEdpFaqsResponse(response),
    }),
    getEdpCoursesWithDocuments: build.query<EdpCoursesWithDocumentsResponse, void>({
      query: () => 'frontend/edp/courses-with-documents',
      transformResponse: (response: unknown) =>
        parseEdpCoursesWithDocumentsResponse(response),
    }),
  }),
});

export const { useGetEdpFaqsQuery, useGetEdpCoursesWithDocumentsQuery } = edpLandingApi;
