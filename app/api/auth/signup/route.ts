import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    console.log('1. Connecting to DB...');
    await dbConnect();
    console.log('2. DB connected');

    const { name, email, password } = await req.json();
    console.log('3. Received data:', { name, email, passwordLength: password?.length });

    if (!name || !email || !password) {
      console.log('4. Missing fields');
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    console.log('5. Checking existing user...');
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('6. User already exists');
      return NextResponse.json({ error: 'Email already used' }, { status: 400 });
    }

    console.log('7. Hashing password...');
    const hashed = await bcrypt.hash(password, 10);

    console.log('8. Creating user...');
    const user = await User.create({
      name,
      email,
      password: hashed,
      profileCompleted: false,   // NEW: set profile as incomplete
    });
    console.log('9. User created:', user._id);

    console.log('10. Signing JWT...');
    const token = signJWT(user._id.toString());

    console.log('11. Sending response...');
    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          name,
          email,
          profileCompleted: false,   // NEW: return flag to frontend
        },
      },
      { status: 201 }
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('❌ SIGNUP ERROR:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}