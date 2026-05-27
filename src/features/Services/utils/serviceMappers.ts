import type { RecommendedServiceItem } from '@/shared/components';

import type { PublicServiceListItem } from '../types/publicServiceApi.types';
import type {
  AboutParagraph,
  AboutSection,
  BenefitItem,
  ComplianceSection,
  DocumentCategory,
  EligibilityItem,
  FAQItem,
  FAQSection,
  IdealForItem,
  IdealForSection,
  PackageItem,
  ProcessStep,
  ServicePage,
  ServicePagePricingCost,
  TextSegment,
} from '../screens/types';

import { resolveServiceAssetUrl } from './serviceMedia';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function formatServicePrice(
  price: string | number | null | undefined,
  isGstIncluded?: string,
): string | undefined {
  if (price == null) {
    return undefined;
  }
  const amount =
    typeof price === 'number'
      ? price
      : Number.parseFloat(String(price).replace(/,/g, ''));
  if (!Number.isFinite(amount) || amount <= 0) {
    return undefined;
  }
  const formatted = `₹${Math.round(amount).toLocaleString('en-IN')}`;
  if (isGstIncluded === 'excluded') {
    return `From ${formatted} + GST`;
  }
  return `From ${formatted}`;
}

function mapServicePageCost(raw: unknown): ServicePagePricingCost | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }
  const prof = isRecord(raw.professionalFee) ? raw.professionalFee : null;
  const gov = isRecord(raw.governmentFee) ? raw.governmentFee : null;
  if (prof == null && gov == null) {
    return undefined;
  }
  return {
    professionalFee:
      prof != null
        ? {
            label: typeof prof.label === 'string' ? prof.label : undefined,
            amountOrText:
              typeof prof.amountOrText === 'string' ? prof.amountOrText : undefined,
            subtext: typeof prof.subtext === 'string' ? prof.subtext : undefined,
          }
        : undefined,
    governmentFee:
      gov != null
        ? {
            label: typeof gov.label === 'string' ? gov.label : undefined,
            amountOrText:
              typeof gov.amountOrText === 'string' ? gov.amountOrText : undefined,
            subtext: typeof gov.subtext === 'string' ? gov.subtext : undefined,
          }
        : undefined,
  };
}

function extractSummary(item: PublicServiceListItem): string {
  if (isRecord(item.hero) && typeof item.hero.subtitle === 'string') {
    const subtitle = item.hero.subtitle.trim();
    if (subtitle.length > 0) {
      return subtitle;
    }
  }
  const metaDesc = item.metadata?.description?.trim();
  if (metaDesc != null && metaDesc.length > 0) {
    return metaDesc;
  }
  if (isRecord(item.about) && Array.isArray(item.about.paragraphsSegments)) {
    const firstBlock = item.about.paragraphsSegments[0];
    if (isRecord(firstBlock) && Array.isArray(firstBlock.segments)) {
      const firstSeg = firstBlock.segments[0];
      if (isRecord(firstSeg) && typeof firstSeg.value === 'string') {
        return firstSeg.value.trim();
      }
    }
  }
  return '';
}

function mapTextSegments(raw: unknown): TextSegment[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const segments: TextSegment[] = [];
  for (const item of raw) {
    if (!isRecord(item) || typeof item.value !== 'string') {
      continue;
    }
    const color =
      typeof item.color === 'string' && item.color.trim().length > 0
        ? item.color.trim()
        : undefined;
    segments.push({
      type: item.type === 'highlight' ? 'highlight' : 'plain',
      value: item.value,
      ...(color != null ? { color } : {}),
    });
  }
  return segments;
}

function mapAbout(raw: unknown): AboutSection | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }
  const paragraphsSegments: AboutParagraph[] = [];
  if (Array.isArray(raw.paragraphsSegments)) {
    for (const block of raw.paragraphsSegments) {
      if (!isRecord(block)) {
        continue;
      }
      paragraphsSegments.push({ segments: mapTextSegments(block.segments) });
    }
  }
  return {
    badge: typeof raw.badge === 'string' ? raw.badge : undefined,
    titleSegments: mapTextSegments(raw.titleSegments),
    taglineSegments: mapTextSegments(raw.taglineSegments),
    paragraphsSegments,
  };
}

