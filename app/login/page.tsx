'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      // Redirect based on profile completion
      if (data.user.profileCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } else {
      setError(data.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-indigo-950">
      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl w-96 border border-white/10">
        <h2 className="text-3xl font-bold mb-6">Welcome back</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-black/50 border border-white/20 mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-black/50 border border-white/20 mb-6"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold">
          Sign In
        </button>
        <p className="text-center mt-4 text-gray-400">
          No account? <Link href="/signup" className="text-indigo-400">Sign up</Link>
        </p>
      </form>
    </div>
  );
}