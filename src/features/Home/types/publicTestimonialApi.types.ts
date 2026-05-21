export interface PublicTestimonialApiRow {
  id: number;
  name: string;
  testimonial: string;
  title: string | null;
  rating: number | string | null;
  avatar: string | null;
  status: number;
  showOnHomescreen: number;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}
