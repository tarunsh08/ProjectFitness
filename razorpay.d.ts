// types/razorpay.d.ts
interface RazorpayOptions {
  key: string;
  name: string;
  currency: string;
  amount: number;
  order_id: string;
  description: string;
  handler: (response: any) => void; // You can refine this type further if needed
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

interface Razorpay {
  open: () => void;
}

interface RazorpayStatic {
  new (options: RazorpayOptions): Razorpay;
}

interface Window {
  Razorpay: RazorpayStatic;
}