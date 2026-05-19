export interface ServiceSearchHit {
  title: string;
  slug: string;
  categorySlug: string | null;
}

export interface ServiceSearchQuery {
  q: string;
  limit?: number;
}

export type SearchScreenParams = {
  initialQuery?: string;
  headerBackground?: string;
  accentColor?: string;
};
