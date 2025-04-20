import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import userProfile from '@/models/UserProfile';
import supabase from '@/lib/supabase';
import ProfileDisplay from '@/components/ProfileDisplay';

export async function generateMetadata({
  params,
}: {
  params: { userId: string }; 
}): Promise<Metadata> {
  return {
    title: `Profile of ${params.userId}`,
  };
}

export default async function Page({
  params,
}: {
  params: { userId: string }; 
}) {
  await dbConnect();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <div>Please sign in to view this profile</div>;
  }

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
