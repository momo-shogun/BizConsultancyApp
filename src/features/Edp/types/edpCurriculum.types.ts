export interface EdpCurriculumTopic {
  serial: number;
  name: string;
}

/** Programme overview module — mapped from API `freeEdps` (web `/edp` coverage tab). */
export interface EdpCurriculumModule {
  id: string;
  name: string;
  videoCount: number;
  pdfCount: number;
  videoUrl?: string;
  modulePdfUrl: string;
  topics: EdpCurriculumTopic[];
}
