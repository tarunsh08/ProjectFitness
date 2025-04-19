import ProfileSettings from '@/components/ProfileSettings';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  // Add other expected properties from your JWT payload here
  // Example: email?: string;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let userId = '';

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      userId = decoded.id;
    } catch (error) {
      console.error('Invalid token:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  return <ProfileSettings userId={userId} />;
}