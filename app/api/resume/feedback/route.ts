import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import { analyseResume } from '@/lib/gemini';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();

    const fullUser = await User.findById(user._id);
    const resumeText = fullUser?.resumeText;
    if (!resumeText) {
      return NextResponse.json({ feedback: null, message: 'No resume uploaded yet.' });
    }

    const feedback = await analyseResume(resumeText);
    return NextResponse.json({ feedback });
  } catch (err) {
    console.error('Resume feedback error:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}