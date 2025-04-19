'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProfileDisplay({
  name,
  bio,
  avatarUrl,
  userId,
  isOwner
}: {
  name: string;
  bio: string;
  avatarUrl: string;
  userId: string;
  isOwner: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {name}s Profile
          </h2>
          {isOwner && (
            <Link 
              href="/settings/profile"
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Edit Profile
            </Link>
          )}
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`${name}'s avatar`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-2/3 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">About</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {bio || 'No bio provided yet.'}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  User ID: {userId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}