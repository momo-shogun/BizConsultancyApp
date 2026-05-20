declare module 'react-native-razorpay' {
  export interface RazorpayOpenOptions {
    key: string;
    amount: string;
    currency: string;
    order_id: string;
    name: string;
    description?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: { color?: string };
  }

  export interface RazorpaySuccessData {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayCheckoutStatic {
    open(options: RazorpayOpenOptions): Promise<RazorpaySuccessData>;
  }

  const RazorpayCheckout: RazorpayCheckoutStatic;
  export default RazorpayCheckout;
}
