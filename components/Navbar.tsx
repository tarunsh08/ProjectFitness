'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavLinksProps {
  isLoggedIn: boolean;
  loading: boolean;
  mobile?: boolean;
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      setIsLoggedIn(res.ok);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    const handleAuthChange = () => checkAuth();
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-black to-green-600 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-black to-green-600 bg-clip-text text-transparent">
              NattyGyatt
            </span>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <NavLinks isLoggedIn={isLoggedIn} loading={loading} />
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 mt-2">
              <NavLinks isLoggedIn={isLoggedIn} loading={loading} mobile />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLinks({ isLoggedIn, loading, mobile = false }: NavLinksProps) {
  return (
    <>
      <Link 
        href="/" 
        className={`${mobile ? 'block' : ''} text-gray-700 hover:text-green-600 py-1 px-1 font-medium border-b-2 border-transparent hover:border-green-500 transition-colors duration-200`}
      >
        Home
      </Link>
      <Link 
        href="/about" 
        className={`${mobile ? 'block' : ''} text-gray-700 hover:text-green-600 py-1 px-1 font-medium border-b-2 border-transparent hover:border-green-500 transition-colors duration-200`}
      >
        About
      </Link>
      <Link 
        href="/contact" 
        className={`${mobile ? 'block' : ''} text-gray-700 hover:text-green-600 py-1 px-1 font-medium border-b-2 border-transparent hover:border-green-500 transition-colors duration-200`}
      >
        Contact
      </Link>

      {!loading && (isLoggedIn ? (
        <Link 
          href="/dashboard" 
          className={`${mobile ? 'block' : ''} text-gray-700 hover:text-green-600 py-1 px-1 font-medium border-b-2 border-transparent hover:border-green-500 transition-colors duration-200`}
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href="/auth"
          className={`${mobile ? 'block w-full text-center mt-2' : 'ml-4'} bg-gradient-to-r from-green-600 to-green-500 px-4 py-1.5 rounded-md text-white font-medium shadow-sm hover:shadow-md hover:from-green-700 hover:to-green-600 transition-all duration-300`}
        >
          Login
        </Link>
      ))}
    </>
  );
}