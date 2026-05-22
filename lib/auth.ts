import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from './dbConnect';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export function signJWT(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest) {
  const cookie = req.cookies.get('token');
  if (!cookie) return null;
  const decoded = verifyJWT(cookie.value);
  if (!decoded) return null;
  await dbConnect();
  const user = await User.findById(decoded.userId).select('-password');
  return user;
}