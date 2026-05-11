import type { RecommendedServiceItem } from '@/shared/components';

export interface TextSegment {
  type: 'plain' | 'highlight';
  value: string;
  color?: string;
}

export interface AboutParagraph {
  segments: TextSegment[];
}

export interface AboutSection {
  badge?: string;

  titleSegments?: TextSegment[];

  taglineSegments?: TextSegment[];

  paragraphsSegments?: AboutParagraph[];
}

export interface PackageItem {
  title: string;

  details: string[];

  category?: string;

  icon?: string;

  status?: string;
}

export interface ProcessStep {
  title: string;

  number: string;

  description: string;
}

export interface DocumentCategory {
  title: string;

  subtitle?: string;

  documents: string[];
}

export interface BenefitItem {
  title: string;

  description: string;
}

export interface EligibilityItem {
  title: string;

  description: string;

  icon?: string;
}

export interface FAQItem {
  question: string;

  answer: string;
}

export interface ServicePage extends RecommendedServiceItem {
  about?: AboutSection;

  ourPackage?: {
    sectionTitle?: string;

    items?: PackageItem[];
  };

  process?: {
    title?: string;

    steps?: ProcessStep[];
  };

  documents?: {
    categories?: DocumentCategory[];
  };

  benefits?: {
    items?: BenefitItem[];
  };

  eligibility?: {
    items?: EligibilityItem[];
  };

  compliance?: {
    items?: string[];
  };

  faqs?: {
    faqs?: FAQItem[];
  };
}