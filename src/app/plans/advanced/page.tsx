'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdvancedPlanPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))?.split('=')[1];

      if (!token) {
        router.push('/auth?redirect=/plans/advanced');
      }
    };

    checkAuth();
  }, [router]);

  const handleBuyNow = () => {
    router.push('/plans/advanced/form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-green-500 via-emerald-800 to-black rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-black mb-4">Advanced Plan</h1>
        <p className="text-white mb-6">
          The Advanced Plan is tailored for serious athletes who want elite-level performance.
          You’ll receive one-on-one coaching, precise analytics, and a plan crafted around your individual strengths and goals.
        </p>

        <h2 className="text-xl font-semibold text-gray-300 mb-2">What’s Included:</h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>1-on-1 personal coaching with weekly calls</li>
          <li>Advanced performance tracking & analytics</li>
          <li>Tailored nutrition & supplement guidance</li>
          <li>Elite-level training cycles and deloading strategies</li>
          <li>Highest priority support and accountability</li>
        </ul>

        <p className="text-xl font-semibold text-gray-800 mb-4">
          💲 Price: <span className="text-black">$30/month</span>
        </p>

        <button
          onClick={handleBuyNow}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-900 to-green-500 hover:from-emerald-900 hover:to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
