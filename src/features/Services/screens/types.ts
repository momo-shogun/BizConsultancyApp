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

/* -------------------- IDEAL FOR -------------------- */

export interface IdealForItem {
  image: string;

  title: string;

  description: string;
}

export interface IdealForSection {
  titleSegments?: TextSegment[];

  items: IdealForItem[];
}

/* -------------------- OUR PACKAGE -------------------- */

export interface PackageItem {
  title: string;

  details: string[];

  category: string;

  icon: string;

  status: string;
}

/* -------------------- PROCESS -------------------- */

export interface ProcessStep {
  title: string;

  number: string;

  description: string;
}

/* -------------------- DOCUMENTS -------------------- */

export interface DocumentCategory {
  title: string;

  subtitle?: string;

  documents: string[];
}

/* -------------------- BENEFITS -------------------- */

export interface BenefitItem {
  title: string;

  description: string;
}

/* -------------------- ELIGIBILITY -------------------- */

export interface EligibilityItem {
  title: string;

  description: string;

  icon?: string;
}

/* -------------------- COMPLIANCE -------------------- */

export interface ComplianceSection {
  badge?: string;

  titleSegments?: TextSegment[];

  description?: string;

  items: string[];
}

/* -------------------- FAQS -------------------- */

export interface FAQItem {
  question: string;

  answer: string;
}

export interface FAQSection {
  badge?: string;

  titleSegments?: TextSegment[];

  faqs: FAQItem[];
}

/* -------------------- RECOMMENDED SERVICES -------------------- */

export interface RecommendedServiceCard {
  href: string;

  title: string;

  description: string;

  servicePageId: number;
}

export interface RecommendedServicesSection {
  title?: string;

  description?: string;

  items?: RecommendedServiceCard[];
}

/* -------------------- MAIN SERVICE PAGE -------------------- */

interface HeroFeature {
  icon: string;
  text: string;
  color: string;
}

interface HeroQuickAction {
  href: string;
  icon: string;
  text: string;
}

interface HeroSection {
  title: string;
  subtitle: string;
  formHeading: string;
  features: HeroFeature[];
  quickActions: HeroQuickAction[];
}

export interface ServicePage extends RecommendedServiceItem {
  hero?: HeroSection;

  about?: AboutSection;

  idealFor?: IdealForSection;

  ourPackage: {
    sectionTitle: string;

    items: PackageItem[];
  };

  process?: {
    title?: string;

    steps?: ProcessStep[];
  };

  documents?: {
    categories: DocumentCategory[];
  };

  benefits?: {
    items: BenefitItem[];
  };

  eligibility?: {
    title: string;

    items: EligibilityItem[];
  };

  compliance?: ComplianceSection;

  faqs?: FAQSection;

  recommendedServices?: RecommendedServicesSection;
}