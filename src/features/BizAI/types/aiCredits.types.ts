export interface AiCreditPackage {
  id: number;
  name: string;
  price: number;
  credits: number;
}

export interface AiUsageSummary {
  remainingCredits: number;
  freeQuestionsUsed?: number;
  creditsUsed?: number;
}

export interface AiCreditRazorpayOrder {
  key: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface AiCreditPurchaseResult {
  remainingCredits: number;
  addedCredits?: number;
}

export interface CreateAiCreditOrderRequest {
  packageId: number;
}

export interface VerifyAiCreditPaymentRequest {
  packageId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PurchaseAiCreditsWalletRequest {
  packageId: number;
}
