import ProfileSettings from '@/components/ProfileSettings';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let userId = '';

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      userId = (decoded as any).id; 
    } catch (err) {
      console.error('Invalid token', err);
    }
  }

  return <ProfileSettings userId={userId} />;
}
