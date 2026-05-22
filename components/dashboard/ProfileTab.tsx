'use client';
import { useState, useEffect } from 'react';

interface ProfileTabProps {
  user: any;
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    skills: user?.skills?.join(', ') || '',
    bio: user?.bio || '',
    education: user?.education || '',
    experience: user?.experience || '',
    createdAt: user?.createdAt || null,
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setProfile({
            name: data.user.name,
            email: data.user.email,
            skills: data.user.skills?.join(', ') || '',
            bio: data.user.bio || '',
            education: data.user.education || '',
            experience: data.user.experience || '',
            createdAt: data.user.createdAt,
          });
        }
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-400">Your account information stored securely</p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div><label className="text-gray-400 text-sm">Full Name</label><p className="text-lg font-semibold">{profile.name}</p></div>
        <div><label className="text-gray-400 text-sm">Email</label><p className="text-lg">{profile.email}</p></div>
        <div><label className="text-gray-400 text-sm">Experience</label><p>{profile.experience || 'Not set'}</p></div>
        <div><label className="text-gray-400 text-sm">Education</label><p>{profile.education || 'Not set'}</p></div>
        <div>
          <label className="text-gray-400 text-sm">Skills</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {profile.skills.split(',').map((s, i) => s.trim() && (
              <span key={i} className="px-3 py-1 bg-indigo-500/20 rounded-full text-sm">{s.trim()}</span>
            ))}
          </div>
        </div>
        <div><label className="text-gray-400 text-sm">Bio</label><p className="text-gray-300">{profile.bio || 'No bio added'}</p></div>
        <div><label className="text-gray-400 text-sm">Account Created</label><p>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}</p></div>
      </div>
    </div>
  );
}