import { useMemo } from 'react';

import type { FAQsData } from '@/features/Services/screens/components/faq/faq';

import { useGetEdpFaqsQuery } from '../api/edpLandingApi';

export interface UseEdpLandingFaqsResult {
  faqs: FAQsData;
  count: number;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}

export function useEdpLandingFaqs(): UseEdpLandingFaqsResult {
  const { data, isLoading, isError } = useGetEdpFaqsQuery();

  const faqs = useMemo((): FAQsData => {
    const items = data?.faqs ?? [];
    return {
      faqs: items.map((item) => ({
        question: item.title,
        answer: item.description,
      })),
    };
  }, [data?.faqs]);

  const count = faqs.faqs.length;

  return {
    faqs,
    count,
    isLoading,
    isError,
    isEmpty: !isLoading && count === 0,
  };
}