function mapHero(raw: unknown): ServicePage['hero'] {
  if (!isRecord(raw)) {
    return undefined;
  }
  const features: NonNullable<ServicePage['hero']>['features'] = [];
  if (Array.isArray(raw.features)) {
    for (const row of raw.features) {
      if (!isRecord(row) || typeof row.text !== 'string') {
        continue;
      }
      features.push({
        icon: typeof row.icon === 'string' ? row.icon : 'CheckCircle2',
        text: row.text,
        color: typeof row.color === 'string' ? row.color : '',
      });
    }
  }
  const quickActions: NonNullable<ServicePage['hero']>['quickActions'] = [];
  if (Array.isArray(raw.quickActions)) {
    for (const row of raw.quickActions) {
      if (!isRecord(row) || typeof row.text !== 'string') {
        continue;
      }
      quickActions.push({
        href: typeof row.href === 'string' ? row.href : '',
        icon: typeof row.icon === 'string' ? row.icon : 'FileText',
        text: row.text,
      });
    }
  }
  return {
    title: typeof raw.title === 'string' ? raw.title : '',
    subtitle: typeof raw.subtitle === 'string' ? raw.subtitle : '',
    formHeading: typeof raw.formHeading === 'string' ? raw.formHeading : '',
    features,
    quickActions,
  };
}

function mapPackageItems(raw: unknown): PackageItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const items: PackageItem[] = [];
  for (const row of raw) {
    if (!isRecord(row) || typeof row.title !== 'string') {
      continue;
    }
    items.push({
      title: row.title,
      category: typeof row.category === 'string' ? row.category : '',
      icon: typeof row.icon === 'string' ? row.icon : '',
      status: typeof row.status === 'string' ? row.status : '',
      details: Array.isArray(row.details)
        ? row.details.filter((d): d is string => typeof d === 'string')
        : [],
    });
  }
  return items;
}

function mapOurPackage(raw: unknown): ServicePage['ourPackage'] {
  if (!isRecord(raw)) {
    return undefined;
  }
  const items = mapPackageItems(raw.items);
  if (items.length === 0) {
    return undefined;
  }
  return {
    sectionTitle: typeof raw.sectionTitle === 'string' ? raw.sectionTitle : 'Our package',
    items,
  };
}

function mapProcessSteps(raw: unknown): ProcessStep[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const steps: ProcessStep[] = [];
  for (const row of raw) {
    if (!isRecord(row) || typeof row.title !== 'string') {
      continue;
    }
    steps.push({
      title: row.title,
      number: typeof row.number === 'string' ? row.number : '',
      description: typeof row.description === 'string' ? row.description : '',
    });
  }
  return steps;
}

function mapDocumentCategoryList(categoriesRaw: unknown): DocumentCategory[] {
  if (!Array.isArray(categoriesRaw)) {
    return [];
  }
  const categories: DocumentCategory[] = [];
  for (const row of categoriesRaw) {
    if (!isRecord(row) || typeof row.title !== 'string') {
      continue;
    }
    categories.push({
      title: row.title,
      subtitle: typeof row.subtitle === 'string' ? row.subtitle : undefined,
      documents: Array.isArray(row.documents)
        ? row.documents.filter((d): d is string => typeof d === 'string')
        : [],
    });
  }
  return categories;
}

function mapDocumentsSection(raw: unknown): ServicePage['documents'] {
  if (!isRecord(raw)) {
    return undefined;
  }
  const categories = mapDocumentCategoryList(raw.categories);
  if (categories.length === 0) {
    return undefined;
  }

  const titleParts = mapTextSegments(raw.titleSegments);
  let title = '';
  let titleHighlight = '';
  for (const seg of titleParts) {
    if (seg.type === 'highlight') {
      titleHighlight += seg.value;
    } else {
      title += seg.value;
    }
  }

  return {
    badge: typeof raw.badge === 'string' ? raw.badge : undefined,
    title: title.trim() || undefined,
    titleHighlight: titleHighlight.trim() || undefined,
    categories,
  };
}

function mapBenefitItems(raw: unknown): BenefitItem[] {
  if (!isRecord(raw) || !Array.isArray(raw.items)) {
    return [];
  }
  const items: BenefitItem[] = [];
  for (const row of raw.items) {
    if (!isRecord(row) || typeof row.title !== 'string') {
      continue;
    }
    items.push({
      title: row.title,
      description: typeof row.description === 'string' ? row.description : '',
    });
  }
  return items;
}

