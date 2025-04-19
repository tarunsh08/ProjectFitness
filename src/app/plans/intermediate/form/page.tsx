'use client';

import { useEffect, useState } from 'react';

export default function IntermediatePaymentPage() {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/razorpay/intermediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: 'NattyGyatt',
        currency: data.currency,
        amount: data.amount,
        order_id: data.id,
        description: 'Intermediate Fitness Plan',
        handler: function () {
          alert('Payment successful!');
          window.location.href = '/thank-you';
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#10b981',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 px-4">
      <div className="bg-black shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 text-white text-center">
        <h2 className="text-2xl font-bold text-green-400">Intermediate Plan</h2>
        <p className="text-sm text-gray-300">Price: ₹599</p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-green-500 hover:to-green-600 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          {loading ? 'Processing...' : 'Pay & Join Now'}
        </button>
      </div>
    </div>
  );
}
