import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '@/models/User';
import { dbConnect } from '@/lib/dbConnect';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const industrySkillsMap: Record<string, string[]> = {
  'Software Development': ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'System Design'],
  'Data Science & AI': ['Python', 'TensorFlow', 'SQL', 'Pandas', 'Machine Learning', 'LLMs'],
  'Cybersecurity': ['Network Security', 'Ethical Hacking', 'SIEM', 'Cloud Security', 'Python'],
  'Cloud & DevOps': ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Monitoring'],
};

export async function GET(req: Request) {
  const user = await getAuthUser(req as any);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();

  const fullUser = await User.findById(user._id);
  const userSkills = fullUser?.skills || [];
  const industry = fullUser?.industry || 'Software Development';
  const idealSkills = industrySkillsMap[industry] || industrySkillsMap['Software Development'];
  const missingSkills = idealSkills.filter(s => !userSkills.some(us => us.toLowerCase().includes(s.toLowerCase())));

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an AI career mentor. The user is in ${industry} and currently has skills: ${userSkills.join(', ')}. 
    Their missing high‑demand skills: ${missingSkills.join(', ')}.
    Generate a JSON object with:
    - "learningPlan": array of 5 specific weekly tasks to acquire missing skills.
    - "projects": array of 3 project ideas to practice these skills.
    Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const aiAdvice = JSON.parse(text);

    return NextResponse.json({
      missingSkills,
      learningPlan: aiAdvice.learningPlan || ['Review fundamentals', 'Build a small project', 'Contribute to open source'],
      projects: aiAdvice.projects || ['Build a portfolio website', 'Create a REST API', 'Write automation scripts'],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      missingSkills,
      learningPlan: ['Complete online courses for missing skills', 'Practice daily coding', 'Join a study group'],
      projects: ['Build a demo app', 'Contribute to GitHub', 'Write technical articles'],
    });
  }
}