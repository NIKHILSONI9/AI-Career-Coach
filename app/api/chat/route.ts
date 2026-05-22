import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { dbConnect } from '@/lib/dbConnect';
import ChatMessage from '@/models/ChatMessage';
import User from '@/models/User';
import { chatWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();

    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: 'No message' }, { status: 400 });

    // Save user message
    await ChatMessage.create({ userId: user._id, role: 'user', content: message });

    // Get last 5 messages for context
    const history = await ChatMessage.find({ userId: user._id }).sort({ timestamp: -1 }).limit(5);
    const conversation = history.reverse().map(m => `${m.role === 'user' ? 'Student' : 'Coach'}: ${m.content}`).join('\n');

    const fullUser = await User.findById(user._id);
    const context = `Student profile:
- Skills: ${fullUser?.skills?.join(', ') || 'unknown'}
- Interests: ${fullUser?.interests?.join(', ') || 'none'}
- Current role/education: ${fullUser?.education || 'student'}
- Resume summary: ${fullUser?.resumeText?.slice(0, 500) || 'not provided'}
- Industry: ${fullUser?.industry || 'not specified'}

Conversation so far:
${conversation}`;

    const reply = await chatWithAI(message, context);
    await ChatMessage.create({ userId: user._id, role: 'assistant', content: reply });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}