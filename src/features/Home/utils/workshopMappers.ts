import type { EventSpotlightItem } from '@/shared/components/cards/EventSpotlightCard/EventSpotlightCard';

import type { PublicWorkshopApiRow } from '../types/publicWorkshopApi.types';

function feeToCardString(value: string | number | null | undefined): string {
  if (value == null) {
    return '0';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '0';
}

/**
 * EventSpotlightCard UI ↔ API mapping.
 *
 * Shown on card (from API):
 * - name → title
 * - thumbnail → hero image (resolved to S3/CDN URL)
 * - highlightPoints → tag pills (JSON string array)
 * - place → location row
 * - startDate, endDate, startTime, endTime → schedule row
 * - type → type pill
 * - onlineFee, offlineFee → fee pill (prefers online, else offline)
 *
 * In API but NOT shown on card (stored on item for detail/navigation later):
 * - description, keywords, mapLocation, contactNumber
 * - segmentId, industryId
 * - isOnlineAvailable, isLiveWorkshop
 * - externalUrlOnline, externalUrlOffline, workshopUrl
 * - createdAt, updatedAt, status, createdBy, updatedBy, deletedBy, isDeleted
 *
 * Used for navigation only (not rendered on card):
 * - id, slug
 */
export function mapPublicWorkshopToEventSpotlightItem(
  row: PublicWorkshopApiRow,
): EventSpotlightItem {
  return {
    id: row.id,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    name: row.name,
    slug: row.slug,
    type: row.type,
    thumbnail: row.thumbnail?.trim() ?? '',
    description: row.description ?? '',
    highlightPoints: row.highlightPoints ?? undefined,
    keywords: row.keywords ?? undefined,
    startDate: row.startDate ?? '',
    endDate: row.endDate ?? undefined,
    startTime: row.startTime ?? undefined,
    endTime: row.endTime ?? undefined,
    place: row.place ?? undefined,
    mapLocation: row.mapLocation ?? undefined,
    contactNumber: row.contactNumber ?? undefined,
    segmentId: row.segmentId ?? undefined,
    industryId: row.industryId ?? undefined,
    onlineFee: feeToCardString(row.onlineFee),
    offlineFee: feeToCardString(row.offlineFee),
    isOnlineAvailable: row.isOnlineAvailable ?? undefined,
    isLiveWorkshop: row.isLiveWorkshop ?? undefined,
    externalUrlOnline: row.externalUrlOnline ?? undefined,
    externalUrlOffline: row.externalUrlOffline ?? undefined,
    workshopUrl: row.workshopUrl ?? undefined,
    status: row.status ?? undefined,
    createdBy: row.createdBy,
    updatedBy: row.updatedBy,
    deletedBy: row.deletedBy,
    isDeleted: row.isDeleted ?? undefined,
  };
}

export function mapPublicWorkshopsToEventSpotlightItems(
  rows: PublicWorkshopApiRow[],
): EventSpotlightItem[] {
  return rows.map(mapPublicWorkshopToEventSpotlightItem);
}
