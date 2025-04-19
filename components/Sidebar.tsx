'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        onClose();
        localStorage.removeItem('isLoggedIn');
        window.dispatchEvent(new Event('authChange'));
        window.location.href = '/';
      } else {
        console.error('Logout failed:', await res.json());
        onClose();
      }
    } catch (error) {
      console.error('Logout error:', error);
      onClose();
    }
  };

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose} />

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-64 bg-gray-900 text-white p-6 shadow-lg z-50 flex flex-col justify-between"
      >
        <div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 mb-6"
          >
            ✖ Close
          </button>

          <ul className="space-y-4 text-lg">
            <li
              onClick={() => navigate('/dashboard')}
              className="hover:text-blue-400 cursor-pointer"
            >
              🏠 Dashboard
            </li>
            <li
              onClick={() => navigate('/userprofile')}
              className="hover:text-blue-400 cursor-pointer"
            >
              👤 Profile
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-10 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white cursor-pointer"
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
}
