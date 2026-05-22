import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();

  const { industry, experience, skills, bio } = await req.json();
  await User.findByIdAndUpdate(user._id, {
    industry,
    experience: parseInt(experience),
    skills,
    bio,
    profileCompleted: true,
  });
  return NextResponse.json({ success: true });
}