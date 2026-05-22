import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '@/models/User';
import { dbConnect } from '@/lib/dbConnect';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(req: Request) {
  const user = await getAuthUser(req as any);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();

  const fullUser = await User.findById(user._id);
  const resumeText = fullUser?.resumeText || '';

  if (!resumeText) {
    return NextResponse.json({ extracted: null, message: 'No resume uploaded yet' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Extract the following information from this resume text. Return ONLY valid JSON (no markdown) with these keys: name, email, phone, location, summary, skills (array), experience (array of objects with title, company, duration, bullets array), education (array of objects with degree, institution, year). If something is missing, use empty string or empty array.

Resume text:
${resumeText.slice(0, 3000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const extracted = JSON.parse(text);
    return NextResponse.json({ extracted });
  } catch (err) {
    console.error('Resume analysis error:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}