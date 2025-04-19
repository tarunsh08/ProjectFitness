import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth');
  }

  let userData: JwtPayload | undefined;

  try {
    userData = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (err) {
    console.error('Invalid token:', err);
    redirect('/auth');
  }

  const userName = userData?.name || 'User';

  return <DashboardClient user={userName} />;
}
