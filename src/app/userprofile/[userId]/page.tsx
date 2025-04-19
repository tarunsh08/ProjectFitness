import dbConnect from '@/lib/db';
import userProfile from '@/models/UserProfile';
import supabase from '@/lib/supabase';
import ProfileDisplay from '@/components/ProfileDisplay';

export default async function ProfilePage({ params }: { params: { userId: string } }) {
  await dbConnect();

  // Verify authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return <div>Please sign in to view this profile</div>;
  }

  // Get profile data
  const profile = await userProfile.findOne({ userId: params.userId });

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <ProfileDisplay 
      name={profile.name}
      bio={profile.bio}
      avatarUrl={profile.avatarUrl}
      userId={params.userId}
      isOwner={session.user.id === params.userId}
    />
  );
}