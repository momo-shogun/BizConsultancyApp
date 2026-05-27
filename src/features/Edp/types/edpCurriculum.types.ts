export interface EdpCurriculumTopic {
  serial: number;
  name: string;
}

/** Programme overview module — mapped from API `freeEdps` (web `/edp` coverage tab). */
export interface EdpCurriculumModule {
  id: string;
  /** IID slug for `GET /frontend/edp/course-details/:slug`. */
  slug: string;
  name: string;
  videoCount: number;
  pdfCount: number;
  videoUrl?: string;
  modulePdfUrl: string;
  topics: EdpCurriculumTopic[];
}
