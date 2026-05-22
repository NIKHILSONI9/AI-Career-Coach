'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      router.push('/onboarding');
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-indigo-950">
      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl w-96 border border-white/10">
        <h2 className="text-3xl font-bold mb-6">Create account</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg bg-black/50 border border-white/20 mb-4 text-white"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-black/50 border border-white/20 mb-4 text-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          className="w-full p-3 rounded-lg bg-black/50 border border-white/20 mb-6 text-white"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition">
          Sign Up
        </button>
        <p className="text-center mt-4 text-gray-400">
          Already have an account? <Link href="/login" className="text-indigo-400">Sign in</Link>
        </p>
      </form>
    </div>
  );
}