function mapEligibilityItems(raw: unknown): EligibilityItem[] {
  if (!isRecord(raw) || !Array.isArray(raw.items)) {
    return [];
  }
  const items: EligibilityItem[] = [];
  for (const row of raw.items) {
    if (!isRecord(row) || typeof row.title !== 'string') {
      continue;
    }
    items.push({
      title: row.title,
      description: typeof row.description === 'string' ? row.description : '',
      icon: typeof row.icon === 'string' ? row.icon : undefined,
    });
  }
  return items;
}

function mapIdealFor(raw: unknown): IdealForSection | undefined {
  if (!isRecord(raw) || !Array.isArray(raw.items)) {
    return undefined;
  }
  const items: IdealForItem[] = [];
  for (const row of raw.items) {
    if (!isRecord(row) || typeof row.title !== 'string') {
      continue;
    }
    const imagePath = typeof row.image === 'string' ? row.image : '';
    items.push({
      image: resolveServiceAssetUrl(imagePath) ?? imagePath,
      title: row.title,
      description: typeof row.description === 'string' ? row.description : '',
    });
  }
  return {
    titleSegments: mapTextSegments(raw.titleSegments),
    items,
  };
}

function mapCompliance(raw: unknown): ComplianceSection | undefined {
  if (!isRecord(raw) || !Array.isArray(raw.items)) {
    return undefined;
  }
  return {
    badge: typeof raw.badge === 'string' ? raw.badge : undefined,
    titleSegments: mapTextSegments(raw.titleSegments),
    description: typeof raw.description === 'string' ? raw.description : undefined,
    items: raw.items.filter((item): item is string => typeof item === 'string'),
  };
}

function mapFaqs(raw: unknown): FAQSection | undefined {
  if (!isRecord(raw) || !Array.isArray(raw.faqs)) {
    return undefined;
  }
  const faqs: FAQItem[] = [];
  for (const row of raw.faqs) {
    if (!isRecord(row) || typeof row.question !== 'string' || typeof row.answer !== 'string') {
      continue;
    }
    faqs.push({ question: row.question, answer: row.answer });
  }
  return {
    badge: typeof raw.badge === 'string' ? raw.badge : undefined,
    titleSegments: mapTextSegments(raw.titleSegments),
    faqs,
  };
}

function slugFromHref(href: string): string {
  const parts = href.split('/').filter((part) => part.length > 0);
  return parts[parts.length - 1] ?? href;
}

