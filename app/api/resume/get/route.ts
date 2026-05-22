import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import User from '@/models/User';

export async function GET(req: Request) {
  const user = await getAuthUser(req as any);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const fullUser = await User.findById(user._id);
  return NextResponse.json({ resume: fullUser?.resumeData || null });
}