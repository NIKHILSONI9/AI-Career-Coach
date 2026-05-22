import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { generateCoverLetterWithResumeAndJD } from '@/lib/gemini';
import User from '@/models/User';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();

    const { company, role, jobDescription } = await req.json();
    if (!company || !role) {
      return NextResponse.json({ error: 'Company and role are required' }, { status: 400 });
    }

    const fullUser = await User.findById(user._id);
    const resumeText = fullUser?.resumeText || '';
    const userName = fullUser?.name || 'Candidate';

    const letter = await generateCoverLetterWithResumeAndJD(resumeText, jobDescription || '', company, role, userName);
    return NextResponse.json({ letter });
  } catch (err) {
    console.error('Cover letter API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}