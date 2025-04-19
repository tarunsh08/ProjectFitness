'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          router.push(redirect);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [redirect, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { 
          email: formData.email, 
          password: formData.password,
          redirectTo: redirect // Add redirectTo parameter
        }
      : formData;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include' // Ensure cookies are handled
      });

      if (res.redirected) {
        // Handle server-side redirect
        window.location.href = res.url;
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // For register flow
      if (!isLogin) {
        router.push('/auth?redirect=' + encodeURIComponent(redirect));
        return;
      }

      // For login flow (if not redirected)
      window.dispatchEvent(new Event('authChange'));
      router.push(redirect);
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 text-red-300 text-sm rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg transition ${
            loading
              ? 'bg-blue-800 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-400">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-blue-400 hover:underline focus:outline-none"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-blue-400 hover:underline focus:outline-none"
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}