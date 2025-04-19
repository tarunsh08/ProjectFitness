'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BeginnerPlan() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/plans/beginner/form');
    } else {
      router.push('/auth?redirect=/plans/beginner/form');
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl bg-gradient-to-r from-green-500 via-emerald-800 to-black shadow-lg rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-bold mb-6 text-black">Beginner Athlete Plan</h1>

        <p className="text-gray-300 mb-8 text-lg">
          Kickstart your fitness journey with our beginner-friendly plan designed to build your foundation.
        </p>

        <ul className="text-left text-white mb-8 space-y-4">
          <li>✅ Full Body Home Workouts</li>
          <li>✅ 4-week Training Plan</li>
          <li>✅ Basic Nutrition Guide</li>
          <li>✅ Motivation & Daily Tips</li>
          <li>✅ Email Support</li>
        </ul>

        <p className="text-2xl font-semibold mb-6 text-yellow-300">Free of Cost 🎉</p>

        <button
          onClick={handleGetStarted}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-900 to-green-500 hover:from-emerald-900 hover:to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
}
