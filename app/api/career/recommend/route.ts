import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import CareerReport from '@/models/CareerReport';
import { generateCareerReport } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const fullUser = await User.findById(user._id);
    if (!fullUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const userData = {
      skills: fullUser.skills || [],
      interests: fullUser.interests || [],
      experience: fullUser.experience || 'Fresher',
      education: fullUser.education || '',
      resumeText: fullUser.resumeText || '',
      careerInterests: fullUser.careerInterests || [],
    };

    console.log('Generating AI career report...');
    const reportData = await generateCareerReport(userData);
    const newReport = await CareerReport.create({ userId: user._id, ...reportData });
    return NextResponse.json({ report: newReport }, { status: 200 });
  } catch (err) {
    console.error('Career recommend error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}