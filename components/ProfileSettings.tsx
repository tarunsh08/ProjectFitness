'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function ProfileSettings({ userId }: { userId: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    avatarUrl: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState({
    fetch: true,
    submit: false,
    upload: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Session expired');

        const res = await fetch(`/api/auth/profile?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to fetch profile');
        }

        const data = await res.json();
        setProfile({
          name: data.name || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || ''
        });
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load profile');
        if (error instanceof Error && error.message.includes('Session')) {
          router.push('/dashboard');
        }
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };

    if (userId) fetchProfile();
  }, [userId, router]);

  const handleAvatarUpload = async (file: File): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required');
    if (session.user.id !== userId) throw new Error('Unauthorized access');

    const fileName = `avatars/${userId}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    const { error: uploadError } = await supabase.storage
      .from('nattypost')
      .upload(fileName, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: true
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = supabase.storage
      .from('nattypost')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(prev => ({ ...prev, submit: true }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Session expired. Please sign in again');
      if (session.user.id !== userId) throw new Error('Unauthorized access');

      let avatarUrl = profile.avatarUrl;
      if (avatarFile) {
        setLoading(prev => ({ ...prev, upload: true }));
        avatarUrl = await handleAvatarUpload(avatarFile);
        setProfile(prev => ({ ...prev, avatarUrl }));
      }

      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          userId, 
          name: profile.name.trim(), 
          bio: profile.bio.trim(),
          avatarUrl
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save profile');
      }

      toast.success('Profile updated successfully! Redirecting...');
      setAvatarFile(null);
      
      // Redirect to profile page after successful update
      setTimeout(() => {
        router.push(`/profile/${userId}`);
        router.refresh(); // Ensure fresh data is loaded
      }, 1500);

    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
      
      if (errorMessage.includes('Session') || errorMessage.includes('Unauthorized')) {
        await supabase.auth.signOut();
        router.push('/dashboard');
      }
    } finally {
      setLoading(prev => ({ ...prev, submit: false, upload: false }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  if (loading.fetch) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-white">Profile Settings</h2>
        
        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-500">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt="Profile avatar"
                width={128}
                height={128}
                className="object-cover w-full h-full"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
            )}
            {loading.upload && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          
          <label className="cursor-pointer">
            <span className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
              loading.upload 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}>
              {avatarFile ? 'Change Avatar' : 'Upload Avatar'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading.upload}
              />
            </span>
          </label>
        </div>

        {/* Profile Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Display Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading.submit}
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              About You
            </label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell others about yourself..."
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              rows={5}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading.submit}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={loading.submit}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              loading.submit
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading.submit ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </span>
            ) : (
              'Save Profile'
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/profile/${userId}`)}
            className="w-full py-3 px-4 rounded-lg font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
            disabled={loading.submit}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}