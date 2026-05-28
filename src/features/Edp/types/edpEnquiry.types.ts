export interface SubmitEdpEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  enqCategoryId: number;
  categoryInterestedId: number;
  message: string;
}

export interface SubmitEdpEnquiryResult {
  id: number;
  message: string;
}
