import type {
  ServicePageRef,
  ServicesCategoryTree,
  ServicesSubCategory,
  ServicesTopCategory,
} from '@/features/Home/screens/ZeptoHS/data/servicesCategoryTree.static';

import type { PublicServiceListItem } from '../types/publicServiceApi.types';

interface PageWithPosition extends ServicePageRef {
  position: number;
}

interface MutableSubCategory {
  id: number;
  name: string;
  slug: string;
  maxPosition: number;
  pages: PageWithPosition[];
}

interface MutableCategory {
  id: number;
  name: string;
  slug: string;
  maxPosition: number;
  subCategories: Map<number, MutableSubCategory>;
  otherPages: PageWithPosition[];
}

function isActivePublicService(item: PublicServiceListItem): boolean {
  if (item.isDeleted === 1) {
    return false;
  }
  if (item.status === 0) {
    return false;
  }
  return true;
}

function readServicePosition(item: PublicServiceListItem): number {
  return typeof item.position === 'number' ? item.position : 0;
}

function slugFromCategoryRef(ref: { slug?: string | null; name: string }): string {
  const explicit = ref.slug?.trim();
  if (explicit != null && explicit.length > 0) {
    return explicit;
  }
  return ref.name.trim().toLowerCase().replace(/\s+/g, '-');
}

function stripPosition(page: PageWithPosition): ServicePageRef {
  return {
    title: page.title,
    slug: page.slug,
    showInSuggestions: page.showInSuggestions,
  };
}

function sortPages(pages: PageWithPosition[]): ServicePageRef[] {
  return pages
    .sort((a, b) => b.position - a.position || a.title.localeCompare(b.title))
    .map(stripPosition);
}

export function buildServicesCategoryTreeFromApi(
  items: readonly PublicServiceListItem[],
): ServicesCategoryTree {
  const categoryMap = new Map<number, MutableCategory>();

  const sortedItems = [...items]
    .filter(isActivePublicService)
    .sort((a, b) => readServicePosition(b) - readServicePosition(a));

  for (const item of sortedItems) {
    const position = readServicePosition(item);
    const page: PageWithPosition = {
      title: item.title,
      slug: item.slug,
      showInSuggestions: false,
      position,
    };

    let category = categoryMap.get(item.category.id);
    if (category == null) {
      category = {
        id: item.category.id,
        name: item.category.name,
        slug: slugFromCategoryRef(item.category),
        maxPosition: position,
        subCategories: new Map(),
        otherPages: [],
      };
      categoryMap.set(item.category.id, category);
    } else {
      category.maxPosition = Math.max(category.maxPosition, position);
    }

    if (item.subCategory != null && item.subCategory.id > 0) {
      let subCategory = category.subCategories.get(item.subCategory.id);
      if (subCategory == null) {
        subCategory = {
          id: item.subCategory.id,
          name: item.subCategory.name,
          slug: slugFromCategoryRef(item.subCategory),
          maxPosition: position,
          pages: [],
        };
        category.subCategories.set(item.subCategory.id, subCategory);
      } else {
        subCategory.maxPosition = Math.max(subCategory.maxPosition, position);
      }
      subCategory.pages.push(page);
      continue;
    }

    category.otherPages.push(page);
  }

  const categories: ServicesTopCategory[] = [...categoryMap.values()]
    .sort(
      (a, b) =>
        b.maxPosition - a.maxPosition || a.name.trim().localeCompare(b.name.trim()),
    )
    .map((category): ServicesTopCategory => {
      const subCategories: ServicesSubCategory[] = [...category.subCategories.values()]
        .sort(
          (a, b) =>
            b.maxPosition - a.maxPosition || a.name.trim().localeCompare(b.name.trim()),
        )
        .map((subCategory) => ({
          name: subCategory.name,
          slug: subCategory.slug,
          pages: sortPages(subCategory.pages),
        }))
        .filter((subCategory) => subCategory.pages.length > 0);

      const uncategorizedPages = sortPages(category.otherPages);
      if (uncategorizedPages.length > 0) {
        subCategories.push({
          name: 'More services',
          slug: `${category.slug}-more`,
          pages: uncategorizedPages,
        });
      }

      return {
        name: category.name,
        slug: category.slug,
        subCategories,
        otherPages: [],
      };
    })
    .filter((category) => category.subCategories.length > 0);

  return { categories };
}
