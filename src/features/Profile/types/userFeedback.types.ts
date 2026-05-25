export interface SubmitUserFeedbackPayload {
  rating: number;
  subject?: string;
  message?: string;
}

export interface SubmitUserFeedbackResult {
  id: number;
  message: string;
}
