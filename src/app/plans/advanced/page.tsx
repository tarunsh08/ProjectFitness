'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function AdvancedPlanPage() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      router.push('/plans/advanced');
      return;
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error('Token verification failed:', error);
      router.push('/auth?redirect=/plans/advanced');
    }
  }, [router]);

  const handleBuyNow = () => {
    router.push('/plans/advanced/form');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 px-4">
      <div className="bg-gradient-to-r from-green-500 via-emerald-800 to-black p-6 rounded-xl shadow-md max-w-2xl w-full space-y-4">
        <h1 className="text-2xl font-bold text-black">Advanced Plan</h1>
        <p className="text-white">This plan includes:</p>
        <ul className="list-disc list-inside space-y-2 text-white">
          <li>1-on-1 personal coaching with weekly calls</li>
          <li>Advanced performance tracking & analytics</li>
          <li>Tailored nutrition & supplement guidance</li>
          <li>Elite-level training cycles and deloading strategies</li>
          <li>Highest priority support and accountability</li>
        </ul>

        <p className="text-xl font-semibold text-gray-800 mb-4">
          💲 Price: <span className="text-black">$12/month</span>
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