function mapRecommendedFromApi(raw: unknown): ServicePage['recommendedServices'] {
  if (!isRecord(raw) || !Array.isArray(raw.items)) {
    return undefined;
  }

  const mapped = raw.items
    .map((row) => {
      if (!isRecord(row)) {
        return null;
      }
      const slug =
        typeof row.slug === 'string' && row.slug.length > 0
          ? row.slug
          : typeof row.href === 'string'
            ? slugFromHref(row.href)
            : '';
      if (slug.length === 0) {
        return null;
      }
      return {
        slug,
        title: typeof row.title === 'string' ? row.title : '',
        description: typeof row.description === 'string' ? row.description : '',
        servicePageId: typeof row.servicePageId === 'number' ? row.servicePageId : undefined,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

  if (mapped.length === 0) {
    return undefined;
  }

  return {
    title: typeof raw.title === 'string' ? raw.title : undefined,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    items: mapped,
  };
}

export function mapPublicServiceToCardItem(item: PublicServiceListItem): RecommendedServiceItem {
  const featureCount = item.featurepoint?.length ?? 0;
  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    categoryLabel: item.category.name,
    headerRight: item.subCategory?.name ?? '',
    summary: extractSummary(item),
    priceLabel: formatServicePrice(item.price, item.isGstIncluded),
    badgeLabel: featureCount > 0 ? `${featureCount} inclusions` : undefined,
  };
}

export function mapPublicServiceToServicePage(raw: unknown): ServicePage | null {
  if (!isRecord(raw)) {
    return null;
  }
  const item = parseLooseService(raw);
  if (item == null) {
    return null;
  }

  const card = mapPublicServiceToCardItem(item);

  const price =
    typeof raw.price === 'string' || typeof raw.price === 'number'
      ? String(raw.price)
      : item.price != null
        ? String(item.price)
        : null;
  const isGstIncluded =
    typeof raw.isGstIncluded === 'string'
      ? raw.isGstIncluded
      : item.isGstIncluded;
  const gstPercent =
    raw.gstPercent != null
      ? String(raw.gstPercent)
      : item.gstPercent != null
        ? String(item.gstPercent)
        : null;

  const page: ServicePage = {
    ...card,
    price,
    isGstIncluded,
    gstPercent,
    cost: mapServicePageCost(raw.cost),
    hero: mapHero(raw.hero ?? item.hero),
    about: mapAbout(raw.about ?? item.about),
    idealFor: mapIdealFor(raw.idealFor),
    ourPackage: mapOurPackage(raw.ourPackage),
    process: isRecord(raw.process)
      ? (() => {
          const steps = mapProcessSteps(raw.process.steps);
          if (steps.length === 0) {
            return undefined;
          }
          return {
            badge: typeof raw.process.badge === 'string' ? raw.process.badge : undefined,
            title: typeof raw.process.title === 'string' ? raw.process.title.trim() : '',
            titleHighlight:
              typeof raw.process.titleHighlight === 'string'
                ? raw.process.titleHighlight.trim()
                : undefined,
            steps,
          };
        })()
      : undefined,
    documents: mapDocumentsSection(raw.documents),
    benefits: isRecord(raw.benefits) ? { items: mapBenefitItems(raw.benefits) } : undefined,
    eligibility: isRecord(raw.eligibility)
      ? {
          badge: typeof raw.eligibility.badge === 'string' ? raw.eligibility.badge : undefined,
          title: typeof raw.eligibility.title === 'string' ? raw.eligibility.title.trim() : '',
          titleHighlight:
            typeof raw.eligibility.titleHighlight === 'string'
              ? raw.eligibility.titleHighlight.trim()
              : undefined,
          description:
            typeof raw.eligibility.description === 'string'
              ? raw.eligibility.description.trim()
              : undefined,
          items: mapEligibilityItems(raw.eligibility),
        }
      : undefined,
    compliance: mapCompliance(raw.compliance),
    faqs: mapFaqs(raw.faqs),
    recommendedServices: mapRecommendedFromApi(raw.recommendedServices),
  };

  return page;
}

function parseLooseService(raw: Record<string, unknown>): PublicServiceListItem | null {
  if (typeof raw.id !== 'number' || typeof raw.slug !== 'string' || typeof raw.title !== 'string') {
    return null;
  }

  const categoryRaw = raw.category ?? raw.serviceCategory;
  const subCategoryRaw = raw.subCategory ?? raw.serviceSubCategory;

  const category =
    isRecord(categoryRaw) && typeof categoryRaw.name === 'string'
      ? {
          id: typeof categoryRaw.id === 'number' ? categoryRaw.id : 0,
          name: categoryRaw.name,
          slug: typeof categoryRaw.slug === 'string' ? categoryRaw.slug : null,
        }
      : { id: 0, name: 'Services', slug: null };

  const subCategory =
    isRecord(subCategoryRaw) && typeof subCategoryRaw.name === 'string'
      ? {
          id: typeof subCategoryRaw.id === 'number' ? subCategoryRaw.id : 0,
          name: subCategoryRaw.name,
          slug: typeof subCategoryRaw.slug === 'string' ? subCategoryRaw.slug : null,
        }
      : null;

  const price =
    typeof raw.price === 'string' || typeof raw.price === 'number' ? String(raw.price) : null;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    serviceIcon: typeof raw.serviceIcon === 'string' ? raw.serviceIcon : null,
    price,
    isGstIncluded: typeof raw.isGstIncluded === 'string' ? raw.isGstIncluded : undefined,
    gstPercent: raw.gstPercent != null ? String(raw.gstPercent) : null,
    metadata: isRecord(raw.metadata)
      ? {
          title: typeof raw.metadata.title === 'string' ? raw.metadata.title : undefined,
          description:
            typeof raw.metadata.description === 'string' ? raw.metadata.description : undefined,
        }
      : null,
    hero: raw.hero,
    about: raw.about,
    featurepoint: Array.isArray(raw.featurepoint)
      ? raw.featurepoint.filter((p): p is string => typeof p === 'string')
      : null,
    position: typeof raw.position === 'number' ? raw.position : undefined,
    category,
    subCategory,
  };
}
