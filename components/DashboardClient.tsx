'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Sidebar from './Sidebar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

export default function DashboardClient({ user }: { user: string }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [posts, setPosts] = useState<{ id: string; image_url: string; user: string; created_at: string; likeCount: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  const toggleSidebar = () => setShowSidebar(prev => !prev);
  const closeSidebar = () => setShowSidebar(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    if (showSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar]);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('nattypost')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out posts with missing or invalid image URLs
      const validPosts = data?.filter(post => 
        post && post.image_url && typeof post.image_url === 'string' && post.image_url.trim() !== ''
      ) || [];

      const formattedPosts = validPosts.map(post => ({
        ...post,
        image_url: post.image_url.replace(/([^:]\/)\/+/g, '$1'),
        likeCount: 0 // Initialize like count to 0
      }));

      console.log('Fetched and filtered posts:', formattedPosts.length);
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Failed to fetch posts', error);
      alert('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const cleanupPostsData = async () => {
      try {
        // Find posts with missing or invalid image URLs
        const { data: invalidPosts, error } = await supabase
          .from('nattypost')
          .select('id, image_url')
          .or('image_url.is.null,image_url.eq.');

        if (error) throw error;
        
        if (invalidPosts && invalidPosts.length > 0) {
          console.log(`Found ${invalidPosts.length} invalid posts, cleaning up...`);
          
          // Delete invalid posts
          const invalidIds = invalidPosts.map(post => post.id);
          const { error: deleteError } = await supabase
            .from('nattypost')
            .delete()
            .in('id', invalidIds);
            
          if (deleteError) throw deleteError;
        }
      } catch (cleanupError) {
        console.error('Error cleaning up invalid posts:', cleanupError);
      } finally {
        // Fetch posts after cleanup
        fetchPosts();
      }
    };
    
    cleanupPostsData();
  }, [supabase, fetchPosts]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('nattypost')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL - ensure it's correctly formatted
      const { data: { publicUrl } } = supabase.storage
        .from('nattypost')
        .getPublicUrl(fileName);

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      console.log('Image uploaded successfully, URL:', publicUrl);

      // Validate URL before inserting
      const cleanedUrl = publicUrl.trim().replace(/([^:]\/)\/+/g, '$1');

      // Insert record into database
      const { error: dbError, data: insertData } = await supabase
        .from('nattypost')
        .insert([{ 
          user, 
          image_url: cleanedUrl,
          created_at: new Date().toISOString() 
        }])
        .select();

      if (dbError) throw dbError;

      if (!insertData || insertData.length === 0) {
        throw new Error('Post was created but no data was returned');
      }

      console.log("Post created successfully:", insertData);
      
      // Delay fetch to ensure storage processing completes
      setTimeout(() => {
        fetchPosts();
      }, 1000);
      
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const increaseLikeCount = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post
      )
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-gray-300">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm text-white px-6 py-4 flex justify-between items-center shadow-lg border-b border-gray-700">
        <button 
          onClick={toggleSidebar} 
          className="text-xl font-semibold cursor-pointer hover:text-green-500 transition-colors"
        >
          ☰
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
          NattyGyatt Dashboard
        </h1>
        <div className="w-6"></div> {/* Spacer for balance */}
      </header>

      {/* Sidebar */}
      <div ref={sidebarRef} className="absolute top-0 left-0 z-50">
        <Sidebar isOpen={showSidebar} onClose={closeSidebar} />
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8 pb-24 max-w-6xl mx-auto">
        {/* Posts Feed */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Upload your first post to get started!</p>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {post.user.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">{post.user}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative aspect-square bg-gray-900">
                  {post.image_url ? (
                    <Image 
                      src={post.image_url}
                      alt={`Post by ${post.user}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      onError={() => {
                        console.error('Failed to load image:', post.image_url);
                        // Could add fallback image logic here
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => increaseLikeCount(post.id)} 
                      className="flex items-center gap-1 text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likeCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Upload Button - Fixed Position at bottom right */}
      <div className="fixed bottom-6 right-6 z-10">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 hover:shadow-xl"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Upload
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
          disabled={uploading}
        />
      </div>
    </div>
  );
}