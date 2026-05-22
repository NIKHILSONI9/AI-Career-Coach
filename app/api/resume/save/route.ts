import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const resumeData = await req.json();
  await User.findByIdAndUpdate(user._id, { resumeData });
  return NextResponse.json({ success: true });
}