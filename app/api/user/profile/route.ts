import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const { skills, bio, education, experience } = await req.json();
  await User.findByIdAndUpdate(user._id, { skills, bio, education, experience });
  return NextResponse.json({ success: true });
}