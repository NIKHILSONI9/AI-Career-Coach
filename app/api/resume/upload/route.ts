import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { parseResume } from '@/lib/resumeParser';
import User from '@/models/User';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const formData = await req.formData();
  const file = formData.get('resume') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const tempPath = path.join('/tmp', `${Date.now()}_${file.name}`);
  await writeFile(tempPath, buffer);
  try {
    const text = await parseResume(tempPath, file.type);
    await dbConnect();
    await User.findByIdAndUpdate(user._id, { resumeText: text });
    await unlink(tempPath);
    return NextResponse.json({ success: true, preview: text.slice(0, 500) });
  } catch (err) {
    return NextResponse.json({ error: 'Parsing failed' }, { status: 500 });
  }
}